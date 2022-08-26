import { FAQAccordion } from "~components/FAQAccordion";
import { Layout } from "~components/Layout";
import { english, t } from "~i18n/translate";

const FAQPage = () => (
  <Layout title="FAQ">
    <h1 className="pb-6 text-2xl font-bold">{t({ language: english, key: "faq_title" })}</h1>

    <FAQAccordion />
  </Layout>
);

export default FAQPage;
