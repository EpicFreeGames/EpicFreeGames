import { Bot, ExecuteWebhook, Webhook } from "discordeno";
import { config } from "~config";
import { logger } from "~shared/utils/logger.ts";

type ExecuteWebhookProps = {
  id: string;
  token: string;
  options: Omit<ExecuteWebhook, "file" | "threadId">;
  threadId?: string | null;
  wait?: boolean;
};

export const executeWebhook = (bot: Bot, props: ExecuteWebhookProps) => {
  const params = new URLSearchParams();

  if (props.threadId) params.append("thread_id", props.threadId);
  if (props.wait) params.append("wait", props.wait.toString());

  return fetch(
    `${config.DISCORD_API_BASEURL}/webhooks/${props.id}/${props.token}?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: props.options.content,
        embeds: props.options.embeds?.map((embed) => bot.transformers.reverse.embed(bot, embed)),
        username: props.options.username,
        avatarUrl: props.options.avatarUrl,
        tts: props.options.tts,
        allowedMentions: props.options.allowedMentions,
        components: props.options.components,
      }),
    }
  );
};

type CreateWebhookOptions = {
  name: string;
  avatar?: string | null;
  reason?: string;
};

type CreateWebhookResponse =
  | {
      data: Webhook;
      error?: never;
    }
  | {
      error: {
        status: number;
        // deno-lint-ignore no-explicit-any
        data: any;
      };
      data?: never;
    };

export const createWebhook = (
  bot: Bot,
  channelId: bigint,
  options: CreateWebhookOptions
): Promise<CreateWebhookResponse> =>
  fetch(`${config.DISCORD_API_BASEURL}/channels/${channelId}/webhooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${config.BOT_TOKEN}`,
    },
    body: JSON.stringify({
      name: options.name,
      ...(options.avatar ? { avatar: options.avatar } : {}),
      ...(options.reason ? { reason: options.reason } : {}),
    }),
  })
    .then(async (res) => {
      if (res.ok) {
        return {
          // Discord won't send invalid json, right?
          data: await res.json().then((json) => bot.transformers.webhook(bot, json)),
        };
      } else {
        const error = {
          url: res.url,
          status: res.status,
          data: await res.json().catch((err) => {
            logger.error(err);
            return null;
          }),
        };
        logger.error(error);
        return {
          error,
        };
      }
    })
    .catch((err) => {
      logger.error("Network error creating a webhook:", err);
      return {
        error: {
          status: 0,
          data: err,
        },
      };
    });

export const removeWebhook = (webhookId: string, webhookToken: string) =>
  fetch(`${config.DISCORD_API_BASEURL}/webhooks/${webhookId}/${webhookToken}`, {
    method: "DELETE",
  });
