import { Layout } from "~components/Layout";
import { Markdown } from "~components/Markdown";
import { Heading, Heading2 } from "~components/Text";
import { english, t } from "~i18n/translate";

const TutorialPage = () => (
  <Layout title="Tutorial">
    <Heading>{t({ language: english, key: "tutorial" })}</Heading>

    <div className="flex flex-col gap-[6rem] pt-6">
      <div className="flex flex-col gap-4">
        <Markdown>
          {t({ language: english, key: "tutorial_q", vars: { botName: "EpicFreeGames" } })}
        </Markdown>

        <Markdown>
          {t({ language: english, key: "tutorial_1", vars: { inviteLink: "/invite" } })}
        </Markdown>

        <Markdown>{t({ language: english, key: "tutorial_2" })}</Markdown>

        <Markdown>{t({ language: english, key: "tutorial_3" })}</Markdown>

        <div className="rounded-md border-[1px] border-gray-700 bg-gray-800 px-3 py-2">
          <Markdown>{t({ language: english, key: "having_problems_title" })}</Markdown>

          <Markdown>
            {t({
              language: english,
              key: "having_problems_desc",
              vars: { faqLink: "/faq", serverInvite: "/support" },
            })}
          </Markdown>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex gap-1">
          <Heading2>{t({ language: english, key: "tutorial_setting_role" })}</Heading2>
          <Optional />
        </div>

        <div className="flex flex-col gap-2">
          <Markdown>{t({ language: english, key: "tutorial_setting_role_1" })}</Markdown>

          <Markdown>{t({ language: english, key: "tutorial_setting_role_2" })}</Markdown>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex gap-1">
          <Heading2>{t({ language: english, key: "tutorial_changing_language" })}</Heading2>
          <Optional />
        </div>

        <Markdown>{t({ language: english, key: "tutorial_changing_language_1" })}</Markdown>
      </div>

      <div className="flex flex-col">
        <div className="flex gap-1">
          <Heading2>{t({ language: english, key: "tutorial_changing_currency" })}</Heading2>
          <Optional />
        </div>

        <Markdown>{t({ language: english, key: "tutorial_changing_currency_1" })}</Markdown>
      </div>
    </div>
  </Layout>
);

const Optional = () => (
  <span className="text-lg font-normal text-slate-600">
    ({t({ language: english, key: "optional" })})
  </span>
);

export default TutorialPage;
