import { CSSProperties, FC, MouseEvent, ReactNode } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

type SharedProps = {
  to: string;
  children?: ReactNode;
};

type OtherProps = {
  style?: CSSProperties;
  className?: string;
};

export const Link: FC<OtherProps & SharedProps> = ({ to, children, style, className }) => {
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

export const ButtonLink: FC<SharedProps> = ({ to, children }) => {
  const router = useRouter();

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    router.push(to, to);
  };

  return (
    <NextLink href={to} passHref>
      <a onClick={onClick} style={{ all: "unset" }}>
        {children}
      </a>
    </NextLink>
  );
};
