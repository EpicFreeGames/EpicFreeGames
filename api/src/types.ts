import { ITokenPayload } from "./auth/jwt";
import { NextFunction, Request, Response } from "express";
import type { Server } from "ws";

export type Middleware = {
  (req: Request, res: Response, next: NextFunction): any;
};

declare global {
  interface BigInt {
    toJSON: () => string;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    wss: Server;
    tokenPayload: ITokenPayload;
  }
}
