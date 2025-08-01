import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translation_ja from "./ja.json";
import translation_en from "./en.json";
import translation_zh from "./zh.json";

const resources= {
  ja: {
    translation: translation_ja,
  },
  en: {
    translation: translation_en,
  },
  zh: {
    translation: translation_zh,
  },
};

i18n
  .use(initReactI18next)
  .init({ resources, lng: "ja",fallbackLng: "en", interpolation: { escapeValue: false } });

export default i18n;
