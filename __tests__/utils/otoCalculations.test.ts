import { describe, it, expect } from "vitest";
import { Oto } from "utauoto";
import {
  calculateOffsetUpdate,
  calculateOverlapUpdate,
  calculatePreUpdate,
  calculateVelocityUpdate,
  calculateBlankUpdate,
} from "../../src/utils/otoCalculations";
import { oto } from "../../src/config/setting";

describe("otoCalculations", () => {
  describe("calculateOffsetUpdate", () => {
    it("オフセットをクリック位置に更新する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 1, false);
      expect(result.offset).toBe(150);
    });

    it("オフセットを移動しても先行発声の絶対位置を維持する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 1, false);
      // pre の絶対位置は offset + pre = 100 + 80 = 180
      // offset が 150 になった場合、pre は 180 - 150 = 30 になる
      expect(result.pre).toBe(30);
    });

    it("先行発声が最小値0を下回らないようにする", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,10,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 1, false);
      expect(result.pre).toBe(0);
    });

    it("オーバーラップロックがオフの場合はオーバーラップの絶対位置を維持する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 1, false);
      // overlap の絶対位置は offset + overlap = 100 + 30 = 130
      // offset が 150 になった場合、overlap は 130 - 150 = -20 になる
      expect(result.overlap).toBe(-20);
    });

    it("オーバーラップロックがオンの場合はオーバーラップを先行発声の1/3にする", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,90,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 1, true);
      expect(result.overlap).toBe(result.pre / 3);
    });

    it("子音速度が最小値を下回らないようにする", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,5,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 1, false);
      expect(result.velocity).toBeGreaterThanOrEqual(oto.minParams);
    });

    it("オフセットを前方に移動しても子音速度の絶対位置を維持する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 50, 1, false);
      // velocity の絶対位置は offset + velocity = 100 + 50 = 150
      // offset が 50 になった場合、velocity は 150 - 50 = 100 になる
      expect(result.velocity).toBe(100);
    });

    it("右ブランクが負の場合は最小値を強制する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-5,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 1, false);
      expect(result.blank).toBeLessThanOrEqual(-2 * oto.minParams);
    });

    it("右ブランクが正の場合は変更しない", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,200,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 1, false);
      expect(result.blank).toBe(200);
    });

    it("pixelPerMsecが正しく処理される", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 75, 2, false);
      // clickX * pixelPerMsec = 75 * 2 = 150
      expect(result.offset).toBe(150);
    });
  });

  describe("calculateOverlapUpdate", () => {
    it("オーバーラップをクリック位置に更新する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOverlapUpdate(record!, 140, 1);
      // 現在の overlap の絶対位置は 100 + 30 = 130
      // クリック位置は 140
      // 移動距離は 130 - 140 = -10
      // 新しい overlap は 30 - (-10) = 40
      expect(result).toBe(40);
    });

    it("オーバーラップを負の値にできる", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOverlapUpdate(record!, 100, 1);
      // 現在の overlap の絶対位置は 100 + 30 = 130
      // clickX = 100 なので移動距離は 130 - 100 = 30
      // newOverlap = 30 - 30 = 0
      // 負の値にするにはさらに左にクリックする必要がある
      const result2 = calculateOverlapUpdate(record!, 50, 1);
      expect(result2).toBeLessThan(0);
    });

    it("pixelPerMsecが正しく処理される", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOverlapUpdate(record!, 70, 2);
      // clickX * pixelPerMsec = 70 * 2 = 140
      expect(result).toBe(40);
    });
  });

  describe("calculatePreUpdate", () => {
    it("先行発声をクリック位置に合わせてオフセットを更新する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculatePreUpdate(record!, 200, 1);
      // 現在の pre の絶対位置は 100 + 80 = 180
      // クリック位置は 200
      // 移動距離は 180 - 200 = -20
      // 新しい offset は 100 - (-20) = 120
      expect(result).toBe(120);
    });

    it("先行発声より前をクリックした場合はオフセットを後方に移動する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculatePreUpdate(record!, 150, 1);
      // 現在の pre の絶対位置は 100 + 80 = 180
      // クリック位置は 150
      // 移動距離は 180 - 150 = 30
      // 新しい offset は 100 - 30 = 70
      expect(result).toBe(70);
    });

    it("pixelPerMsecが正しく処理される", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculatePreUpdate(record!, 100, 2);
      // clickX * pixelPerMsec = 100 * 2 = 200
      expect(result).toBe(120);
    });
  });

  describe("calculateVelocityUpdate", () => {
    it("子音速度をクリック位置に更新する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateVelocityUpdate(record!, 170, 1);
      // 現在の velocity の絶対位置は 100 + 50 = 150
      // クリック位置は 170
      // 移動距離は 150 - 170 = -20
      // 新しい velocity は 50 - (-20) = 70
      expect(result.velocity).toBe(70);
    });

    it("子音速度が最小値を下回らないようにする", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,10,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateVelocityUpdate(record!, 50, 1);
      expect(result.velocity).toBeGreaterThanOrEqual(oto.minParams);
    });

    it("子音速度の変更に応じて右ブランクを調整し最小伸縮範囲を維持する", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-60,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateVelocityUpdate(record!, 170, 1);
      // 新しい velocity は 70
      // blank の最大値は -oto.minParams - velocity = -0.001 - 70 = -70.001
      expect(result.blank).toBeLessThanOrEqual(-oto.minParams - result.velocity);
    });

    it("右ブランクが既に最小値を満たしている場合は変更しない", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-200,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateVelocityUpdate(record!, 170, 1);
      expect(result.blank).toBe(-200);
    });

    it("pixelPerMsecが正しく処理される", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateVelocityUpdate(record!, 85, 2);
      // clickX * pixelPerMsec = 85 * 2 = 170
      expect(result.velocity).toBe(70);
    });
  });

  describe("calculateBlankUpdate", () => {
    it("右ブランクをクリック位置に更新する（負の値）", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateBlankUpdate(record!, 250, 1);
      // 新しい blank の位置は offset - clickX = 100 - 250 = -150
      expect(result).toBe(-150);
    });

    it("右ブランクが最小伸縮範囲を下回らないようにする", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateBlankUpdate(record!, 90, 1);
      // 新しい blank の位置は offset - clickX = 100 - 90 = 10 (正の値)
      // 最小値は -oto.minParams - velocity = -0.001 - 50 = -50.001
      expect(result).toBeLessThanOrEqual(-oto.minParams - record!.velocity);
    });

    it("右ブランクは常に負の値を返す", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateBlankUpdate(record!, 50, 1);
      expect(result).toBeLessThan(0);
    });

    it("pixelPerMsecが正しく処理される", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateBlankUpdate(record!, 125, 2);
      // clickX * pixelPerMsec = 125 * 2 = 250
      expect(result).toBe(-150);
    });
  });

  describe("edge cases", () => {
    it("pixelPerMsecが0の場合でも正しく処理される（オフセット）", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 150, 0, false);
      // pixelPerMsec が 0 の場合、moveValue は record.offset となる
      expect(result.offset).toBe(0);
    });

    it("非常に小さい子音速度でも正しく処理される", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", `test.wav=あ,100,${oto.minParams},-100,80,30`);
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateVelocityUpdate(record!, 50, 1);
      expect(result.velocity).toBe(oto.minParams);
    });

    it("非常に大きなオフセット移動でも正しく処理される", () => {
      const testOto = new Oto();
      testOto.ParseOto("test", "test.wav=あ,100,50,-100,80,30");
      const record = testOto.GetRecord("test", "test.wav", "あ");
      const result = calculateOffsetUpdate(record!, 10000, 1, false);
      expect(result.offset).toBe(10000);
      expect(result.pre).toBe(0);
      expect(result.velocity).toBeGreaterThanOrEqual(oto.minParams);
    });
  });
});
