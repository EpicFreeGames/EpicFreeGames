import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import nodemailer from "nodemailer";
import { config } from "../config";

const prismaClient: FastifyPluginCallback = async (fastify, options, next) => {
  if (Object.hasOwn(fastify, "sendMail")) {
    return next(new Error("mailerPlugin has been defined before"));
  }

  const mailer = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS,
    },
  });

  fastify
    .decorate("mailer", mailer)
    .decorateRequest("mailer", { getter: () => fastify.mailer })
    .addHook("onClose", async (fastify, done) => {
      mailer.close();
      done();
    });

  next();
};

export const mailerPlugin = fp(prismaClient, {
  name: "mailer-plugin",
});
