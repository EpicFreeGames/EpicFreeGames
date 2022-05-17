import { cardStyles } from "../Card";
import { GuildCount } from "./Stats/GuildCount";
import { Sendable } from "./Stats/Sendable";
import { ChannelSet } from "./Stats/ChannelSet";
import { WebhookSet } from "./Stats/WebhookSet";
import { CommandsRan } from "./Stats/CommandsRan";

export const Overview = () => {
  const { classes } = cardStyles();

  return (
    <div className={classes.card}>
      <div className={classes.cardContent}>
        <h1 style={{ paddingBottom: "1rem" }}>Overview</h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <GuildCount />
          <Sendable />
          <ChannelSet />
          <WebhookSet />
          <CommandsRan />
        </div>
      </div>
    </div>
  );
};
