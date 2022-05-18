import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "database";
import { ICommandsRanIn } from "shared";
import { hasAccess } from "../../../utils/auth";
import { dbConnect } from "../../../utils/db";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!(await hasAccess(req, res, false))) return;

  await dbConnect();

  const lastHour = await db.logs.commands.get.lastHour();
  const lastDat = await db.logs.commands.get.lastDay();

  const stats: ICommandsRanIn = {
    allTime: await db.logs.commands.get.all(),
    lastHour: lastHour,
    lastDay: lastDat,
    last7days: await db.logs.commands.get.last7days(),
    last30days: await db.logs.commands.get.last30days(),

    avgCommandsIn: {
      anHour: lastHour / 3600,
      aDay: lastDat / 86400,
    },
  };

  res.status(200).json(stats);
};

export default Handler;
