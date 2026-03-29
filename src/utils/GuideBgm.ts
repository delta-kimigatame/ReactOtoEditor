/**
 * guideBGMの設定ファイルを解析してオフセット値を取得するユーティリティ
 */

/** 設定ファイルの時刻単位 */
type GuideBgmUnit = "sec" | "msec";

/**
 * 1行目の単位文字列をパースする
 * @param line 1行目の文字列
 * @returns 単位 ("sec" | "msec")
 * @throws 不正な単位が指定された場合
 */
const parseUnit = (line: string): GuideBgmUnit => {
  const trimmed = line.trim().toLowerCase();
  if (trimmed === "sec") return "sec";
  if (trimmed === "msec") return "msec";
  throw new Error(`不正な単位が指定されています: "${line.trim()}"`);
};

/**
 * guideBGMの設定ファイルを解析し、オフセット値をmsで返す。
 *
 * オフセット値は「7列目のコメントに"発声はじめ"を含む行の時刻」-「録音開始フラグ（3列目が1）の行の時刻」で求める。
 *
 * @param fileContent 設定ファイルの文字列全体
 * @returns オフセット値（ms単位のNumber）
 * @throws 録音開始フラグが見つからない場合、または"発声はじめ"コメントを含む行が見つからない場合
 * @throws 1行目の単位が不正な場合
 */
export const parseGuideBgmOffset = (fileContent: string): number => {
  const lines = fileContent.split(/\r?\n/);

  if (lines.length === 0) {
    throw new Error("ファイルが空です");
  }

  // 1行目から単位を取得
  const unit = parseUnit(lines[0]);

  let recordingStartTime: number | null = null;
  let voiceStartTime: number | null = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // 空行・コメント行を無視
    if (line === "" || line.startsWith("#")) continue;

    // 空白・タブをすべて除去してからCSVをパース
    const cleanLine = line.replace(/[ \t]/g, "");
    const values = cleanLine.split(",");

    // 値が7列未満の行は無視
    if (values.length < 7) continue;

    const time = parseFloat(values[1]);

    // parseFloat が失敗した場合は無視
    if (isNaN(time)) continue;

    const recordingFlag = parseInt(values[2], 10);
    const comment = values[6];

    if (recordingFlag === 1) {
      recordingStartTime = time;
    }

    if (comment.includes("発声はじめ")) {
      voiceStartTime = time;
    }
  }

  if (recordingStartTime === null) {
    throw new Error("録音開始フラグ（3列目が1）の行が見つかりません");
  }
  if (voiceStartTime === null) {
    throw new Error('発声開始行（7列目のコメントに"発声はじめ"を含む行）が見つかりません');
  }

  const diff = voiceStartTime - recordingStartTime;

  return unit === "sec" ? diff * 1000 : diff;
};
