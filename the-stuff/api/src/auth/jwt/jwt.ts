import * as jose from "jose";
import { v4 as uuidv4 } from "uuid";

import { config } from "../../config";
import { isLoginInvalidated, unInvalidateUserLogin } from "../userReLogin";
import { isWhitelisted, saveJti } from "./jwtWhitelist";
import { ITokenPayload, tokenPayloadSchema } from "./types";

const getEpochSeconds = () => Math.floor(new Date().getTime() / 1000);

const signAccessToken = (props: ITokenPayload) =>
  new jose.SignJWT({ ...props })
    .setProtectedHeader({
      alg: "HS512",
    })
    .setIssuedAt()
    .setJti(props.jti)
    .setIssuer(config.JWT_ISS)
    .setAudience(config.JWT_AUD)
    .setExpirationTime(getEpochSeconds() + config.JWT_EXP)
    .sign(config.JWT_KEY);

export const createAccessToken = async (props: Omit<ITokenPayload, "jti">, jti?: string) => {
  const innerJti = jti || uuidv4();

  const token = await signAccessToken({
    ...props,
    jti: innerJti,
  });

  await saveJti({ userId: props.userId, jti: innerJti });
  await unInvalidateUserLogin(props.userId);

  return token;
};

export const verifyAccessJwt = async (token: string): Promise<ITokenPayload | null> => {
  const decryptRes = await jose
    .jwtVerify(token, config.JWT_KEY, {
      audience: config.JWT_AUD,
      issuer: config.JWT_ISS,
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

  const { userId, jti } = payloadRes.data;

  const [whitelisted, invalidated] = await Promise.all([
    isWhitelisted({ userId, jti }),
    isLoginInvalidated(userId),
  ]);

  if (!whitelisted || invalidated) return null;

  return payloadRes.data;
};
