import { NextFunction, Request, Response } from "express";

export interface Middleware {
  (req: Request, res: Response, next: NextFunction): any;
}

declare module "express-session" {
  interface SessionData {
    flags: number;
  }
}
