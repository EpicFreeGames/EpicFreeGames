import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import type { Server } from "ws";

export type Middleware = {
  (req: Request, res: Response, next: NextFunction): any;
};

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

declare global {
  interface BigInt {
    toJSON: () => string;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    wss: Server;
  }
}
