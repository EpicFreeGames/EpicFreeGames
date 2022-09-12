import { SlashCommand } from "../utils/interactions/types";
import { debugCommand } from "./debugCommand";
import { freeCommand } from "./freeCommand";
import { helpCommand } from "./helpCommand";
import { inviteCommand } from "./inviteCommand";
import { removeCommand } from "./removeCommand";
import { setCommand } from "./setCommand";
import { settingsCommand } from "./settingsCommand";
import { testCommand } from "./testCommand";
import { upCommand } from "./upCommand";
import { voteCommand } from "./voteCommand";

export const commands: Map<string, SlashCommand> = new Map([
  ["set", setCommand],
  ["remove", removeCommand],
  ["settings", settingsCommand],
  ["test", testCommand],
  ["debug", debugCommand],
  ["free", freeCommand],
  ["help", helpCommand],
  ["invite", inviteCommand],
  ["up", upCommand],
  ["vote", voteCommand],
]);
