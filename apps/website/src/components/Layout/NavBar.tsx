import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Home } from "tabler-icons-react";

import type { ILanguage } from "@efg/types";

import { useT } from "~hooks/useT";

type Props = {
  languages: ILanguage[];
  translations: Record<string, string>;
};

export const NavBar = ({ translations, languages }: Props) => {
  const t = useT(translations);

  return (
    <nav className="fixed z-10 w-full bg-gray-900/50 backdrop-blur-sm">
      <div className="mx-auto flex h-[3.5rem] max-w-screen-sm items-center justify-between gap-3 overflow-auto px-3 sm:h-[4.5rem]">
        <div className="flex gap-1 sm:gap-3">
          <Navlink href="/">
            <Home size={20} strokeWidth={2} />
          </Navlink>
          <Navlink href="/commands">{t({ key: "commands" })}</Navlink>
          <Navlink href="/tutorial">{t({ key: "tutorial" })}</Navlink>
          <Navlink href="/faq">{t({ key: "faq" })}</Navlink>
        </div>
      </div>
    </nav>
  );
};

const Navlink = ({ href, children }: { href: string; children: ReactNode }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const active = pathname === href;

  return (
    <Link passHref href={href}>
      <a
        className={`focus flex items-center justify-center rounded-md border-[1px] border-transparent bg-gray-800 px-2 py-1 text-sm font-bold transition-all duration-200 hover:bg-gray-700 sm:text-base ${
          active ? "border-[1px] !border-gray-500 bg-gray-700 hover:bg-gray-600" : ""
        }`}
      >
        {children}
      </a>
    </Link>
  );
};
