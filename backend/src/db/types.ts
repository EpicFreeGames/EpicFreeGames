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

export type DbServer = {
	id: string;
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
	server: Exclude<DbServer, "createdAt">;
	attempts: {
		date: Date;
		error: string | null;
		server: Exclude<DbServer, "createdAt"> | null;
	}[];
};

export type DbLog = {
	/**
	 * Date
	 */
	d: Date;
	/**
	 * Log message
	 */
	m: string;
	/**
	 * Request ID
	 */
	r: string;
	/**
	 * Log context
	 */
	c: any;
};
