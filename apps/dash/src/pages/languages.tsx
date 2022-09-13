import { Flags } from "@efg/types";

import { Language } from "~components/Language/Language";
import { Layout } from "~components/Layout/Layout";
import { StatusCard } from "~components/StatusCard";
import { useLanguages } from "~utils/api/languages/getLanguages";

const LanguagesPage = () => (
  <Layout title="Languages">
    <Languages />
  </Layout>
);

const Languages = () => {
  const { data: languages, isLoading, error } = useLanguages();

  if (isLoading) return <StatusCard>Loading...</StatusCard>;
  if (error) return <StatusCard error>Error loading games</StatusCard>;

  return (
    <div className="max:grid-cols-2 grid grid-cols-1 gap-3">
      {languages && languages?.length ? (
        languages?.map((language) => <Language language={language} key={language.code} />)
      ) : (
        <StatusCard>No currencies</StatusCard>
      )}
    </div>
  );
};

LanguagesPage.requireAuth = true;
LanguagesPage.requiredFlags = [Flags.GetLanguages];

export default LanguagesPage;
