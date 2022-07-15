import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { TokenPayload } from "./utils/jwt";

declare module "fastify" {
  interface FastifyRequest {
    prisma: PrismaClient;
    mailer: nodemailer.Transporter;
  }
  interface FastifyInstance {
    prisma: PrismaClient;
    mailer: nodemailer.Transporter;
  }
}

declare module "jose" {
  interface JWTPayload extends TokenPayload {}
}
