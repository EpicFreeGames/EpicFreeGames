import axios from "axios";
import { config } from "config";
import { embeds, SlashCommand } from "shared-discord-stuff";
import { CommandTypes } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language, currency) => {
    if (i.user.id !== config.adminIds[0])
      return i.reply({
        embeds: [
          embeds.generic("Not allowed", "You are not allowed to use `/send`, sorry", "DARK_RED"),
        ],
        ephemeral: true,
      });

    await i.deferReply({ ephemeral: true });

    let gameIds = i.options.getString("game_ids", true);
    const sendingId = i.options.getString("sending_id");

    let idArr = [];

    if (gameIds.includes(", ")) {
      idArr = gameIds.split(", ");
    } else {
      idArr.push(gameIds);
    }

    try {
      const res = await axios.post(config.senderUrl, { gameIds: idArr, sendingId });
      return i.editReply({
        embeds: [embeds.generic("Sending ID", `${res?.data?.sendingId}`)],
        ephemeral: true,
      });
    } catch (err: any) {
      return i.editReply({
        embeds: [embeds.generic("Error", `${err?.response?.data}`, "DARK_RED")],
        ephemeral: true,
      });
    }
  },
};
