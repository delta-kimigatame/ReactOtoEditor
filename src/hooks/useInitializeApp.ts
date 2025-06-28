import React from "react";
import { Log } from "../lib/Logging";
import { useInitializeCookieStore } from "../store/cookieStore";
declare const __BUILD_TIMESTAMP__: string;

/**
 * Appsを初期化する際に実行するカスタムフック
 */
export const useInitializeApp = (): void => {
  const initialized = React.useRef(false);
  if (!initialized.current) {
    Log.log("アプリケーションの初期化", "useInitializeApp");
    Log.log(`build: ${__BUILD_TIMESTAMP__}`, "useInitializeApp");
    Log.log(window.navigator.userAgent, "useInitializeApp");
    Log.log(
      "画面サイズ:" + [window.innerWidth, window.innerHeight],
      "useInitializeApp"
    );
    initialized.current = true;
  }
  useInitializeCookieStore();
};
