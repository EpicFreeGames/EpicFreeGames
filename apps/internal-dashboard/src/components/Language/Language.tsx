import { ILanguage } from "@efg/types";

import { pluralize } from "~utils/pluralize";

type Props = {
  language: ILanguage;
};

export const Language = ({ language }: Props) => (
  <div className="flex flex-col gap-3 rounded-md bg-gray-700 p-3">
    <div className="flex h-full w-full flex-col items-start justify-between gap-2 md:flex-row">
      <h2 className="rounded-md bg-gray-800 py-2 px-3 text-lg md:text-2xl">
        {language.englishName}
      </h2>
    </div>

    <div className="flex flex-col gap-2">
      <Spec title="Code:" value={language.code} />
      <Spec title="Native name:" value={language.nativeName} />
      <Spec title="English name:" value={language.englishName} />
      <Spec title="Used by:" value={pluralize(language.serverCount!, "server", "servers")} />
    </div>
  </div>
);

const Spec = ({ title, value, wordWrap }: { title: string; value: string; wordWrap?: boolean }) => (
  <p className={`rounded-md bg-gray-800 p-3 ${wordWrap ? "" : "whitespace-nowrap"}`}>
    <b className="text-[17px]">{title}</b> <br /> {value}
  </p>
);
