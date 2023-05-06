import * as jose from "jose";

import { env } from "./env";

export function createToken(userId: string) {
	return new jose.SignJWT({ userId })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setIssuer("tasks_dev")
		.setAudience("tasks_dev")
		.setExpirationTime("7d")
		.sign(env.JWT_SECRET);
}

export function verifyToken(token: string) {
	return jose.jwtVerify(token, env.JWT_SECRET, {
		issuer: "tasks_dev",
		audience: "tasks_dev",
	}) as Promise<{
		payload: jose.JWTPayload & { userId: string };
		protectedHeader: jose.JWTHeaderParameters;
	}>;
}
