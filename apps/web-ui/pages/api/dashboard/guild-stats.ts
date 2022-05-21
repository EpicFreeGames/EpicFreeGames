import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "database";
import { hasAccess } from "../../../utils/auth";
import { dbConnect } from "../../../utils/db";
import { requireMethod } from "../../../utils/apiUtils";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!requireMethod(req, res, "GET")) return;

  if (!(await hasAccess(req, res, false))) return;

  await dbConnect();

  res.status(200).json({
    dbGuildCount: await db.guilds.get.count(),
    hasWebhook: await db.guilds.get.counts.hasWebhook(),
    hasOnlyChannel: await db.guilds.get.counts.hasOnlySetChannel(),
    hasSetRole: await db.guilds.get.counts.hasSetRole(),
    hasChangedLanguage: await db.guilds.get.counts.hasChangedLanguage(),
    hasChangedCurrency: await db.guilds.get.counts.hasChangedCurrency(),
    hasSetThread: await db.guilds.get.counts.hasSetThread(),
  });
};

export default Handler;
