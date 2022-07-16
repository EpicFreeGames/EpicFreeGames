import { timingSafeEqual, createHmac } from "crypto";
import { config } from "../config";

export const safeEqual = (a: string, b: string) => {
  const aBuff = Buffer.from(a);
  const bBuff = Buffer.from(b);

  return aBuff.length === bBuff.length && timingSafeEqual(aBuff, bBuff);
};

export const hmacSha256 = (plaintext: string) =>
  createHmac("sha256", config.APP_SECRET).update(plaintext).digest("hex");
