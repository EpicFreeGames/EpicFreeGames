export interface ISendingLog {
  guildId: string;
  sendingId: string;
  type: "channel" | "webhook";
  result: {
    success: boolean;
    reason: string | null;
  };
}
