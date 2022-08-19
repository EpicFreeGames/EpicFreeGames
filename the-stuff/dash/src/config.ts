import { z } from "zod";

const envSchema = z.object({
  EFG_API_INTERNAL_BASEURL: z.string(),

  DISCORD_CLIENT_ID: z.string(),
  DISCORD_REDIRECT_URL: z.string(),

  DENO_DEPLOYMENT_ID: z.string(),

  ENV: z.enum(["Development", "Staging", "Production"]),
});

const result = envSchema.safeParse(Deno.env.toObject());

if (!result.success) {
  console.log("❌ Invalid environment variables:", JSON.stringify(result.error.format(), null, 4));

  Deno.exit(1);
}

export const config = result.data;