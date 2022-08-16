import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  htmlFor: string;
  required?: boolean;
};

export const Label = ({ children, required, htmlFor }: Props) => (
  <label className="text-sm" htmlFor={htmlFor}>
    {children} {!!required && <b className="text-red-500"> *</b>}
  </label>
);
