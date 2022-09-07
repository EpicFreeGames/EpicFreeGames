import { configuration } from "@efg/configuration";

import { initDatabaseDev } from "./data/init";
// @ts-ignore
import prisma from "./data/prisma";
import { createServer } from "./server";

(async () => {
  const server = await createServer();

  if (configuration.ENV === "Development") await initDatabaseDev();

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => console.log(`API listening on port ${port}`));
})();
