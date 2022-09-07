import { configuration } from "@efg/configuration";

export const createAccessTokenCookie = (value: string) =>
  `access-token=${value}; Path=/; HttpOnly; SameSite=Lax; ${
    configuration.ENV !== "Development" ? "Secure;" : ""
  }`;

export const createEmptyAccessTokenCookie = () =>
  `access-token=empty; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;${
    configuration.ENV !== "Development" ? "Secure;" : ""
  }`;
