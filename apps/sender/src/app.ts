import express from "express";
import { send } from "./send";

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.post("/send", send);

  return app;
};
