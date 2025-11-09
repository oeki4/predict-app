import styles from "./contained-icon.module.scss";
import { Icon } from "@shared/ui";
import type { FC, SVGProps } from "react";
import { clsx } from "clsx";

export type GradientColor = "orange" | "blue" | "pink" | "green";
type ContainedIconRadius = "10" | "full";

interface IProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  className?: string;
  gradientColor?: GradientColor;
  radius?: ContainedIconRadius;
}

export default function ContainedIcon(props: IProps) {
  const { icon, className, gradientColor = "blue", radius = "10" } = props;
  return (
    <div
      className={clsx(
        styles["ContainedIcon"],
        styles[`ContainedIcon_gradient-${gradientColor}`],
        styles[`ContainedIcon_radius-${radius}`],
        className,
      )}
    >
      <Icon
        initialFill
        icon={icon}
        className={styles["ContainedIconInnerIcon"]}
      />
    </div>
  );
}
