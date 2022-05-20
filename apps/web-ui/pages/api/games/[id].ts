import { db } from "database";
import { ApiEndpoint } from "../../../utils/ApiEndpoint";
import { methodNotAllowed } from "../../../utils/apiUtils";
import { hasAccess } from "../../../utils/auth";

const Handler: ApiEndpoint = async (req, res) => {
  const method = req.method;

  switch (method) {
    case "PATCH":
      await HandlePatch(req, res);
      break;

    case "DELETE":
      await HandleDelete(req, res);
      break;

    default:
      methodNotAllowed(res);
      break;
  }
};

const HandlePatch: ApiEndpoint = async (req, res) => {
  if (!(await hasAccess(req, res, true))) return;

  const body = JSON.parse(req.body);
  const id = req.query.id as string;

  const existingGame = await db.games.get.byId(id);

  if (!existingGame) return res.status(404).json({ message: "Game not found" });

  const game = {
    ...existingGame,
    ...body,
  };

  delete game._id;

  await db.games.update.game(id, game);

  return res.status(204).end();
};

const HandleDelete: ApiEndpoint = async (req, res) => {
  if (!(await hasAccess(req, res, true))) return;

  const id = req.query.id as string;

  const removedGame = await db.games.remove(id);

  if (!removedGame) return res.status(404).json({ message: "Game not found" });

  return res.status(204).end();
};

export default Handler;
