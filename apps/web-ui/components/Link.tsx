import { CSSProperties, FC, MouseEvent, ReactNode } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

type OtherProps = {
  to: string;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
};

export const Link: FC<OtherProps> = ({ to, children, style, className }) => {
  const router = useRouter();

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    router.push(to, to);
  };

  return (
    <NextLink href={to} passHref>
      <a onClick={onClick} style={style} className={className}>
        {children}
      </a>
    </NextLink>
  );
};
