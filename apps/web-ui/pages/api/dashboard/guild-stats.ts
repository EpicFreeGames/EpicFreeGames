import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "shared";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();

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
