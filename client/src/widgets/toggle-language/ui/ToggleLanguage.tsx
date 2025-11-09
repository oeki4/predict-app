import { Button } from "@shared/ui";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@shared/ui";
import styles from "./toggle-language.module.scss";

export default function ToggleLanguage() {
  const { i18n } = useTranslation();
  const toggleLanguage = useCallback(() => {
    if (i18n.language === "en") {
      i18n.changeLanguage("ru");
    } else {
      i18n.changeLanguage("en");
    }
  }, []);
  return (
    <Button className={styles["ToggleLanguageButton"]} onClick={toggleLanguage}>
      <Text className={styles["ToggleLanguageButtonText"]} weight={500}>
        {i18n.language === "ru" ? "EN" : "RU"}
      </Text>
    </Button>
  );
}
