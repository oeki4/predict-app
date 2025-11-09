import { clsx } from "clsx";
import styles from "./avatar.module.scss";

type AvatarSize = 72;

interface IProps {
  url?: string;
  className?: string;
  size?: AvatarSize;
}

export default function Avatar(props: IProps) {
  const { url, className = "", size = 72 } = props;
  return (
    <div
      className={clsx(
        styles["Avatar"],
        styles[`Avatar-size-${size}`],
        className,
      )}
    >
      <img src={url} alt="avatar" />
    </div>
  );
}
