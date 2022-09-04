import * as jose from "jose";
import { v4 as uuidv4 } from "uuid";

import { config } from "../../config";
import { getTokenId, isCorrectTokenId, setTokenId } from "./tokenId";
import { ITokenPayload, tokenPayloadSchema } from "./types";

const signAccessToken = (props: ITokenPayload) =>
  new jose.SignJWT({ ...props })
    .setProtectedHeader({
      alg: "HS512",
      typ: "JWT",
    })
    .setJti(props.jti)
    .setIssuer(config.JWT_ISS)
    .setAudience(config.JWT_AUD)
    .setExpirationTime("7d")
    .sign(config.JWT_KEY);

export const createAccessToken = async (props: Omit<ITokenPayload, "jti">, jti?: string) => {
  let createdNewId = false;

  const tokenVersion =
    jti ||
    (await getTokenId(props.userId)) ||
    (() => {
      createdNewId = true;
      return uuidv4();
    })();

  const token = await signAccessToken({
    ...props,
    jti: tokenVersion,
  });

  if (createdNewId) await setTokenId(props.userId, tokenVersion);

  return token;
};

export const verifyAccessJwt = async (token: string): Promise<ITokenPayload | null> => {
  const decryptRes = await jose
    .jwtVerify(token, config.JWT_KEY, {
      audience: config.JWT_AUD,
      issuer: config.JWT_ISS,
    })
    .catch((err) => {
      console.log("access token verification failed", err);
      return null;
    });

  if (!decryptRes) return null;

  const { payload: tokenPayload } = decryptRes;

  const payloadRes = await tokenPayloadSchema.safeParseAsync(tokenPayload);
  if (!payloadRes.success) {
    console.log("Access token error: Payload verification failed", payloadRes.error.format());

    return null;
  }

  const { userId, jti } = payloadRes.data;

  if (!(await isCorrectTokenId(userId, jti))) {
    console.log("Access token error: Wrong token version");

    return null;
  }

  return payloadRes.data;
};
