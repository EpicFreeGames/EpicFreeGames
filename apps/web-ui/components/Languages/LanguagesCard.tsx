import { Text, Title, Tooltip } from "@mantine/core";
import { FC } from "react";
import { ILanguageWithGuildCount } from "shared";
import { useLanguages } from "../../hooks/requests";
import { Card } from "../Card";
import { FlexDiv } from "../FlexDiv";
import { AddLanguage } from "./AddLanguage";
import { EditLanguage } from "./EditLanguage";

export const LanguagesCard = () => (
  <Card variant="dark">
    <FlexDiv column fullWidth>
      <LanguagesTitle />

      <Languages />
    </FlexDiv>
  </Card>
);

const LanguagesTitle = () => (
  <FlexDiv justifyBetween>
    <Title order={2}>Languages</Title>

    <AddLanguage />
  </FlexDiv>
);

interface LanguageProps {
  language: ILanguageWithGuildCount;
}
const Language: FC<LanguageProps> = ({ language }) => (
  <Card key={language.code}>
    <FlexDiv column alignCenter>
      <FlexDiv column alignCenter gap05>
        <Title order={3}>{language.englishName}</Title>
        <Text>{language.localizedName}</Text>
      </FlexDiv>

      <Tooltip transition={"rotate-right"} label={`Used by ${language.guildCount} servers`}>
        <Title order={3}>{language.guildCount} servers</Title>
      </Tooltip>

      <EditLanguage code={language.code} />
    </FlexDiv>
  </Card>
);

export const Languages = () => {
  const { languages } = useLanguages();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
      {languages?.map((language) => (
        <Language key={language.code} language={language} />
      ))}
    </div>
  );
};
