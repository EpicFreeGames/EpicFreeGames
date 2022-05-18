export interface ICommandLog {
  command: string;
  sender: {
    id: string;
    tag: string;
  };
  guildId: string | null;
  respondedIn: number;
}
