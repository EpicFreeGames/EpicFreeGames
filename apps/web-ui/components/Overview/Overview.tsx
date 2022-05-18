import { Card } from "../Card";
import { GuildCount } from "./Stats/GuildCount";
import { Sendable } from "./Stats/Sendable";
import { ChannelSet } from "./Stats/ChannelSet";
import { WebhookSet } from "./Stats/WebhookSet";
import { CommandsRan } from "./Stats/CommandsRan";
import { Title } from "@mantine/core";

export const Overview = () => {
  return (
    <Card variant="dark">
      <Title order={2} style={{ paddingBottom: "1rem" }}>
        Overview
      </Title>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
        <GuildCount />
        <Sendable />
        <ChannelSet />
        <WebhookSet />
        <CommandsRan />
      </div>
    </Card>
  );
};
