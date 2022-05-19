import { createStyles, Text, Title } from "@mantine/core";
import { FC } from "react";
import { ILanguageWithGuildCount } from "shared";
import { useLanguages } from "../../hooks/requests";
import { Card } from "../Card";
import { FlexDiv } from "../FlexDiv";
import { CardTitle } from "../Text";
import { Tooltip } from "../Tooltip";
import { AddLanguage } from "./AddLanguage";
import { EditLanguage } from "./EditLanguage";

export const LanguagesCard = () => (
  <Card variant="dark">
    <LanguagesTitle />

    <Languages />
  </Card>
);

const LanguagesTitle = () => (
  <FlexDiv justifyBetween alignCenter>
    <CardTitle>Languages</CardTitle>

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

      <Tooltip label={`Used by ${language.guildCount} servers`}>
        <Title order={3}>{language.guildCount} servers</Title>
      </Tooltip>

      <EditLanguage language={language} />
    </FlexDiv>
  </Card>
);

export const Languages = () => {
  const { languages } = useLanguages();

  return (
    <div className={styles().classes.langGrid}>
      {languages?.map((language) => (
        <Language key={language.code} language={language} />
      ))}
    </div>
  );
};

const styles = createStyles((theme) => ({
  langGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",

    [theme.fn.largerThan("sm")]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
    },

    [theme.fn.largerThan("md")]: {
      gridTemplateColumns: "1fr 1fr 1fr 1fr",
      gap: "0.7rem",
    },
  },
}));
