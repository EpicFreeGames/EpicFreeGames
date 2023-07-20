import { objToStr } from "../discord/utils";
import { z } from "zod";

const envSchema = z.object({
	DB_URL: z.string(),
	FRONT_BASE: z.string(),
	DC_CLIENT_ID: z.string(),
	DC_CLIENT_SECRET: z.string(),
	DC_API_BASE: z.string(),
	DC_PUB_KEY: z.string(),
	DC_TOKEN: z.string(),
	JWT_SECRET: z.string().transform((x) => new TextEncoder().encode(x)),
	ADMIN_EMAIL: z.string(),
	ADMIN_USER_ID: z.string(),
	PORT: z.string().transform(Number).optional(),
	LOG: z.enum(["debug", "info", "warn", "error"]).optional(),
	PRETTY_LOG: z.string().transform(Boolean).optional(),
	ENV: z.enum(["prod", "notprod"]),
});

console.debug("Parsing environment variables...");
const parseResult = envSchema.safeParse(process.env);
console.debug("Valid environment variables");

if (!parseResult.success) {
	throw new Error(
		`Invalid environment variables:\n${objToStr(parseResult.error.flatten().fieldErrors)}`
	);
}

export const inProd = parseResult.data.ENV === "prod";
export const envs = parseResult.data;
