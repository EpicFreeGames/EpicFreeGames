import { Card } from "./Card";
import { FlexDiv } from "./FlexDiv";
import { Text } from "./Text";

export const FailedToGet = ({ objName }: { objName: string }) => (
  <Card variant="dark">
    <FlexDiv justifyCenter style={{ padding: "1rem" }}>
      <Text>Failed to get {objName}</Text>
    </FlexDiv>
  </Card>
);
