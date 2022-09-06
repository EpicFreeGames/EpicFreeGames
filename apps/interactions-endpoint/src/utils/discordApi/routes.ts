export const discordApiRoutes = {
  GATEWAY_BOT: () => {
    return `/gateway/bot`;
  },

  // Automod Endpoints
  AUTOMOD_RULES: (guildId: bigint) => {
    return `/guilds/${guildId}/auto-moderation/rules`;
  },
  AUTOMOD_RULE: (guildId: bigint, ruleId: bigint) => {
    return `/guilds/${guildId}/auto-moderation/rules/${ruleId}`;
  },

  // Channel Endpoints
  CHANNEL: (channelId: bigint) => {
    return `/channels/${channelId}`;
  },
  CHANNEL_MESSAGE: (channelId: bigint, messageId: bigint) => {
    return `/channels/${channelId}/messages/${messageId}`;
  },
  CHANNEL_PIN: (channelId: bigint, messageId: bigint) => {
    return `/channels/${channelId}/pins/${messageId}`;
  },
  CHANNEL_PINS: (channelId: bigint) => {
    return `/channels/${channelId}/pins`;
  },
  CHANNEL_BULK_DELETE: (channelId: bigint) => {
    return `/channels/${channelId}/messages/bulk-delete`;
  },
  CHANNEL_INVITES: (channelId: bigint) => {
    return `/channels/${channelId}/invites`;
  },
  CHANNEL_WEBHOOKS: (channelId: bigint) => {
    return `/channels/${channelId}/webhooks`;
  },
  CHANNEL_MESSAGE_REACTION_ME: (channelId: bigint, messageId: bigint, emoji: string) => {
    return `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
      emoji
    )}/@me`;
  },
  CHANNEL_MESSAGE_REACTION_USER: (
    channelId: bigint,
    messageId: bigint,
    emoji: string,
    userId: bigint
  ) => {
    return `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(
      emoji
    )}/${userId}`;
  },
  CHANNEL_MESSAGE_REACTIONS: (channelId: bigint, messageId: bigint) => {
    return `/channels/${channelId}/messages/${messageId}/reactions`;
  },

  CHANNEL_FOLLOW: (channelId: bigint) => {
    return `/channels/${channelId}/followers`;
  },
  CHANNEL_MESSAGE_CROSSPOST: (channelId: bigint, messageId: bigint) => {
    return `/channels/${channelId}/messages/${messageId}/crosspost`;
  },
  CHANNEL_OVERWRITE: (channelId: bigint, overwriteId: bigint) => {
    return `/channels/${channelId}/permissions/${overwriteId}`;
  },
  // Bots SHALL NOT use this endpoint but they can
  CHANNEL_TYPING: (channelId: bigint) => {
    return `/channels/${channelId}/typing`;
  },

  // Thread Endpoints
  THREAD_START_PUBLIC: (channelId: bigint, messageId: bigint) => {
    return `/channels/${channelId}/messages/${messageId}/threads`;
  },
  THREAD_START_PRIVATE: (channelId: bigint) => {
    return `/channels/${channelId}/threads`;
  },
  THREAD_ACTIVE: (guildId: bigint) => {
    return `/guilds/${guildId}/threads/active`;
  },
  THREAD_MEMBERS: (channelId: bigint) => {
    return `/channels/${channelId}/thread-members`;
  },
  THREAD_ME: (channelId: bigint) => {
    return `/channels/${channelId}/thread-members/@me`;
  },
  THREAD_USER: (channelId: bigint, userId: bigint) => {
    return `/channels/${channelId}/thread-members/${userId}`;
  },
  THREAD_ARCHIVED: (channelId: bigint) => {
    return `/channels/${channelId}/threads/archived`;
  },
  // Thread -> Forum Endpoints
  FORUM_START: (channelId: bigint) => {
    return `/channels/${channelId}/threads?has_message=true`;
  },

  // Guild Endpoints
  GUILD: (guildId: bigint, withCounts?: boolean) => {
    let url = `/guilds/${guildId}?`;

    if (withCounts !== undefined) {
      url += `with_counts=${withCounts}`;
    }

    return url;
  },
  GUILDS: () => {
    return `/guilds`;
  },
  GUILD_BAN: (guildId: bigint, userId: bigint) => {
    return `/guilds/${guildId}/bans/${userId}`;
  },
  GUILD_CHANNELS: (guildId: bigint) => {
    return `/guilds/${guildId}/channels`;
  },
  GUILD_WIDGET: (guildId: bigint) => {
    return `/guilds/${guildId}/widget`;
  },
  GUILD_WIDGET_JSON: (guildId: bigint) => {
    return `/guilds/${guildId}/widget.json`;
  },
  GUILD_WIDGET_IMAGE: (
    guildId: bigint,
    style?: "shield" | "banner1" | "banner2" | "banner3" | "banner4"
  ) => {
    let url = `/guilds/${guildId}/widget.png?`;

    if (style) {
      url += `style=${style}`;
    }

    return url;
  },
  GUILD_EMOJI: (guildId: bigint, emojiId: bigint) => {
    return `/guilds/${guildId}/emojis/${emojiId}`;
  },
  GUILD_EMOJIS: (guildId: bigint) => {
    return `/guilds/${guildId}/emojis`;
  },
  GUILD_INTEGRATION: (guildId: bigint, integrationId: bigint) => {
    return `/guilds/${guildId}/integrations/${integrationId}`;
  },
  GUILD_INTEGRATION_SYNC: (guildId: bigint, integrationId: bigint) => {
    return `/guilds/${guildId}/integrations/${integrationId}/sync`;
  },
  GUILD_INTEGRATIONS: (guildId: bigint) => {
    return `/guilds/${guildId}/integrations?include_applications=true`;
  },
  GUILD_INVITES: (guildId: bigint) => {
    return `/guilds/${guildId}/invites`;
  },
  GUILD_LEAVE: (guildId: bigint) => {
    return `/users/@me/guilds/${guildId}`;
  },
  GUILD_MEMBER: (guildId: bigint, userId: bigint) => {
    return `/guilds/${guildId}/members/${userId}`;
  },

  GUILD_MEMBER_ROLE: (guildId: bigint, memberId: bigint, roleId: bigint) => {
    return `/guilds/${guildId}/members/${memberId}/roles/${roleId}`;
  },
  GUILD_MEMBERS_SEARCH: (guildId: bigint, query: string, options?: { limit?: number }) => {
    let url = `/guilds/${guildId}/members/search?query=${encodeURIComponent(query)}`;

    if (options) {
      if (options.limit !== undefined) url += `&limit=${options.limit}`;
    }

    return url;
  },

  GUILD_REGIONS: (guildId: bigint) => {
    return `/guilds/${guildId}/regions`;
  },
  GUILD_ROLE: (guildId: bigint, roleId: bigint) => {
    return `/guilds/${guildId}/roles/${roleId}`;
  },
  GUILD_ROLES: (guildId: bigint) => {
    return `/guilds/${guildId}/roles`;
  },

  GUILD_VANITY_URL: (guildId: bigint) => {
    return `/guilds/${guildId}/vanity-url`;
  },
  GUILD_WEBHOOKS: (guildId: bigint) => {
    return `/guilds/${guildId}/webhooks`;
  },
  TEMPLATE: (code: string) => {
    return `/guilds/templates/${code}`;
  },
  GUILD_TEMPLATE: (guildId: bigint, code: string) => {
    return `/guilds/${guildId}/templates/${code}`;
  },
  GUILD_TEMPLATES: (guildId: bigint) => {
    return `/guilds/${guildId}/templates`;
  },
  GUILD_PREVIEW: (guildId: bigint) => {
    return `/guilds/${guildId}/preview`;
  },
  UPDATE_VOICE_STATE: (guildId: bigint, userId?: bigint) => {
    return `/guilds/${guildId}/voice-states/${userId ?? "@me"}`;
  },
  GUILD_WELCOME_SCREEN: (guildId: bigint) => {
    return `/guilds/${guildId}/welcome-screen`;
  },
  GUILD_SCHEDULED_EVENTS: (guildId: bigint, withUserCount?: boolean) => {
    let url = `/guilds/${guildId}/scheduled-events?`;

    if (withUserCount !== undefined) {
      url += `with_user_count=${withUserCount}`;
    }
    return url;
  },
  GUILD_SCHEDULED_EVENT: (guildId: bigint, eventId: bigint, withUserCount?: boolean) => {
    let url = `/guilds/${guildId}/scheduled-events/${eventId}`;

    if (withUserCount !== undefined) {
      url += `with_user_count=${withUserCount}`;
    }

    return url;
  },

  // Voice
  VOICE_REGIONS: () => {
    return `/voice/regions`;
  },

  WEBHOOK: (webhookId: bigint, token: string, options?: { wait?: boolean; threadId?: bigint }) => {
    let url = `/webhooks/${webhookId}/${token}?`;

    if (options) {
      if (options?.wait !== undefined) url += `wait=${options.wait}`;
      if (options.threadId) url += `thread_id=${options.threadId}`;
    }

    return url;
  },
  WEBHOOK_ID: (webhookId: bigint) => {
    return `/webhooks/${webhookId}`;
  },
  WEBHOOK_MESSAGE: (
    webhookId: bigint,
    token: string,
    messageId: bigint,
    options?: { threadId?: bigint }
  ) => {
    let url = `/webhooks/${webhookId}/${token}/messages/${messageId}?`;

    if (options) {
      if (options.threadId) url += `thread_id=${options.threadId}`;
    }

    return url;
  },
  WEBHOOK_MESSAGE_ORIGINAL: (webhookId: bigint, token: string, options?: { threadId?: bigint }) => {
    let url = `/webhooks/${webhookId}/${token}/messages/@original?`;

    if (options) {
      if (options.threadId) url += `thread_id=${options.threadId}`;
    }

    return url;
  },
  WEBHOOK_SLACK: (webhookId: bigint, token: string) => {
    return `/webhooks/${webhookId}/${token}/slack`;
  },
  WEBHOOK_GITHUB: (webhookId: bigint, token: string) => {
    return `/webhooks/${webhookId}/${token}/github`;
  },

  // Application Endpoints
  COMMANDS: (applicationId: bigint) => {
    return `/applications/${applicationId}/commands`;
  },
  COMMANDS_GUILD: (applicationId: bigint, guildId: bigint) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands`;
  },
  COMMANDS_PERMISSIONS: (applicationId: bigint, guildId: bigint) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands/permissions`;
  },
  COMMANDS_PERMISSION: (applicationId: bigint, guildId: bigint, commandId: bigint) => {
    return `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}/permissions`;
  },
  COMMANDS_ID: (applicationId: bigint, commandId: bigint, withLocalizations?: boolean) => {
    let url = `/applications/${applicationId}/commands/${commandId}?`;

    if (withLocalizations !== undefined) {
      url += `withLocalizations=${withLocalizations}`;
    }

    return url;
  },
  COMMANDS_GUILD_ID: (
    applicationId: bigint,
    guildId: bigint,
    commandId: bigint,
    withLocalizations?: boolean
  ) => {
    let url = `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}?`;

    if (withLocalizations !== undefined) {
      url += `with_localizations=${withLocalizations}`;
    }

    return url;
  },

  // Interaction Endpoints
  INTERACTION_ID_TOKEN: (interactionId: bigint, token: string) => {
    return `/interactions/${interactionId}/${token}/callback`;
  },
  INTERACTION_ORIGINAL_ID_TOKEN: (interactionId: bigint, token: string) => {
    return `/webhooks/${interactionId}/${token}/messages/@original`;
  },
  INTERACTION_ID_TOKEN_MESSAGE_ID: (applicationId: bigint, token: string, messageId: bigint) => {
    return `/webhooks/${applicationId}/${token}/messages/${messageId}`;
  },

  // User endpoints
  USER: (userId: bigint) => {
    return `/users/${userId}`;
  },
  USER_BOT: () => {
    return `/users/@me`;
  },
  USER_GUILDS: () => {
    return `/users/@me/guilds`;
  },
  USER_DM: () => {
    return `/users/@me/channels`;
  },
  USER_CONNECTIONS: () => {
    return `/users/@me/connections`;
  },
  USER_NICK: (guildId: bigint) => {
    return `/guilds/${guildId}/members/@me`;
  },

  // Discovery Endpoints
  DISCOVERY_CATEGORIES: () => {
    return `/discovery/categories`;
  },
  DISCOVERY_VALID_TERM: (term: string) => {
    return `/discovery/valid-term?term=${term}`;
  },
  DISCOVERY_METADATA: (guildId: bigint) => {
    return `/guilds/${guildId}/discovery-metadata`;
  },
  DISCOVERY_SUBCATEGORY: (guildId: bigint, categoryId: number) => {
    return `/guilds/${guildId}/discovery-categories/${categoryId}`;
  },

  // OAuth2
  OAUTH2_APPLICATION: () => {
    return `/oauth2/applications/@me`;
  },

  // Stage instances
  STAGE_INSTANCES: () => {
    return `/stage-instances`;
  },
  STAGE_INSTANCE: (channelId: bigint) => {
    return `/stage-instances/${channelId}`;
  },

  // Misc Endpoints
  NITRO_STICKER_PACKS: () => {
    return `/sticker-packs`;
  },
};
