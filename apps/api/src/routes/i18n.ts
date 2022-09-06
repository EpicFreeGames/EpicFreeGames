import { Router } from "express";
import { z } from "zod";

import {
  currencies,
  defaultCurrency,
  defaultLanguage,
  getDefaultTransations,
  languages,
  translations,
} from "@efg/i18n";

import { endpointAuth } from "../auth/endpointAuth";
import { Flags } from "../auth/flags";
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

      let langTranslations = translations.get(languageCode);
      let usedDefaultTranslations = false;

      if (!langTranslations) {
        usedDefaultTranslations = true;
        langTranslations = getDefaultTransations();
      }

      res.json({
        translations: langTranslations,
        usedDefaultTranslations,
      });
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
  res.json(getDefaultTransations());
});

router.get("/languages", endpointAuth(Flags.GetLanguages), async (req, res) => {
  res.json(Object.fromEntries(languages));
});

router.get("/currencies", endpointAuth(Flags.GetCurrencies), async (req, res) => {
  res.json(Object.fromEntries(currencies));
});

export const i18nRouter = router;
