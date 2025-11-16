import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JSZip from "jszip";
import {
  LoadZipButtonArea,
  ZipExtract,
} from "../../../src/features/LoadZipDialog/LoadZipButtonArea";
import { LOG } from "../../../src/lib/Logging";

describe("ZipExtract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ファイルが1つのzip:ファイル名の頭にBOMサインがある場合、新たなzipでは削除されている", async () => {
    // mockを使わず、ファイルオブジェクトから実際にJSZipObjectを生成する。bufは適当な値
    const buf = new Uint8Array([1, 2, 3]);
    const zip = new JSZip();
    zip.file("\uFEFFfile1.txt", buf);
    const files = zip.files;
    const newZip = new JSZip();
    const setZipFiles = vi.fn();
    const setDialogOpen = vi.fn();

    ZipExtract(files, 0, newZip, setZipFiles, setDialogOpen);

    await waitFor(() => {
      expect(setZipFiles).toHaveBeenCalledWith(newZip.files);
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
    // newZipに格納されているファイル名からBOMサインが削除されていることを確認
    expect(newZip.file("file1.txt")).toBeDefined();
    expect(newZip.file("\uFEFFfile1.txt")).toBeNull();
  });

  it("ファイルが1つのzip:NFDのファイル名がNFCに変換されることの確認", async () => {
    // mockを使わず、ファイルオブジェクトから実際にJSZipObjectを生成する。bufは適当な値
    const buf = new Uint8Array([1, 2, 3]);
    const zip = new JSZip();

    // NFDで「が」を表現（「か」+ 濁点）
    const nfdFilename = "か\u3099.wav".normalize("NFD");
    // NFCで「が」を表現（合成文字）
    const nfcFilename = "が.wav".normalize("NFC");

    zip.file(nfdFilename, buf);
    const files = zip.files;
    const newZip = new JSZip();
    const setZipFiles = vi.fn();
    const setDialogOpen = vi.fn();

    ZipExtract(files, 0, newZip, setZipFiles, setDialogOpen);

    await waitFor(() => {
      expect(setZipFiles).toHaveBeenCalledWith(newZip.files);
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
    // newZipに格納されているファイル名がNFCに変換されていることを確認
    expect(newZip.file(nfcFilename)).toBeDefined(); //NFCでが.wav
    expect(newZip.file(nfdFilename)).toBeNull(); //NFDでが.wav
  });

  it("ファイルが1つのzip:拡張子のWavが小文字に統一されているか確認", async () => {
    // mockを使わず、ファイルオブジェクトから実際にJSZipObjectを生成する。bufは適当な値
    const buf = new Uint8Array([1, 2, 3]);
    const zip = new JSZip();

    const filenameWithUppercaseWav = "test.Wav";
    const filenameWithLowercaseWav = "test.wav";

    zip.file(filenameWithUppercaseWav, buf);
    const files = zip.files;
    const newZip = new JSZip();
    const setZipFiles = vi.fn();
    const setDialogOpen = vi.fn();

    ZipExtract(files, 0, newZip, setZipFiles, setDialogOpen);

    await waitFor(() => {
      expect(setZipFiles).toHaveBeenCalledWith(newZip.files);
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
    // newZipに格納されているファイル名がNFCに変換されていることを確認
    expect(newZip.file(filenameWithLowercaseWav)).toBeDefined();
    expect(newZip.file(filenameWithUppercaseWav)).toBeNull();
  });

  it("ファイルが複数の場合再帰的に実行され、全てのファイルがnewZipに格納されることを確認", async () => {
    // mockを使わず、ファイルオブジェクトから実際にJSZipObjectを生成する。bufは適当な値
    const buf1 = new Uint8Array([1, 2, 3]);
    const buf2 = new Uint8Array([4, 5, 6]);
    const zip = new JSZip();
    zip.file("file1.wav", buf1);
    zip.file("file2.Wav", buf2);
    const files = zip.files;
    const newZip = new JSZip();
    const setZipFiles = vi.fn();
    const setDialogOpen = vi.fn();

    ZipExtract(files, 0, newZip, setZipFiles, setDialogOpen);

    await waitFor(() => {
      expect(setZipFiles).toHaveBeenCalledWith(newZip.files);
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
    // newZipに格納されているファイル名がNFCに変換されていることを確認
    expect(newZip.file("file1.wav")).toBeDefined();
    expect(newZip.file("file2.wav")).toBeDefined();
  });
});

describe("LoadZipButtonArea", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("エンコードが変更されたとき、propsが渡した各状態が呼ばれることの確認", async () => {
    const setDialogOpen = vi.fn();
    const setProcessing = vi.fn();
    const setEncoding = vi.fn();
    const setZipFiles = vi.fn();
    const LoadZip = vi.fn();
    const file = new File(["dummy content"], "test.zip", {
      type: "application/zip",
    });

    render(
      <LoadZipButtonArea
        file={file}
        encoding="utf-8"
        zipFiles={null}
        LoadZip={LoadZip}
        setDialogOpen={setDialogOpen}
        setProcessing={setProcessing}
        setEncoding={setEncoding}
        setZipFiles={setZipFiles}
      />
    );

    // エンコード選択を変更（Material-UIのSelectコンポーネント用）
    const hiddenInput = screen.getByDisplayValue("utf-8");
    fireEvent.change(hiddenInput, { target: { value: "Shift-Jis" } });

    // エンコード変更時に呼ばれるべき関数が実行されたことを確認
    expect(setEncoding).toHaveBeenCalledWith("Shift-Jis");
    expect(setProcessing).toHaveBeenCalledWith(true);
    expect(setZipFiles).toHaveBeenCalledWith(null);
    expect(LoadZip).toHaveBeenCalledWith(file, "Shift-Jis");
  });

  it("ボタンをクリック。zipFileが非nullの場合、ZipExtractが呼ばれることを確認", async () => {
    // setZipFilesやsetDialogOpenをモックすることで間接的に確認する。
    const setDialogOpen = vi.fn();
    const setProcessing = vi.fn();
    const setEncoding = vi.fn();
    const setZipFiles = vi.fn();
    const LoadZip = vi.fn();
    const file = new File(["dummy content"], "test.zip", {
      type: "application/zip",
    });
    // モックしていない正しいzipファイルオブジェクト
    const zip = new JSZip();
    zip.file("file1.wav", new Uint8Array([1, 2, 3]));
    const zipFiles = zip.files;
    render(
      <LoadZipButtonArea
        file={file}
        encoding="utf-8"
        zipFiles={zipFiles}
        LoadZip={LoadZip}
        setDialogOpen={setDialogOpen}
        setProcessing={setProcessing}
        setEncoding={setEncoding}
        setZipFiles={setZipFiles}
      />
    );
    // ボタンには名前は設定されていない
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(setZipFiles).toHaveBeenCalled();
      expect(setDialogOpen).toHaveBeenCalledWith(false);
    });
  });
  it("ボタンをクリック。zipFileがnullの場合、ZipExtractは呼ばれるないことを確認", async () => {
    // setZipFilesやsetDialogOpenをモックすることで間接的に確認する。
    const setDialogOpen = vi.fn();
    const setProcessing = vi.fn();
    const setEncoding = vi.fn();
    const setZipFiles = vi.fn();
    const LoadZip = vi.fn();
    const file = new File(["dummy content"], "test.zip", {
      type: "application/zip",
    });
    render(
      <LoadZipButtonArea
        file={file}
        encoding="utf-8"
        zipFiles={null}
        LoadZip={LoadZip}
        setDialogOpen={setDialogOpen}
        setProcessing={setProcessing}
        setEncoding={setEncoding}
        setZipFiles={setZipFiles}
      />
    );
    // ボタンには名前は設定されていない
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(setZipFiles).toHaveBeenCalledTimes(0);
      expect(setDialogOpen).toHaveBeenCalledTimes(0);
    });
  });
});
