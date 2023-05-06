import { z } from "zod";

const envSchema = z.object({
	JWT_SECRET: z.string(),
	// JWT_ISSUER: z.string(),
	// JWT_AUDIENCE: z.string(),

	ENV: z.enum(["dev", "prod", "staging"]),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
	...parsedEnv,
	JWT_SECRET: new TextEncoder().encode(parsedEnv.JWT_SECRET),
};
