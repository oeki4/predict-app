import { type FC, type SVGProps } from "react";

import clsx from "clsx";

import styles from "./Icon.module.scss";

interface IProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  className?: string;
  initialStroke?: boolean;
  initialFill?: boolean;
}

export default function Icon(props: IProps) {
  const {
    icon: SvgIcon,
    className = "",
    initialStroke = false,
    initialFill = false,
  } = props;

  return (
    <span
      className={clsx(
        styles["Icon"],
        {
          [styles["IconRepaintStroke"]]: !initialStroke,
          [styles["IconRepaintFill"]]: !initialFill,
        },
        className,
      )}
    >
      <SvgIcon />
    </span>
  );
}
