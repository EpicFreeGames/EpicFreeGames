import { z } from "zod";

const envSchema = z.object({
	MONGO_URL: z.string(),
	ENV: z.enum(["dev", "prod", "staging"]),
});

export const env = envSchema.parse(process.env);
