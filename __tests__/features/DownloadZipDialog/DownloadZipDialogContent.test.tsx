import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DownloadZipDialogContent } from "../../../src/features/DownloadZipDialog/DownloadZipDialogContent";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { JSZipObject } from "jszip";

describe("DownloadZipDialogContent", () => {
  let mockSetTargetList: React.Dispatch<
    React.SetStateAction<Array<number> | null>
  >;

  beforeEach(() => {
    // ストアの初期化
    const store = useOtoProjectStore.getState();
    store.readZip = {
      "dir1/oto.ini": {} as JSZipObject,
      "dir2/oto.ini": {} as JSZipObject,
    };
    store.targetDirs = ["dir1", "dir2", "dir3"];
    store.targetDir = "dir1";

    // モック関数の初期化
    mockSetTargetList = vi.fn();
  });

  it("セレクトボックスが正しく表示される", () => {
    render(
      <DownloadZipDialogContent
        storagedOto={{
          dir1: { update_date: "2025-06-29" },
          dir2: { update_date: "2025-06-28" },
        }}
        targetList={[0, 1, 3]}
        setTargetList={mockSetTargetList}
      />
    );

    // 各ディレクトリのセレクトボックスが表示されていることを確認
    expect(screen.getByText("dir1")).toBeInTheDocument();
    expect(screen.getByText("dir2")).toBeInTheDocument();
    expect(screen.getByText("dir3")).toBeInTheDocument();
  });

  it("セレクトボックスの選択肢が正しく表示される", () => {
    render(
      <DownloadZipDialogContent
        storagedOto={{
          dir1: { update_date: "2025-06-29" },
          dir2: { update_date: "2025-06-28" },
        }}
        targetList={[0, 1, 3]}
        setTargetList={mockSetTargetList}
      />
    );

    // dir1 の選択肢を確認
    const comboboxes = screen.getAllByRole("combobox");
    fireEvent.mouseDown(comboboxes[0]); // 選択肢を確認
    const options = screen.getAllByRole("option"); // role="option" を持つ要素を取得

    expect(
      options.some((option) =>
        option.textContent?.includes("downloadZipDialog.current")
      )
    ).toBe(true);

    expect(
      options.some((option) =>
        option.textContent?.includes("downloadZipDialog.storaged 2025-06-29")
      )
    ).toBe(true);

    expect(
      options.some((option) =>
        option.textContent?.includes("downloadZipDialog.readed")
      )
    ).toBe(true);

    expect(
      options.some((option) =>
        option.textContent?.includes("downloadZipDialog.none")
      )
    ).toBe(true);
  });

  it("セレクトボックスの値を変更すると setTargetList が呼び出される", () => {
    render(
      <DownloadZipDialogContent
        storagedOto={{
          dir1: { update_date: "2025-06-29" },
          dir2: { update_date: "2025-06-28" },
        }}
        targetList={[0, 1, 3]}
        setTargetList={mockSetTargetList}
      />
    );

    // dir1 のセレクトボックスの値を変更
    const comboboxes = screen.getAllByRole("combobox");
    fireEvent.mouseDown(comboboxes[0]); // 選択肢を確認
    fireEvent.click(screen.getByText("downloadZipDialog.storaged 2025-06-29"));

    // setTargetList が呼び出されることを確認
    expect(mockSetTargetList).toHaveBeenCalledWith([1, 1, 3]);
  });

  it("readedを選ぶとtargetListの該当箇所が2になる", () => {
    render(
      <DownloadZipDialogContent
        storagedOto={{
          dir1: { update_date: "2025-06-29" },
          dir2: { update_date: "2025-06-28" },
        }}
        targetList={[0, 1, 3]}
        setTargetList={mockSetTargetList}
      />
    );

    // dir1 のセレクトボックスの値を変更
    const comboboxes = screen.getAllByRole("combobox");
    fireEvent.mouseDown(comboboxes[0]); // 選択肢を開く
    fireEvent.click(screen.getByText("downloadZipDialog.readed")); // 値を "readed" に変更

    // setTargetList が [2, 1, 3] で呼び出されることを確認
    expect(mockSetTargetList).toHaveBeenCalledWith([2, 1, 3]);
  });

  it("noneを選ぶとtargetListの該当箇所が3になる", () => {
    render(
      <DownloadZipDialogContent
        storagedOto={{
          dir1: { update_date: "2025-06-29" },
          dir2: { update_date: "2025-06-28" },
        }}
        targetList={[0, 1, 3]}
        setTargetList={mockSetTargetList}
      />
    );

    // dir1 のセレクトボックスの値を変更
    const comboboxes = screen.getAllByRole("combobox");
    fireEvent.mouseDown(comboboxes[0]); // 選択肢を開く

    // role="option" の中から "downloadZipDialog.none" を持つ要素をクリック
    const options = screen.getAllByRole("option");
    const noneOption = options.find((option) =>
      option.textContent?.includes("downloadZipDialog.none")
    );
    expect(noneOption).toBeDefined(); // noneOption が見つかることを確認
    fireEvent.click(noneOption!); // noneOption をクリック

    // setTargetList が [3, 1, 3] で呼び出されることを確認
    expect(mockSetTargetList).toHaveBeenCalledWith([3, 1, 3]);
  });
});
