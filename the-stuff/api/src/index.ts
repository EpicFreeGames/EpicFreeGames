// @ts-ignore
import prisma from "./data/prisma";
// @ts-ignore
import redis from "./data/redis";
import { createServer } from "./server";

(async () => {
  const server = await createServer();

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => console.log(`API listening on port ${port}`));
})();
