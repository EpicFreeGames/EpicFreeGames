import { z } from "zod";

const envSchema = z.object({
  WEBHOOK_INTEGRATION_NAME: z.string(),
});

const result = envSchema.safeParse(Deno.env.toObject());

if (!result.success) {
  console.log(
    "❌ (event-handler) Invalid environment variables:",
    JSON.stringify(result.error.format(), null, 4)
  );

  Deno.exit(1);
}

export const eventHandlerConfig = {
  ...result.data,
};
