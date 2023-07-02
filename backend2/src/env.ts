import z from "zod";

const envSchema = z.object({
	PORT: z.string().transform(Number).default("8000"),
	DISCORD_CLIENT_ID: z.string(),
	DISCORD_CLIENT_SECRET: z.string(),
	DISCORD_REDIRECT_URL: z.string(),
	FRONT_BASE_URL: z.string(),
});

const res = envSchema.parse(process.env);

export const envs = res;
