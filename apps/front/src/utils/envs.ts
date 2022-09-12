export type IEnvironment = "Production" | "Staging";
export const environment: IEnvironment = process.env.ENV as any;

if (environment !== "Production" && environment !== "Staging" && environment !== "Development")
  throw new Error("Invalid environment variable ENVIRONMENT");
