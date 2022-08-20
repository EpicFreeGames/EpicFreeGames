import { z } from "zod";

const envSchema = z.object({
  SENDER_AUTH: z.string(),
  WEBHOOK_NAME: z.string(),
});

const result = envSchema.safeParse(Deno.env.toObject());

if (!result.success) {
  console.log(
    "❌ (sender) Invalid environment variables:",
    JSON.stringify(result.error.format(), null, 4)
  );

  Deno.exit(1);
}

export const senderConfig = {
  ...result.data,
};
