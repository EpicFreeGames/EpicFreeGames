import { z } from "zod";

const envSchema = z.object({
  EVENT_HANDLER_URL: z.string(),
});

const result = envSchema.safeParse(Deno.env.toObject());

if (!result.success) {
  console.log(
    "❌ (gateway) Invalid environment variables:",
    JSON.stringify(result.error.format(), null, 4)
  );

  Deno.exit(1);
}

export const gatewayConfig = {
  ...result.data,
};
