/** @jsx h */

import { Configuration } from "twind";
import { blueGray } from "twind/colors";

/** @type {import('twind').Configuration} */
const config: Configuration = {
  mode: "strict",
  theme: {
    extend: {
      boxShadow: {
        focus: `0 0 0 3px ${blueGray[400]}`,
      },
    },
  },
  variants: {
    focus: "[@media(any-hover:hover){&:hover}]",
    max: "@media(min-width: 1200px)",
    halfMax: "@media(min-width: 600px)",
  },
  plugins: {
    btn: `
      flex
      items-center
      justify-center
      py-2
      px-3
      !outline-none
      select-none
      rounded-md
      hover:bg-opacity-80
      active:bg-opacity-60
      focus-visible:shadow-focus
      transition-all
      transform-gpu
    `,

    iconBtn: `
      !outline-none
      select-none
      flex
      items-center
      justify-center
      rounded-md
      hover:bg-opacity-80
      active:bg-opacity-60
      focus-visible:shadow-focus
      transition-all
      transform-gpu
      p-2
      gap-1
    `,

    iconBtnText: `
      !outline-none
      select-none
      flex
      items-center
      justify-center
      rounded-md
      hover:bg-opacity-80
      active:bg-opacity-60
      focus-visible:shadow-focus
      transition-all
      transform-gpu
      py-2
      pl-1
      pr-3
      gap-1
    `,
  },
};

export default config;
