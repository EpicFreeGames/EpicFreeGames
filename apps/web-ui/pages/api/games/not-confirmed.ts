import { db } from "database";
import { ApiEndpoint } from "../../../utils/ApiEndpoint";
import { requireMethod } from "../../../utils/apiUtils";
import { hasAccess } from "../../../utils/auth";
import { mongoUrl } from "../../../utils/envs";

const Handler: ApiEndpoint = async (req, res) => {
  if (!requireMethod(req, res, "GET")) return;
  if (!(await hasAccess(req, res, false))) return;

  await db.connect(mongoUrl);

  const notConfirmedGames = await db.games.get.notConfirmed();

  res.status(200).json(notConfirmedGames);
};

export default Handler;
