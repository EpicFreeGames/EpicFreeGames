import { config } from "./config";
import redis from "./redis";
import { authRouter } from "./routes/auth";
import { currencyRouter } from "./routes/currencies";
import { dashboardRouter } from "./routes/dashboard";
import { gameRouter } from "./routes/games";
import { logRouter } from "./routes/logs";
import { sendsRouter } from "./routes/sends";
import { serverRouter } from "./routes/servers";
import { userRouter } from "./routes/users";
import { handleWebsocketConnection } from "./websocket/handler";
import connectRedis from "connect-redis";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router, Express } from "express";
import expressSession from "express-session";
import http from "http";
import WebSocket from "ws";

export const createServer = async () => {
  const app = express();
  const RedisStore = connectRedis(expressSession);
  const store = new RedisStore({ client: redis });

  app.use(express.json());
  app.use(cookieParser());
  app.set("trust proxy", 2);
  app.use(cors({ credentials: true, origin: config.DASH_URL }));

  app.use(
    expressSession({
      store,
      secret: config.EFG_API_SECRET,
      resave: false,
      saveUninitialized: false,
      name: "sid",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      },
    })
  );

  const server = http.createServer(app);
  const wss = createWs(server);

  app.use((req, res, next) => {
    req.wss = wss;

    next();
  });

  registerRoutes(app);

  return server;
};

const createWs = (server: http.Server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", handleWebsocketConnection(wss));

  return wss;
};

const registerRoutes = (app: Express) => {
  const router = Router();

  router.use("/games", gameRouter);
  router.use("/servers", serverRouter);
  router.use("/users", userRouter);
  router.use("/logs", logRouter);
  router.use("/auth", authRouter);
  router.use("/currencies", currencyRouter);
  router.use("/sends", sendsRouter);
  router.use("/dashboard", dashboardRouter);

  app.use("/api", router);
};
