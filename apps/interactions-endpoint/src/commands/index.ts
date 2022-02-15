import { SlashCommand } from "shared";

import { command as free } from "./free";
import { command as up } from "./up";

export const commands: Map<string, SlashCommand> = new Map();

commands.set("free", free);
commands.set("up", up);
