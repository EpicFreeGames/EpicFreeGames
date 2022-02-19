import mongoose from "mongoose";

export interface ICommandLog {
  command: string;
  sender: {
    id: string;
    tag: string;
  };
  guildId: string | null;
  respondedIn: number;
}

export interface CommandLogDocument extends ICommandLog, mongoose.Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
