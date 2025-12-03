import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import { TargetDirDialogTabPanelStoraged } from "../../../src/features/TargetDirDialog/TargetDirDialogTabPanelStoraged";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { TabContext } from "@mui/lab";

describe("TargetDirDialogTabPanelStoraged", () => {
  const mockSetDialogOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // ストアをリセット
    useOtoProjectStore.getState().setOto(null);
    useOtoProjectStore.getState().setTargetDir("");
    useOtoProjectStore.getState().setZipFileName("");
    // localStorageをクリア
    localStorage.clear();
  });

  const renderWithTabContext = (component: React.ReactElement) => {
    return render(<TabContext value="2">{component}</TabContext>);
  };

  it("UI描画確認：storagedOto_がnullの場合、nothingHistoryメッセージが表示される", () => {
    useOtoProjectStore.getState().setTargetDir("A3");

    renderWithTabContext(
      <TargetDirDialogTabPanelStoraged setDialogOpen={mockSetDialogOpen} />
    );

    // nothingHistoryメッセージが表示される
    expect(screen.getByText(/nothingHistory/)).toBeInTheDocument();

    // submitボタンは表示されない
    expect(screen.queryByText(/submit/)).not.toBeInTheDocument();

    // selectは表示されない
    expect(screen.queryByTestId("storaged-oto-select")).not.toBeInTheDocument();
  });

  it("UI描画確認：storagedOtoが存在する場合、submitボタンとselectが表示される", () => {
    // 模擬データを作成
    const mockStoragedOto = {
      "test-voice.zip": {
        "A3": {
          oto: "CV.wav=あ,1,2,-3,4,5",
          update_date: "2024-11-20T10:00:00.000Z",
        },
        "A4": {
          oto: "CV.wav=い,2,3,-4,5,6",
          update_date: "2024-11-21T11:00:00.000Z",
        },
      },
      "another-voice.zip": {
        "B3": {
          oto: "CV.wav=う,3,4,-5,6,7",
          update_date: "2024-11-22T12:00:00.000Z",
        },
      },
    };

    // localStorageに模擬データを設定
    localStorage.setItem("oto", JSON.stringify(mockStoragedOto));

    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    renderWithTabContext(
      <TargetDirDialogTabPanelStoraged setDialogOpen={mockSetDialogOpen} />
    );

    // nothingHistoryメッセージは表示されない
    expect(screen.queryByText(/nothingHistory/)).not.toBeInTheDocument();

    // submitボタンが表示される（初期状態では無効）
    const submitButton = screen.getByText(/submit/);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // selectが表示される
    const select = screen.getByTestId("storaged-oto-select");
    expect(select).toBeInTheDocument();

    // selectのデフォルト値がzipFileNameとtargetDirに基づいて設定されている
    // test-voice.zipはindex 0、A3はその中のindex 0なので"t_0_0"
    const selectInput = select.querySelector("input");
    expect(selectInput).toHaveValue("t_0_0");

    // TargetDirDialogCheckListは表示されない（otoがnullのため）
    expect(screen.queryByTestId("correct-offset-checkbox")).not.toBeInTheDocument();
  });

  it("UI描画確認：zipFileNameとtargetDirに整合するotoが無い場合、selectのデフォルト値が設定されない", () => {
    // 模擬データを作成
    const mockStoragedOto = {
      "test-voice.zip": {
        "A3": {
          oto: "CV.wav=あ,1,2,-3,4,5",
          update_date: "2024-11-20T10:00:00.000Z",
        },
        "A4": {
          oto: "CV.wav=い,2,3,-4,5,6",
          update_date: "2024-11-21T11:00:00.000Z",
        },
      },
      "another-voice.zip": {
        "B3": {
          oto: "CV.wav=う,3,4,-5,6,7",
          update_date: "2024-11-22T12:00:00.000Z",
        },
      },
    };

    // localStorageに模擬データを設定
    localStorage.setItem("oto", JSON.stringify(mockStoragedOto));

    // 存在しないzipFileNameとtargetDirを設定
    useOtoProjectStore.getState().setTargetDir("C5");
    useOtoProjectStore.getState().setZipFileName("non-existent.zip");

    renderWithTabContext(
      <TargetDirDialogTabPanelStoraged setDialogOpen={mockSetDialogOpen} />
    );

    // submitボタンが表示される（無効状態）
    const submitButton = screen.getByText(/submit/);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // selectが表示される
    const select = screen.getByTestId("storaged-oto-select");
    expect(select).toBeInTheDocument();

    // selectのデフォルト値が設定されていない（空文字列）
    const selectInput = select.querySelector("input");
    expect(selectInput).toHaveValue("");

    // TargetDirDialogCheckListは表示されない（otoがnullのため）
    expect(screen.queryByTestId("correct-offset-checkbox")).not.toBeInTheDocument();
  });

  it("useEffect確認：targetDirが変更されるとselectHistoryが更新される", async () => {
    // 模擬データを作成
    const mockStoragedOto = {
      "test-voice.zip": {
        "A3": {
          oto: "CV.wav=あ,1,2,-3,4,5",
          update_date: "2024-11-20T10:00:00.000Z",
        },
        "A4": {
          oto: "CV.wav=い,2,3,-4,5,6",
          update_date: "2024-11-21T11:00:00.000Z",
        },
      },
      "another-voice.zip": {
        "B3": {
          oto: "CV.wav=う,3,4,-5,6,7",
          update_date: "2024-11-22T12:00:00.000Z",
        },
      },
    };

    // localStorageに模擬データを設定
    localStorage.setItem("oto", JSON.stringify(mockStoragedOto));

    // 初期値を設定
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    const { rerender } = renderWithTabContext(
      <TargetDirDialogTabPanelStoraged setDialogOpen={mockSetDialogOpen} />
    );

    // 初期状態のselect値を確認（t_0_0: test-voice.zip/A3）
    const select = screen.getByTestId("storaged-oto-select");
    let selectInput = select.querySelector("input");
    expect(selectInput).toHaveValue("t_0_0");

    // 初期状態でoto読み込み後、TargetDirDialogCheckListが表示される
    await waitFor(() => {
      expect(screen.getByText(/CV.wav=あ,1.000,2.000,-3.000,4.000,5.000/)).toBeInTheDocument();
    });

    // otoが表示されたことにより、submitボタンが有効になる
    const submitButton = screen.getByTestId("target-dir-dialog-storaged-submit-button");
    expect(submitButton).not.toBeDisabled();

    // targetDirを変更
    useOtoProjectStore.getState().setTargetDir("A4");

    // 再レンダリング
    rerender(
      <TabContext value="2">
        <TargetDirDialogTabPanelStoraged setDialogOpen={mockSetDialogOpen} />
      </TabContext>
    );

    // select値が更新される（t_0_1: test-voice.zip/A4）
    selectInput = select.querySelector("input");
    expect(selectInput).toHaveValue("t_0_1");

    // A4のoto読み込み後、TargetDirDialogCheckListが更新される
    await waitFor(() => {
      expect(screen.getByText(/CV.wav=い,2.000,3.000,-4.000,5.000,6.000/)).toBeInTheDocument();
    });
    expect(submitButton).not.toBeDisabled();
  });

  it("OnSelectChange確認：selectを変更するとselectHistoryが更新される", async () => {
    // 模擬データを作成
    const mockStoragedOto = {
      "test-voice.zip": {
        "A3": {
          oto: "CV.wav=あ,1,2,-3,4,5",
          update_date: "2024-11-20T10:00:00.000Z",
        },
        "A4": {
          oto: "CV.wav=い,2,3,-4,5,6",
          update_date: "2024-11-21T11:00:00.000Z",
        },
      },
      "another-voice.zip": {
        "B3": {
          oto: "CV.wav=う,3,4,-5,6,7",
          update_date: "2024-11-22T12:00:00.000Z",
        },
      },
    };

    // localStorageに模擬データを設定
    localStorage.setItem("oto", JSON.stringify(mockStoragedOto));

    // 初期値を設定
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    renderWithTabContext(
      <TargetDirDialogTabPanelStoraged setDialogOpen={mockSetDialogOpen} />
    );

    // 初期状態のselect値を確認（t_0_0: test-voice.zip/A3）
    const select = screen.getByTestId("storaged-oto-select");
    const selectInput = select.querySelector("input") as HTMLInputElement;
    expect(selectInput).toHaveValue("t_0_0");

    // 初期状態でoto読み込み後、TargetDirDialogCheckListが表示される
    await waitFor(() => {
      expect(screen.getByText(/CV.wav=あ,1.000,2.000,-3.000,4.000,5.000/)).toBeInTheDocument();
    });

    // selectを変更（t_1_0: another-voice.zip/B3）
    fireEvent.change(selectInput, { target: { value: "t_1_0" } });

    // select値が更新される
    expect(selectInput).toHaveValue("t_1_0");

    // B3のoto読み込み後、TargetDirDialogCheckListが更新される
    await waitFor(() => {
      expect(screen.getByText(/CV.wav=う,3.000,4.000,-5.000,6.000,7.000/)).toBeInTheDocument();
    });
  });

  it("OnSubmitClick確認：oto読み込み後、submitボタンが有効になりクリックでsetDialogOpenにfalseが渡される", async () => {
    // 模擬データを作成
    const mockStoragedOto = {
      "test-voice.zip": {
        "A3": {
          oto: "CV.wav=あ,1,2,-3,4,5",
          update_date: "2024-11-20T10:00:00.000Z",
        },
      },
    };

    // localStorageに模擬データを設定
    localStorage.setItem("oto", JSON.stringify(mockStoragedOto));

    // 整合するzipFileNameとtargetDirを設定
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("test-voice.zip");

    renderWithTabContext(
      <TargetDirDialogTabPanelStoraged setDialogOpen={mockSetDialogOpen} />
    );

    // submitボタンを取得
    const submitButton = screen.getByText(/submit/);

    // 初期状態ではsubmitボタンは無効
    expect(submitButton).toBeDisabled();

    // oto読み込み後、TargetDirDialogCheckListが表示される
    await waitFor(() => {
      expect(screen.getByText(/CV.wav=あ,1.000,2.000,-3.000,4.000,5.000/)).toBeInTheDocument();
    });

    // oto読み込み後、submitボタンが有効になる
    expect(submitButton).not.toBeDisabled();

    // submitボタンをクリック
    fireEvent.click(submitButton);

    // setDialogOpenがfalseで呼ばれる
    expect(mockSetDialogOpen).toHaveBeenCalledWith(false);
    expect(mockSetDialogOpen).toHaveBeenCalledTimes(1);
  });
});
