import { NextApiRequest, NextApiResponse } from "next";
import { getDefaultCurrency, getDefaultLanguage } from "shared";
import { hasAccess } from "../../../../utils/auth";
import { getCommandsToDeploy, globalDeploy } from "../../../../utils/commandDeploy";
import { dbConnect } from "../../../../utils/db";
import { db } from "database";

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(405).json({ message: `Method '${req.method}' not allowed` });

  if (!(await hasAccess(req, res, true))) return;

  try {
    await dbConnect();

    console.log("Connected to DB");
    console.log("Getting languages");

    const dbLanguages = await db.languages.get.all();
    const dbCurrencies = await db.currencies.get.all();

    const languages = [...dbLanguages, getDefaultLanguage()];
    const currencies = [...dbCurrencies, getDefaultCurrency()];

    console.log("Got languages");

    const { globalCommands } = await getCommandsToDeploy(languages, currencies);

    console.log("Got commands");
    console.log("Deploying commands");

    await globalDeploy(globalCommands);

    console.log("Commands deployed");

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default Handler;
