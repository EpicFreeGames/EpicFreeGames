import { initTranslations } from "@efg/i18n";

import { createApp } from "./app";

(async () => {
  console.log("Initializing translations");
  await initTranslations();
  console.log("Translations initialized");

  const app = createApp();

  app.listen(3002, () => {
    console.log(`Listening for interactions on port ${3002}`);
  });
})();
