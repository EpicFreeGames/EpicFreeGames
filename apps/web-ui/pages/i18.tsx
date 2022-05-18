import { Title } from "@mantine/core";
import { NextPage } from "next";
import { Card } from "../components/Card";
import { FlexDiv } from "../components/FlexDiv";
import { AddLanguage } from "../components/Languages/AddLanguage";
import { LanguageList } from "../components/Languages/Languages";
import { Layout } from "../components/Layout";

const I18: NextPage = () => (
  <Layout title="Internationalization">
    <Card variant="dark">
      <FlexDiv column fullWidth>
        <FlexDiv justifyBetween>
          <Title order={2}>Languages</Title>

          <AddLanguage />
        </FlexDiv>

        <LanguageList />
      </FlexDiv>
    </Card>
  </Layout>
);

(I18 as any).auth = true;

export default I18;
