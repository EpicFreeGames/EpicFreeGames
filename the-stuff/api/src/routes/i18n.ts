import { Router } from "express";
import { z } from "zod";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
import { defaultTransations, translations } from "../i18n";
import { currencies, defaultCurrency } from "../i18n/currencies";
import { defaultLanguage, languages } from "../i18n/languages";
import { withValidation } from "../utils/withValidation";

const router = Router();

router.get(
  "/translations/:languageCode",
  endpointAuth(Flags.GetTranslations),
  withValidation(
    {
      params: z.object({
        languageCode: z.string(),
      }),
    },
    async (req, res) => {
      const { languageCode } = req.params;

      if (!languages.has(languageCode))
        return res.status(400).json({
          statusCode: 400,
          error: "Bad request",
          message: "Invalid language code",
        });

      res.json(translations.get(languageCode) || defaultTransations);
    }
  )
);

router.get("/translations", endpointAuth(Flags.GetTranslations), async (req, res) => {
  res.json(Object.fromEntries(translations));
});

router.get("/defaults/language", endpointAuth(Flags.GetLanguages), async (req, res) => {
  res.json(defaultLanguage);
});

router.get("/defaults/currency", endpointAuth(Flags.GetCurrencies), async (req, res) => {
  res.json(defaultCurrency);
});

router.get("/defaults/translations", endpointAuth(Flags.GetTranslations), async (req, res) => {
  res.json(defaultTransations);
});

router.get("/languages", endpointAuth(Flags.GetLanguages), async (req, res) => {
  res.json(Object.fromEntries(languages));
});

router.get("/currencies", endpointAuth(Flags.GetCurrencies), async (req, res) => {
  res.json(Object.fromEntries(currencies));
});

export const i18nRouter = router;
