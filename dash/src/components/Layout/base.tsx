/** @jsx h */
/** @jsxFrag Fragment */
import { Head } from "$fresh/runtime.ts";
import { ComponentChildren, Fragment, h } from "preact";
import { apply } from "twind";

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
          *:focus-visible {
            ${apply`ring ring-1 ring-gray-500`}
          }

          body {
            background-color: rgb(17, 24, 39);
            color: rgb(236, 237, 238);
          }

          input {
            appearance: none;
            boxSizing: border-box;
          }

          input:focus {
            outline: none;
          }
        `}
      </style>
    </Head>

    {children}
  </>
);