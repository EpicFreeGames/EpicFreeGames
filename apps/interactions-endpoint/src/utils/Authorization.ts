import { config } from "config";
import { CommandInteraction, CommandTypes, SlashCommand } from "shared";

export const isAuthorized = (i: CommandInteraction, command: SlashCommand) => {
  if (command.type === CommandTypes.MANAGE_GUILD)
    return (
      i.user.permissions && i.user.permissions.hasPermission(i.user.permissions.bits, BigInt(32))
    );

  if (command.type === CommandTypes.ADMIN) return config.adminIds.includes(i.user.id);

  return command.type === CommandTypes.EVERYONE;
};
