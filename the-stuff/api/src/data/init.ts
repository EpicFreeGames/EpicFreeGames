import { Flags } from "../auth/flags";
import { config } from "../config";
import prisma from "./prisma";

const allFlags = Object.values(Flags).reduce((a, b) => a | Number(b), 0);

export const initDatabaseDev = async () => {
  if (config.ENV !== "Development") {
    console.log("Not in development, skipping database init");
    return;
  }

  console.log("Initializing database...");

  if (config.ADMIN_DISCORD_ID) {
    console.log("Upserting admin user...");

    await prisma.user.upsert({
      where: { identifier: config.ADMIN_DISCORD_ID },
      create: { bot: false, flags: allFlags, identifier: config.ADMIN_DISCORD_ID },
      update: { bot: false, flags: allFlags, identifier: config.ADMIN_DISCORD_ID },
    });

    console.log("Upserted admin user");
  } else {
    console.log("No admin user specified, skipping");
  }
};
