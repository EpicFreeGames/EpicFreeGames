import { z } from "zod";
import { objToStr } from "../utils";

const envSchema = z.object({
	DC_PUB_KEY: z.string(),
	PORT: z.string().transform(Number).optional(),
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
