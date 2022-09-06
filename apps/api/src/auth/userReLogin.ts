import redis from "../data/redis";

export const invalidateUserLogin = (userId: string) =>
  redis.sadd(`invalidated-users-logins`, userId);
export const unInvalidateUserLogin = (userId: string) =>
  redis.srem(`invalidated-users-logins`, userId);

export const isLoginInvalidated = async (userId: string) =>
  !!(await redis.sismember(`invalidated-users-logins`, userId));
