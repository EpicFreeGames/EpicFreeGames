import { InferGetStaticPropsType } from "next";

import { FAQAccordion } from "~components/FAQAccordion";
import { Layout } from "~components/Layout";
import { t } from "~i18n/translate";
import { mainGetStaticProps } from "~utils/mainGetStaticProps";

export const getStaticProps = mainGetStaticProps;

const FAQPage = ({
  translations,
  languages,
  env,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout languages={languages} title={t({ translations, key: "faq_title" })} env={env}>
    <h1 className="pb-6 text-2xl font-bold">{t({ translations, key: "faq_title" })}</h1>

    <FAQAccordion translations={translations} />
  </Layout>
);

export default FAQPage;
