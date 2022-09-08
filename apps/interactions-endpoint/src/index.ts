import { createApp } from "./app";

(async () => {
  const app = createApp();

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Listening for interactions on port ${port}`);
  });
})();
