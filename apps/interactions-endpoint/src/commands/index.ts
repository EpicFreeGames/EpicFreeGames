import { SlashCommand } from "shared";

import { command as free } from "./free";
import { command as up } from "./up";

import { command as debug } from "./debug";

import { command as vote } from "./vote";
import { command as help } from "./help";
import { command as invite } from "./invite";

import { command as set } from "./set";
import { command as remove } from "./remove";

import { command as games } from "./games";
import { command as send } from "./send";
import { command as stats } from "./stats";

export const commands: Map<string, SlashCommand> = new Map();

commands.set("free", free);
commands.set("up", up);

commands.set("debug", debug);

commands.set("vote", vote);
commands.set("help", help);
commands.set("invite", invite);

commands.set("set", set);
commands.set("remove", remove);

commands.set("games", games);
commands.set("send", send);
commands.set("stats", stats);
