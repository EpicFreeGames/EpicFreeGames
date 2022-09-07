import { v4 as uuidv4 } from "uuid";

import { configuration } from "@efg/configuration";

import { Flags } from "../auth/flags";
import prisma from "./prisma";

const allFlags = Object.values(Flags).reduce((a, b) => a | Number(b), 0);

export const initDatabaseDev = async () => {
  if (configuration.ENV !== "Development") {
    console.log("Not in development, skipping database init");
    return;
  }

  console.log("Initializing database...");

  if (configuration.ADMIN_DISCORD_ID) {
    console.log("Upserting admin user...");

    await prisma.user.upsert({
      where: { identifier: configuration.ADMIN_DISCORD_ID },
      create: {
        bot: false,
        flags: allFlags,
        identifier: configuration.ADMIN_DISCORD_ID,
        tokenVersion: uuidv4(),
      },
      update: { bot: false, flags: allFlags, identifier: configuration.ADMIN_DISCORD_ID },
    });

    console.log("Upserted admin user");
  } else {
    console.log("No admin user specified, skipping");
  }
};
