import ReactMarkdown from "react-markdown";

import { B, Code, Heading, Heading2, Heading3, Link } from "./Text";

export const Markdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    components={{
      a: ({ children, href }) => <Link href={href!}>{children}</Link>,
      strong: ({ children }) => <B>{children}</B>,
      code: ({ children }) => <Code toCopy={children as string}>{children}</Code>,
      h1: ({ children }) => <Heading>{children}</Heading>,
      h2: ({ children }) => <Heading2>{children}</Heading2>,
      h3: ({ children }) => <Heading3>{children}</Heading3>,
    }}
  >
    {children}
  </ReactMarkdown>
);
