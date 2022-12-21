import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, Router } from "express";
import http from "http";
import { v4 as uuidv4 } from "uuid";

import { configuration } from "@efg/configuration";

import { authRouter } from "./routes/auth";
import { currencyRouter } from "./routes/currencies";
import { dashboardRouter } from "./routes/dashboard";
import { gameRouter } from "./routes/games";
import { languageRouter } from "./routes/languages";
import { logRouter } from "./routes/logs";
import { sendsRouter } from "./routes/sends";
import { serverRouter } from "./routes/servers";
import { statusRouter } from "./routes/status";
import { userRouter } from "./routes/users";
import { createWs } from "./websocket/websocket";

export const createServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.set("trust proxy", 2);
  app.use(cors({ credentials: true, origin: configuration.DASH_URL }));

  const server = http.createServer(app);
  const wss = createWs(server);

  app.use((req, res, next) => {
    req.wss = wss;

    next();
  });

  app.use((req, res, next) => {
    const requestId = uuidv4();
    const start = new Date().getTime();
    const timestamp = `${new Date().toISOString()}`;

    console.log(`[${timestamp}]::[${requestId}] - ${req.method} ${req.url}`);

    res.on("finish", () => {
      const end = new Date().getTime();
      const duration = end - start;

      console.log(`[${timestamp}]::[${requestId}]::FINISH - ${res.statusCode} - ${duration}ms`);
    });

    next();
  });

  registerRoutes(app);

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
  router.use("/status", statusRouter);

  app.use("/api", router);
};
