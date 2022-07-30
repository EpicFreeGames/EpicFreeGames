/** @jsx h */

import { Configuration } from "twind";

/** @type {import('twind').Configuration} */

const config: Configuration = {
  mode: "strict",
  theme: {},
  variants: {
    focus: "[@media(any-hover:hover){&:hover}]",
  },
  plugins: {
    btn: `
      flex
      items-center
      justify-center
      py-2
      px-3
      rounded-md
      hover:bg-opacity-60
      transition-all
      transform-gpu
      active:bg-opacity-40
    `,
  },
};

export default config;
