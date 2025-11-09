import styles from "./button-back.module.scss";
import { Icon, Text } from "@shared/ui";
import ArrowLeftIcon from "@shared/assets/svg/arrow-left.svg?react";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function ButtonBack(props: IProps) {
  const { className, ...otherProps } = props;
  return (
    <button className={clsx(styles["ButtonBack"], className)} {...otherProps}>
      <Icon
        initialFill
        className={styles["ButtonBackIcon"]}
        icon={ArrowLeftIcon}
      />
      <Text size={12}>Назад</Text>
    </button>
  );
}
