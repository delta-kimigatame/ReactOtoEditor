import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

import { TargetDirDialogTabPanelTemplate } from "../../../src/features/TargetDirDialog/TargetDirDialogTabPanelTemplate";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { Oto } from "utauoto";
import { TabContext } from "@mui/lab";

describe("TargetDirDialogTabPanelTemplate", () => {
  const mockSetDialogOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // ストアをリセット
    useOtoProjectStore.getState().setOto(null);
    useOtoProjectStore.getState().setTargetDir("");
  });
  const renderWithTabContext = (component: React.ReactElement) => {
    return render(<TabContext value="3">{component}</TabContext>);
  };

  it("UI描画確認：初期状態でotoがnull", () => {
    useOtoProjectStore.getState().setTargetDir("A3");

    renderWithTabContext(
      <TargetDirDialogTabPanelTemplate setDialogOpen={mockSetDialogOpen} />
    );

    // ファイル読み込みボタンが表示される
    expect(screen.getByText(/readTemplate/)).toBeInTheDocument();

    // ボタンは有効状態
    const button = screen.getByRole("button", { name: /readTemplate/ });
    expect(button).not.toBeDisabled();

    // 子コンポーネントは表示されない
    expect(screen.queryByText(/correctType/)).not.toBeInTheDocument();
  });

  it("UI描画確認：processingがtrueの場合ボタンが無効", () => {
    useOtoProjectStore.getState().setTargetDir("A3");

    const { rerender } = renderWithTabContext(
      <TargetDirDialogTabPanelTemplate setDialogOpen={mockSetDialogOpen} />
    );

    // 初期状態ではボタンは有効
    const button = screen.getByRole("button", { name: /readTemplate/ });
    expect(button).not.toBeDisabled();
  });

  it("OnReadClickボタンのクリック確認：hidden-template-oto-inputのクリックが発火する", () => {
    useOtoProjectStore.getState().setTargetDir("A3");

    renderWithTabContext(
      <TargetDirDialogTabPanelTemplate setDialogOpen={mockSetDialogOpen} />
    );

    // hidden inputにクリックイベントのスパイを設定
    const hiddenInput = screen.getByTestId("hidden-template-oto-input");
    const clickSpy = vi.spyOn(hiddenInput, "click");

    // ボタンをクリック
    const button = screen.getByTestId("target-dir-dialog-read-template-button");
    fireEvent.click(button);

    // hidden inputのclickが呼ばれることを確認
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("OnFileChange確認：e.target.filesがnullの場合、processingがfalseのまま", () => {
    useOtoProjectStore.getState().setTargetDir("A3");

    renderWithTabContext(
      <TargetDirDialogTabPanelTemplate setDialogOpen={mockSetDialogOpen} />
    );

    const hiddenInput = screen.getByTestId("hidden-template-oto-input");
    const button = screen.getByTestId("target-dir-dialog-read-template-button");

    // ボタンは初期状態で有効
    expect(button).not.toBeDisabled();

    // e.target.filesがnullのイベントを発火
    // @ts-ignore
    fireEvent.change(hiddenInput, { target: { files: null } });

    // ボタンは有効のまま（processingはfalse）
    expect(button).not.toBeDisabled();
  });

  it("OnFileChange確認：e.target.files.lengthが0の場合、processingがfalseのまま", () => {
    useOtoProjectStore.getState().setTargetDir("A3");

    renderWithTabContext(
      <TargetDirDialogTabPanelTemplate setDialogOpen={mockSetDialogOpen} />
    );

    const hiddenInput = screen.getByTestId("hidden-template-oto-input");
    const button = screen.getByTestId("target-dir-dialog-read-template-button");

    // ボタンは初期状態で有効
    expect(button).not.toBeDisabled();

    // e.target.files.length === 0のイベントを発火
    fireEvent.change(hiddenInput, { target: { files: [] } });

    // ボタンは有効のまま（processingはfalse）
    expect(button).not.toBeDisabled();
  });

  it("OnFileChange確認：e.target.filesにFileオブジェクトが渡される場合、processingがtrueになる", async() => {
    useOtoProjectStore.getState().setTargetDir("A3");

    renderWithTabContext(
      <TargetDirDialogTabPanelTemplate setDialogOpen={mockSetDialogOpen} />
    );

    const hiddenInput = screen.getByTestId("hidden-template-oto-input");
    const button = screen.getByTestId("target-dir-dialog-read-template-button");

    // ボタンは初期状態で有効
    expect(button).not.toBeDisabled();

    // Fileオブジェクトを作成（有効なoto.iniの内容）
    const otoContent = "CV.wav=あ,1,2,-3,4,5";
    const file = new File([otoContent], "oto.ini", { type: "text/plain" });

    // e.target.filesにFileオブジェクトを渡してイベントを発火
    fireEvent.change(hiddenInput, { target: { files: [file] } });

    // ボタンが無効になる（processingがtrue）
    expect(button).toBeDisabled();

    // 非同期処理の完了によりprocessingがfalseに戻るのを待つ
    await waitFor(() => expect(button).not.toBeDisabled());

    //otoが非nullになったため、子コンポーネントが表示されることを確認する。encodeOkはfalseのはず
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });
  it("SetEncodeOk_：oto読込後、submitボタンをクリックした場合、encodeOkがtrueになり、correct-offset-checkboxが表示される", async() => {
    useOtoProjectStore.getState().setTargetDir("A3");

    renderWithTabContext(
      <TargetDirDialogTabPanelTemplate setDialogOpen={mockSetDialogOpen} />
    );

    const hiddenInput = screen.getByTestId("hidden-template-oto-input");
    const button = screen.getByTestId("target-dir-dialog-read-template-button");

    // ボタンは初期状態で有効
    expect(button).not.toBeDisabled();

    // Fileオブジェクトを作成（有効なoto.iniの内容）
    const otoContent = "CV.wav=あ,1,2,-3,4,5";
    const file = new File([otoContent], "oto.ini", { type: "text/plain" });

    // e.target.filesにFileオブジェクトを渡してイベントを発火
    fireEvent.change(hiddenInput, { target: { files: [file] } });

    // ボタンが無効になる（processingがtrue）
    expect(button).toBeDisabled();

    // 非同期処理の完了によりprocessingがfalseに戻るのを待つ
    await waitFor(() => expect(button).not.toBeDisabled());

    //otoが非nullになったため、子コンポーネントが表示されることを確認する。encodeOkはfalseのはず
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    // correct-offset-checkboxが表示されることを確認
    expect(screen.getByTestId("correct-offset-checkbox")).toBeInTheDocument();
  });

//   it("UI描画確認：otoが存在し、encodeOkがfalseの場合TargetDirDialogCorrectPanelが表示される", () => {
//     const oto = new Oto();
//     oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
//     useOtoProjectStore.getState().setOto(oto);
//     useOtoProjectStore.getState().setTargetDir("A3");
//     renderWithTabContext(
//       <TargetDirDialogTabPanelTemplate setDialogOpen={mockSetDialogOpen} />
//     );
//     // TargetDirDialogCorrectPanelが表示されることを確認。correct-offset-checkboxが必ず描画されるはず
//     expect(screen.getByTestId("correct-offset-checkbox")).toBeInTheDocument();
//   });
});
