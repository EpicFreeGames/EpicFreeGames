import { TooltipProps, Tooltip as MantineTooltip } from "@mantine/core";
import { FC, RefAttributes } from "react";

interface Props extends TooltipProps, RefAttributes<HTMLDivElement> {}

export const Tooltip: FC<Props> = ({ style, transition, ...props }) => (
  <MantineTooltip
    {...props}
    style={{ ...style, width: "100%", display: "flex" }}
    transition={transition || "rotate-right"}
  >
    {props.children}
  </MantineTooltip>
);
