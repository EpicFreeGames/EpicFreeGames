import { ColorResolvable, MessageEmbed } from "discord.js";

export const generic = (title: string, desc: string, color: ColorResolvable = "#2f3136") =>
  new MessageEmbed({
    title,
    description: desc,
    color,
  });
