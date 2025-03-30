import { z } from "zod";

const envSchema = z.object({
	DC_TOKEN: z.string(),
	DC_CLIENT_ID: z.string(),
});

console.debug("Parsing environment variables...");
const parseResult = envSchema.safeParse(process.env);
console.debug("Valid environment variables");

if (!parseResult.success) {
	throw new Error(
		`Invalid environment variables:\n${JSON.stringify(
			parseResult.error.flatten().fieldErrors,
			null,
			2
		)}`
	);
}

export const env = parseResult.data;
