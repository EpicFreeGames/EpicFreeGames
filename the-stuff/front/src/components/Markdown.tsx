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
