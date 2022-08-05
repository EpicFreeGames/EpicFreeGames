/** @jsx h */
/** @jsxFrag Fragment */
import { ChevronRight } from "icons";
import { Fragment, h } from "preact";
import { tw } from "twind";

type Props = {
  url: URL;
  segments: string[];
};

export const Path = ({ url, segments }: Props) => {
  const urlSegments = url.pathname.split("/").slice(1);

  return (
    <div
      className={tw`flex gap-2 items-center whitespace-nowrap overflow-y-hidden w-full overflow-x-auto p-3 halfMax:px-0`}
    >
      <Segment href="/" title="Home" />

      {urlSegments.map((_, index) => (
        <>
          <ChevronRight size={15} className={tw`min-w-[1rem]`} />

          <Segment
            href={`/${urlSegments.slice(0, index + 1).join("/")}`}
            title={segments[index]}
            active={index === urlSegments.length - 1}
          />
        </>
      ))}
    </div>
  );
};

type SegmentProps = {
  title: string;
  href: string;
  active?: boolean;
};

const Segment = ({ title, href, active }: SegmentProps) =>
  active ? (
    <p className={pathBtnStyles(active)}>{title}</p>
  ) : (
    <a className={pathBtnStyles(active)} href={href}>
      {title}
    </a>
  );

const pathBtnStyles = (active?: boolean) => tw`
  py-1 
  px-2
  text-[0.8rem] 
  bg-opacity-40 
  rounded-md 
  !outline-none
  select-none
  rounded-md
  transition-all
  transform-gpu 
  ${
    active
      ? "bg-gray-400 ring-1 ring-gray-500"
      : "bg-gray-600 hover:bg-opacity-30 active:bg-opacity-20 focusVisibleStyles"
  }
  `;
