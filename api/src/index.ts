import Fastify from "fastify";
import { logRoutes } from "./routes/logs";
import { serverRoutes } from "./routes/servers";
import { gameRoutes } from "./routes/games";
import { config } from "./config";
import { prismaPlugin } from "./plugins/prismaPlugin";
import { mailerPlugin } from "./plugins/mailerPlugin";
import { authRoutes } from "./routes/auth";
import { emailRoutes } from "./routes/email";
import fastifyCookie from "@fastify/cookie";

(async () => {
  const fastify = Fastify({ logger: true });

  fastify.register(fastifyCookie);
  fastify.register(prismaPlugin);
  fastify.register(mailerPlugin);

  fastify.register(serverRoutes, {
    prefix: "/api/servers",
  });
  fastify.register(logRoutes, {
    prefix: "/api/logs",
  });
  fastify.register(gameRoutes, {
    prefix: "/api/games",
  });
  fastify.register(authRoutes, {
    prefix: "/api/auth",
  });
  fastify.register(emailRoutes, {
    prefix: "/api/email",
  });

  await fastify.listen({ port: config.PORT });
})();
