import logger from '../config/logger.js';
import { cookieOptions } from '../config/cookie.config.js';
import * as authService from '../services/authService.js';
import { mapUserResponse } from '../utils/utils.js';
import User from '../models/User.js';
import { populateRolePermissions } from '../services/roleService.js';

export const login = async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.login(req.body, req);

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE) });
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
  });

  return res.status(200).json({ success: true, message: 'Login successful', user });
};

export const logout = async (req, res) => {
  await authService.logout(req);

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate(populateRolePermissions);
  return res.status(200).json({ success: true, user: mapUserResponse(user) });
};

export const forgotPassword = async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  return res.status(200).json(result);
};

export const resetPassword = async (req, res) => {
  const result = await authService.resetPassword(req.body, req);
  return res.status(200).json(result);
};

export const googleAuth = (req, res) => {
  const redirectUrl =
    'https://accounts.google.com/o/oauth2/v2/auth' +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI)}` +
    '&response_type=code' +
    '&scope=profile email';

  res.redirect(redirectUrl);
};

export const googleOAuthLogin = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await authService.googleOAuthLogin(req);

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE),
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    logger.error('Google OAuth error', error);

    const errorCode = error.code ?? 'OAUTH_FAILED';

    res.redirect(`${process.env.CLIENT_URL}/login?error=${errorCode}`);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.refresh(req);

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE),
    });
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    next(error);
  }
};
