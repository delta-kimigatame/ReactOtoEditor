export type BatchProps =
  | { [key: string]: JSZip.JSZipObject }
  | string
  | ("offset" | "overlap" | "preutter" | "velocity" | "blank")
  | null;
import { Oto } from "utauoto";
import JSZip from "jszip";

export interface BatchProcess {
  /** プロセスの説明文。選択メニューに表示 */
  description: string;
  /** 引数として文字列をとるか */
  requireString?: boolean;
  /** 引数として数字をとるか */
  requireNumber?: boolean;
  /** 引数としてtargetをとるか */
  requireTarget?: boolean;
  /** 引数としてzipをとるか */
  requireZip?: boolean;
  /** 処理 */
  endPoint: (
    oto: Oto,
    targetDir: string,
    param?:
      | { [key: string]: JSZip.JSZipObject }
      | string
      | ("offset" | "overlap" | "preutter" | "velocity" | "blank"),
    value?: number
  ) => void;
}
