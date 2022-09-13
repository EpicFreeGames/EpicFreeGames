import { NextPage } from "next";
import { AppProps } from "next/app";

import { Flags } from "@efg/types";

export type Page = NextPage & {
  requiredFlags?: Flags[];
  requireAuth: boolean;
};

export type MyAppProps = AppProps & {
  Component: Page;
};
