import mongoose from "mongoose";

export interface ISendingLog {
  guildId: string;
  sendingId: string;
  type: "channel" | "webhook";
  result: {
    success: boolean;
    reason: string | null;
  };
}

export interface SendingLogDocument extends ISendingLog, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
