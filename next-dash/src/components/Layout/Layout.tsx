import Head from "next/head";
import { ElementType, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { useUser } from "~hooks/useUser";
import { useNotifs } from "~hooks/useNotifs";
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
          <Toaster
            toastOptions={{
              style: {
                backgroundColor: "rgb(17 24 39)",
                color: "rgb(241 245 249)",
              },
            }}
          />

          <NavBar />

          <main className="max-w-screen-lg mx-auto halfMax:px-4">
            <div className="flex flex-col">
              <div className="flex justify-between px-3 py-3 halfMax:px-0 halfMax:py-4 items-center">
                <h1 className="flex items-center text-[1.5rem] leading-[1.25rem] halfMax:text-[2.25rem] halfMax:leading-[2rem]">
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
