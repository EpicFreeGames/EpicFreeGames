import { BASE_URL, ExecuteWebhook } from "discordeno";
import { bot } from "../bot/mod.ts";

type ExecuteWebhookProps = {
  id: string;
  token: string;
  options: Omit<ExecuteWebhook, "file">;
  wait?: boolean;
};

export const executeWebhook = (props: ExecuteWebhookProps) => {
  const params = new URLSearchParams();

  if (props.options.threadId) params.append("thread_id", String(props.options.threadId));
  if (props.wait) params.append("wait", props.wait.toString());

  return fetch(`${BASE_URL}/webhooks/${props.id}/${props.token}?${params.toString()}`, {
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
  });
};
