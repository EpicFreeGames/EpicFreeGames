import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Router } from "express";
import http from "http";

import { config } from "./config";
import { initTranslations } from "./i18n";
import { authRouter } from "./routes/auth";
import { currencyRouter } from "./routes/currencies";
import { dashboardRouter } from "./routes/dashboard";
import { gameRouter } from "./routes/games";
import { i18nRouter } from "./routes/i18n";
import { languageRouter } from "./routes/languages";
import { logRouter } from "./routes/logs";
import { sendsRouter } from "./routes/sends";
import { serverRouter } from "./routes/servers";
import { userRouter } from "./routes/users";
import { createWs } from "./websocket/websocket";

export const createServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.set("trust proxy", 2);
  app.use(cors({ credentials: true, origin: config.DASH_URL }));

  const server = http.createServer(app);
  const wss = createWs(server);

  app.use((req, res, next) => {
    req.wss = wss;

    next();
  });

  registerRoutes(app);
  await initTranslations();

  return server;
};

const registerRoutes = (app: Express) => {
  const router = Router();

  router.use("/games", gameRouter);
  router.use("/servers", serverRouter);
  router.use("/users", userRouter);
  router.use("/logs", logRouter);
  router.use("/auth", authRouter);
  router.use("/currencies", currencyRouter);
  router.use("/languages", languageRouter);
  router.use("/sends", sendsRouter);
  router.use("/dashboard", dashboardRouter);
  router.use("/i18n", i18nRouter);

  app.use("/api", router);
};
