import { Bot, Channel, Collection, Guild, PermissionStrings, separateOverwrites } from "discordeno";

export type ResultMap = Collection<PermissionStrings, boolean>;

const setAllPerms = (neededPerms: PermissionStrings[], resultMap: ResultMap, setTo: boolean) => {
  neededPerms.forEach((perm) => resultMap.set(perm, setTo));
  return resultMap;
};

export const hasPermsOnChannel = async (
  bot: Bot,
  channel: Channel,
  guild: Guild,
  neededPerms: PermissionStrings[]
) => {
  const result = new Collection<PermissionStrings, boolean>();

  const member = await bot.helpers.getMember(guild.id, bot.id);
  if (!member)
    return {
      details: setAllPerms(neededPerms, result, false),
      hasPerms: false,
    };

  const memberRoles = guild.roles
    .filter((role) => member.roles.some((r) => r === role.id))
    .map((role) => role);

  const everyoneRole = guild.roles.get(guild.id);
  if (!everyoneRole)
    return {
      details: setAllPerms(neededPerms, result, false),
      hasPerms: false,
    };

  let permissions = everyoneRole.permissions;

  for (const role of memberRoles) permissions |= role.permissions;

  // is admin?
  if (bot.utils.calculatePermissions(permissions).includes("ADMINISTRATOR"))
    return {
      details: setAllPerms(neededPerms, result, true),
      hasPerms: true,
    };

  for (const packedOverwrite of channel.permissionOverwrites) {
    const [type, id, overwriteAllow, overwriteDeny] = separateOverwrites(packedOverwrite);

    // @everyone
    if (type == 0 && id == guild.id) {
      permissions &= ~overwriteDeny;
      permissions |= overwriteAllow;

      continue;
    }

    // role overwrite
    if (type == 0 && member.roles.includes(id)) {
      permissions &= ~overwriteDeny;
      permissions |= overwriteAllow;

      continue;
    }

    // member overwrite
    if (type == 1 && id == member.id) {
      permissions &= ~overwriteDeny;
      permissions |= overwriteAllow;

      continue;
    }
  }

  let hasPerms = true;

  for (const neededPermission of neededPerms) {
    const neededAsBigInt = BigInt(bot.utils.calculateBits([neededPermission]));

    const hasPerm = (neededAsBigInt & permissions) === neededAsBigInt;
    if (!hasPerm) hasPerms = false;

    result.set(neededPermission, hasPerm);
  }

  return {
    details: result,
    hasPerms,
  };
};
