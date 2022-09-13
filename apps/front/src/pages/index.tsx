import type { InferGetStaticPropsType } from "next";

import { Layout } from "~components/Layout";
import { Markdown } from "~components/Markdown";
import { Link } from "~components/Text";
import { t } from "~i18n/translate";
import { mainGetStaticProps } from "~utils/mainGetStaticProps";

export const getStaticProps = mainGetStaticProps;

const Home = ({ translations, languages, env }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout languages={languages} env={env}>
    <div className="flex flex-col items-start justify-start gap-[3rem] sm:gap-[6rem]">
      <div className="flex w-full flex-col items-start">
        <h1 className="pb-2 text-2xl font-bold">EpicFreeGames</h1>

        <p className="text-lg">{t({ translations, key: "the_sentence" })}</p>

        <a
          href="/invite"
          className="btnBase mt-3 transform-gpu rounded-md bg-blue-600 px-4 text-[1.1rem] transition-transform duration-200 hover:scale-[1.05] active:scale-[0.98]"
        >
          {t({ translations, key: "get_the_bot" })}
        </a>
      </div>

      <div className="flex flex-col">
        <h2 className="pb-2 text-xl font-bold">
          {t({ translations, key: "what_is_bot", vars: { botName: "EpicFreeGames" } })}
        </h2>

        <div className="flex flex-col gap-2">
          <Markdown>
            {t({
              translations,
              key: "what_is_bot_desc",
              vars: { botName: "EpicFreeGames", commandsLink: "/commands" },
            })}
          </Markdown>

          <Markdown>
            {t({
              translations,
              key: "what_is_bot_desc_2",
            })}
          </Markdown>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="pb-2 text-xl font-bold">{t({ translations, key: "customization" })}</h2>
        <div className="flex flex-col gap-2">
          <Markdown>
            {t({
              translations,
              key: "customization_desc",
              vars: {
                commandsLink: "/commands",
              },
            })}
          </Markdown>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="pb-2 text-xl font-bold">Links</h2>

        <div className="flex flex-col">
          <Link href="mailto:hi@epicfreegames.net">Contact us</Link>
          <Link href="/discord">Discord server</Link>
        </div>

        <div className="flex flex-col">
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/terms-of-service">Terms of service</Link>
        </div>
      </div>
    </div>
  </Layout>
);

export default Home;
