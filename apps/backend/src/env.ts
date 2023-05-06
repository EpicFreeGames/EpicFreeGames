import { z } from "zod";

const envSchema = z.object({
	ENV: z.enum(["dev", "prod", "staging"]),
	DC_API_BASE: z.string(),
	DC_PUB_KEY: z.string(),
	DC_CLIENT_ID: z.string(),
	DC_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
