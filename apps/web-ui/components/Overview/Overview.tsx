import { Card } from "../Card";
import { GuildCount } from "./Stats/GuildCount";
import { Sendable } from "./Stats/Sendable";
import { ChannelSet } from "./Stats/ChannelSet";
import { WebhookSet } from "./Stats/WebhookSet";
import { CommandsRan } from "./Stats/CommandsRan";
import { createStyles } from "@mantine/core";
import { CardTitle } from "../Text";

export const Overview = () => {
  return (
    <Card variant="dark">
      <CardTitle>Overview</CardTitle>

      <div className={styles().classes.overview}>
        <GuildCount />
        <Sendable />
        <ChannelSet />
        <WebhookSet />
        <CommandsRan />
      </div>
    </Card>
  );
};

const styles = createStyles((theme) => ({
  overview: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",

    [theme.fn.largerThan("sm")]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    },
  },
}));
