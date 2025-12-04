import { ColorTheme } from "../types/colorTheme";
import { Language, languages } from "../types/language";
import { Mode } from "../types/mode";

export const COOKIE_KEYS = {
  mode: "laberuMode",
  language: "laberuLanguage",
  colorTheme: "laberuColorTheme",
  overlapLock: "laberuOverlapLock",
  touchMode: "laberuTouchMode",
} as const;

const determineDefaultLocale = (): Language => {
  const userLangs: string[] =
    navigator.languages && navigator.languages.length > 0
      ? [...navigator.languages]
      : [navigator.language || ""];

  const filtered = userLangs
    .map((lang) => lang.slice(0, 2))
    .filter((code) => languages.includes(code as Language)) as Language[];

  if (filtered.length > 0) {
    return filtered[0];
  }

  return "en";
};

export type CookieKey = keyof typeof COOKIE_KEYS;
/**
 * cookieDefaults
 *
 * アプリケーションで使用する初期設定のデフォルト値を定義します。
 *
 */
export const cookieDefaults: {
  /**
   * アプリケーションの表示モード。`light`（ライトモード）または`dark`（ダークモード）、`system`（システム設定による自動選択）のいずれかを選択します。
   */
  mode: Mode;
  /**
   * 現在選択されている言語。デフォルトは日本語（`ja`）
   */
  language: Language;
  /**
   * アプリケーションのカラーテーマ。デフォルトは`default`
   */
  colorTheme: ColorTheme;

  overlapLock: boolean;
  touchMode: boolean;
} = {
  mode: "system",
  language: determineDefaultLocale(),
  colorTheme: "gray",
  overlapLock: false,
  touchMode: false,
};
