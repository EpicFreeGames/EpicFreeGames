import { compare, hash } from "bcrypt";
import { createHash, timingSafeEqual, createHmac } from "crypto";
import { config } from "../config";

const sha256 = (plainText: string) =>
  createHash("sha256").update(plainText).digest("base64");

export const comparePassword = (plainText: string, hash: string) =>
  compare(sha256(plainText), hash);

export const hashPassword = (plainText: string) => hash(sha256(plainText), 12);

export const safeEqual = (a: string, b: string) => {
  const aBuff = Buffer.from(a);
  const bBuff = Buffer.from(b);

  return aBuff.length === bBuff.length && timingSafeEqual(aBuff, bBuff);
};

export const hmacSha256 = (plaintext: string) =>
  createHmac("sha256", config.APP_SECRET).update(plaintext).digest("hex");
