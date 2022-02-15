import { SlashCommand } from "shared";

import { command as free } from "./free";
import { command as up } from "./up";

import { command as debug } from "./debug";

import { command as vote } from "./vote";
import { command as help } from "./help";
import { command as invite } from "./invite";

export const commands: Map<string, SlashCommand> = new Map();

commands.set("free", free);
commands.set("up", up);

commands.set("debug", debug);

commands.set("vote", vote);
commands.set("help", help);
commands.set("invite", invite);
