import { InferGetStaticPropsType } from "next";

import { FAQAccordion } from "~components/FAQAccordion";
import { Layout } from "~components/Layout/Layout";
import { useT } from "~hooks/useT";
import { mainGetStaticProps } from "~utils/mainGetStaticProps";

export const getStaticProps = mainGetStaticProps;

const FAQPage = ({
  translations,
  languages,
  env,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const t = useT(translations);

  return (
    <Layout languages={languages} title={t({ key: "faq" })} translations={translations} env={env}>
      <h1 className="pb-6 text-2xl font-bold">{t({ key: "faq_title" })}</h1>

      <FAQAccordion translations={translations} />
    </Layout>
  );
};

export default FAQPage;
