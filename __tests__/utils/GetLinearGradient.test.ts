import { describe, it, expect } from "vitest";
import { GetLinearGradient } from "../../src/utils/GetLinearGradient";
import { specColor } from "../../src/config/colors";

describe("GetLinearGradient", () => {
  it("ライトモードで正しいグラデーション文字列を返す", () => {
    const mode = "light";
    const color = "red";

    // specColor から期待される値を計算
    const expectedGradient = specColor[color][mode]
      .map((c) => `rgb(${c.r},${c.g},${c.b})`)
      .join(",");
    const expected = `linear-gradient(to top,${expectedGradient})`;

    // 関数の結果を確認
    const result = GetLinearGradient(mode, color);
    expect(result).toBe(expected);
  });

  it("ダークモードで正しいグラデーション文字列を返す", () => {
    const mode = "dark";
    const color = "blue";

    // specColor から期待される値を計算
    const expectedGradient = specColor[color][mode]
      .map((c) => `rgb(${c.r},${c.g},${c.b})`)
      .join(",");
    const expected = `linear-gradient(to top,${expectedGradient})`;

    // 関数の結果を確認
    const result = GetLinearGradient(mode, color);
    expect(result).toBe(expected);
  });

  it("存在しない色を指定した場合にエラーをスローする", () => {
    const mode = "light";
    const color = "nonexistent";

    // 関数の実行がエラーをスローすることを確認
    expect(() => GetLinearGradient(mode, color)).toThrow();
  });

  it("存在しないモードを指定した場合にエラーをスローする", () => {
    const mode = "nonexistent" as "light" | "dark";
    const color = "red";

    // 関数の実行がエラーをスローすることを確認
    expect(() => GetLinearGradient(mode, color)).toThrow();
  });
});