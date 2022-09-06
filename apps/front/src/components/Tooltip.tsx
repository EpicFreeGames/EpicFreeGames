import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
  copied?: boolean;
  onClick?: () => void;
};

export const Tooltip = ({ label, children, copied, onClick }: Props) => (
  <RadixTooltip.Root delayDuration={0}>
    <RadixTooltip.Trigger onClick={onClick} className="focus rounded-md">
      {children}
    </RadixTooltip.Trigger>
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        onPointerDownOutside={(e) => e.preventDefault()}
        sideOffset={5}
        className={`
          animate-fadeIn rounded-md border-[1px] px-2 py-1 
          ${copied ? "border-green-700 bg-green-600" : "border-gray-700 bg-gray-800"}
        `}
      >
        {label}
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  </RadixTooltip.Root>
);

export const TooltipProvider = RadixTooltip.Provider;
