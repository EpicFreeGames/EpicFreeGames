import { InferGetStaticPropsType } from "next";

import { Layout } from "~components/Layout/Layout";
import { Markdown } from "~components/Markdown";
import { useT } from "~hooks/useT";
import { mainGetStaticProps } from "~utils/mainGetStaticProps";

export const getStaticProps = mainGetStaticProps;

const TutorialPage = ({
  translations,
  languages,
  env,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const t = useT(translations);

  return (
    <Layout
      languages={languages}
      title={t({ key: "tutorial" })}
      translations={translations}
      env={env}
    >
      <h1 className="text-2xl font-bold">{t({ key: "tutorial" })}</h1>

      <div className="flex flex-col gap-[3rem] pt-6 text-sm sm:gap-[6rem] sm:text-base">
        <div className="flex flex-col gap-4">
          <Markdown>{t({ key: "tutorial_q", vars: { botName: "EpicFreeGames" } })}</Markdown>

          <Markdown>{t({ key: "tutorial_1", vars: { inviteLink: "/invite" } })}</Markdown>

          <Markdown>{t({ key: "tutorial_2" })}</Markdown>

          <Markdown>{t({ key: "tutorial_3" })}</Markdown>

          <div className="rounded-md border-[1px] border-gray-700 bg-gray-800 px-3 py-2">
            <h3 className="pb-2 font-bold">{t({ key: "having_problems_title" })}</h3>

            <Markdown>
              {t({
                key: "having_problems_desc",
                vars: { faqLink: "/faq", serverInvite: "/discord" },
              })}
            </Markdown>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-1">
            <h2 className="pb-2 text-xl font-bold">{t({ key: "tutorial_setting_role" })}</h2>
            <span className="text-lg font-normal text-slate-600">({t({ key: "optional" })})</span>
          </div>

          <div className="flex flex-col gap-2">
            <Markdown>{t({ key: "tutorial_setting_role_1" })}</Markdown>

            <Markdown>{t({ key: "tutorial_setting_role_2" })}</Markdown>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-1">
            <h2 className="pb-2 text-xl font-bold">{t({ key: "tutorial_changing_language" })}</h2>
            <span className="text-lg font-normal text-slate-600">({t({ key: "optional" })})</span>
          </div>

          <Markdown>{t({ key: "tutorial_changing_language_1" })}</Markdown>
        </div>

        <div className="flex flex-col">
          <div className="flex gap-1">
            <h2 className="pb-2 text-xl font-bold">{t({ key: "tutorial_changing_currency" })}</h2>
            <span className="text-lg font-normal text-slate-600">({t({ key: "optional" })})</span>
          </div>

          <Markdown>{t({ key: "tutorial_changing_currency_1" })}</Markdown>
        </div>
      </div>
    </Layout>
  );
};

export default TutorialPage;
