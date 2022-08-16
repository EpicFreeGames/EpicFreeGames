import { NextFunction, Request, Response } from "express";
import type { Server } from "ws";
import { ITokenPayload } from "./auth/jwt/types";

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
