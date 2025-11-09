import type { ReactNode } from "react";
import styles from "./badge.module.scss";
import { clsx } from "clsx";

type BadgeVariant = "info" | "blue";
type BadgeRadius = "8" | "4";

interface IProps {
  variant?: BadgeVariant;
  children: ReactNode;
  radius?: BadgeRadius;
  className?: string;
}

export default function Badge(props: IProps) {
  const { variant = "info", children, radius = "8", className = "" } = props;
  return (
    <span
      className={clsx(
        styles["Badge"],
        styles[`Badge_variant-${variant}`],
        styles[`Badge_radius-${radius}`],
        className,
      )}
    >
      {children}
    </span>
  );
}
