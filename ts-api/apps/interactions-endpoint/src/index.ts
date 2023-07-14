import { logger } from "@efg/logger";

import { createServer } from "./server";

const server = createServer();

const port = Number(process.env.PORT) || 3000;

server.listen(port, () => logger.info(`Interactions endpoint listening on port ${port}`));
