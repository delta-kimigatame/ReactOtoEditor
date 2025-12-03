import React from "react";
import { create } from "zustand";
import { cookieDefaults } from "../config/cookie";
import { useProjectCookie } from "../services/useProjectCookie";
import { ColorTheme } from "../types/colorTheme";
import { Language } from "../types/language";
import { Mode } from "../types/mode";

/**
 * CookieStore
 *
 * アプリケーションの設定を管理する状態を格納するためのインターフェースです。
 * 各項目はcookieから取得したデフォルト値を初期値として保持し、
 * アプリ内での設定変更を反映するために利用されます。
 */
interface CookieStore {
  /**
   * 表示モードの設定。`light`（ライトモード）、`dark`（ダークモード）、または`system`（システム設定による選択）のいずれか。
   */
  mode: Mode;

  /**
   * 言語設定。アプリケーションが使用する言語コードを格納します。
   */
  language: Language;

  /**
   * アプリケーションのカラーテーマ。テーマの設定に基づいてUIが調整されます。
   */
  colorTheme: ColorTheme;

  overlapLock: boolean;

  touchMode: boolean;

  /**
   * 表示モードを更新する関数。モードを変更するために使用されます。
   *
   * @param mode 新しい表示モード。`light`、`dark`、`system` のいずれか。
   */
  setMode: (mode: Mode) => void;

  /**
   * 言語設定を更新する関数。選択されている言語を変更します。
   *
   * @param language 新しい言語コード。
   */
  setLanguage: (language: Language) => void;

  /**
   * カラーテーマを更新する関数。選択されているカラーテーマを変更します。
   *
   * @param colorTheme 新しいカラーテーマ。
   */
  setColorTheme: (colorTheme: ColorTheme) => void;

  setOverlapLock: (overlapLock: boolean) => void;

  setTouchMode: (touchMode: boolean) => void;

  /**
   * cookieに表示モードを保存する関数。
   *
   * @param mode 新しい表示モード。
   */
  setModeInCookie: (mode: Mode) => void;

  /**
   * cookieに言語設定を保存する関数。
   *
   * @param language 新しい言語コード。
   */
  setLanguageInCookie: (language: Language) => void;

  /**
   * cookieにカラーテーマを保存する関数。
   *
   * @param colorTheme 新しいカラーテーマ。
   */
  setColorThemeInCookie: (colorTheme: ColorTheme) => void;

  setOverlapLockInCookie: (overlapLock: boolean) => void;

  setTouchModeInCookie: (touchMode: boolean) => void;

  /**
   * 初期化フラグ。状態が初期化されているかどうかを示します。
   */
  isInitialized: boolean;
}

/**
 * useCookieStore
 *
 * Zustandのストアを使用して、アプリケーションの設定を管理します。
 * このストアは、表示モード、言語、カラーテーマ、ノート設定の変更を追跡し、
 * 各コンポーネントで必要に応じて状態を更新します。
 */
export const useCookieStore = create<CookieStore>((set) => {
  return {
    mode: cookieDefaults.mode,
    language: cookieDefaults.language,
    colorTheme: cookieDefaults.colorTheme,
    overlapLock: cookieDefaults.overlapLock,
    touchMode: cookieDefaults.touchMode,
    // 状態更新関数
    setMode: (newMode) =>
      set((state) => {
        state.setModeInCookie(newMode); // Cookie に保存
        return { mode: newMode };
      }),

    setLanguage: (newLanguage) =>
      set((state) => {
        state.setLanguageInCookie(newLanguage);
        return { language: newLanguage };
      }),

    setColorTheme: (newColorTheme) =>
      set((state) => {
        state.setColorThemeInCookie(newColorTheme);
        return { colorTheme: newColorTheme };
      }),

    setOverlapLock: (overlapLock) =>
      set((state) => {
        state.setOverlapLockInCookie(overlapLock);
        return { overlapLock };
      }),
    setTouchMode: (touchMode) =>
      set((state) => {
        state.setTouchModeInCookie(touchMode);
        return { touchMode };
      }),

    // 初期状態ではダミー関数を設定
    setModeInCookie: () => {},
    setLanguageInCookie: () => {},
    setColorThemeInCookie: () => {},
    setOverlapLockInCookie: () => {},
    setTouchModeInCookie: () => {},
    isInitialized: false,
  };
});
export const useInitializeCookieStore = () => {
  const projectCookie = useProjectCookie();

  React.useEffect(() => {
    if (!projectCookie || useCookieStore.getState().isInitialized) return;

    useCookieStore.setState({
      mode: projectCookie.mode,
      language: projectCookie.language,
      colorTheme: projectCookie.colorTheme,
      overlapLock: projectCookie.overlapLock,
      touchMode: projectCookie.touchMode,
      setModeInCookie: projectCookie.setMode,
      setLanguageInCookie: projectCookie.setLanguage,
      setColorThemeInCookie: projectCookie.setColorTheme,
      setOverlapLockInCookie: projectCookie.setOverlapLock,
      setTouchModeInCookie: projectCookie.setTouchMode,
      isInitialized: true,
    });
  }, [projectCookie]);
};
