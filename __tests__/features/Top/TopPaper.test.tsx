import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TopPaper } from "../../../src/features/Top/TopPaper";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { GetStorageOto } from "../../../src/services/StorageOto";
import { LOG } from "../../../src/lib/Logging";
import { Oto } from "utauoto";
import { JSZipObject } from "jszip";

describe("TopPaper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // LoadZipDialogのモック化
    vi.mock("../../../src/features/LoadZipDialog/LoadZipDialog", () => ({
      LoadZipDialog: ({
        dialogOpen,
        file,
        setDialogOpen,
        setZipFiles,
      }: {
        dialogOpen: boolean;
        file: File | null;
        setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setZipFiles: React.Dispatch<
          React.SetStateAction<{ [key: string]: any } | null>
        >;
      }) => (
        <div
          data-testid="mock-dialog"
          style={{ display: dialogOpen ? "block" : "none" }}
        >
          {file ? file.name : "No file"}
        </div>
      ),
    }));
    // ストアの初期化
    const store = useOtoProjectStore.getState();
    store.zipFileName = "test.zip";
    store.readZip = {
      "dir1/oto.ini": {} as JSZipObject,
      "dir2/oto.ini": {} as JSZipObject,
      "dir3/oto.ini": {} as JSZipObject,
    };
    store.targetDirs = ["dir1", "dir2", "dir3", "dir4"];
    store.targetDir = "dir1";
    store.oto = new Oto();
    vi.mock("../../../../src/services/StorageOto", () => ({
      GetStorageOto: vi.fn().mockReturnValue({
        "test.zip": {
          dir1: {},
          dir2: {},
        },
      }),
    }));
    LOG.clear();
  });
  it("ボタンをクリックするとinputがクリックされる", () => {
    render(<TopPaper />);
    const button = screen.getByText("top.selectZipButtonText");
    const input = screen.getByTestId("hidden-zip-input") as HTMLInputElement;

    // inputのclickメソッドをスパイ
    const clickSpy = vi.spyOn(input, "click");

    fireEvent.click(button);

    // inputのclickが呼ばれたことを確認
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // スパイをリストア
    clickSpy.mockRestore();
  });

  it("ファイル選択時にOnFileChangeが呼ばる:nullの場合LoadZipDialogは表示されない", () => {
    render(<TopPaper />);
    const input = screen.getByTestId("hidden-zip-input") as HTMLInputElement;
    // 初期状態ではダイアログが非表示
    const dialog = screen.getByTestId("mock-dialog");
    expect(dialog).toHaveStyle({ display: "none" });

    // ファイル選択
    //@ts-ignore テストのためにあえてnullを渡す
    fireEvent.change(input, null);
    expect(dialog).toHaveStyle({ display: "none" });
  });

  it("ファイル選択時にOnFileChangeが呼ばる:ファイルが選択されていない場合LoadZipDialogは開かない", () => {
    render(<TopPaper />);
    const input = screen.getByTestId("hidden-zip-input") as HTMLInputElement;
    // 初期状態ではダイアログが非表示
    const dialog = screen.getByTestId("mock-dialog");
    expect(dialog).toHaveStyle({ display: "none" });

    // ファイル選択
    fireEvent.change(input, { target: { files: [] } });
    expect(dialog).toHaveStyle({ display: "none" });
  });

  it("ファイル選択時にOnFileChangeが呼ばる:ファイルが選択されている場合LoadZipDialogが開く", () => {
    render(<TopPaper />);
    const input = screen.getByTestId("hidden-zip-input") as HTMLInputElement;
    const file = new File(["dummy content"], "test.zip", {
      type: "application/zip",
    });

    // 初期状態ではダイアログが非表示
    const dialog = screen.getByTestId("mock-dialog");
    expect(dialog).toHaveStyle({ display: "none" });

    // ファイル選択
    fireEvent.change(input, { target: { files: [file] } });

    // ダイアログが表示され、ファイル名が表示される
    expect(dialog).toHaveStyle({ display: "block" });
    expect(dialog).toHaveTextContent("test.zip"); //間接的にsetReadFileが呼ばれたことを確認

    // screen.getByText("top.selectZipButtonText");が見つからないことで、間接的にsetProcessing(true)が呼ばれたことを確認する。
    const button = screen.queryByText("top.selectZipButtonText");
    expect(button).not.toBeInTheDocument();
  });

  it("readZipの変更:nullに変更した場合LOGは出力されない", async () => {
    render(<TopPaper />);
    const { setReadZip } = useOtoProjectStore.getState();
    
    // 初期状態でLOGをクリア
    LOG.clear();
    
    // readZipをnullに設定
    setReadZip(null);
    
    // useEffectが実行されるまで少し待つ
    await waitFor(() => {
      // readZip !== null の条件を満たさないため、LOGは出力されない
      expect(LOG.datas.join("\n")).not.toContain("zip読込完了");
    });
  });

  it("readZipの変更:非nullに変更した場合LOGは出力される", async () => {
    render(<TopPaper />);
    const { setReadZip } = useOtoProjectStore.getState();
    
    // 初期状態をnullに設定
    setReadZip(null);
    LOG.clear();
    
    // 非nullの値を設定
    const newReadZip = {
      "dir1/oto.ini": {} as JSZipObject,
      "dir2/oto.ini": {} as JSZipObject,
    };
    setReadZip(newReadZip);
    
    // useEffectが実行されてLOGが出力されるまで待つ
    await waitFor(() => {
      expect(LOG.datas.join("\n")).toContain("zip読込完了");
    });
  });
});
