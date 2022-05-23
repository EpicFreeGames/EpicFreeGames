import { IConstants } from "./types";
import dotenv from "dotenv";

dotenv.config({ path: "../../.const" });

export const constants: IConstants = {
  gifs: {
    vote: process.env.GIFS_VOTE || "",
    invite: process.env.GIFS_INVITE || "",
  },

  links: {
    botInvite: process.env.LINKS_BOT_INVITE || "",
    serverInvite: process.env.LINKS_SERVER_INVITE || "",
    vote: process.env.LINKS_VOTE || "",
    website: process.env.LINKS_WEBSITE || "",
    commands: process.env.LINKS_COMMANDS || "",
    browserRedirect: process.env.LINKS_BROWSER_REDIRECT || "",
    launcherRedirect: process.env.LINKS_LAUNCHER_REDIRECT || "",
  },

  webhookName: process.env.WEBHOOK_NAME || "",

  userIds: {
    prod: process.env.USER_IDS_PROD || "",
    dev: process.env.USER_IDS_DEV || "",
  },

  photos: {
    thumbnail: process.env.PHOTOS_THUMBNAIL || "",
    base64Thumb: process.env.PHOTOS_BASE64_THUMB || "",
  },
};
