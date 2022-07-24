import { config } from "./config";
import { authRouter } from "./routes/auth";
import { gameRouter } from "./routes/games";
import { logRouter } from "./routes/logs";
import { serverRouter } from "./routes/servers";
import { userRouter } from "./routes/users";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser";
import express, { Router, Express } from "express";
import expressSession from "express-session";

export const createServer = async (redisStore: RedisStore) => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    expressSession({
      store: redisStore,
      secret: config.APP_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
      },
    })
  );

  registerRoutes(app);

  return app;
};

const registerRoutes = (app: Express) => {
  const router = Router();

  router.use("/games", gameRouter);
  router.use("/servers", serverRouter);
  router.use("/users", userRouter);
  router.use("/logs", logRouter);
  router.use("/auth", authRouter);

  app.use("/api", router);
};
