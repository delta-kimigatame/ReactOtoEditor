import { COOKIE_KEYS, cookieDefaults } from "../config/cookie";
import { Log } from "../lib/Logging";
import { ColorTheme } from "../types/colorTheme";
import { Language } from "../types/language";
import { Mode } from "../types/mode";
import { useCookie } from "./useCookie";

/**
 * useProjectCookie
 *
 * 本プロジェクトに特化したクッキー管理のカスタムフックです。
 * `useCookie` フックを利用して、プロジェクト固有の設定値（モード、言語、カラーテーマ、ノート設定）を取得・更新します。
 * 取得されるクッキーは、プロジェクト固有のキーを基に保存されます。
 *
 * @returns プロジェクト固有の設定（`mode`, `language`, `colorTheme`, `defaultNote`）と、それらを更新するための関数。
 */
export const useProjectCookie = () => {
  Log.log("cookieの取得", "useProjectCookie");
  const { getStringCookie, setStringCookie, getObjectCookie, setObjectCookie } =
    useCookie();
  /**
   * モード（`light`, `dark`, `system`）を取得します。
   * クッキーが存在しない場合は、デフォルトで `cookieDefaults.mode` を返します。
   */
  const mode = getStringCookie(COOKIE_KEYS.mode, cookieDefaults.mode) as Mode;
  /**
   * 言語（`ja`, `en` など）を取得します。
   * クッキーが存在しない場合は、デフォルトで `cookieDefaults.language` を返します。
   */
  const language = getStringCookie(
    COOKIE_KEYS.language,
    cookieDefaults.language
  ) as Language;
  /**
   * カラーテーマを取得します。
   * クッキーが存在しない場合は、デフォルトで `cookieDefaults.colorTheme` を返します。
   */
  const colorTheme = getStringCookie(
    COOKIE_KEYS.colorTheme,
    cookieDefaults.colorTheme
  ) as ColorTheme;
  /**
   * モードをクッキーに保存します。
   * @param newMode 更新するモード（`light`, `dark`, `system`）
   */
  const setMode = (newMode: Mode) => setStringCookie(COOKIE_KEYS.mode, newMode);
  /**
   * 言語をクッキーに保存します。
   * @param newLanguage 更新する言語（`ja`, `en` など）
   */
  const setLanguage = (newLanguage: Language) =>
    setStringCookie(COOKIE_KEYS.language, newLanguage);
  /**
   * カラーテーマをクッキーに保存します。
   * @param newColorTheme 更新するカラーテーマ
   */
  const setColorTheme = (newColorTheme: ColorTheme) =>
    setStringCookie(COOKIE_KEYS.colorTheme, newColorTheme);

  Log.log(
    `mode:${mode},language:${language},colorTheme:${colorTheme}`,
    "useProjectCookie"
  );
  return {
    mode,
    language,
    colorTheme,
    setMode,
    setLanguage,
    setColorTheme,
  };
};
