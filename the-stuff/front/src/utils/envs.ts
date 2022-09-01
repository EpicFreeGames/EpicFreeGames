export const token = process.env.EFG_API_FRONT_TOKEN;
export const apiBaseUrl = process.env.EFG_API_BASEURL;

export type IEnvironment = "Production" | "Staging";
export const environment: IEnvironment = process.env.ENVIRONMENT as any;

if (environment !== "Production" && environment !== "Staging")
  throw new Error("Invalid environment variable ENVIRONMENT");
