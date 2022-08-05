/** @jsx h */
import { ChevronLeft } from "icons";
import { h } from "preact";
import { tw } from "twind";

type Props = {
  href: string;
};

export const BackButton = ({ href }: Props) => (
  <a href={href} className={tw`bg-gray-700 iconBtnText`}>
    <ChevronLeft /> Back
  </a>
);
