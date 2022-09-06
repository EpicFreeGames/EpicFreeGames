import { Router } from "express";
import { z } from "zod";

import { languages } from "@efg/i18n";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import prisma from "../data/prisma";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get("/", endpointAuth(Flags.GetLanguages), async (req, res) => {
  const resolvedLanguages = [...languages].map(([code, language]) => ({
    ...language,
    serverCount: 0,
  }));

  const counts = await prisma.$transaction(
    resolvedLanguages.map((language, i) =>
      prisma.server.count({
        where: { languageCode: language.code },
      })
    )
  );

  counts.map(
    (count, i) =>
      (resolvedLanguages[i] = {
        ...resolvedLanguages[i]!,
        serverCount: count,
      })
  );

  res.json(resolvedLanguages);
});

router.get(
  "/:languageCode",
  endpointAuth(Flags.GetLanguages),
  withValidation(
    {
      params: z.object({
        languageCode: z.string(),
      }),
    },
    async (req, res) => {
      const languageCode = req.params.languageCode;

      const language = languages.get(languageCode);

      if (!language)
        return res.status(404).json({
          statusCode: 404,
          error: "Not found",
          message: "Language not found",
        });

      res.json(language);
    }
  )
);

export const languageRouter = router;
