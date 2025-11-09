import type { ReactNode } from "react";
import { clsx } from "clsx";
import styles from "./Text.module.scss";

type TextSize = 24 | 20 | 18 | 16 | 14 | 12 | 10 | 8;
type TextWeight = 400 | 500;
type TextColor = "white" | "black" | "gray" | "green" | "blue";
type TextAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type TextAlign = "left" | "center" | "right";

interface IProps {
  children: ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  as?: TextAs;
  className?: string;
}

export default function Text(props: IProps) {
  const {
    children,
    className = "",
    size = 14,
    as: Component = "p",
    weight = 400,
    color = "black",
    align = "left",
  } = props;
  return (
    <Component
      className={clsx(
        styles["Text"],
        styles[`Text-size-${size}`],
        styles[`Text-weight-${weight}`],
        styles[`Text-color-${color}`],
        styles[`Text_align-${align}`],
        className,
      )}
    >
      {children}
    </Component>
  );
}
