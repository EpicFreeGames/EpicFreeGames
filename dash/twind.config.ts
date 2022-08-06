/** @jsx h */

import { Configuration } from "twind";

/** @type {import('twind').Configuration} */
const config: Configuration = {
  mode: "strict",

  variants: {
    focus: "[@media(any-hover:hover){&:hover}]",
    max: "@media(min-width: 1024px)",
    halfMax: "@media(min-width: 512px)",
  },
  plugins: {
    focusVisibleStyles: `!outline-none focus:outline-none focus-visible:ring focus-visible:ring-2 focus-visible:ring-blue-500`,
    focusStyles: `
      !outline-none
      focus:outline-none
      focus:ring focus-within:ring 
      focus:ring-2 focus-within:ring-2 
      focus:ring-blue-500 focus-within:ring-blue-500`,

    baseBtn: `
      flex
      cursor-default
      items-center
      justify-center
      !outline-none
      select-none
      rounded-md
      transition-all
      transform-gpu
      focusVisibleStyles
    `,

    baseBtnPadding: `py-2 px-3`,
    baseBtnText: `text-[0.95rem] halfMax:text-[1rem]`,

    allBaseBtn: `baseBtn baseBtnPadding baseBtnText`,

    "btn-blue-border": `allBaseBtn border(1 blue-500) bg(blue-800 opacity-60 hover:(blue-700 opacity-80) active:(blue-600 opacity-80))`,
    "btn-green-border": `allBaseBtn border(1 green-500) bg(green-700 opacity-60 hover:(green-600 opacity-80) active:(green-500 opacity-80))`,
    "btn-red-border": `allBaseBtn border(1 red-500) bg(red-700 opacity-60 hover:(red-600 opacity-80) active:(red-500 opacity-80))`,

    "btn-gray": `allBaseBtn bg(gray-700 hover:(gray-600 opacity-90) active:(gray-500 opacity-90))`,
    "btn-light-gray": `allBaseBtn bg(gray-600 hover:(gray-500 opacity-80) active:(gray-400 opacity-60))`,
    "btn-dark-gray": `allBaseBtn bg(gray-800 hover:(gray-900 opacity-80) active:(gray-900 opacity-100))`,

    iconBtn: `
      !outline-none
      select-none
      flex
      items-center
      justify-center
      rounded-md
      hover:bg-opacity-80
      active:bg-opacity-60
      transition-all
      transform-gpu
      p-2
      gap-1
      focusVisibleStyles
    `,

    iconBtnText: `
      !outline-none
      select-none
      flex
      items-center
      justify-center
      rounded-md
      transition-all
      transform-gpu
      py-2
      pl-1
      pr-3
      gap-1
      focusVisibleStyles
    `,
  },
};

export default config;
