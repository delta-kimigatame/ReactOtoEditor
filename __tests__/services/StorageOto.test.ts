import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetStorageOto, SaveStorageOto } from "../../src/services/StorageOto";
import { Oto } from "utauoto";

describe("StorageOto", () => {
  beforeEach(() => {
    // localStorage をモック化
    Object.defineProperty(global, "localStorage", {
      value: (() => {
        let store: Record<string, string> = {};
        return {
          getItem: (key: string) => store[key] || null,
          setItem: (key: string, value: string) => {
            store[key] = value;
          },
          removeItem: (key: string) => {
            delete store[key];
          },
          clear: () => {
            store = {};
          },
        };
      })(),
      writable: true,
    });

    // localStorage をクリア
    localStorage.clear();
  });

  it("GetStorageOto: localStorage にデータが存在しない場合、空のオブジェクトを返す", () => {
    const result = GetStorageOto();
    expect(result).toEqual({});
  });

  it("GetStorageOto: localStorage にデータが存在する場合、正しいデータを返す", () => {
    const mockData = {
      testZip: {
        testDir: {
          oto: "line1\r\nline2",
          update_date: "2025-01-01T00:00:00.000Z",
        },
      },
    };
    localStorage.setItem("oto", JSON.stringify(mockData));

    const result = GetStorageOto();
    expect(result).toEqual(mockData);
  });

  it("SaveStorageOto: localStorage に新しいデータを保存する", () => {
    const mockOto = {
      GetLines: vi.fn().mockReturnValue({
        testDir: ["line1", "line2"],
      }),
    } as unknown as Oto;

    const storagedOto = {};
    SaveStorageOto(storagedOto, mockOto, "testZip", "testDir");

    const savedData = JSON.parse(localStorage.getItem("oto") || "{}");
    expect(savedData).toHaveProperty("testZip");
    expect(savedData.testZip).toHaveProperty("testDir");
    expect(savedData.testZip.testDir.oto).toBe("line1\r\nline2");
    expect(savedData.testZip.testDir).toHaveProperty("update_date");
  });

  it("SaveStorageOto: localStorage の容量不足時にエラーメッセージを出力する", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("QuotaExceededError", "QuotaExceededError");
    });

    const mockOto = {
      GetLines: vi.fn().mockReturnValue({
        testDir: ["line1", "line2"],
      }),
    } as unknown as Oto;

    const storagedOto = {};
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    SaveStorageOto(storagedOto, mockOto, "testZip", "testDir");

    expect(consoleSpy).toHaveBeenCalledWith("localStorageの容量が不足しています。");

    consoleSpy.mockRestore();
  });

  it("SaveStorageOto: 未知のエラーが発生した場合にエラーメッセージを出力する", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("Unknown error");
    });

    const mockOto = {
      GetLines: vi.fn().mockReturnValue({
        testDir: ["line1", "line2"],
      }),
    } as unknown as Oto;

    const storagedOto = {};
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    SaveStorageOto(storagedOto, mockOto, "testZip", "testDir");

    expect(consoleSpy).toHaveBeenCalledWith(
      "未知のエラーでlocalStorageに書き込みできませんでした。"
    );

    consoleSpy.mockRestore();
  });
});