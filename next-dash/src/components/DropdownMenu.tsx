import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/router";
import { ComponentProps, ReactNode } from "react";

type Props = ComponentProps<typeof DropdownMenuPrimitive.Root> & {
  children: ReactNode;
  trigger: ReactNode;
};

export const DropdownMenu = ({ children, trigger, ...rest }: Props) => {
  return (
    <DropdownMenuPrimitive.Root {...rest}>
      <DropdownMenuPrimitive.Trigger asChild>{trigger}</DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Content
        className="min-w-[220px] overflow-hidden rounded-md border-[1px] border-gray-700 bg-gray-800 p-2 text-sm shadow-sm"
        sideOffset={5}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Root>
  );
};

export const DropdownMenuItem = ({
  children,
  href,
  ...rest
}: { children: ReactNode; href: string } & Omit<
  ComponentProps<typeof DropdownMenuPrimitive.Item>,
  "className"
>) => {
  const router = useRouter();

  return (
    <DropdownMenuPrimitive.Item
      {...rest}
      className="relative flex select-none items-center rounded-md bg-gray-800 p-3 pl-7 outline-none duration-200 focus:bg-gray-700"
      onClick={() => router.push(href)}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
};
