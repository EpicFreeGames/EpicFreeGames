import { Flags } from "../auth/flags";
import { createAccessToken } from "../auth/jwt/jwt";
import { config } from "../config";
import prisma from "./prisma";

const botFlags =
  Flags.AddCommandLogs |
  Flags.EditServers |
  Flags.GetGames |
  Flags.GetTranslations |
  Flags.GetCurrencies |
  Flags.GetLanguages |
  Flags.GetServers |
  Flags.GetSendingLogs |
  Flags.GetSendings |
  Flags.AddSendingLogs |
  Flags.EditSendings;

const scraperFlags =
  Flags.GetGames |
  Flags.AddCommandLogs |
  Flags.GetServers |
  Flags.EditServers |
  Flags.GetCurrencies |
  Flags.GetLanguages |
  Flags.GetTranslations;

const frontendFlags = Flags.GetLanguages | Flags.GetTranslations;

export const initDatabaseDev = async () => {
  if (config.ENV !== "Development" || !config.INITDB) {
    console.log("Not in development or env.INITDB not set, skipping database initialization");
    return;
  }

  console.log("Initializing database DEV...");

  const bot = await prisma.user.upsert({
    where: { identifier: "bot" },
    create: {
      bot: true,
      identifier: "bot",
      flags: botFlags,
    },
    update: { flags: botFlags },
  });

  const frontend = await prisma.user.upsert({
    where: { identifier: "frontend" },
    create: {
      bot: true,
      identifier: "frontend",
      flags: frontendFlags,
    },
    update: { flags: frontendFlags },
  });

  const scraper = await prisma.user.upsert({
    where: { identifier: "scraper" },
    create: {
      bot: true,
      identifier: "scraper",
      flags: scraperFlags,
    },
    update: { flags: scraperFlags },
  });

  console.log("\nDatabase initialized DEV");

  console.log(`\nBot api token: ${await createAccessToken({ userId: bot.id, flags: bot.flags })}`);
  console.log(
    `\nFrontend api token: ${await createAccessToken({
      userId: frontend.id,
      flags: frontend.flags,
    })}`
  );
  console.log(
    `\nScraper api token: ${await createAccessToken({ userId: scraper.id, flags: scraper.flags })}`
  );
};
