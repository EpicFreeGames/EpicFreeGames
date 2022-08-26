import type { NextPage } from "next";

import { Layout } from "~components/Layout";
import { Markdown } from "~components/Markdown";
import { B, Code, Heading, Heading2, Link } from "~components/Text";
import { english, t } from "~i18n/translate";

const Home: NextPage = () => {
  return (
    <Layout title="Home">
      <div className="flex flex-col items-start justify-start gap-[6rem]">
        <div className="flex w-full flex-col items-start">
          <Heading className="pb-2">EpicFreeGames</Heading>

          <p className="text-lg">{t({ language: english, key: "the_sentence" })}</p>

          <a
            href="/invite"
            className="btnBase mt-3 transform-gpu rounded-md bg-gradient-to-r from-blue-500 to-blue-800 px-4 text-[1.1rem] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98]"
          >
            {t({ language: english, key: "get_the_bot" })}
          </a>
        </div>

        <div className="flex flex-col">
          <Heading2>
            {t({ language: english, key: "what_is_bot", vars: { botName: "EpicFreeGames" } })}
          </Heading2>
          <div className="flex flex-col gap-2">
            <Markdown>
              {t({
                language: english,
                key: "what_is_bot_desc",
                vars: { commandsLink: "/commands" },
              })}
            </Markdown>

            <Markdown>
              {t({
                language: english,
                key: "what_is_bot_desc_2",
              })}
            </Markdown>
          </div>
        </div>

        <div className="flex flex-col">
          <Heading2>{t({ language: english, key: "customization" })}</Heading2>
          <div className="flex flex-col gap-2">
            <Markdown>
              {t({
                language: english,
                key: "customization_desc",
              })}
            </Markdown>

            <Markdown>
              {t({
                language: english,
                key: "check_out_commands",
                vars: { commandsLink: "/commands" },
              })}
            </Markdown>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
