import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import * as iconv from "iconv-lite";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SteApp } from "../../src/ste/SteApp";
import { copyToArrayBuffer } from "../../src/ste/textEncoding";

const createTextFile = (bytes: Uint8Array, name: string): File => {
  const file = new File([copyToArrayBuffer(bytes)], name, { type: "text/plain" });
  Object.defineProperty(file, "arrayBuffer", {
    value: async () =>
      bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  });
  return file;
};

describe("SteApp", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    URL.revokeObjectURL = vi.fn();
  });

  it("初期状態で文字のない Fab を三つ表示する", () => {
    render(<SteApp />);

    const buttons = screen.getAllByRole("button");
    const fileInput = document.querySelector('input[type="file"]');
    expect(buttons).toHaveLength(3);
    expect(buttons.every((button) => button.textContent === "")).toBe(true);
    expect(fileInput?.getAttribute("accept")).toBe("text/plain");
  });

  it("CP932 を既定としてファイルを読み込む", async () => {
    render(<SteApp />);
    const file = createTextFile(iconv.encode("原音設定", "CP932"), "oto.ini");
    const fileInput = document.querySelector('input[type="file"]')!;

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(
        "原音設定"
      );
    });
  });

  it("再読込で UTF-8 と CP932 を切り替える", async () => {
    render(<SteApp />);
    const source = "再読込";
    const file = createTextFile(iconv.encode(source, "CP932"), "oto.ini");
    const fileInput = document.querySelector('input[type="file"]')!;

    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(
        source
      );
    });

    fireEvent.click(screen.getAllByRole("button")[1]);
    await waitFor(() => {
      expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).not.toBe(
        source
      );
    });

    fireEvent.click(screen.getAllByRole("button")[1]);
    await waitFor(() => {
      expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(
        source
      );
    });
  });

  it("元のファイル名でダウンロードする", async () => {
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:ste");
    let downloadedFileName = "";
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloadedFileName = this.download;
      });
    render(<SteApp />);
    const file = createTextFile(new TextEncoder().encode("text"), "input.ini");
    const fileInput = document.querySelector('input[type="file"]')!;

    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe(
        "text"
      );
    });
    fireEvent.click(screen.getAllByRole("button")[2]);

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:ste");
    expect(downloadedFileName).toBe("input.ini");
  });
});