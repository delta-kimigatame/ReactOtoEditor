import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { ZipExtract } from "../../src/services/ZipExtract";

describe("ZipExtract", () => {
  it("ZIPからファイルを抽出して新しいZIPに追加する", async () => {
    // ダミーのZIPファイルを作成
    const dummyZip = new JSZip();
    dummyZip.file("file1.txt", "Hello, World!");
    dummyZip.file("file2.txt", "This is a test.");
    dummyZip.file("nested/file3.txt", "Nested file content.");
    console.log(dummyZip.files);
    // 新しいZIPファイルを作成
    const newZip = new JSZip();

    // ZipExtractを実行
    const resultZip = await ZipExtract(dummyZip.files, 0, newZip);

    // 検証: 新しいZIPにファイルが正しく追加されていることを確認
    const file1Content = await resultZip.file("file1.txt")?.async("string");
    const file2Content = await resultZip.file("file2.txt")?.async("string");
    const file3Content = await resultZip.file("nested/file3.txt")?.async("string");

    expect(file1Content).toBe("Hello, World!");
    expect(file2Content).toBe("This is a test.");
    expect(file3Content).toBe("Nested file content.");
  });
});