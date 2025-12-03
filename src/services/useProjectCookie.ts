import { COOKIE_KEYS, cookieDefaults } from "../config/cookie";
import { LOG } from "../lib/Logging";
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
  LOG.debug("cookieの取得", "useProjectCookie");
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

  const overlapLock = getStringCookie(
    COOKIE_KEYS.overlapLock,
    cookieDefaults.overlapLock.toString()
  ) as unknown as boolean;

  const touchMode = getStringCookie(
    COOKIE_KEYS.touchMode,
    cookieDefaults.touchMode.toString()
  ) as unknown as boolean;
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

  const setOverlapLock = (overlapLock: boolean) =>
    setStringCookie(COOKIE_KEYS.overlapLock, overlapLock.toString());

  const setTouchMode = (touchMode: boolean) =>
    setStringCookie(COOKIE_KEYS.touchMode, touchMode.toString());

  LOG.debug(
    `mode:${mode},language:${language},colorTheme:${colorTheme},overlapLock:${overlapLock},touchMode:${touchMode}`,
    "useProjectCookie"
  );
  return {
    mode,
    language,
    colorTheme,
    overlapLock,
    touchMode,
    setMode,
    setLanguage,
    setColorTheme,
    setOverlapLock,
    setTouchMode,
  };
};
