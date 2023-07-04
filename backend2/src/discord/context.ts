import { APIInteractionResponse } from "discord-api-types/v10";
import { ulid } from "ulid";
import { Database } from "../db/db";
import { Response } from "./requestHandler";
import { PrismaClient } from "@prisma/client";

export type DiscordRequestId = string & { __brand: "DiscordRequestContext" };

function createRequestId() {
	return ulid() as DiscordRequestId;
}

export function getDiscordRequestContext(res: Response, db: PrismaClient) {
	const requestId = createRequestId();
	const logger = discordLogger(requestId);

	return {
		respondWith: respondWith(logger, res),
		requestId,
		log: logger,
		db,
	};
}

export type DiscordRequestContext = ReturnType<typeof getDiscordRequestContext>;

function respondWith(log: DiscordLogger, res: Response) {
	return (code: number, body?: string | APIInteractionResponse, shouldLog = true) => {
		if (body) {
			if (typeof body === "string") {
				shouldLog && log("Responding with", { code, body });

				res.writeHead(code, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ [code < 400 ? "error" : "message"]: body }));
			} else {
				shouldLog && log("Responding with", { code, body: "..." });

				res.writeHead(code, { "Content-Type": "application/json" });
				res.end(JSON.stringify(body));
			}
		} else {
			shouldLog && log("Responding with", { code });

			res.writeHead(code);
			res.end();
		}
	};
}

export function discordLogger(requestId: DiscordRequestId) {
	return (message: string, context?: any) => {
		const date = new Date();

		console.log(
			`${date.toISOString()} [discord] ${requestId} ${message}` +
				(context ? " " + JSON.stringify(context) : "")
		);
	};
}

export type DiscordLogger = ReturnType<typeof discordLogger>;
