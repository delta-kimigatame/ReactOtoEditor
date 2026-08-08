import { describe, expect, it } from "vitest";
import * as iconv from "iconv-lite";

import {
  decodePlainText,
  encodeCp932,
  toCrLf,
} from "../../src/ste/textEncoding";

describe("textEncoding", () => {
  it("CP932 のテキストをデコードする", () => {
    const source = "原音設定";

    expect(decodePlainText(iconv.encode(source, "CP932"), "cp932")).toBe(
      source
    );
  });

  it("UTF-8 のテキストをデコードする", () => {
    const source = "UTF-8 の内容";
    const bytes = new TextEncoder().encode(source);

    expect(decodePlainText(bytes, "utf-8")).toBe(source);
  });

  it("すべての改行を CRLF にする", () => {
    expect(toCrLf("first\nsecond\rthird\r\nfourth")).toBe(
      "first\r\nsecond\r\nthird\r\nfourth"
    );
  });

  it("CP932 でエンコードする前に改行を CRLF にする", () => {
    const bytes = encodeCp932("一行目\n二行目");

    expect(iconv.decode(Buffer.from(bytes), "CP932")).toBe(
      "一行目\r\n二行目"
    );
  });
});