import ReactMarkdown from "react-markdown";

import { B, Code, Link } from "./Text";

export const Markdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    components={{
      a: ({ children, href }) => <Link href={href!}>{children}</Link>,
      strong: ({ children }) => <B>{children}</B>,
      code: ({ children }) => <Code toCopy={children as string}>{children}</Code>,
    }}
  >
    {children}
  </ReactMarkdown>
);

export const TermsMarkdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    components={{
      a: ({ children, href }) => <Link href={href!}>{children}</Link>,
      strong: ({ children }) => <b>{children}</b>,
      code: ({ children }) => <Code toCopy={children as string}>{children}</Code>,
      h1: ({ children }) => <h1 className="my-[0.67em] text-2xl font-medium">{children}</h1>,
      h2: ({ children }) => <h2 className="my-[0.83em] text-xl font-medium">{children}</h2>,
      h3: ({ children }) => <h3 className="my-[1em] text-lg font-medium">{children}</h3>,
      h4: ({ children }) => <h3 className="my-[1em] text-base font-medium">{children}</h3>,
      p: ({ children }) => <p className="my-[1em]">{children}</p>,
      ul: ({ children }) => <ul className="my-[1em] list-disc pl-5">{children}</ul>,
    }}
  >
    {children}
  </ReactMarkdown>
);
