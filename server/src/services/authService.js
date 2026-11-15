import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

import User from '../models/User.js';
import logger from '../config/logger.js';
import { getRedisClient } from '../config/redisClient.js';
import { sendPasswordResetEmail } from '../integrations/mailService.js';
import { logAuthEvent } from './authLogService.js';
import defaults from '../constants/defaults.js';
import { AuthError } from '../errors/appError.js';
import { populateRolePermissions } from './roleService.js';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from './jwtService.js';
import { createSession, deleteAllSessions, deleteSession, getSession, updateSession } from './sessionService.js';
import { hashToken, mapUserResponse } from '../utils/utils.js';

const isAccountLocked = (user) => {
  if (!user.lockUntil) return false;
  return user.lockUntil > Date.now();
};

const recordFailedLogin = async (user) => {
  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= defaults.MAX_LOGIN_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + defaults.LOCK_TIME_MS);
  }

  await user.save();
};

const resetLoginAttempts = async (user) => {
  if (user.failedLoginAttempts > 0) {
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();
  }
};

const createUserSession = async (user, req) => {
  const userId = user._id.toString();
  const sessionId = crypto.randomUUID();

  const payload = {
    id: userId,
    sessionId,
  };

  const accessPayload = {
    ...payload,
    role: user.role?.name || '',
    permissions: user.role?.permissions?.map((p) => p.name) || [],
  };

  const accessToken = generateAccessToken(accessPayload);
  const refreshToken = generateRefreshToken(payload);

  const refreshTokenHash = hashToken(refreshToken);

  await createSession(sessionId, userId, {
    refreshTokenHash,
    ip: req.ip || req.headers['x-forwarded-for'],
    userAgent: req.headers['user-agent'],
  });

  return {
    accessToken,
    refreshToken,
    user: mapUserResponse(user),
  };
};

export const login = async (body, req) => {
  const identifier = body.identifier.trim();
  const password = body.password;
  const isEmail = identifier.includes('@');

  const user = await User.findOne(
    isEmail ? { email: identifier.toLowerCase() } : { username: new RegExp('^' + identifier + '$', 'i') }
  ).populate(populateRolePermissions);

  if (!user) {
    await logAuthEvent({ action: 'LOGIN_FAILED', provider: 'local', req });
    throw new AuthError('Invalid username/email', 400);
  }

  if (!user.authProvider.includes('local')) {
    await logAuthEvent({ action: 'LOGIN_FAILED', provider: 'local', req });
    throw new AuthError('Please login with your existing Google account and create a password', 403);
  }

  if (isAccountLocked(user)) {
    throw new AuthError('Account temporarily locked. Try again later.', 423);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    await recordFailedLogin(user);
    await logAuthEvent({ userId: user._id, action: 'LOGIN_FAILED', provider: 'local', req });

    // If just locked
    if (isAccountLocked(user)) {
      throw new AuthError('Too many failed attempts. Account locked for 15 minutes.', 423);
    }
    throw new AuthError('Invalid password', 400);
  }

  // Password correct → reset attempts
  await resetLoginAttempts(user);

  const session = await createUserSession(user, req);

  await logAuthEvent({ userId: user._id, action: 'LOGIN_SUCCESS', provider: 'local', req });

  return session;
};

export const logout = async (req) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) return;

  let decoded;
  try {
    decoded = verifyAccessToken(accessToken);
  } catch {
    return; // invalid/expired token
  }

  const { id, sessionId } = decoded;

  await deleteSession(sessionId);

  await logAuthEvent({ userId: id, action: 'LOGOUT', provider: 'local', req });
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return { success: true, message: 'If this email exists, a reset link has been sent.' };
  }

  const redisClient = getRedisClient();
  if (!redisClient) {
    logger.error('Redis unavailable during forgot password');
    throw new AuthError('Password reset temporarily unavailable. Please try later.', 503);
  }

  // Invalidate any previous outstanding reset token for the user
  const prevTokenKey = `password_reset_user:${user._id}`;
  const prevTokenHash = await redisClient.get(prevTokenKey);
  if (prevTokenHash) {
    await redisClient.del(`password_reset:${prevTokenHash}`);
  }

  // Opaque random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(resetToken);

  await redisClient.set(`password_reset:${tokenHash}`, user._id.toString(), { EX: 600 });

  await redisClient.set(prevTokenKey, tokenHash, { EX: 600 });

  await redisClient.set(`password_reset:${user._id}`, '1', { EX: 600 });

  await sendPasswordResetEmail(user.email, resetToken);

  return { success: true, message: 'If this email exists, a reset link has been sent.' };
};

