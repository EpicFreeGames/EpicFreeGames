import Head from "next/head";
import { ElementType, ReactNode } from "react";

import { useNotifs } from "~hooks/useNotifs";
import { useUser } from "~hooks/useUser";

import { NavBar } from "./NavBar";

type Props = {
  children: ReactNode;
  title: string;
  titleButtons?: ElementType[];
};

export const Layout = ({ children, title, titleButtons }: Props) => {
  const { user } = useUser();

  useNotifs({ isAuthenticated: !!user });

  const hasButtons = titleButtons?.length;

  return (
    <>
      <Head>
        <title>{`${title} - Dash - EpicFreeGames`}</title>
      </Head>

      {!!user && (
        <>
          <NavBar />

          <main className="mx-auto max-w-screen-lg px-3 pt-[3.5rem]">
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-3 md:px-0 md:py-4">
                <h1 className="flex items-center text-[1.5rem] leading-[1.25rem] md:text-[2.25rem] md:leading-[2rem]">
                  {title}
                </h1>

                {hasButtons && (
                  <div className="flex gap-3">
                    {titleButtons.map((TitleButton, i) => (
                      <div key={i} className="flex items-center">
                        <TitleButton />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {children}
          </main>
        </>
      )}
    </>
  );
};
