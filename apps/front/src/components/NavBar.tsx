import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import type { ILanguage } from "@efg/types";

import { useMediaQuery } from "~hooks/useMediaQuery";
import { t } from "~i18n/translate";

import { DropdownMenu, MenuLinkItem } from "./DropdownMenu";
import { LanguageSelector } from "./LanguageSelector";

type Props = {
  languages: ILanguage[];
  translations: Record<string, string>;
};

export const NavBar = ({ translations, languages }: Props) => {
  const router = useRouter();
  const isHome = router.pathname === "/";

  const mobile = useMediaQuery("(max-width: 560px)");

  return (
    <nav className="sticky inset-0 z-10 bg-gray-900/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[680px] items-center justify-between gap-3 p-3 sm:p-5">
        {!mobile ? (
          <div className="flex gap-3">
            {!isHome && <Navlink href="/">{t({ key: "home", translations })}</Navlink>}
            <Navlink href="/commands">{t({ key: "commands", translations })}</Navlink>
            <Navlink href="/tutorial">{t({ key: "tutorial", translations })}</Navlink>
            <Navlink href="/faq">{t({ key: "faq", translations })}</Navlink>
          </div>
        ) : (
          <DropdownMenu>
            {!isHome && <MenuLinkItem href="/">{t({ key: "home", translations })}</MenuLinkItem>}
            <MenuLinkItem href="/commands">{t({ key: "commands", translations })}</MenuLinkItem>
            <MenuLinkItem href="/tutorial">{t({ key: "tutorial", translations })}</MenuLinkItem>
            <MenuLinkItem href="/faq">{t({ key: "faq", translations })}</MenuLinkItem>
          </DropdownMenu>
        )}

        <LanguageSelector languages={languages} />
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
        className={`focus items-center justify-center rounded-md border-[1px] border-transparent px-2 py-1 text-sm font-bold transition-all duration-200 hover:bg-gray-800 sm:text-base ${
          active ? "border-[1px] !border-gray-600 bg-gray-800" : ""
        }`}
      >
        {children}
      </a>
    </Link>
  );
};
