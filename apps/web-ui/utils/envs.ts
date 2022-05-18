export const adminId = process.env.ADMIN_ID || "";
export const collaborators = process.env.COLLABORATORS?.split(",") || [""];

export const discordClientId = process.env.DISCORD_CLIENT_ID || "";
export const discordClientSecret = process.env.DISCORD_CLIENT_SECRET || "";

export const nextAuthSecret = process.env.NEXTAUTH_SECRET || "";

export const botId = process.env.BOT_ID || "";
export const guildId = process.env.GUILD_ID || "";
export const botToken = process.env.BOT_TOKEN || "";

export const mongoUrl = process.env.MONGO_URL || "";

// --- envs below this are accessible from browser ---

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "";
