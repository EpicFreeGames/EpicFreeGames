import * as jose from "jose";
import { z } from "zod";
import { config } from "../config";

export interface TokenPayload {
  userId: string;
  email: string;
  flags: number;
  jti: string;
}

const tokenPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  flags: z.number(),
  jti: z.string(),
});

// Access token

export const encryptAccessJwt = (props: Omit<TokenPayload, "jti">) =>
  new jose.SignJWT({ ...props })
    .setProtectedHeader({
      alg: "HS512",
    })
    .setIssuedAt()
    .setJti("0")
    .setIssuer(config.JWT_ACC_ISS)
    .setAudience(config.JWT_ACC_AUD)
    .setExpirationTime(config.JWT_ACC_EXP)
    .sign(config.JWT_ACC_KEY);

export const verifyAccessJwt = async (
  token: string
): Promise<TokenPayload | null> => {
  const decryptRes = await jose
    .jwtVerify(token, config.JWT_ACC_KEY, {
      audience: config.JWT_ACC_AUD,
      issuer: config.JWT_ACC_ISS,
      clockTolerance: 0,
    })
    .catch((err) => {
      console.log("access token verification failed", err);
      return null;
    });

  if (!decryptRes) return null;

  const { payload: tokenPayload } = decryptRes;

  const payloadRes = await tokenPayloadSchema.safeParseAsync(tokenPayload);
  if (!payloadRes.success) {
    console.log("token verification failed", payloadRes.error.format());

    return null;
  }

  return payloadRes.data;
};

// Refresh token

export const encryptRefreshJwt = (props: TokenPayload) =>
  new jose.SignJWT({ ...props })
    .setProtectedHeader({
      alg: "HS512",
    })
    .setIssuedAt()
    .setJti(props.jti)
    .setIssuer(config.JWT_REF_ISS)
    .setAudience(config.JWT_REF_AUD)
    .setExpirationTime(config.JWT_REF_EXP)
    .sign(config.JWT_REF_KEY);

export const verifyRefreshJwt = async (
  token: string
): Promise<TokenPayload | null> => {
  const decryptRes = await jose
    .jwtVerify(token, config.JWT_REF_KEY, {
      audience: config.JWT_REF_AUD,
      issuer: config.JWT_REF_ISS,
      clockTolerance: 0,
    })
    .catch((err) => {
      console.log("refresh token verification failed", err);
      return null;
    });

  if (!decryptRes) return null;

  const { payload: tokenPayload } = decryptRes;

  const payloadRes = await tokenPayloadSchema.safeParseAsync(tokenPayload);
  if (!payloadRes.success) {
    console.log("refresh token verification failed", payloadRes.error.format());

    return null;
  }

  return payloadRes.data;
};
