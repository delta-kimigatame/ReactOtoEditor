import { describe, it, expect } from "vitest";
import { GetColor, GetColorInterp, GetColorInterpParam, Color } from "../../src/utils/Color";

describe("Color Utility Functions", () => {
  describe("GetColor", () => {
    it("RGB値を正しく文字列に変換する", () => {
      const color: Color = { r: 255, g: 128, b: 64 };
      const result = GetColor(color);
      expect(result).toBe("rgb(255,128,64)");
    });

    it("RGB値が全て0の場合、正しい文字列を返す", () => {
      const color: Color = { r: 0, g: 0, b: 0 };
      const result = GetColor(color);
      expect(result).toBe("rgb(0,0,0)");
    });
  });

  describe("GetColorInterp", () => {
    const colors: Array<Color> = [
      { r: 255, g: 0, b: 0 }, // 赤
      { r: 0, g: 255, b: 0 }, // 緑
      { r: 0, g: 0, b: 255 }, // 青
    ];

    it("ratioが0の場合、最初の色を返す", () => {
      const result = GetColorInterp(0, colors);
      expect(result).toBe("rgb(255,0,0)");
    });

    it("ratioが1の場合、最後の色を返す", () => {
      const result = GetColorInterp(1, colors);
      expect(result).toBe("rgb(0,0,255)");
    });

    it("ratioが0.5の場合、中間の色を返す", () => {
      const result = GetColorInterp(0.5, colors);
      expect(result).toBe("rgb(0,255,0)");
    });

    it("ratioが0.25の場合、最初の色と中間の色を線形補間する", () => {
      const result = GetColorInterp(0.25, colors);
      expect(result).toBe("rgb(128,128,0)");
    });

    it("ratioが0.75の場合、中間の色と最後の色を線形補間する", () => {
      const result = GetColorInterp(0.75, colors);
      expect(result).toBe("rgb(0,128,128)");
    });

    it("ratioがNaNの場合、最初の色を返す", () => {
      const result = GetColorInterp(NaN, colors);
      expect(result).toBe("rgb(255,0,0)");
    });
  });

  describe("GetColorInterpParam", () => {
    const colors: Array<Color> = [
      { r: 255, g: 0, b: 0 }, // 赤
      { r: 0, g: 255, b: 0 }, // 緑
      { r: 0, g: 0, b: 255 }, // 青
    ];

    it("ratioが0の場合、最初の色を返す", () => {
      const result = GetColorInterpParam(0, colors);
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    it("ratioが1の場合、最後の色を返す", () => {
      const result = GetColorInterpParam(1, colors);
      expect(result).toEqual({ r: 0, g: 0, b: 255 });
    });

    it("ratioが0.5の場合、中間の色を返す", () => {
      const result = GetColorInterpParam(0.5, colors);
      expect(result).toEqual({ r: 0, g: 255, b: 0 });
    });

    it("ratioが0.25の場合、最初の色と中間の色を線形補間する", () => {
      const result = GetColorInterpParam(0.25, colors);
      expect(result).toEqual({ r: 128, g: 128, b: 0 });
    });

    it("ratioが0.75の場合、中間の色と最後の色を線形補間する", () => {
      const result = GetColorInterpParam(0.75, colors);
      expect(result).toEqual({ r: 0, g: 128, b: 128 });
    });

    it("ratioがNaNの場合、最初の色を返す", () => {
      const result = GetColorInterpParam(NaN, colors);
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });
  });
});