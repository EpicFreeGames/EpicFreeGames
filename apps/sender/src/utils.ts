import { MessageEmbed } from "discord.js";
import { IGuild } from "shared";

export const getDataToSend = (guild: IGuild, embeds: MessageEmbed[]) => {
  const data: any = {
    embeds,
  };

  if (guild.roleId) {
    if (guild.roleId === "1") {
      data.content = "@everyone";
    } else {
      data.content = `<@&${guild.roleId}>`;
    }
  }

  return data;
};
