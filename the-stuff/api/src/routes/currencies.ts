import { Router } from "express";
import { z } from "zod";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import prisma from "../data/prisma";
import { prismaUpdateCatcher } from "../data/prismaUpdateCatcher";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get("/", endpointAuth(Flags.GetCurrencies), async (req, res) => {
  const currencies = await prisma.currency.findMany({
    include: { _count: { select: { servers: true } } },
  });

  res.json(
    currencies.map((c) => ({
      ...c,
      serverCount: c._count?.servers ?? 0,
    }))
  );
});

router.get(
  "/:currencyId",
  endpointAuth(Flags.GetCurrencies),
  withValidation(
    {
      params: z.object({
        currencyId: z.string(),
      }),
    },
    async (req, res) => {
      const id = req.params.currencyId;

      const currency = await prisma.currency.findUnique({
        where: { id },
      });

      if (!currency)
        return res.status(404).json({
          statusCode: 404,
          error: "Not found",
          message: "Currency not found",
        });

      res.json(currency);
    }
  )
);

router.post(
  "/",
  endpointAuth(Flags.AddCurrencies, Flags.GetCurrencies),
  withValidation(
    {
      body: z.object({
        code: z.string(),
        name: z.string(),
        apiValue: z.string(),
        inFrontOfPrice: z.string(),
        afterPrice: z.string(),
      }),
    },
    async (req, res) => {
      const createdCurrency = await prisma.currency.create({
        data: req.body,
      });

      res.json(createdCurrency);
    }
  )
);

router.patch(
  "/:currencyId",
  endpointAuth(Flags.EditCurrencies, Flags.GetCurrencies),
  withValidation(
    {
      params: z.object({
        currencyId: z.string(),
      }),
      body: z.object({
        code: z.string().optional(),
        name: z.string().optional(),
        apiValue: z.string().optional(),
        inFrontOfPrice: z.string().optional(),
        afterPrice: z.string().optional(),
      }),
    },
    async (req, res) => {
      const id = req.params.currencyId;

      const updatedCurrency = await prisma.currency
        .update({
          where: { id },
          data: req.body,
        })
        .catch(prismaUpdateCatcher);

      if (!updatedCurrency)
        return res.status(404).json({
          statusCode: 404,
          error: "Not found",
          message: "Currency not found",
        });

      res.json(updatedCurrency);
    }
  )
);

router.delete(
  "/:currencyId",
  endpointAuth(Flags.DeleteCurrencies, Flags.GetCurrencies),
  withValidation(
    {
      params: z.object({
        currencyId: z.string(),
      }),
    },
    async (req, res) => {
      const id = req.params.currencyId;

      const deletedCurrency = await prisma.currency.delete({
        where: { id },
      });

      if (!deletedCurrency)
        return res.status(404).json({
          statusCode: 404,
          error: "Not found",
          message: "Currency not found",
        });

      res.status(204).send();
    }
  )
);

export const currencyRouter = router;
