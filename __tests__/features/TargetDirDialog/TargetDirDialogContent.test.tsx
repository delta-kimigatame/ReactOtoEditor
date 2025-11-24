import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import JSZip from "jszip";

import { TargetDirDialogContent } from "../../../src/features/TargetDirDialog/TargetDirDialogContent";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

describe("TargetDirDialogContent", () => {
  const mockSetDialogOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // ストアをリセット
    useOtoProjectStore.getState().setOto(null);
    useOtoProjectStore.getState().setTargetDir(null);
    useOtoProjectStore.getState().setReadZip(null);
    useOtoProjectStore.getState().setZipFileName("");
  });

  it("UI描画確認：targetDirがnullの場合、TabContextは表示されない", () => {
    useOtoProjectStore.getState().setTargetDir(null);

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // TargetDirDialogSelectDirは表示される
    expect(
      screen.getByTestId("target-dir-dialog-select-dir")
    ).toBeInTheDocument();

    // TabListは表示されない
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("UI描画確認：targetDirが設定されている場合、TabContextが表示される", async () => {
    // JSZipの模擬データを作成
    const zip = new JSZip();
    const otoContent = "CV.wav=a,1,2,-3,4,5";
    zip.file("A3/oto.ini", otoContent);

    const readZip = await zip
      .loadAsync(await zip.generateAsync({ type: "blob" }))
      .then((z) => z.files);

    useOtoProjectStore.getState().setReadZip(readZip);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // TabListが表示される
    expect(screen.getByRole("tablist")).toBeInTheDocument();

    // 4つのタブが表示される
    expect(screen.getByText(/tab.zip/)).toBeInTheDocument();
    expect(screen.getByText(/tab.storaged/)).toBeInTheDocument();
    expect(screen.getByText(/tab.template/)).toBeInTheDocument();
    expect(screen.getByText(/tab.make/)).toBeInTheDocument();
  });

  it("UI描画確認：oto.iniが存在する場合、tab.zipが表示される", async () => {
    // JSZipの模擬データを作成（oto.ini含む）
    const zip = new JSZip();
    const otoContent = "CV.wav=a,1,2,-3,4,5";
    zip.file("A3/oto.ini", otoContent);

    const readZip = await zip
      .loadAsync(await zip.generateAsync({ type: "blob" }))
      .then((z) => z.files);

    useOtoProjectStore.getState().setReadZip(readZip);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // oto.ini読み込み後、TargetDirDialogCheckListが表示される
    await waitFor(() => {
      expect(
        screen.getByText(/CV.wav=a,1.000,2.000,-3.000,4.000,5.000/)
      ).toBeInTheDocument();
    });

    // tab.zipがアクティブ（デフォルト）
    const zipTab = screen.getByText(/tab.zip/);
    expect(zipTab.closest("button")).toHaveAttribute("aria-selected", "true");
  });

  it("UI描画確認：oto.iniが存在しない場合、tab.storagedが表示される", async () => {
    // JSZipの模擬データを作成（oto.iniなし）
    const zip = new JSZip();
    zip.file("A3/dummy.txt", "dummy");

    const readZip = await zip
      .loadAsync(await zip.generateAsync({ type: "blob" }))
      .then((z) => z.files);

    useOtoProjectStore.getState().setReadZip(readZip);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // tab.storagedがアクティブ
    await waitFor(() => {
      const storagedTab = screen.getByText(/tab.storaged/);
      expect(storagedTab.closest("button")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  it("OnTabChange確認：タブをクリックすると表示が切り替わる（zip->template）", async () => {
    // JSZipの模擬データを作成
    const zip = new JSZip();
    const otoContent = "CV.wav=a,1,2,-3,4,5";
    zip.file("A3/oto.ini", otoContent);

    const readZip = await zip
      .loadAsync(await zip.generateAsync({ type: "blob" }))
      .then((z) => z.files);

    useOtoProjectStore.getState().setReadZip(readZip);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // 初期状態でtab.zipがアクティブ
    await waitFor(() => {
      const zipTab = screen.getByText(/tab.zip/);
      expect(zipTab.closest("button")).toHaveAttribute("aria-selected", "true");
    });

    // tab.templateをクリック
    const templateTab = screen.getByText(/tab.template/);
    fireEvent.click(templateTab);

    // tab.templateがアクティブになる
    await waitFor(() => {
      expect(templateTab.closest("button")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  it("OnTabChange確認：タブをクリックすると表示が切り替わる（zip->storaged）", async () => {
    // JSZipの模擬データを作成
    const zip = new JSZip();
    const otoContent = "CV.wav=a,1,2,-3,4,5";
    zip.file("A3/oto.ini", otoContent);

    const readZip = await zip
      .loadAsync(await zip.generateAsync({ type: "blob" }))
      .then((z) => z.files);

    useOtoProjectStore.getState().setReadZip(readZip);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // 初期状態でtab.zipがアクティブ
    await waitFor(() => {
      const zipTab = screen.getByText(/tab.zip/);
      expect(zipTab.closest("button")).toHaveAttribute("aria-selected", "true");
    });

    // tab.storagedをクリック
    const storagedTab = screen.getByText(/tab.storaged/);
    fireEvent.click(storagedTab);

    // tab.storagedがアクティブになる
    await waitFor(() => {
      expect(storagedTab.closest("button")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  it("OnTabChange確認：タブをクリックすると表示が切り替わる（zip->make）", async () => {
    // JSZipの模擬データを作成
    const zip = new JSZip();
    const otoContent = "CV.wav=a,1,2,-3,4,5";
    zip.file("A3/oto.ini", otoContent);

    const readZip = await zip
      .loadAsync(await zip.generateAsync({ type: "blob" }))
      .then((z) => z.files);

    useOtoProjectStore.getState().setReadZip(readZip);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // 初期状態でtab.zipがアクティブ
    await waitFor(() => {
      const zipTab = screen.getByText(/tab.zip/);
      expect(zipTab.closest("button")).toHaveAttribute("aria-selected", "true");
    });

    // tab.makeをクリック
    const makeTab = screen.getByText(/tab.make/);
    fireEvent.click(makeTab);

    // tab.makeがアクティブになる
    await waitFor(() => {
      expect(makeTab.closest("button")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
  });

  it("OnTabChange確認：タブをクリックすると表示が切り替わる（storaged->zip）", async () => {
    // JSZipの模擬データを作成（oto.iniなし）
    const zip = new JSZip();
    zip.file("A3/dummy.txt", "dummy");

    const readZip = await zip
      .loadAsync(await zip.generateAsync({ type: "blob" }))
      .then((z) => z.files);

    useOtoProjectStore.getState().setReadZip(readZip);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // 初期状態でtab.storagedがアクティブ（oto.iniが存在しないため）
    await waitFor(() => {
      const storagedTab = screen.getByText(/tab.storaged/);
      expect(storagedTab.closest("button")).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });

    // tab.zipをクリック
    const zipTab = screen.getByText(/tab.zip/);
    fireEvent.click(zipTab);

    // tab.zipがアクティブになる
    await waitFor(() => {
      expect(zipTab.closest("button")).toHaveAttribute("aria-selected", "true");
    });
  });
  
  it("useEffect確認：targetDirを変更するとoto.iniの内容が切り替わる", async () => {
    // JSZipの模擬データを作成（A3, A4両方のoto.iniを含む）
    const zip = new JSZip();
    zip.file("A3/oto.ini", "CV.wav=a,1,2,-3,4,5");
    zip.file("A4/oto.ini", "CV.wav=b,2,3,-4,5,6");

    const readZip = await zip
      .loadAsync(await zip.generateAsync({ type: "blob" }))
      .then((z) => z.files);

    useOtoProjectStore.getState().setReadZip(readZip);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    render(<TargetDirDialogContent setDialogOpen={mockSetDialogOpen} />);

    // 初期状態でA3のoto.iniが表示される
    await waitFor(() => {
      expect(
        screen.getByText(/CV.wav=a,1.000,2.000,-3.000,4.000,5.000/)
      ).toBeInTheDocument();
    });

    // targetDirをA4に変更
    useOtoProjectStore.getState().setTargetDir("A4");

    // A4のoto.iniが表示される
    await waitFor(() => {
      expect(
        screen.getByText(/CV.wav=b,2.000,3.000,-4.000,5.000,6.000/)
      ).toBeInTheDocument();
    });
  });
});
