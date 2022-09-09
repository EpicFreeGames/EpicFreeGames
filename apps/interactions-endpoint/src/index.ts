import { logger } from "@efg/logger";

import { createApp } from "./app";

(async () => {
  const app = createApp();

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    logger.info(`Listening for interactions on port ${port}`);
  });
})();
