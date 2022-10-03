import { parseISO, startOfDay } from "date-fns";
import { Router } from "express";
import { z } from "zod";

import { defaultCurrency, defaultLanguage } from "@efg/i18n";
import { Flags } from "@efg/types";

import { endpointAuth } from "../auth/endpointAuth";
import prisma from "../data/prisma";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get(
  "/counts",
  endpointAuth(Flags.GetDashboard),
  withValidation(
    {
      query: z.object({
        today: z.string(),
      }),
    },
    async (req, res) => {
      const [
        total,
        totalToday,
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
        // total today
        prisma.server.count({
          where: { createdAt: { gte: startOfDay(parseISO(decodeURIComponent(req.query.today))) } },
        }),
        // sendable
        prisma.server.count({
          where: { channelId: { not: null } },
        }),
        // has webhook
        prisma.server.count({
          where: {
            channelId: { not: null },
            webhookId: { not: null },
            webhookToken: { not: null },
          },
        }),
        // has role
        prisma.server.count({
          where: { roleId: { not: null } },
        }),
        // has changed language
        prisma.server.count({
          where: { languageCode: { not: defaultLanguage.code } },
        }),
        // has changed currency
        prisma.server.count({
          where: { currencyCode: { not: defaultCurrency.code } },
        }),
        // has thread
        prisma.server.count({
          where: { threadId: { not: null } },
        }),
        // has only a channel
        prisma.server.count({
          where: {
            channelId: { not: null },
            webhookId: null,
            webhookToken: null,
          },
        }),
        // total commands
        prisma.commandLog.count(),
      ]);

      const webhookAdoption = `${((hasWebhook / sendable) * 100 || 0).toFixed(2)} %`;

      res.send({
        total,
        totalToday,
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
    }
  )
);

export const dashboardRouter = router;
