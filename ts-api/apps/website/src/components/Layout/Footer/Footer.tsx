import type { ILanguage } from "@efg/types";

import { Link } from "~components/Text";
import { useT } from "~hooks/useT";

import { LanguageSelector } from "./LanguageSelector";

type Props = {
  translations: Record<string, string>;
  languages: ILanguage[];
};

export const Footer = ({ translations, languages }: Props) => {
  const t = useT(translations);

  return (
    <div className="mx-auto mt-[3rem] mb-[4rem] flex w-full max-w-screen-sm flex-col items-start gap-5 px-3 sm:mt-[6rem] sm:flex-row sm:justify-between sm:gap-0">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col">
          <Link href="mailto:hi@epicfreegames.net">{t({ key: "contact_us" })}</Link>
          <Link href="/discord" locale={false}>
            {t({ key: "discord_server" })}
          </Link>
        </div>

        <div className="flex flex-col">
          <Link href="/privacy-policy" locale={false}>
            {t({ key: "privacy_policy" })}
          </Link>
          <Link href="/terms-of-service" locale={false}>
            {t({ key: "terms_of_service" })}
          </Link>
        </div>
      </div>

      <LanguageSelector translations={translations} languages={languages} />
    </div>
  );
};
