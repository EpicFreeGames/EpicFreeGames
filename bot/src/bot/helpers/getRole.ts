import { Bot, DiscordRole, Role } from "discordeno";
import { getCachedGuild } from "../redis.ts";

export const getRole = async (
  bot: Bot,
  guildId: bigint,
  roleId: bigint
): Promise<Role | undefined> => {
  const fromCache = await getCachedGuild(guildId);
  const role = fromCache?.roles.find((r) => r.id === String(roleId));
  if (role) return bot.transformers.role(bot, { role, guildId });

  const result = await bot.rest.runMethod<DiscordRole[]>(
    bot.rest,
    "GET",
    bot.constants.routes.GUILD_ROLES(guildId)
  );

  const roles = result.map((role) =>
    bot.transformers.role(bot, { role, guildId })
  );

  return roles.find((role) => role.id === roleId);
};
