export type DbGame = {
	name: string;
	displayName: string;
	imageUrl: string;
	startDate: Date;
	endDate: Date;
	confirmed: boolean;
	path: string;
	prices: {
		value: number;
		formattedValue: string;
		currencyCode: string;
	}[];
};

export type DbUser = {
	email: string;
	/**
	 * BigInt stored as a string
	 */
	flags: string;
};

export type DbServer = {
	discordId: string;
	languageCode: string;
	currencyCode: string;
	roleId: string | null;
	channelId: string | null;
	threadId: string | null;
	webhookId: string | null;
	webhookToken: string | null;
	createdAt: Date;
};

export type DbCommandLog = {
	command: string;
	args: string[];
	senderDiscordId: string;
	serverDiscordId: string;
	error: string | null;
	createdAt: Date;
};

export type DbSending = {
	gameIds: string[];
};

export type DbSendingLog = {
	sendingId: string;
	serverDiscordId: string;
	type: "MESSAGE" | "WEBHOOK";
	error: string | null;
};

export type DbSession = {
	userId: string;
	createdAt: Date;
	expiresAt: Date;
};
