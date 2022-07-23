import {
  ApplicationCommandOption,
  ApplicationCommandTypes,
  BitwisePermissionFlags,
  Bot,
  Collection,
  Interaction,
} from "discordeno";
import { logger } from "~logger";
import { Currency, Language, Server } from "../../types.ts";
import { freeCommand } from "./free.ts";
import { helpCommand } from "./help.ts";
import { pingCommand } from "./ping.ts";
import { removeCommand } from "./remove.ts";
import { setCommand } from "./set/mod.ts";
import { upCommand } from "./up.ts";

export type CommandExecuteProps = {
  bot: Bot;
  i: Interaction;
  server?: Server;
  commandName: string;
  lang: Language;
  curr: Currency;
};

export type Command = {
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  type: ApplicationCommandTypes;
  /** Defaults to `Guild` */
  scope?: "Global" | "Guild";
  needsGuild: boolean;
  neededPermissions?: BitwisePermissionFlags;
  execute: (props: CommandExecuteProps) => unknown;
  subCommands?: Array<SubCommandGroup | SubCommand>;
};

export type SubCommand = Omit<Command, "subCommands">;

export type SubCommandGroup = {
  name: string;
  subCommands: SubCommand[];
};

export const commands = new Collection<string, Command>();

export const initCommands = () => {
  logger.info("Initializing commands");

  commands.set("ping", pingCommand);
  commands.set("free", freeCommand);
  commands.set("up", upCommand);
  commands.set("help", helpCommand);

  commands.set("remove", removeCommand);
  commands.set("set", setCommand);
};
