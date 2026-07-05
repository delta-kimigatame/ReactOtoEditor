/**
 * UTAU エイリアスをパースして音素情報を抽出
 * Python interface.py に相当する TypeScript 実装
 */

const CONTEXTS = ["sil", "a", "i", "u", "e", "o", "n", "none"];
const CONSONANTS = [
  "",
  "k",
  "ky",
  "kw",
  "g",
  "gy",
  "gw",
  "s",
  "sh",
  "z",
  "j",
  "t",
  "ch",
  "ts",
  "d",
  "n",
  "ny",
  "h",
  "hy",
  "f",
  "b",
  "by",
  "p",
  "py",
  "m",
  "my",
  "r",
  "ry",
  "w",
  "y",
  "none",
];
const VOWELS = ["a", "e", "i", "o", "u", "n", "none"];

const KANA_MAP: Record<string, [string, string]> = {
  // 5音
  あ: ["", "a"],
  い: ["", "i"],
  う: ["", "u"],
  え: ["", "e"],
  お: ["", "o"],
  ん: ["", "n"],
  // か行
  か: ["k", "a"],
  き: ["k", "i"],
  く: ["k", "u"],
  け: ["k", "e"],
  こ: ["k", "o"],
  きゃ: ["ky", "a"],
  きゅ: ["ky", "u"],
  きぇ: ["ky", "e"],
  きょ: ["ky", "o"],
  くぁ: ["kw", "a"],
  くぃ: ["kw", "i"],
  くぇ: ["kw", "e"],
  くぉ: ["kw", "o"],
  // さ行
  さ: ["s", "a"],
  すぃ: ["s", "i"],
  す: ["s", "u"],
  せ: ["s", "e"],
  そ: ["s", "o"],
  しゃ: ["sh", "a"],
  し: ["sh", "i"],
  しゅ: ["sh", "u"],
  しぇ: ["sh", "e"],
  しょ: ["sh", "o"],
  // た行
  た: ["t", "a"],
  てぃ: ["t", "i"],
  とぅ: ["t", "u"],
  て: ["t", "e"],
  と: ["t", "o"],
  ちゃ: ["ch", "a"],
  ち: ["ch", "i"],
  ちゅ: ["ch", "u"],
  ちぇ: ["ch", "e"],
  ちょ: ["ch", "o"],
  つぁ: ["ts", "a"],
  つぃ: ["ts", "i"],
  つ: ["ts", "u"],
  つぇ: ["ts", "e"],
  つぉ: ["ts", "o"],
  // な行
  な: ["n", "a"],
  に: ["n", "i"],
  ぬ: ["n", "u"],
  ね: ["n", "e"],
  の: ["n", "o"],
  にゃ: ["ny", "a"],
  にゅ: ["ny", "u"],
  にぇ: ["ny", "e"],
  にょ: ["ny", "o"],
  // は行
  は: ["h", "a"],
  ひ: ["h", "i"],
  へ: ["h", "e"],
  ほ: ["h", "o"],
  ひゃ: ["hy", "a"],
  ひゅ: ["hy", "u"],
  ひぇ: ["hy", "e"],
  ひょ: ["hy", "o"],
  ふぁ: ["f", "a"],
  ふぃ: ["f", "i"],
  ふ: ["f", "u"],
  ふぇ: ["f", "e"],
  ふぉ: ["f", "o"],
  // ま行
  ま: ["m", "a"],
  み: ["m", "i"],
  む: ["m", "u"],
  め: ["m", "e"],
  も: ["m", "o"],
  みゃ: ["my", "a"],
  みゅ: ["my", "u"],
  みぇ: ["my", "e"],
  みょ: ["my", "o"],
  // や行
  や: ["y", "a"],
  ゆ: ["y", "u"],
  いぇ: ["y", "e"],
  よ: ["y", "o"],
  // ら行
  ら: ["r", "a"],
  り: ["r", "i"],
  る: ["r", "u"],
  れ: ["r", "e"],
  ろ: ["r", "o"],
  りゃ: ["ry", "a"],
  りゅ: ["ry", "u"],
  りぇ: ["ry", "e"],
  りょ: ["ry", "o"],
  // わ行
  わ: ["w", "a"],
  うぃ: ["w", "i"],
  うぇ: ["w", "e"],
  を: ["w", "o"],
  // が行
  が: ["g", "a"],
  ぎ: ["g", "i"],
  ぐ: ["g", "u"],
  げ: ["g", "e"],
  ご: ["g", "o"],
  ぎゃ: ["gy", "a"],
  ぎゅ: ["gy", "u"],
  ぎぇ: ["gy", "e"],
  ぎょ: ["gy", "o"],
  ぐぁ: ["gw", "a"],
  ぐぃ: ["gw", "i"],
  ぐぇ: ["gw", "e"],
  ぐぉ: ["gw", "o"],
  // ざ行 / じゃ行
  ざ: ["z", "a"],
  ずぃ: ["z", "i"],
  ず: ["z", "u"],
  ぜ: ["z", "e"],
  ぞ: ["z", "o"],
  じゃ: ["j", "a"],
  じ: ["j", "i"],
  じゅ: ["j", "u"],
  じぇ: ["j", "e"],
  じょ: ["j", "o"],
  // だ行
  だ: ["d", "a"],
  でぃ: ["d", "i"],
  どぅ: ["d", "u"],
  づ: ["z", "u"],
  で: ["d", "e"],
  ど: ["d", "o"],
  // ば行
  ば: ["b", "a"],
  び: ["b", "i"],
  ぶ: ["b", "u"],
  べ: ["b", "e"],
  ぼ: ["b", "o"],
  びゃ: ["by", "a"],
  びゅ: ["by", "u"],
  びぇ: ["by", "e"],
  びょ: ["by", "o"],
  // ぱ行
  ぱ: ["p", "a"],
  ぴ: ["p", "i"],
  ぷ: ["p", "u"],
  ぺ: ["p", "e"],
  ぽ: ["p", "o"],
  ぴゃ: ["py", "a"],
  ぴゅ: ["py", "u"],
  ぴぇ: ["py", "e"],
  ぴょ: ["py", "o"],
};

