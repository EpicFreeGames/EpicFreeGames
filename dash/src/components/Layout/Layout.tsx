/** @jsx h */

/** @jsxFrag Fragment */
import { ComponentChildren, Fragment, h } from "preact";
import { tw } from "twind";

import { NavBar } from "./NavBar.tsx";
import { Path } from "./Path.tsx";
import { Base } from "./base.tsx";

type Props = {
  children: ComponentChildren;
  title: string;
  titleButtons?: ComponentChildren[];
} & (
  | { url: URL; segments: string[] }
  | {
      url?: never;
      segments?: never;
    }
);

export const Layout = ({ children, title, titleButtons, url, segments }: Props) => {
  const hasPath = !!(url && segments);
  const hasButtons = !!titleButtons?.length;

  return (
    <Base title={title}>
      <NavBar />

      <main className={tw`mx-auto max-w-screen-lg md:px-4`}>
        <div className={tw`flex flex-col`}>
          {hasPath && <Path url={url} segments={segments} />}

          <div className={tw`flex justify-between px-3 pb-3 md:px-0`}>
            <h1 className={tw`flex items-center text-2xl md:text-4xl`}>{title}</h1>

            {hasButtons && (
              <div className={tw`flex gap-3`}>
                {titleButtons.map((button) => (
                  <>{button}</>
                ))}
              </div>
            )}
          </div>
        </div>

        {children}
      </main>
    </Base>
  );
};
