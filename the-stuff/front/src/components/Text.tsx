import NextLink from "next/link";
import { ReactNode } from "react";
import toast from "react-hot-toast";

type BProps = {
  children: ReactNode;
};

export const B = ({ children }: BProps) => (
  <b className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text font-bold text-transparent">
    {children}
  </b>
);

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

  const copyFail = () =>
    toast.error(
      <p>
        Failed to copy <Code>{toCopy}</Code> to clipboard!
      </p>
    );

  const copy = () => {
    if (!toCopy) return;

    if (!navigator.clipboard) {
      console.log("Failed to copy text to clipboard - cause:", "Clipboard API not supported");
      copyFail();
    } else {
      try {
        navigator.clipboard.writeText(toCopy);
        copySuccess();
      } catch (err) {
        console.log("Failed to copy text to clipboard - cause:", err);
        copyFail();
      }
    }
  };

  return (
    <code
      onClick={() => copy()}
      className="whitespace-nowrap rounded-md border-[1px] border-gray-700 bg-gray-800 py-[0.1rem] px-1 font-mono outline-none transition-all duration-200 hover:cursor-pointer hover:bg-gray-800/50"
    >
      {children}
    </code>
  );
};

type HeadingProps = {
  children: ReactNode;
};

export const Heading = ({ children, className }: HeadingProps & { className?: string }) => (
  <h1 className={`text-2xl font-bold ${className}`}>{children}</h1>
);
export const Heading2 = ({ children }: HeadingProps) => (
  <h2 className="pb-2 text-xl font-bold">{children}</h2>
);

export const Heading3 = ({ children }: HeadingProps) => (
  <h3 className="pb-2 text-lg font-bold">{children}</h3>
);

type LinkProps = {
  children: ReactNode;
  href: string;
};

export const Link = ({ children, href }: LinkProps) => (
  <NextLink href={href} passHref>
    <a className="focus rounded-md outline-none">
      <span className="border-b-2 border-b-blue-400 bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text font-bold text-transparent outline-none">
        {children}
      </span>
    </a>
  </NextLink>
);
