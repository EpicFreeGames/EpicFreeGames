import { config } from "../config";
import * as jose from "jose";
import { z } from "zod";

export interface ITokenPayload {
  userId: string;
  flags: number;
  jti: string;
}

const tokenPayloadSchema = z.object({
  userId: z.string(),
  flags: z.number(),
  jti: z.string(),
});

// Access token

export const createAccessToken = (props: Omit<ITokenPayload, "jti">) =>
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

export const verifyAccessJwt = async (token: string): Promise<ITokenPayload | null> => {
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
    console.log("access token payload verification failed", payloadRes.error.format());

    return null;
  }

  return payloadRes.data;
};

// Refresh token

export const createRefreshToken = (props: ITokenPayload) =>
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

export const verifyRefreshJwt = async (token: string): Promise<ITokenPayload | null> => {
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
    console.log("refresh token payload verification failed", payloadRes.error.format());

    return null;
  }

  return payloadRes.data;
};
