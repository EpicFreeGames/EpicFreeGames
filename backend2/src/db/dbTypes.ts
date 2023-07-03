import { ObjectId, WithId } from "mongodb";

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

export type DbGameWithId = WithId<DbGame>;

export type DbDiscordServer = {
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

export type DbSend = {
	gameIds: ObjectId[];
};

export type DbSendLog = {
	sendId: ObjectId;
	server: Exclude<DbDiscordServer, "createdAt">;
	attempts: {
		date: Date;
		error: string | null;
		server: Exclude<DbDiscordServer, "createdAt"> | null;
	}[];
};
