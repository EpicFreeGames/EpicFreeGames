import { config } from "config";
import { Request, Response } from "express";
import { initTranslations } from "shared-discord-stuff";

export const updateTranslations = async (req: Request, res: Response) => {
  try {
    if (req?.body?.secret !== config.botPublicKey) return res.status(403).end();

    await initTranslations();

    console.log("Translations updated (sender)");

    res.status(200).json({ message: "Translations updated" });
  } catch (err) {
    console.error("failed to update translations", err);
    res.status(500).json({ message: err?.message });
  }

  return;
};
