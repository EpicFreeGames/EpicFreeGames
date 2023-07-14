import { z } from "zod";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const bigintSchema = z.string().transform(BigInt);
