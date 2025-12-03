import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JSZip from "jszip";
import {
  DownloadZipDialogTitle,
  DownloadZipDialogTitleProps,
  AddOtoToZip,
} from "../../../src/features/DownloadZipDialog/DownloadZipDialogTitle";
import { Oto } from "utauoto";
import { LOG } from "../../../src/lib/Logging";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { oto } from "../../../src/config/setting";

describe("AddOtoToZip", () => {
  it("targetListに基づいてoto.iniを正しく操作する", async () => {
    // ダミーのZIPファイルを作成
    const dummyZip = new JSZip();
    dummyZip.file("dir1/oto.ini", "dir1 original content");
    dummyZip.file("dir2/oto.ini", "dir2 original content");
    dummyZip.file("dir3/oto.ini", "dir3 original content");
    dummyZip.file("dir4/oto.ini", "dir4 original content");

    // targetDirsとtargetListを定義
    const targetDirs = ["dir1", "dir2", "dir3", "dir4"];
    const targetList = [0, 1, 2, 3]; // dir1: 現在のデータ, dir2: 保存されたデータ, dir3: 元のデータ, dir4: 書き出ししない

    // 保存されたoto.iniのデータ
    const storagedOto = {
      dir1: { oto: "dir1 storaged content" },
      dir2: { oto: "dir2 storaged content" },
      dir3: { oto: "dir3 storaged content" },
      dir4: { oto: "dir4 storaged content" },
    };

    // Otoインスタンスを作成
    const oto = new Oto();
    oto.GetLines = () => ({
      dir1: ["dir1 edited content"],
      dir2: ["dir2 edited content"],
      dir3: ["dir3 edited content"],
      dir4: ["dir4 edited content"],
    });

    // AddOtoToZipを実行
    const resultZip = await AddOtoToZip(
      dummyZip,
      targetDirs,
      targetList,
      storagedOto,
      oto
    );

    // 検証: dir1のoto.iniが現在のデータに置き換えられていることを確認
    const dir1Content = await resultZip.file("dir1/oto.ini")?.async("string");
    expect(dir1Content).toBe("dir1 edited content");

    // 検証: dir2のoto.iniが保存されたデータに置き換えられていることを確認
    const dir2Content = await resultZip.file("dir2/oto.ini")?.async("string");
    expect(dir2Content).toBe("dir2 storaged content");

    // 検証: dir3のoto.iniが元データを保持していることを確認
    const dir3Content = await resultZip.file("dir3/oto.ini")?.async("string");
    expect(dir3Content).toBe("dir3 original content");

    // 検証: dir4のoto.iniが削除されていることを確認
    const dir4Exists = resultZip.file("dir4/oto.ini");
    expect(dir4Exists).toBeNull();
  });
});

describe("DownloadZipDialogTitle", () => {
  let props: DownloadZipDialogTitleProps;
  let dummyZip: JSZip;

  beforeEach(() => {
    // ダミーのZIPファイルを作成
    dummyZip = new JSZip();
    dummyZip.file("dir1/oto.ini", "dir1 original content");
    dummyZip.file("dir2/oto.ini", "dir2 original content");
    dummyZip.file("dir3/oto.ini", "dir3 original content");

    // モックされたpropsを準備
    props = {
      setMenuAnchor: vi.fn(),
      setDialogOpen: vi.fn(),
      storagedOto: {
        dir1: { oto: "dir1 storaged content" },
        dir2: { oto: "dir2 storaged content" },
        dir3: { oto: "dir3 storaged content" },
      },
      targetList: [0, 1, 2], // dir1: 現在のデータ, dir2: 保存されたデータ, dir3: 元のデータ
      setTargetList: vi.fn(),
    };
    const store = useOtoProjectStore.getState();
    store.zipFileName = "test.zip";
    store.readZip = dummyZip.files;
    store.targetDirs = ["dir1", "dir2", "dir3"];
    store.oto = new Oto();
    store.oto.ParseOto(
      "dir1",
      "01_あかきくけこ.wav=あ,1538.320,66.210,-325.620,0.000,0.000"
    );
    LOG.clear();
  });

  it("ダウンロードボタンをクリックするとZIPが生成される", async () => {
    // Otoインスタンスを作成
    const oto = new Oto();
    oto.GetLines = () => ({
      dir1: ["dir1 edited content"],
      dir2: ["dir2 edited content"],
      dir3: ["dir3 edited content"],
    });

    // コンポーネントをレンダリング
    render(<DownloadZipDialogTitle {...props} />);

    // ダウンロードボタンをクリック
    const downloadButton = screen.getByRole("button", {
      name: "menu.zipDownload",
    });
    fireEvent.click(downloadButton);

    const logEntries = LOG.datas.filter((entry) => entry.includes("zipの生成"));
    expect(logEntries.length).toBe(1);
    // ダウンロード処理が完了するまで待機
    await waitFor(() => {
      const logEntries2 = LOG.datas.filter((entry) =>
        entry.includes("zipダウンロード")
      );
      expect(logEntries2.length).toBe(1);
    });

    // ダイアログが閉じられることを確認
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
    expect(props.setMenuAnchor).toHaveBeenCalledWith(null);
  });

  it("エラーが発生した場合にエラーログが記録される", async () => {
    // Otoインスタンスを作成
    useOtoProjectStore.getState().oto = new Oto();

    // コンポーネントをレンダリング
    render(<DownloadZipDialogTitle {...props} />);

    // ダウンロードボタンをクリック
    const downloadButton = screen.getByRole("button", {
      name: "menu.zipDownload",
    });
    fireEvent.click(downloadButton);

    // LOG.errorが呼び出されていることを確認
    await new Promise((resolve) => setTimeout(resolve, 100));
    const logEntries = LOG.datas.filter((entry) =>
      entry.includes("ZIP生成中にエラーが発生しました")
    );
    expect(logEntries.length).toBe(1);
  });
});
