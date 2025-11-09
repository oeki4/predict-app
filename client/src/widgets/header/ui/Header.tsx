import { useState } from "react";
import styles from "./header.module.scss";
import { clsx } from "clsx";
import { ToggleTheme } from "@widgets/toggle-theme";
import { Text } from "@shared/ui";
import { ToggleLanguage } from "@widgets/toggle-language";

export default function Header() {
  const [safeAreaInsetTop] = useState(
    window.Telegram.WebApp.contentSafeAreaInset.top +
      window.Telegram.WebApp.safeAreaInset.top,
  );

  return (
    <header
      className={clsx(styles["Header"])}
      style={{
        paddingTop: safeAreaInsetTop,
      }}
    >
      <div className={clsx(styles["HeaderInner"])}>
        <Text
          className={styles["HeaderLogo"]}
          weight={500}
          color="white"
          size={16}
        >
          ⚡ EcoChain
        </Text>
        <div className={clsx(styles["HeaderButtons"])}>
          <ToggleLanguage />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
