import { z } from "zod";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const discordIdSchema = z.string().transform(BigInt);
