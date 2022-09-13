import { InferGetStaticPropsType } from "next";

import { Layout } from "~components/Layout";
import { Markdown } from "~components/Markdown";
import { t } from "~i18n/translate";
import { mainGetStaticProps } from "~utils/mainGetStaticProps";

export const getStaticProps = mainGetStaticProps;

const TutorialPage = ({
  translations,
  languages,
  env,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout
    languages={languages}
    title={t({ translations, key: "tutorial" })}
    translations={translations}
    env={env}
  >
    <h1 className="text-2xl font-bold">{t({ translations, key: "tutorial" })}</h1>

    <div className="flex flex-col gap-[3rem] pt-6 text-sm sm:gap-[6rem] sm:text-base">
      <div className="flex flex-col gap-4">
        <Markdown>
          {t({ translations, key: "tutorial_q", vars: { botName: "EpicFreeGames" } })}
        </Markdown>

        <Markdown>
          {t({ translations, key: "tutorial_1", vars: { inviteLink: "/invite" } })}
        </Markdown>

        <Markdown>{t({ translations, key: "tutorial_2" })}</Markdown>

        <Markdown>{t({ translations, key: "tutorial_3" })}</Markdown>

        <div className="rounded-md border-[1px] border-gray-700 bg-gray-800 px-3 py-2">
          <h3 className="pb-2 font-bold">{t({ translations, key: "having_problems_title" })}</h3>

          <Markdown>
            {t({
              translations,
              key: "having_problems_desc",
              vars: { faqLink: "/faq", serverInvite: "/support" },
            })}
          </Markdown>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex gap-1">
          <h2 className="pb-2 text-xl font-bold">
            {t({ translations, key: "tutorial_setting_role" })}
          </h2>
          <Optional translations={translations} />
        </div>

        <div className="flex flex-col gap-2">
          <Markdown>{t({ translations, key: "tutorial_setting_role_1" })}</Markdown>

          <Markdown>{t({ translations, key: "tutorial_setting_role_2" })}</Markdown>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex gap-1">
          <h2 className="pb-2 text-xl font-bold">
            {t({ translations, key: "tutorial_changing_language" })}
          </h2>
          <Optional translations={translations} />
        </div>

        <Markdown>{t({ translations, key: "tutorial_changing_language_1" })}</Markdown>
      </div>

      <div className="flex flex-col">
        <div className="flex gap-1">
          <h2 className="pb-2 text-xl font-bold">
            {t({ translations, key: "tutorial_changing_currency" })}
          </h2>
          <Optional translations={translations} />
        </div>

        <Markdown>{t({ translations, key: "tutorial_changing_currency_1" })}</Markdown>
      </div>
    </div>
  </Layout>
);

const Optional = ({ translations }: { translations: Record<string, string> }) => (
  <span className="text-lg font-normal text-slate-600">
    ({t({ translations, key: "optional" })})
  </span>
);

export default TutorialPage;