export const TOTAL_COND_DIM = CONTEXTS.length + CONSONANTS.length + VOWELS.length;

/**
 * UTAU エイリアスをパースして音素を抽出
 * @param alias UTAU エイリアス（例："デ A3" or "デ")
 * @returns [context, consonant, vowel] または null
 */
export function parseAliasToPhonemes(
  alias: string
): [string, string, string] | null {
  if (!alias) return null;

  // 先行音を抽出
  let pre = "sil";
  let mainAlias = alias;

  if (alias.includes(" ")) {
    const [p, ...rest] = alias.split(" ");
    if (p === "-") {
      pre = "sil";
    } else if (p === "*") {
      return null; // 母音結合用音素はスキップ
    } else {
      pre = p;
    }
    mainAlias = rest.join(" ");
  }

  // 平仮名のみを抽出
  mainAlias = mainAlias.replace(/[^\u3041-\u3096]/g, "");

  // カナマップでルックアップ
  if (mainAlias in KANA_MAP) {
    const [consonant, vowel] = KANA_MAP[mainAlias as keyof typeof KANA_MAP];
    return [pre, consonant, vowel];
  }

  return null;
}

/**
 * 音素をOne-Hot条件ベクトルに変換
 * @param context 先行音（例："sil", "a")
 * @param consonant 子音（例："", "k", "sh")
 * @param vowel 母音（例："a", "i")
 * @returns [TOTAL_COND_DIM] の Float32Array
 */
export function phonemesToConditionVector(
  context: string,
  consonant: string,
  vowel: string
): Float32Array {
  const condition = new Float32Array(TOTAL_COND_DIM);

  const ctxIdx = CONTEXTS.indexOf(context);
  const consIdx = CONSONANTS.indexOf(consonant);
  const vowlIdx = VOWELS.indexOf(vowel);

  // One-Hotエンコーディング
  if (ctxIdx >= 0) {
    condition[ctxIdx] = 1.0;
  }
  if (consIdx >= 0) {
    condition[CONTEXTS.length + consIdx] = 1.0;
  }
  if (vowlIdx >= 0) {
    condition[CONTEXTS.length + CONSONANTS.length + vowlIdx] = 1.0;
  }

  return condition;
}

/**
 * デバッグ用：条件ベクトルを人間が読める形式に変換
 */
export function conditionVectorToString(cond: Float32Array): string {
  const context = CONTEXTS[cond.indexOf(1)] || "unknown";
  const consonantly = CONSONANTS[cond.slice(CONTEXTS.length).indexOf(1)] || "none";
  const vowel = VOWELS[cond.slice(CONTEXTS.length + CONSONANTS.length).indexOf(1)] || "unknown";
  return `[${context}, ${consonantly}, ${vowel}]`;
}
