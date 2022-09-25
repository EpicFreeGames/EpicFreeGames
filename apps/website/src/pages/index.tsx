import type { InferGetStaticPropsType } from "next";

import { Layout } from "~components/Layout/Layout";
import { Markdown } from "~components/Markdown";
import { useT } from "~hooks/useT";
import { mainGetStaticProps } from "~utils/mainGetStaticProps";

export const getStaticProps = mainGetStaticProps;

const Home = ({ translations, languages, env }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const t = useT(translations);

  return (
    <Layout languages={languages} translations={translations} env={env}>
      <div className="flex flex-col items-start justify-start gap-[3rem] sm:gap-[6rem]">
        <div className="flex w-full flex-col items-start">
          <h1 className="pb-2 text-2xl font-bold">EpicFreeGames</h1>

          <p className="text-lg">{t({ key: "the_sentence" })}</p>

          <a
            href="/invite"
            className="btnBase focus mt-3 transform-gpu rounded-md bg-blue-600 px-4 text-[1.1rem] hover:scale-[1.05] active:scale-[0.98]"
          >
            {t({ key: "get_the_bot" })}
          </a>
        </div>

        <div className="flex flex-col">
          <h2 className="pb-2 text-xl font-bold">
            {t({ key: "what_is_bot", vars: { botName: "EpicFreeGames" } })}
          </h2>

          <div className="flex flex-col gap-2">
            <Markdown>
              {t({
                key: "what_is_bot_desc",
                vars: { botName: "EpicFreeGames", commandsLink: "/commands" },
              })}
            </Markdown>

            <Markdown>
              {t({
                key: "what_is_bot_desc_2",
              })}
            </Markdown>
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="pb-2 text-xl font-bold">{t({ key: "customization" })}</h2>
          <div className="flex flex-col gap-2">
            <Markdown>
              {t({
                key: "customization_desc",
                vars: {
                  commandsLink: "/commands",
                },
              })}
            </Markdown>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
