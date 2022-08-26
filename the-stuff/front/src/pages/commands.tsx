import { Layout } from "~components/Layout";
import { Heading } from "~components/Text";
import { english, t } from "~i18n/translate";

const CommandsPage = () => {
  return (
    <Layout title="Commands">
      <Heading>{t({ language: english, key: "commands" })}</Heading>
    </Layout>
  );
};

export default CommandsPage;
