import { hasProperty } from "discordeno";
import { SubCommand, SubCommandGroup } from "../commands/mod.ts";

export const snowflakeToTimestamp = (id: bigint) =>
  Number(id / 4194304n + 1420070400000n);

export const isSubCommand = (
  data: SubCommand | SubCommandGroup
): data is SubCommand => !hasProperty(data, "subCommands");

export const isSubCommandGroup = (
  data: SubCommand | SubCommandGroup
): data is SubCommandGroup => hasProperty(data, "subCommands");
