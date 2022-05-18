import { TooltipProps, Tooltip as MantineTooltip } from "@mantine/core";
import { FC, RefAttributes } from "react";

interface Props extends TooltipProps, RefAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

export const Tooltip: FC<Props> = ({ style, transition, fullWidth, ...props }) => (
  <MantineTooltip
    {...props}
    style={{
      ...style,
      width: fullWidth ? "100%" : undefined,
      display: fullWidth ? "flex" : undefined,
    }}
    transition={transition || "rotate-right"}
  >
    {props.children}
  </MantineTooltip>
);
