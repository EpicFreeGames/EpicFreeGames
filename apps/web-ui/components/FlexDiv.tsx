import { CSSProperties, FC, ReactNode } from "react";
import { NoneOrOneOf } from "types";

interface FlexDivJustifyProps {
  justifyCenter: boolean;
  justifyBetween: boolean;
  justifyStart: boolean;
  justifyEnd: boolean;
}

interface FlexDivAlignProps {
  alignCenter: boolean;
  alignStart: boolean;
  alignEnd: boolean;
  alignBaseline: boolean;
}

type FlexDivProps = NoneOrOneOf<FlexDivJustifyProps> &
  NoneOrOneOf<FlexDivAlignProps> & {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    gap05?: boolean;
    gap0?: boolean;
    column?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
  };

export const FlexDiv: FC<FlexDivProps> = (props) => (
  <div
    style={{
      display: "flex",
      gap: props.gap05 ? "0.5rem" : props.gap0 ? "0rem" : "1rem",

      alignItems: props.alignCenter
        ? "center"
        : props.alignStart
        ? "flex-start"
        : props.alignEnd
        ? "flex-end"
        : props.alignBaseline
        ? "baseline"
        : undefined,

      justifyContent: props.justifyCenter
        ? "center"
        : props.justifyBetween
        ? "space-between"
        : props.justifyStart
        ? "flex-start"
        : props.justifyEnd
        ? "flex-end"
        : undefined,

      flexDirection: props.column ? "column" : "row",
      width: props.fullWidth ? "100%" : undefined,
      height: props.fullHeight ? "100%" : undefined,
      ...props.style,
    }}
    className={props.className}
  >
    {props.children}
  </div>
);
