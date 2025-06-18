
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
class Logging {
  datas: Array<string>;
  constructor() {
    this.datas = new Array();
  }
  log(value: string, source: string) {
    this.datas.push(new Date().toJSON() + "\t" + source + "\t" + value);
  }
  gtag = (
    eventName: string,
    eventParams?: {
      [key: string]: string | number | boolean;
    }
  ) => {
    /** nodeなどwindowがundefinedの場合何もせず返す */
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    if (hostname === "localhost" || /^[0-9.]+$/.test(hostname)) {
      /** 開発環境ではgtagは送付せず、gtagに送付される予定の内容を記録する */
      Log.log(
        `eventName:${eventName}, eventParams:${JSON.stringify(eventParams)}`,
        "Logging.gtag"
      );
    } else if (typeof window.gtag === "function") {
      /** 本番環境 */
      window.gtag("event", eventName, eventParams);
    } else {
      /** storybookはここに来るはず */
      Log.log(
        `eventName:${eventName}, eventParams:${JSON.stringify(eventParams)}`,
        "Logging.gtag"
      );
    }
  };
}

export const Log = new Logging();
