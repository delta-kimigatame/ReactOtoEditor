import { describe, it, expect } from "vitest";
import { parseGuideBgmOffset } from "../../src/utils/GuideBgm";

/** 仕様に沿ったサンプル設定ファイル（sec 単位） */
const SAMPLE_SEC = `sec
# No, 時刻, r開始, r停止, ↓キー押, リピート, コメント
   1, 0,\t0, 0, 0, 0, BGM再生
   2, 3,\t1, 0, 0, 0, 録音開始
   3, 4,\t0, 0, 0, 0, 発声はじめ！
   4, 7,\t0, 0, 0, 0, 発声おわり！
   5, 7.5,\t0, 1, 0, 0, 録音停止
   6, 8.0,\t0, 0, 1, 1, 録音を保存し次へ`;

/** msec 単位の設定ファイル */
const SAMPLE_MSEC = `msec
# No, 時刻, r開始, r停止, ↓キー押, リピート, コメント
   1, 0,\t0, 0, 0, 0, BGM再生
   2, 3000,\t1, 0, 0, 0, 録音開始
   3, 4000,\t0, 0, 0, 0, 発声はじめ！
   4, 7000,\t0, 0, 0, 0, 発声おわり！
   5, 7500,\t0, 1, 0, 0, 録音停止
   6, 8000,\t0, 0, 1, 1, 録音を保存し次へ`;

/** 録音開始と発声はじめが同時刻のファイル（オフセット=0） */
const SAMPLE_ZERO_OFFSET = `sec
   1, 0, 1, 0, 0, 0, 録音開始
   2, 0, 0, 0, 0, 0, 発声はじめ`;

/** 発声はじめが録音開始より前（負のオフセット） */
const SAMPLE_NEGATIVE_OFFSET = `sec
   1, 5, 1, 0, 0, 0, 録音開始
   2, 3, 0, 0, 0, 0, 発声はじめ`;

/** CRLF 改行のファイル */
const SAMPLE_CRLF = `sec\r\n# コメント\r\n   1, 0,\t1, 0, 0, 0, 録音開始\r\n   2, 2,\t0, 0, 0, 0, 発声はじめ`;

describe("parseGuideBgmOffset", () => {
  describe("sec単位の設定ファイル", () => {
    it("サンプルファイルのオフセットが1000msになる", () => {
      // 発声はじめ！(4sec) - 録音開始(3sec) = 1sec = 1000ms
      expect(parseGuideBgmOffset(SAMPLE_SEC)).toBe(1000);
    });

    it("オフセットが0msになる場合を正しく返す", () => {
      expect(parseGuideBgmOffset(SAMPLE_ZERO_OFFSET)).toBe(0);
    });

    it("負のオフセットを正しく返す", () => {
      // 発声開始(3sec) - 録音開始(5sec) = -2sec = -2000ms
      expect(parseGuideBgmOffset(SAMPLE_NEGATIVE_OFFSET)).toBe(-2000);
    });
  });

  describe("msec単位の設定ファイル", () => {
    it("サンプルファイルのオフセットが1000msになる", () => {
      // 発声はじめ！(4000msec) - 録音開始(3000msec) = 1000ms
      expect(parseGuideBgmOffset(SAMPLE_MSEC)).toBe(1000);
    });
  });

  describe("改行コードの違い", () => {
    it("CRLFの設定ファイルを正しく解析できる", () => {
      // 発声開始(2sec) - 録音開始(0sec) = 2sec = 2000ms
      expect(parseGuideBgmOffset(SAMPLE_CRLF)).toBe(2000);
    });
  });

  describe("コメント行・空行の無視", () => {
    it("#で始まる行を無視して正しく解析できる", () => {
      const content = `sec
# これはコメント
# もう一つのコメント
   1, 1, 1, 0, 0, 0, 録音開始
   2, 3, 0, 0, 0, 0, 発声はじめ`;
      expect(parseGuideBgmOffset(content)).toBe(2000);
    });

    it("空行を無視して正しく解析できる", () => {
      const content = `sec

   1, 1, 1, 0, 0, 0, 録音開始

   2, 3, 0, 0, 0, 0, 発声はじめ
`;
      expect(parseGuideBgmOffset(content)).toBe(2000);
    });
  });

  describe("エラー処理", () => {
    it("不正な単位を指定した場合にエラーをスローする", () => {
      const content = `sample
   1, 0, 1, 0, 0, 0, 録音開始
   2, 1, 0, 0, 0, 0, 発声はじめ`;
      expect(() => parseGuideBgmOffset(content)).toThrow(
        "不正な単位が指定されています"
      );
    });

    it("録音開始フラグがない場合にエラーをスローする", () => {
      const content = `sec
   1, 0, 0, 0, 0, 0, BGM再生
   2, 1, 0, 0, 0, 0, 発声はじめ`;
      expect(() => parseGuideBgmOffset(content)).toThrow(
        "録音開始フラグ（3列目が1）の行が見つかりません"
      );
    });

    it("発声はじめコメントがない場合にエラーをスローする", () => {
      const content = `sec
   1, 0, 1, 0, 0, 0, 録音開始
   2, 1, 0, 0, 0, 0, 発声なし`;
      expect(() => parseGuideBgmOffset(content)).toThrow(
        '発声開始行（7列目のコメントに"発声はじめ"を含む行）が見つかりません'
      );
    });
  });
});
