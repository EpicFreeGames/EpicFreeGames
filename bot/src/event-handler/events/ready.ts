import { EventHandlers } from "discordeno";

export const readyEventHandler: EventHandlers["ready"] = (_bot, { shardId }) => {
  console.log(`Shard ${shardId} ready`);
};