export const resetPassword = async (body, req) => {
  const { token, newPassword } = body;

  if (!token || typeof token !== 'string') {
    throw new AuthError('Invalid or expired reset token', 400);
  }

  const redisClient = getRedisClient();
  if (!redisClient) {
    logger.error('Redis unavailable during reset password');
    throw new AuthError('Password reset temporarily unavailable. Please try later.', 503);
  }

  const tokenHash = hashToken(token);
  const resetKey = `password_reset:${tokenHash}`;
  const userId = await redisClient.get(resetKey);

  if (!userId) {
    throw new AuthError('Invalid or expired reset token', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AuthError('User not found', 404);
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  // Delete reset token (single-use) and the per-user pointer to it
  await redisClient.del(resetKey);
  await redisClient.del(`password_reset_user:${userId}`);

  await deleteAllSessions(userId);

  await logAuthEvent({ userId: user._id, action: 'PASSWORD_RESET', provider: 'local', req });
  return { success: true, message: 'Password reset successful. Please log in again.' };
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleOAuthLogin = async (req) => {
  const { code } = req.query;

  if (!code) {
    throw new AuthError('Authorization code missing', 400);
  }

  // Exchange code for tokens
  const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  const { id_token } = tokenRes.data;

  // Verify Google identity
  const ticket = await googleClient.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub, email, given_name, family_name, email_verified, picture } = payload;
  if (!email_verified) {
    throw new AuthError('Email not verified', 403, 'EMAIL_NOT_VERIFIED');
  }

  let user = await User.findOne({ googleId: sub });

  // Check for local user exists
  if (!user) {
    user = await User.findOne({ email });
    // Local user exists → LINK GOOGLE
    if (user && !user.authProvider.includes('google')) {
      user.googleId = sub;
      user.authProvider.push('google');
      if (!user.profileImage?.url && payload.picture) {
        user.profileImage.url = payload.picture;
      }
      await user.save();
    }
  }

  if (!user) {
    throw new AuthError('No account found. Please contact your administrator.', 403, 'NO_ACCOUNT');
  }

  user = await User.findById(user._id).populate(populateRolePermissions);

  const session = await createUserSession(user, req);

  await logAuthEvent({ userId: user._id, action: 'GOOGLE_LOGIN', provider: 'google', req });

  return session;
};

export const refresh = async (req) => {
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new AuthError('Authentication required', 401);

  const { id, sessionId } = verifyRefreshToken(refreshToken);

  const session = await getSession(sessionId);
  if (!session) throw new AuthError('Session expired, please login again', 401);

  const incomingHash = hashToken(refreshToken);

  if (incomingHash !== session.refreshTokenHash) {
    await deleteSession(sessionId);
    throw new AuthError('Session revoked due to token reuse. Please login again.', 401);
  }

  const user = await User.findById(id).populate(populateRolePermissions);
  if (!user) throw new AuthError('User not found', 401);

  const payload = {
    id,
    sessionId,
  };

  const accessPayload = {
    ...payload,
    role: user.role?.name || '',
    permissions: user.role?.permissions?.map((p) => p.name) || [],
  };

  const accessToken = generateAccessToken(accessPayload);
  refreshToken = generateRefreshToken(payload);

  const refreshTokenHash = hashToken(refreshToken);

  await updateSession(sessionId, {
    refreshTokenHash,
  });

  return { accessToken, refreshToken };
};
