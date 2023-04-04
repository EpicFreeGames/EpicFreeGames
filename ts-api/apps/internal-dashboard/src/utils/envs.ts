export const apiBaseUrl = process.env.NEXT_PUBLIC_EFG_API_BASEURL!;
export const wsUrl = process.env.NEXT_PUBLIC_EFG_API_WS_URL!;

if (!apiBaseUrl) throw new Error("Missing environment variable NEXT_PUBLIC_EFG_API_BASEURL");
if (!wsUrl) throw new Error("Missing environment variable NEXT_PUBLIC_EFG_API_WS_URL");
