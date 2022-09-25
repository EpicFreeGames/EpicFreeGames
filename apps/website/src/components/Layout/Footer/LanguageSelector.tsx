import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { ChevronDown } from "tabler-icons-react";

import type { ILanguage } from "@efg/types";

import { useT } from "~hooks/useT";

type Props = { languages: ILanguage[]; translations: Record<string, string> };

export const LanguageSelector = ({ languages, translations }: Props) => {
  const t = useT(translations);
  const router = useRouter();
  const { locale, pathname, asPath } = router;

  const [selected, setSelected] = useState(locale || "en");

  const webLanguages = useMemo(() => languages.filter((l) => l.websiteReady), [languages]);

  const onChange = (newValue: string) => {
    if (!webLanguages.find((lang) => lang.code === newValue)) {
      console.warn(`Unknown language: ${newValue}`);
      return;
    }

    setSelected(newValue);
    router.push({ pathname }, asPath, { locale: newValue });
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="language-selector" className="text-sm">
        {t({ key: "language" })}:
      </label>

      <div className="relative">
        <select
          id="language-selector"
          onChange={(e) => onChange(e.target.value)}
          className="focus w-full appearance-none rounded-md border-[1px] border-gray-600 bg-gray-800 py-1 pl-2 pr-7 text-sm sm:text-base"
          value={selected}
        >
          {webLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>

        <div className="absolute right-[0.55rem] top-[0.5rem]">
          <ChevronDown size={19} />
        </div>
      </div>
    </div>
  );
};
