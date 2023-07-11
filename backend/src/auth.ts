import * as jose from "jose";
import { envs } from "./configuration/env";
import z from "zod";

const tokenPayloadSchema = z.object({
	email: z.string(),
});

export function createToken(email: string) {
	return new jose.SignJWT({
		email,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.setAudience("epicfreegames-backend")
		.setIssuer("epicfreegames-backend")
		.sign(envs.JWT_SECRET);
}

export async function verifyToken(token: string) {
	try {
		const res = await jose.jwtVerify(token, envs.JWT_SECRET);

		const payload = tokenPayloadSchema.parse(res.payload);

		return payload;
	} catch (e) {
		return false;
	}
}
