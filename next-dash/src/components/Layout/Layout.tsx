import Head from "next/head";
import { ElementType, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { NavBar } from "./NavBar";
import { Path } from "./Path";

type Props = {
  children: ReactNode;
  title: string;
  titleButtons?: ElementType[];
  segments?: string[];
};

export const Layout = ({ children, title, titleButtons, segments }: Props) => {
  const hasPath = segments?.length;
  const hasButtons = titleButtons?.length;

  return (
    <>
      <Head>
        <title>{`${title} - Dash - EpicFreeGames`}</title>
      </Head>

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
          {hasPath && <Path segments={segments} />}

          <div className="flex justify-between pb-3 px-3 halfMax:px-0">
            <h1 className={`flex items-center text-2xl halfMax:text-4xl ${hasPath ? "" : "pt-3"}`}>
              {title}
            </h1>

            {hasButtons && (
              <div className="flex gap-3">
                {titleButtons.map((TitleButton, i) => (
                  <TitleButton key={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {children}
      </main>
    </>
  );
};
