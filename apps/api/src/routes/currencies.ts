import { Router } from "express";
import { z } from "zod";

import { currencies } from "@efg/i18n";
import { Flags } from "@efg/types";

import { endpointAuth } from "../auth/endpointAuth";
import prisma from "../data/prisma";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get("/", endpointAuth(Flags.GetCurrencies), async (req, res) => {
  const resolvedCurrencies = [...currencies].map(([code, currency]) => ({
    ...currency,
    serverCount: 0,
  }));

  const counts = await prisma.$transaction(
    resolvedCurrencies.map((currency, i) =>
      prisma.server.count({
        where: { currencyCode: currency.code },
      })
    )
  );

  counts.map(
    (count, i) =>
      (resolvedCurrencies[i] = {
        ...resolvedCurrencies[i]!,
        serverCount: count,
      })
  );

  res.json(resolvedCurrencies);
});

router.get(
  "/:currencyCode",
  endpointAuth(Flags.GetCurrencies),
  withValidation(
    {
      params: z.object({
        currencyCode: z.string(),
      }),
    },
    async (req, res) => {
      const currencyCode = req.params.currencyCode;

      const currency = currencies.get(currencyCode);

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

export const currencyRouter = router;
