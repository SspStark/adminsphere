import { getRedisClient } from '../config/redisClient.js';

const SESSION_PREFIX = 'session:';
const USER_SESSION_PREFIX = 'userSessions:';

const SESSION_TTL = Number(process.env.SESSION_TTL_SECONDS);

const getSessionKey = (sessionId) => `${SESSION_PREFIX}${sessionId}`;

const getUserSessionKey = (userId) => `${USER_SESSION_PREFIX}${userId}`;

export const createSession = async (sessionId, userId, sessionData) => {
  const redisClient = getRedisClient();
  if (!redisClient) return null;

  const session = {
    sessionId,
    userId,
    createdAt: new Date().toISOString(),
    ...sessionData,
  };

  await redisClient.set(getSessionKey(sessionId), JSON.stringify(session), { EX: SESSION_TTL });

  await redisClient.sAdd(getUserSessionKey(userId), sessionId);
};

export const getSession = async (sessionId) => {
  const redisClient = getRedisClient();
  if (!redisClient) return null;

  const session = await redisClient.get(getSessionKey(sessionId));
  if (!session) return null;

  return JSON.parse(session);
};

export const updateSession = async (sessionId, updates) => {
  const redisClient = getRedisClient();
  if (!redisClient) return null;

  const session = await getSession(sessionId);
  if (!session) return null;

  const updateSession = {
    ...session,
    ...updates,
  };

  await redisClient.set(getSessionKey(sessionId), JSON.stringify(updateSession), { EX: SESSION_TTL });

  return updateSession;
};

export const deleteSession = async (sessionId) => {
  const redisClient = getRedisClient();
  if (!redisClient) return;

  const session = await getSession(sessionId);
  if (!session) return;

  await redisClient.del(getSessionKey(sessionId));
  await redisClient.sRem(getUserSessionKey(session.userId), sessionId);
};

export const getUserSessions = async (userId) => {
  const redisClient = getRedisClient();
  if (!redisClient) return [];

  const sessionIds = await redisClient.sMembers(getUserSessionKey(userId));

  const sessions = [];

  for (const id of sessionIds) {
    const session = await getSession(id);

    if (!session) {
      await redisClient.sRem(getUserSessionKey(userId), id);
      continue;
    }

    sessions.push(session);
  }

  return sessions;
};

export const deleteAllSessions = async (userId) => {
  const redisClient = getRedisClient();
  if (!redisClient) return;

  const sessionIds = await getUserSessions(userId);

  if (sessionIds.length) {
    const keys = sessionIds.map(getSessionKey);
    await redisClient.del(keys);
  }

  await redisClient.del(getUserSessionKey(userId));
};
