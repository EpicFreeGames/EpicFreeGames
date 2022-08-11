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
      flex items-center justify-center 
      outline-none select-none cursor-default 
      rounded-md transition-all 
      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      bg-gray-700 hover:bg-gray-600/90 active:bg-gray-500/90"
  >
    {children}
  </button>
);

export const ButtonLightGray = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
      flex items-center justify-center 
      outline-none select-none cursor-default 
      rounded-md transition-all 
      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      bg-gray-600 hover:bg-gray-500/80 active:bg-gray-400/60"
  >
    {children}
  </button>
);

export const ButtonDarkGray = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
      flex items-center justify-center 
      outline-none select-none cursor-default 
      rounded-md transition-all 
      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      bg-gray-800 hover:bg-gray-900/80 active:bg-gray-900"
  >
    {children}
  </button>
);

export const IconButtonGray = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
      flex items-center justify-center
      outline-none select-none cursor-default
      rounded-md transition-all
      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      bg-gray-800 hover:bg-gray-900/80 active:bg-gray-900"
  >
    {children}
  </button>
);

export const ButtonBorderBlue = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
    flex items-center justify-center
    outline-none select-none cursor-default
    rounded-md transition-all
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    border-1 border-blue-500
    bg-blue-800/60 hover:bg-blue-700/80 active:bg-blue-600/80"
  >
    {children}
  </button>
);

export const ButtonBorderGreen = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
    flex items-center justify-center
    outline-none select-none cursor-default
    rounded-md transition-all
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    border-1 border-green-500
    bg-green-700/60 hover:bg-green-600/80 active:bg-green-500/80"
  >
    {children}
  </button>
);

export const ButtonBorderRed = ({ children, ...props }: Props) => (
  <button
    {...props}
    className="
    flex items-center justify-center
    outline-none select-none cursor-default
    rounded-md transition-all
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    border-1 border-red-500
    bg-red-700/60 hover:bg-red-600/80 active:bg-red-500/80"
  >
    {children}
  </button>
);
