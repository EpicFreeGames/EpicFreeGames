import { logger } from "@efg/logger";

import { initDatabase } from "./data/init";
// @ts-ignore
import prisma from "./data/prisma";
import { createServer } from "./server";

(async () => {
  const server = await createServer();

  await initDatabase();

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => logger.info(`EFG Api listening on port ${port}`));
})();
