import { Router } from "express";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import prisma from "../data/prisma";

const router = Router();

router.get("/counts", endpointAuth(Flags.GetDashboard), async (req, res) => {
  const [
    total,
    sendable,
    hasWebhook,
    hasRole,
    hasChangedLanguage,
    hasChangedCurrency,
    hasThread,
    hasOnlyChannel,
    totalCommands,
  ] = await prisma.$transaction([
    // total
    prisma.server.count(),
    // sendable
    prisma.server.count({
      where: {
        channelId: {
          not: null,
        },
      },
    }),
    // has webhook
    prisma.server.count({
      where: {
        NOT: {
          channelId: null,
          webhookId: null,
          webhookToken: null,
        },
      },
    }),
    // has role
    prisma.server.count({
      where: {
        roleId: {
          not: null,
        },
      },
    }),
    // has changed language
    prisma.server.count({
      where: {
        languageCode: {
          not: "en",
        },
      },
    }),
    // has changed currency
    prisma.server.count({
      where: {
        currency: {
          code: {
            not: "USD",
          },
        },
      },
    }),
    // has thread
    prisma.server.count({
      where: {
        threadId: {
          not: null,
        },
      },
    }),
    // has only a channel
    prisma.server.count({
      where: {
        channelId: {
          not: null,
        },
        webhookId: null,
        webhookToken: null,
      },
    }),
    // total commands
    prisma.commandLog.count(),
  ]);

  const webhookAdoption = `${(hasWebhook / sendable) * 100 || 0} %`;

  res.send({
    total,
    sendable,
    hasWebhook,
    hasRole,
    hasThread,
    hasChangedLanguage,
    hasChangedCurrency,
    webhookAdoption,
    hasOnlyChannel,
    totalCommands,
  });
});

export const dashboardRouter = router;
