import { SlashCommand } from "shared";

import { command as free } from "./free";

export const commands: Map<string, SlashCommand> = new Map();

commands.set("free", free);
