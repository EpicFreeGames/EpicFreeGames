import { config } from "../config";

export const createAccessTokenCookie = (value: string) =>
  `access-token=${value}; Path=/; HttpOnly; SameSite=Lax; ${
    config.ENV !== "Development" ? "Secure;" : ""
  }`;

export const createEmptyAccessTokenCookie = () =>
  `access-token=empty; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;${
    config.ENV !== "Development" ? "Secure;" : ""
  }`;
