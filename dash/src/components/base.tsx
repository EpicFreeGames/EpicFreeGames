/** @jsx h */
/** @jsxFrag Fragment */
import { Head } from "$fresh/runtime.ts";
import { ComponentChildren, Fragment, h } from "preact";

type Props = {
  children: ComponentChildren;
  title: string;
};

export const Base = ({ children, title }: Props) => (
  <>
    <Head>
      <title>{title} - EpicFreeGames</title>

      <style>
        {`
          body {
            background-color: rgb(17, 24, 39);
            color: rgb(236, 237, 238);
          }
        `}
      </style>
    </Head>

    {children}
  </>
);
