import { useLoaderStore } from "@shared/stores";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import styles from "./global-loader.module.scss";
import { Icon } from "@shared/ui";
import LoaderIcon from "@shared/assets/svg/loader.svg?react";

export default function GlobalLoader() {
  const { isLoading } = useLoaderStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);
  return (
    <div
      className={clsx(
        styles["GlobalLoader"],
        isLoading && styles["active"],
        visible && styles["visible"],
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        {/*<div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />*/}
        {/*<span className="text-white text-sm font-medium">Загрузка...</span>*/}
        <Icon className={clsx(styles["GlobalLoaderIcon"])} icon={LoaderIcon} />
      </div>
    </div>
  );
}
