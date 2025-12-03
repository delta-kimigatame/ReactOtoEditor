import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JSZip from "jszip";
import * as iconv from "iconv-lite";
import {
  LoadZipDialog,
  LoadZip,
} from "../../../src/features/LoadZipDialog/LoadZipDialog";
import { LOG } from "../../../src/lib/Logging";

// LoadZipButtonAreaコンポーネントのモック
vi.mock("../../../src/features/LoadZipDialog/LoadZipButtonArea", () => ({
  LoadZipButtonArea: vi.fn(() => <div data-testid="load-zip-button-area">LoadZipButtonArea Mock</div>)
}));

describe("LoadZip", () => {
  // test用のデータを定義する。
  const buf1 = new Uint8Array([1, 2, 3]);
  const buf2 = new Uint8Array([4, 5, 6]);

  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it("ファイル名がutf-8のzipファイルを正しく読み込む", async () => {
    // UTF-8テスト用のZIPファイルを作成
    const zip = new JSZip();
    zip.file("フォルダ名/_ああいあうえあ.wav", buf1);
    zip.file("フォルダ名/_いいうあえいえ.wav", buf2);
    
    const zipfile: File = new File(
      [await zip.generateAsync({ type: "blob" })],
      "test.zip",
      { type: "application/zip" }
    );
    const setZipFileName = vi.fn();
    const setZipFiles = vi.fn();
    const setProcessing = vi.fn();

    LoadZip(zipfile, "utf-8", setZipFileName, setProcessing, setZipFiles);

    await waitFor(() => {
      expect(setZipFileName).toHaveBeenCalledWith("test.zip");
      expect(setZipFiles).toHaveBeenCalled();
      expect(setProcessing).toHaveBeenCalledWith(false);
    });
    // setZipFilesに渡された引数をnewZipFilesとして取得
    const newZipFiles = (setZipFiles.mock.calls[0][0]) as { [key: string]: JSZip.JSZipObject };
    // newZipFilesに格納されているファイル名が正しいことを確認
    expect(newZipFiles["フォルダ名/_ああいあうえあ.wav"]).toBeDefined();
    // フォルダ名/_いいうあえいえ.wavも正しく認識されていることを確認
    expect(newZipFiles["フォルダ名/_いいうあえいえ.wav"]).toBeDefined();
  });

  it("ファイル名がShift-Jisのzipファイルを正しく読み込む", async () => {
    // Shift-JIS用のZIPファイルを作成
    const shiftJisZip = new JSZip();
    shiftJisZip.file("フォルダ名/_ああいあうえあ.wav", buf1);
    shiftJisZip.file("フォルダ名/_いいうあえいえ.wav", buf2);
    
    // Shift-JISエンコーディングでZIPファイルを生成
    const shiftJisArrayBuffer = await shiftJisZip.generateAsync({
      type: "uint8array",
      // @ts-expect-error 型の方がおかしい
      encodeFileName: (fileName: string) => iconv.encode(fileName, "CP932"),
    });
    
    const zipfile: File = new File(
      [shiftJisArrayBuffer],
      "test.zip",
      { type: "application/zip" }
    );
    
    const setZipFileName = vi.fn();
    const setZipFiles = vi.fn();
    const setProcessing = vi.fn();

    LoadZip(zipfile, "Shift-Jis", setZipFileName, setProcessing, setZipFiles);

    await waitFor(() => {
      expect(setZipFileName).toHaveBeenCalledWith("test.zip");
      expect(setZipFiles).toHaveBeenCalled();
      expect(setProcessing).toHaveBeenCalledWith(false);
    });
    
    // setZipFilesに渡された引数をnewZipFilesとして取得
    const newZipFiles = (setZipFiles.mock.calls[0][0]) as { [key: string]: JSZip.JSZipObject };
    // Shift-JISで正しく読み込まれていることを確認
    expect(newZipFiles["フォルダ名/_ああいあうえあ.wav"]).toBeDefined();
    expect(newZipFiles["フォルダ名/_いいうあえいえ.wav"]).toBeDefined();
  });
});

