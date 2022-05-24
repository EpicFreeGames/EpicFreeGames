import express from "express";
import { send } from "./send";
import { updateTranslations } from "./update-translations";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.post("/send", send);
  app.post("/update-translations", updateTranslations);

  return app;
};
