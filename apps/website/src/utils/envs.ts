export const efgApiBaseUrl = process.env.EFG_API_BASEURL;
export const efgApiToken = process.env.EFG_API_FRONT_TOKEN;

export type IEnvironment = "Production" | "Staging";
export const environment: IEnvironment = process.env.ENV as any;

if (environment !== "Production" && environment !== "Staging" && environment !== "Development")
  throw new Error("Invalid environment variable ENVIRONMENT");

if (!efgApiBaseUrl) throw new Error("Invalid environment variable EFG_API_BASEURL");
if (!efgApiToken) throw new Error("Invalid environment variable EFG_API_FRONT_TOKEN");
