import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
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
        className="border-1 min-w-[220px] overflow-hidden rounded-md border-gray-500 bg-gray-700 p-2 text-sm shadow-sm"
        sideOffset={5}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Root>
  );
};

export const DropdownMenuItem = ({
  children,
  ...rest
}: { children: ReactNode } & Omit<
  ComponentProps<typeof DropdownMenuPrimitive.Item>,
  "className"
>) => (
  <DropdownMenuPrimitive.Item
    {...rest}
    className="relative flex select-none items-center rounded-md bg-gray-500/80 p-3 pl-7 outline-none duration-200 focus:bg-gray-600"
  >
    {children}
  </DropdownMenuPrimitive.Item>
);
