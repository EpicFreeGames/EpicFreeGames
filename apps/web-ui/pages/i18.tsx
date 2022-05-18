import { NextPage } from "next";
import { CurrenciesCard } from "../components/Currencies/CurrenciesCard";
import { FlexDiv } from "../components/FlexDiv";
import { LanguagesCard } from "../components/Languages/LanguagesCard";
import { Layout } from "../components/Layout";

const I18: NextPage = () => (
  <Layout title="Internationalization">
    <FlexDiv column gap05>
      <LanguagesCard />

      <CurrenciesCard />
    </FlexDiv>
  </Layout>
);

(I18 as any).auth = true;

export default I18;
