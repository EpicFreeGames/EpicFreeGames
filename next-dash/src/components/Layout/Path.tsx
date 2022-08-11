import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronRight } from "tabler-icons-react";
import { useIsMounted } from "~hooks/useIsMounted";

type Props = {
  segments: string[];
};

export const Path = ({ segments }: Props) => {
  const isMounted = useIsMounted();
  const router = useRouter();

  if (!isMounted) return null;

  const urlSegments = router.pathname.split("/").slice(1);
  if (urlSegments.length !== segments.length)
    throw Error("url segments and segments must have the same length");

  return (
    <div
      className={`flex gap-2 items-center whitespace-nowrap overflow-y-hidden w-full overflow-x-auto p-3 halfMax:px-0`}
    >
      <Segment href="/" title="Home" />

      {urlSegments.map((_, index) => (
        <Segment
          key={index}
          href={`/${urlSegments.slice(0, index + 1).join("/")}`}
          title={segments[index]!}
          active={index === urlSegments.length - 1}
          showChevron={true}
        />
      ))}
    </div>
  );
};

type SegmentProps = {
  title: string;
  href: string;
  active?: boolean;
  showChevron?: boolean;
};

const Segment = ({ title, href, active, showChevron }: SegmentProps) => {
  return (
    <>
      {showChevron && <ChevronRight size={15} className={`min-w-[1rem]`} />}

      {active ? (
        <p className="py-1 px-2 btnBase text-[0.8rem] bg-opacity-40 bg-gray-400 ring-gray-500">
          {title}
        </p>
      ) : (
        <Link href={href} passHref>
          <a className="py-1 px-2 btnBase text-[0.8rem] bg-opacity-40 cursor-pointer bg-gray-600 hover:bg-gray-500/40 active:bg-gray-400/40)">
            {title}
          </a>
        </Link>
      )}
    </>
  );
};
