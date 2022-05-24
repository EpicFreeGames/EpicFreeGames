export const adminId = process.env.ADMIN_IDS?.split(",")[0] || "";
export const collaborators = process.env.ADMIN_IDS?.split(",") || [""];

export const discordClientId = process.env.DISCORD_CLIENT_ID || "";
export const discordClientSecret = process.env.DISCORD_CLIENT_SECRET || "";

export const nextAuthSecret = process.env.NEXTAUTH_SECRET || "";

export const botId = process.env.BOT_ID || "";
export const guildId = process.env.GUILD_ID || "";
export const botToken = process.env.BOT_TOKEN || "";

export const mongoUrl = process.env.MONGO_URI || "";

export const senderUrl = process.env.SENDER_URL || "";
