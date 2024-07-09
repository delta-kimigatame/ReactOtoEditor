import { describe } from "node:test";
import { ParseIni, ReplaceAlias } from "../src/Lib/MakeOtoTempIni";

describe("MakeOtoTempIniのテスト", () => {
  test("ReplaceAlias", () => {
    const ini = ParseIni("[REPLACE]\r\na=あ\r\ni=い");
    expect(ini.replace).toEqual([
      ["a", "あ"],
      ["i", "い"],
    ]);
    expect(ReplaceAlias(ini, "a")).toBe("あ");
    expect(ReplaceAlias(ini, "i")).toBe("い");
    expect(ReplaceAlias(ini, "ai")).toBe("あい");
    expect(ReplaceAlias(ini, "aiu")).toBe("あいu");
  });
});
