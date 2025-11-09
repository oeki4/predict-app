import styles from "./card.module.scss";
import { type ReactNode, type ComponentPropsWithoutRef } from "react";
import { clsx } from "clsx";

type BorderButtonColor = "blue" | "green";

interface CommonProps {
  children: ReactNode;
  className?: string;
  isButton?: boolean;
  borderButtonColor?: BorderButtonColor;
}

type CardProps =
  | (CommonProps & ComponentPropsWithoutRef<"article"> & { isButton?: false })
  | (CommonProps & ComponentPropsWithoutRef<"button"> & { isButton: true });

export default function Card(props: CardProps) {
  const {
    className = "",
    children,
    isButton,
    borderButtonColor,
    ...otherProps
  } = props;
  const Component = isButton ? "button" : "article";

  return (
    <Component
      className={clsx(
        styles["Card"],
        isButton && styles["Card_button"],
        borderButtonColor && styles[`Card_button-${borderButtonColor}`],
        className,
      )}
      {...otherProps}
    >
      {children}
    </Component>
  );
}
