import Cluster from "discord-hybrid-sharding";
import { Client, ClientOptions } from "discord.js";

export class IClient extends Client {
  cluster: Cluster.Client = new Cluster.Client(this);

  constructor(options: ClientOptions) {
    super(options);
  }
}

export interface IEvent {
  once?: boolean;
  execute: any;
}

export interface EventFile {
  event: IEvent;
}
