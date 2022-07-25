import { prisma } from "..";
import { auth } from "../utils/auth";
import { Flags } from "../utils/flags";
import { Router } from "express";

const router = Router();

router.get("/", auth(Flags.GetCurrencies), async (req, res) => {
  const currencies = await prisma.currency.findMany();

  res.json(currencies);
});

export const currencyRouter = router;
