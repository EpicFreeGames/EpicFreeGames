/** @jsx h */
import { ChevronLeft } from "icons";
import { h } from "preact";
import { tw } from "twind";

type Props = {
  href: string;
};

export const BackButton = ({ href }: Props) => (
  <a href={href} className={tw`btn-gray iconBtnText`}>
    <ChevronLeft /> Back
  </a>
);
