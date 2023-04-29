import { z } from "zod";
import { objToStr } from "./utils";

const envSchema = z.object({
	DC_API_BASE: z.string(),
	DC_CLIENT_ID: z.string(),
	DC_TOKEN: z.string(),
	LOG: z.enum(["debug", "info", "warn", "error"]).optional(),
	PRETTY_LOG: z.string().transform(Boolean).optional(),
	ENV: z.enum(["development", "staging", "production"]).optional(),
});

console.debug("Parsing environment variables...");
const parseResult = envSchema.safeParse(process.env);
console.debug("Valid environment variables");

if (!parseResult.success) {
	throw new Error(
		`Invalid environment variables:\n${objToStr(parseResult.error.flatten().fieldErrors)}`
	);
}

export const env = parseResult.data;
