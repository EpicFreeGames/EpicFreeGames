import { NextPage } from "next";
import { Card } from "../components/Card";
import { FlexDiv } from "../components/FlexDiv";
import { AddLanguage } from "../components/Languages/AddLanguage";
import { LanguageList } from "../components/Languages/Languages";
import { Layout } from "../components/Layout";

const Languages: NextPage = () => (
  <Layout title="Languages">
    <Card variant="dark">
      <FlexDiv column>
        <FlexDiv justifyEnd>
          <AddLanguage />
        </FlexDiv>

        <LanguageList />
      </FlexDiv>
    </Card>
  </Layout>
);

(Languages as any).auth = true;

export default Languages;
