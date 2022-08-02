/** @jsx h */
/** @jsxFrag Fragment */
import { Logout } from "icons";
import { ComponentChildren, h } from "preact";
import { tw } from "twind";
import { Base } from "./base.tsx";
import { Path } from "./Path.tsx";

type Props = {
  children: ComponentChildren;
  title: string;
  titleButton?: ComponentChildren;
} & (
  | { url: URL; segments: string[] }
  | {
      url?: never;
      segments?: never;
    }
);

export const Layout = ({ children, title, titleButton, url, segments }: Props) => {
  const hasPath = !!(url && segments);
  const hasButton = !!titleButton;

  return (
    <Base title={title}>
      <nav className={tw`bg-gray-800`}>
        <div className={tw`max-w-screen-lg mx-auto flex justify-between p-3 halfMax:p-4`}>
          <div className={tw`flex gap-4`}>
            <NavLink href="/games">Games</NavLink>
            <NavLink href="/currencies">Currencies</NavLink>
          </div>

          <a className={tw`iconBtn bg-gray-700`} href="/logout">
            <Logout />
          </a>
        </div>
      </nav>

      <main className={tw`max-w-screen-lg mx-auto halfMax:px-4`}>
        <div className={tw`flex flex-col`}>
          {hasPath && <Path url={url} segments={segments} />}

          <div
            className={tw`flex justify-between pb-3 px-3 halfMax:px-0 ${hasButton ? "" : "pt-3"}`}
          >
            <h1 className={tw`flex items-center text-2xl halfMax:text-4xl`}>{title}</h1>

            {titleButton}
          </div>
        </div>

        {children}
      </main>
    </Base>
  );
};

const NavLink = ({ children, href }: { children: ComponentChildren; href: string }) => (
  <a tabIndex={1} href={href} className={tw`btn bg-gray-700`}>
    {children}
  </a>
);
