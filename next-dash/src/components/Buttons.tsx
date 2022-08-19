import { ComponentProps } from "react";

type Props = Omit<ComponentProps<"button">, "className">;

export const ButtonGrayClasses = `
  flex items-center justify-center
  outline-none select-none cursor-default
  rounded-md transition-all
  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
  bg-gray-700 hover:bg-gray-600/90 active:bg-gray-500/90`;

export const ButtonGray = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
      flex cursor-default select-none 
      items-center justify-center rounded-md 
      bg-gray-700 outline-none 
      transition-all hover:bg-gray-600/90 focus:outline-none
      focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-gray-500/90"
  >
    {children}
  </button>
);

export const ButtonLightGray = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
      flex cursor-default select-none 
      items-center justify-center rounded-md 
      bg-gray-600 outline-none 
      transition-all hover:bg-gray-500/80 focus:outline-none
      focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-gray-400/60"
  >
    {children}
  </button>
);

export const ButtonDarkGray = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
      flex cursor-default select-none 
      items-center justify-center rounded-md 
      bg-gray-800 outline-none 
      transition-all hover:bg-gray-900/80 focus:outline-none
      focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-gray-900"
  >
    {children}
  </button>
);

export const IconButtonGray = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
      flex cursor-default select-none
      items-center justify-center rounded-md
      bg-gray-800 outline-none
      transition-all hover:bg-gray-900/80 focus:outline-none
      focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-gray-900"
  >
    {children}
  </button>
);

export const ButtonBorderBlue = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
    border-1 flex cursor-default
    select-none items-center justify-center
    rounded-md border-blue-500
    bg-blue-800/60 outline-none transition-all
    hover:bg-blue-700/80 focus:outline-none
    focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-blue-600/80"
  >
    {children}
  </button>
);

export const ButtonBorderGreen = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
    border-1 flex cursor-default
    select-none items-center justify-center
    rounded-md border-green-500
    bg-green-700/60 outline-none transition-all
    hover:bg-green-600/80 focus:outline-none
    focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-green-500/80"
  >
    {children}
  </button>
);

export const ButtonBorderRed = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
    border-1 flex cursor-default
    select-none items-center justify-center
    rounded-md border-red-500
    bg-red-700/60 outline-none transition-all
    hover:bg-red-600/80 focus:outline-none
    focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-red-500/80"
  >
    {children}
  </button>
);
