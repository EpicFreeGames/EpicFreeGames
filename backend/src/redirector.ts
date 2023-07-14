import { PrismaClient } from "@prisma/client";
import { Request, Response } from "./discord/requestHandler";

export async function redirect(req: Request, res: Response, db: PrismaClient) {
	const [destination, gameId] = req.url?.split("/").slice(2) ?? [];

	if (!destination || !gameId) {
		res.writeHead(400);
		res.end();
		return;
	}

	const game = await db.game.findUnique({
		where: { id: gameId },
		select: { path: true },
	});

	if (!game) {
		res.writeHead(404);
		res.end();
		return;
	}

	const dest =
		destination === "web"
			? `https://epicgames.com${game.path}`
			: `com.epicgames.launcher://store${game.path}`;

	res.writeHead(302, { Location: dest });
	res.end();
	return;
}
