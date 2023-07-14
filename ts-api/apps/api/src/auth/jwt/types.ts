import { z } from "zod";

export interface ITokenPayload {
  userId: string;
  flags: number;
  jti: string;
}

export const tokenPayloadSchema = z.object({
  userId: z.string(),
  flags: z.number(),
  jti: z.string(),
});
