import { z } from "zod";

const envSchema = z.object({
	DB_URL: z.string(),
});

export const env = envSchema.parse(process.env);
