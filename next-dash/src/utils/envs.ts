export const apiBaseUrl = process.env.NEXT_PUBLIC_EFG_API_BASE_URL!;
export const wsUrl = process.env.NEXT_PUBLIC_EFG_API_WS_URL!;

if (!apiBaseUrl) throw new Error("Missing environment variable NEXT_PUBLIC_EFG_API_BASE_URL");
if (!wsUrl) throw new Error("Missing environment variable NEXT_PUBLIC_EFG_API_WS_URL");
