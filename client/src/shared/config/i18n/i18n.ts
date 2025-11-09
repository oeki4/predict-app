import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import en from "@public/locales/en/translation.json";
import ru from "@public/locales/ru/translation.json";

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "ru",
  debug: true,
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
