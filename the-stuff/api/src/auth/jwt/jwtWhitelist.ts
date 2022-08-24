import redis from "../../data/redis";

type Props = { userId: string; jti: string };

export const saveJti = ({ userId, jti }: Props) => redis.sadd(`${userId}:tokens`, jti);
export const removeJti = ({ userId, jti }: Props) => redis.srem(`${userId}:tokens`, jti);

export const isWhitelisted = async ({ userId, jti }: Props) =>
  !!(await redis.sismember(`${userId}:tokens`, jti));
