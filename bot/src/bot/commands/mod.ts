import {
  ApplicationCommandOption,
  ApplicationCommandTypes,
  Bot,
  Collection,
  Interaction,
} from "discordeno";
import { logger } from "~logger";
import { Currency, Language, Server } from "../../types.ts";
import { freeCommand } from "./free.ts";
import { helpCommand } from "./help.ts";
import { inviteCommand } from "./invite.ts";
import { removeCommand } from "./remove.ts";
import { setCommand } from "./set/mod.ts";
import { settingsCommand } from "./settings.ts";
import { upCommand } from "./up.ts";
import { voteCommand } from "./vote.ts";

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
  needsManageGuild?: boolean;
  execute: (props: CommandExecuteProps) => unknown;
  subCommands?: Array<SubCommandGroup | SubCommand>;
};

export type SubCommand = Omit<Command, "subCommands">;

export type SubCommandGroup = {
  name: string;
  subCommands: SubCommand[];
};

export const EphemeralFlag = 64;

export const commands = new Collection<string, Command>();

export const initCommands = () => {
  logger.info("Initializing commands");

  commands.set("free", freeCommand);
  commands.set("up", upCommand);
  commands.set("help", helpCommand);
  commands.set("invite", inviteCommand);
  commands.set("vote", voteCommand);

  commands.set("remove", removeCommand);
  commands.set("set", setCommand);

  commands.set("settings", settingsCommand);
};