describe("LoadZipDialog", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // LoadZipButtonAreaのmockを設定（このdescribe内でのみ使用）
    const { LoadZipButtonArea } = await import("../../../src/features/LoadZipDialog/LoadZipButtonArea");
    (LoadZipButtonArea as any).mockImplementation(() => 
      <div data-testid="load-zip-button-area">ZIP読込ダイアログが表示されています</div>
    );
  });

  it("dialogOpenがtrueの時にダイアログが表示される", async () => {
    // 有効なZIPファイルを作成
    const zip = new JSZip();
    zip.file("test.txt", "test content");
    const mockFile = new File(
      [await zip.generateAsync({ type: "blob" })],
      'test.zip',
      { type: 'application/zip' }
    );
    
    const mockSetDialogOpen = vi.fn();
    const mockSetZipFiles = vi.fn();

    render(
      <LoadZipDialog
        file={mockFile}
        dialogOpen={true}
        setDialogOpen={mockSetDialogOpen}
        setZipFiles={mockSetZipFiles}
      />
    );

    // ZIP読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('ZIP読込ダイアログが表示されています')).toBeInTheDocument();
    });
    
    // data-testidでも確認
    expect(screen.getByTestId('load-zip-button-area')).toBeInTheDocument();
  });

  it("dialogOpenがfalseの時にダイアログが表示されない", async () => {
    // 有効なZIPファイルを作成（falseケースでも一応有効なファイルを使用）
    const zip = new JSZip();
    zip.file("test.txt", "test content");
    const mockFile = new File(
      [await zip.generateAsync({ type: "blob" })],
      'test.zip',
      { type: 'application/zip' }
    );
    
    const mockSetDialogOpen = vi.fn();
    const mockSetZipFiles = vi.fn();

    render(
      <LoadZipDialog
        file={mockFile}
        dialogOpen={false}
        setDialogOpen={mockSetDialogOpen}
        setZipFiles={mockSetZipFiles}
      />
    );

    // mockコンポーネントのテキストでダイアログが表示されていないことを確認
    expect(screen.queryByText('ZIP読込ダイアログが表示されています')).not.toBeInTheDocument();
    // data-testidでも確認
    expect(screen.queryByTestId('load-zip-button-area')).not.toBeInTheDocument();
  });

  it("fileがnullでdialogOpenがtrueの場合、ダイアログが閉じられる", async () => {
    const mockSetDialogOpen = vi.fn();
    const mockSetZipFiles = vi.fn();

    render(
      <LoadZipDialog
        file={null}
        dialogOpen={true}
        setDialogOpen={mockSetDialogOpen}
        setZipFiles={mockSetZipFiles}
      />
    );

    // setDialogOpenが false で呼ばれることを確認
    await waitFor(() => {
      expect(mockSetDialogOpen).toHaveBeenCalledWith(false);
    });

    // ダイアログは表示されない
    expect(screen.queryByText('ZIP読込ダイアログが表示されています')).not.toBeInTheDocument();
    expect(screen.queryByTestId('load-zip-button-area')).not.toBeInTheDocument();
  });

  it("有効なfileが設定された時にprocessingが開始される", async () => {
    // 有効なZIPファイルを作成
    const zip = new JSZip();
    zip.file("test.txt", "test content");
    const mockFile = new File(
      [await zip.generateAsync({ type: "blob" })],
      'test.zip',
      { type: 'application/zip' }
    );
    
    const mockSetDialogOpen = vi.fn();
    const mockSetZipFiles = vi.fn();

    render(
      <LoadZipDialog
        file={mockFile}
        dialogOpen={true}
        setDialogOpen={mockSetDialogOpen}
        setZipFiles={mockSetZipFiles}
      />
    );

    // 最初はprocessing状態（CircularProgress表示）
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // ZIP読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('ZIP読込ダイアログが表示されています')).toBeInTheDocument();
    });

    // processing完了後はLoadZipButtonAreaが表示される
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

});
