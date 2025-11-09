import { clsx } from "clsx";
import styles from "./flex.module.scss";
import type { ReactNode } from "react";

type FlexDirection = "column" | "row";
type FlexGap = 4 | 8 | 12 | 16 | 32;
type FlexJustifyContent = "start" | "end" | "center" | "between";
type FlexAlignItems = "start" | "end" | "center" | "stretch";

interface IProps {
  direction?: FlexDirection;
  gap?: FlexGap;
  justify?: FlexJustifyContent;
  items?: FlexAlignItems;
  className?: string;
  children: ReactNode;
}

export default function Flex(props: IProps) {
  const {
    direction = "row",
    gap,
    children,
    justify = "start",
    items = "start",
    className = "",
  } = props;

  return (
    <div
      className={clsx(
        styles["Flex"],
        styles[`Flex_direction-${direction}`],
        styles[`Flex_gap-${gap}`],
        styles[`Flex_justify-${justify}`],
        styles[`Flex_items-${items}`],
        className,
      )}
    >
      {children}
    </div>
  );
}
