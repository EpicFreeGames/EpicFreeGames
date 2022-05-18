import axios from "axios";
import { constants, config } from "config";
import { CommandInteraction, discordApiRequest, embeds, ILanguage, IWebhook } from "shared";

export const makeSenseOfRole = (role: any) => {
  if (role.name === "@everyone") return { embed: "@everyone", toDb: "1" };
  return { embed: `<@&${role.id}>`, toDb: role.id };
};

export const userHasVoted = async (userId: string): Promise<boolean> => {
  try {
    const res = await axios.get(
      `https://top.gg/api/bots/${constants.userIds.prod}/check?userId=${userId}`,
      {
        headers: { Authorization: config.topGGAuth },
      }
    );

    if (res?.data) return res?.data?.voted === 1;

    return true;
  } catch (err: any) {
    console.log("topgg vote check failed", err?.message);
    return true;
  }
};

export const getRole = async (guildId: string, roleId: string) => {
  const res = await axios(discordApiRequest(`/guilds/${guildId}/roles`, "GET"));

  return res?.data?.find((role: any) => role.id === roleId);
};

export const getParentId = async (channelId: string): Promise<string | null> => {
  try {
    const res = await axios(discordApiRequest(`/channels/${channelId}`, "GET"));

    return res?.data?.parent_id as string;
  } catch (err) {
    if (err?.respnose && err?.response?.data?.code) throw new Error(err.response.data.code);

    return null;
  }
};

export const checkForErrorsAndCommunicate = async (
  check: IWebhook | string | null,
  i: CommandInteraction,
  language: ILanguage,
  channelId: string
) => {
  // 50013 = Missing permissions | 50001 = Missing access
  if (check === "50013" || check === "50001") {
    await i.editReply({ embeds: [embeds.errors.missingPermissions(channelId, language)] });
    return true;
  }

  // 30007 = Maximum number of webhooks reached (10)
  if (check === "30007") {
    await i.editReply({ embeds: [embeds.errors.maxNumberOfWebhooks(language)] });
    return true;
  }

  return false;
};
