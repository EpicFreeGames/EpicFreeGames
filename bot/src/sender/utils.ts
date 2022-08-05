import { api } from "~shared/api.ts";
import { SendingLog } from "~shared/types.ts";
import { logger } from "~shared/utils/logger.ts";

export const logLog = (log: SendingLog) =>
  api({
    method: "POST",
    path: `/sends/logs`,
    body: log,
  }).catch((err) => logger.error("failed to save sending log:", err));

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
