import * as jose from "jose";

import { configuration } from "@efg/configuration";

import { ITokenPayload, tokenPayloadSchema } from "./types";

const signAccessToken = (props: ITokenPayload) =>
  new jose.SignJWT({ ...props })
    .setProtectedHeader({
      alg: "HS512",
      typ: "JWT",
    })
    .setJti(props.jti)
    .setIssuer(configuration.JWT_ISS)
    .setAudience(configuration.JWT_AUD)
    .setExpirationTime("7d")
    .sign(configuration.JWT_KEY);

export const createAccessToken = async (props: ITokenPayload) => await signAccessToken(props);

export const verifyAccessJwt = async (token: string): Promise<ITokenPayload | null> => {
  const decryptRes = await jose
    .jwtVerify(token, configuration.JWT_KEY, {
      audience: configuration.JWT_AUD,
      issuer: configuration.JWT_ISS,
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

  return payloadRes.data;
};
