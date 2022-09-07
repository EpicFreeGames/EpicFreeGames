import { initTranslations } from "@efg/i18n";

import { createApp } from "./app";

(async () => {
  console.log("Initializing translations");
  await initTranslations();
  console.log("Translations initialized");

  const app = createApp();

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Listening for interactions on port ${port}`);
  });
})();
