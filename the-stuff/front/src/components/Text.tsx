import NextLink from "next/link";
import { ReactNode } from "react";
import toast from "react-hot-toast";

type TextProps = {
  children: ReactNode;
  className?: string;
};

export const Text = ({ children, className }: TextProps) => (
  <p className={`${className} text-sm sm:text-base`}>{children}</p>
);

type BProps = {
  children: ReactNode;
};

export const B = ({ children }: BProps) => <b className="font-bold text-blue-400">{children}</b>;

type CodeProps = {
  children: ReactNode;
  toCopy?: string;
};

export const Code = ({ children, toCopy }: CodeProps) => {
  const copySuccess = () =>
    toast.success(
      <p>
        Copied <Code>{toCopy}</Code> to clipboard!
      </p>
    );

  const copyFail = (cause?: string) =>
    toast.error(
      <p>
        Failed to copy <Code>{toCopy}</Code> to clipboard! {cause ? `Cause: ${cause}` : ""}
      </p>
    );

  const copy = () => {
    if (!toCopy) return;

    if (!navigator.clipboard) {
      console.log("Failed to copy text to clipboard - cause:", "Clipboard API not supported");
      copyFail("Clipboard API not supported");
    } else {
      try {
        navigator.clipboard.writeText(toCopy);
        copySuccess();
      } catch (err) {
        console.log("Failed to copy text to clipboard - cause:", err);
        copyFail(err?.message);
      }
    }
  };

  return (
    <code
      onClick={() => copy()}
      className={`focus whitespace-nowrap rounded-md border-[1px] border-gray-700 bg-gray-800 py-[0.1rem] px-1 font-mono text-xs outline-none transition-all duration-200 sm:text-base ${
        toCopy ? "hover:cursor-pointer hover:bg-gray-800/50" : ""
      }`}
      tabIndex={toCopy ? 0 : -1}
    >
      {children}
    </code>
  );
};

type LinkProps = {
  children: ReactNode;
  href: string;
};

export const Link = ({ children, href }: LinkProps) => (
  <NextLink href={href} passHref>
    <a className="focus rounded-md outline-none">
      <span className="border-b-2 border-b-blue-400 border-opacity-40 font-bold text-blue-400 outline-none transition-all duration-200 hover:border-opacity-100">
        {children}
      </span>
    </a>
  </NextLink>
);
