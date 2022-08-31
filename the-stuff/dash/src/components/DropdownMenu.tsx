import { Menu, Transition } from "@headlessui/react";
import Link, { LinkProps } from "next/link";
import { Fragment, ReactNode, forwardRef } from "react";
import { Menu2 } from "tabler-icons-react";

type Props = {
  children: ReactNode;
};

export const DropdownMenu = ({ children }: Props) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="focus rounded-md border-[1px] border-gray-700 bg-gray-800 p-1">
          <Menu2 size={20} />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <Menu.Items className="absolute mt-1 rounded-md border-[1px] border-gray-600 bg-gray-800 p-[0.4rem] text-sm sm:text-base">
            {children}
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
};

const MyLink = forwardRef<
  HTMLAnchorElement,
  LinkProps & { children: ReactNode; className?: string }
>((props, ref) => {
  let { href, children, ...rest } = props;

  return (
    <Link href={href} passHref>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

MyLink.displayName = "MyLink";

type MenuLinkItemProps = {
  children: ReactNode;
  href: string;
};

export const DropdownMenuLinkItem = ({ children, href }: MenuLinkItemProps) => (
  <Menu.Item>
    {({ active }) => (
      <MyLink
        className={`block select-none rounded-md p-2 pl-8 pr-16 ${
          active ? "bg-gray-700" : "bg-gray-800"
        }`}
        href={href}
      >
        {children}
      </MyLink>
    )}
  </Menu.Item>
);
