import { db } from "database";
import { ApiEndpoint } from "../../../utils/ApiEndpoint";
import { methodNotAllowed } from "../../../utils/apiUtils";
import { hasAccess } from "../../../utils/auth";
import { mongoUrl } from "../../../utils/envs";

const Handler: ApiEndpoint = async (req, res) => {
  const method = req.method;

  switch (method) {
    case "GET":
      await HandleGet(req, res);
      break;

    default:
      methodNotAllowed(res);
      break;
  }
};

const HandleGet: ApiEndpoint = async (req, res) => {
  if (!(await hasAccess(req, res, false))) return;

  await db.connect(mongoUrl);

  const freeGames = await db.games.get.free();
  const upcomingFreeGames = await db.games.get.upcoming();

  const notConfirmedGames = await db.games.get.notConfirmed();

  res.status(200).json({
    freeGames,
    upcomingFreeGames,
    notConfirmedGames,
  });
};

export default Handler;
