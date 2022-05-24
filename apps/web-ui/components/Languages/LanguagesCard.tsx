import { createStyles, Skeleton } from "@mantine/core";
import { FC } from "react";
import { ILanguageWithGuildCount } from "shared";
import { useLanguages } from "../../hooks/requests";
import { Card } from "../Card";
import { FailedToGet } from "../FailedToGet";
import { FlexDiv } from "../FlexDiv";
import { CardTitle, H3, Text } from "../Text";
import { Tooltip } from "../Tooltip";
import { AddLanguage } from "./AddLanguage";
import { EditLanguage } from "./EditLanguage";
import { UpdateTranslations } from "./UpdateTranslations";

export const LanguagesCard = () => (
  <Card variant="dark">
    <LanguagesTitle />

    <Languages />
  </Card>
);

const LanguagesTitle = () => (
  <FlexDiv justifyBetween alignCenter>
    <CardTitle>Languages</CardTitle>

    <FlexDiv gap05>
      <UpdateTranslations />
      <AddLanguage />
    </FlexDiv>
  </FlexDiv>
);

interface LanguageProps {
  language: ILanguageWithGuildCount;
}
const Language: FC<LanguageProps> = ({ language }) => (
  <Card key={language.code}>
    <FlexDiv column alignCenter>
      <FlexDiv column alignCenter gap05>
        <H3>{language.englishName}</H3>
        <Text>{language.localizedName}</Text>
      </FlexDiv>

      <Tooltip label={`Used by ${language.guildCount} servers`}>
        <H3>{language.guildCount} servers</H3>
      </Tooltip>

      <EditLanguage language={language} />
    </FlexDiv>
  </Card>
);

export const Languages = () => {
  const { languages, error, isLoading } = useLanguages();

  if (error) return <FailedToGet objName="languages" />;

  return (
    <div className={styles().classes.langGrid}>
      {isLoading
        ? Array(20)
            .fill(1)
            .map((_, i) => <Skeleton height={175} />)
        : languages?.map((language) => <Language key={language.code} language={language} />)}
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
    },
  },
}));
