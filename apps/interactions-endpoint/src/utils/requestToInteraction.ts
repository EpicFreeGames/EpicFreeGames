import axios from "axios";
import { Request } from "express";
import {
  ApplicationCommandOptionType,
  InteractionResponseType,
  MessageFlags,
} from "discord-api-types/v9";
import { discordApiRequest } from "./axiosConfig";
import { CommandInteraction, CommandOptions, db, embeds, ICommandLog, logger, User } from "shared";
import { config } from "config";

export const requestToInteraction = (req: Request): CommandInteraction => {
  const body = req.body;
  const start = Date.now();

  const user: User = {
    id: body?.member?.user?.id || body?.user?.id,
    tag:
      (body?.member?.user?.username || body?.user?.username) +
      "#" +
      (body?.member?.user?.discriminator || body?.user?.discriminator),
    locale: body.locale,
    permissions: null,
  };

  if (body?.member) {
    const bits = BigInt(body.member.permissions);
    user.permissions = {
      bits,
      hasPermission: (bits: bigint, checkFor: bigint) => (bits & checkFor) === checkFor,
    };
  }

  return {
    channelId: body.channel_id || null,
    guildId: body.guild_id || null,
    id: body.id,
    token: body.token,
    type: body.type,
    command: {
      name: body.data.name,
      type: body.data.type,
      id: body.data.id,
    },
    user,
    options: {
      getString: (name: string, required?: boolean | undefined) => {
        let res = null;

        for (const option of body.data.options) {
          if (option.type === ApplicationCommandOptionType.String && option.name === name) {
            res = option.value;
            break;
          }

          for (const subOption of option.options) {
            if (subOption.type === ApplicationCommandOptionType.String && subOption.name === name) {
              res = subOption.value;
              break;
            }
          }
        }
        if (!res && required) throw new TypeError("STRING_OPTION_NOT_FOUND");

        return res;
      },

      getChannelId: (name: string, required?: boolean | undefined) => {
        let res = null;

        for (const option of body.data.options) {
          if (option.type === ApplicationCommandOptionType.Channel && option.name === name) {
            res = option.value;
            break;
          }

          for (const subOption of option.options) {
            if (
              subOption.type === ApplicationCommandOptionType.Channel &&
              subOption.name === name
            ) {
              res = subOption.value;
              break;
            }
          }
        }

        if (!res && required) throw new TypeError("STRING_OPTION_NOT_FOUND");

        return res;
      },

      getRole: (name: string, required?: boolean | undefined) => {
        let res = null;

        for (const option of body.data.options) {
          if (option.type === ApplicationCommandOptionType.Role && option.name === name) {
            res = option.value;
            break;
          }

          for (const subOption of option.options) {
            if (subOption.type === ApplicationCommandOptionType.Role && subOption.name === name) {
              res = subOption.value;
              break;
            }
          }
        }

        if (!res && required) throw new TypeError("STRING_OPTION_NOT_FOUND");

        return res;
      },
    },
    async reply(options) {
      this.onFinish();
      const data: any = {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {},
      };

      if (options.content) data.data.content = options.content;
      if (options.embeds?.length) data.data.embeds = options.embeds;
      if (options.components?.length) data.data.components = options.components;
      if (options.ephemeral) data.data.flags = MessageFlags.Ephemeral;

      const res = await axios(
        discordApiRequest(`/interactions/${this.id}/${this.token}/callback`, "POST", data)
      );

      return res.data;
    },
    async deferReply(options) {
      const data: any = {
        type: InteractionResponseType.DeferredChannelMessageWithSource,
        data: {},
      };

      if (options.ephemeral) data.data.flags = MessageFlags.Ephemeral;

      const res = await axios(
        discordApiRequest(`/interactions/${this.id}/${this.token}/callback`, "POST", data)
      );

      return res.data;
    },
    async followUp(options) {
      this.onFinish();
      const data: any = {};

      if (options.content) data.content = options.content;
      if (options.embeds?.length) data.embeds = options.embeds;
      if (options.components?.length) data.components = options.components;
      if (options.ephemeral) data.flags = MessageFlags.Ephemeral;

      const res = await axios(
        discordApiRequest(`/webhooks/${config.botId}/${this.token}`, "POST", data)
      );

      return res.data;
    },
    async editReply(options) {
      this.onFinish();
      const data: any = {};

      if (options.content) data.content = options.content;
      if (options.embeds?.length) data.embeds = options.embeds;
      if (options.components?.length) data.data.components = options.components;
      if (options.ephemeral) data.flags = MessageFlags.Ephemeral;

      const res = await axios(
        discordApiRequest(
          `/webhooks/${config.botId}/${this.token}/messages/@original`,
          "PATCH",
          data
        )
      );

      return res.data;
    },
    getSubCommand(required?: boolean | undefined) {
      const subCmd = body.data?.options?.find(
        (option: CommandOptions) => option.type === ApplicationCommandOptionType.Subcommand
      );

      if (!subCmd && required) throw new TypeError("SUB_COMMAND_NOT_FOUND");

      return subCmd;
    },
    async onFinish() {
      const subCommandName = this.getSubCommand()?.name;
      const commandName = `/${this.command.name}${subCommandName ? ` ${subCommandName}` : ""}`;

      const end = Date.now();

      const log: ICommandLog = {
        command: commandName,
        sender: {
          id: this.user.id,
          tag: this.user.tag,
        },
        guildId: this.guildId,
        respondedIn: end - start,
      };

      db.logs.addCommand(log).catch((err) => console.error(err));

      let guild = null;
      if (this.guildId) guild = await db.guilds.get.one(this.guildId);

      logger
        .discord({ embeds: [embeds.logs.command(guild, log, !!!this.guildId)] })
        .catch((err: any) => console.error(err));

      logger.console(`${commandName} executed in ${log.respondedIn}ms`);
    },
  };
};
