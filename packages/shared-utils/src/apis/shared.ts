export type Method = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiResponse<TData> =
  | {
      error?: never;
      data: TData;
    }
  | {
      error: Record<string, unknown>;
      data?: never;
    };
