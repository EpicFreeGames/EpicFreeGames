import { BASE_URL, Bot, ExecuteWebhook } from "discordeno";

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
