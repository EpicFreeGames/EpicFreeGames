import { Currency, Game } from "../types.ts";

export const getGamePrice = (game: Game, currency: Currency): string => {
  const price = game.prices.find((p) => p.currencyCode === currency.code);

  if (!price || !price.formattedValue)
    return game.prices.find((p) => p.currencyCode === "USD")?.formattedValue || "???";

  return price.formattedValue;
};
