import styles from "./button.module.scss";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonColor = "transparent";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  color?: ButtonColor;
}

export default function Button(props: IProps) {
  const { children, color = "transparent", className, ...otherProps } = props;
  return (
    <button
      className={clsx(
        styles["Button"],
        styles[`Button-color-${color}`],
        className,
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
}
