import { logger } from "@efg/logger";

import { createServer } from "./server";

const server = createServer();

const port = process.env.PORT || 3000;

server.listen(port, () =>
  logger.info(`Under maintenance response server listening on port ${port}`)
);
