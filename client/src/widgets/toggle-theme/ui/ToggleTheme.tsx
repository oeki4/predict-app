import { Button, Icon } from "@shared/ui";
import { ThemeContext } from "@app/providers/theme-provider";
import { useContext } from "react";
import MoonIcon from "@shared/assets/svg/moon.svg?react";
import SunIcon from "@shared/assets/svg/sun.svg?react";
import styles from "./toggle-theme.module.scss";

export default function ToggleTheme() {
  const { toggleTheme, darkTheme } = useContext(ThemeContext);
  return (
    <Button className={styles["ToggleThemeButton"]} onClick={toggleTheme}>
      {darkTheme ? (
        <Icon
          className={styles["ToggleThemeIcon"]}
          icon={SunIcon}
          initialFill
        />
      ) : (
        <Icon
          className={styles["ToggleThemeIcon"]}
          icon={MoonIcon}
          initialFill
        />
      )}
    </Button>
  );
}
