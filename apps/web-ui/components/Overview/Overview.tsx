import { Card } from "../Card";
import { GuildCount } from "./Stats/GuildCount";
import { Sendable } from "./Stats/Sendable";
import { ChannelSet } from "./Stats/ChannelSet";
import { WebhookSet } from "./Stats/WebhookSet";
import { CommandsRan } from "./Stats/CommandsRan";
import { FlexDiv } from "../Containers";

export const Overview = () => {
  return (
    <Card variant="dark">
      <h1 style={{ paddingBottom: "1rem" }}>Overview</h1>

      <FlexDiv gap05 justifyCenter>
        <GuildCount />
        <Sendable />
        <ChannelSet />
        <WebhookSet />
        <CommandsRan />
      </FlexDiv>
    </Card>
  );
};
