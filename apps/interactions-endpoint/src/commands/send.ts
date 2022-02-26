import axios from "axios";
import { config } from "config";
import { CommandTypes, embeds, SlashCommand } from "shared";

export const command: SlashCommand = {
  type: CommandTypes.ADMIN,
  execute: async (i, guild, language) => {
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
