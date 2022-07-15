import { config } from "../config";
import { hmacSha256 } from "./crypto";

export const getConfirmationUrl = (userId: string) => {
  const url = `${config.APP_URL}/api/email/verify?userId=${userId}`;
  const signature = hmacSha256(url);

  return `${url}&signature=${signature}`;
};
