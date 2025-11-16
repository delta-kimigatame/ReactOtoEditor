import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MakePanelSelectPreset } from "../../../../src/features/TargetDirDialog/MakePanel/MakePanelSelectPreset";

// MakeOtoTemp/Presetモジュールのモック
vi.mock("../../../../src/lib/MakeOtoTemp/Preset", () => ({
  MakeJpCv: vi.fn(() => ({ mockData: "CV" })),
  MakeJpCVVC: vi.fn(() => ({ mockData: "CVVC" })),
  MakeJpVCV: vi.fn(() => ({ mockData: "VCV" }))
}));

// MakeOtoTemp/Inputモジュールのモック
vi.mock("../../../../src/lib/MakeOtoTemp/Input", () => ({
  InputFile: vi.fn(() => Promise.resolve({ mockData: "loaded" }))
}));

describe("MakePanelSelectPreset", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it("CVが選択された場合、MakeJpCvが呼ばれsetIniに結果が渡される", async () => {
    const mockSetIni = vi.fn();
    const { MakeJpCv } = await import("../../../../src/lib/MakeOtoTemp/Preset");

    render(
      <MakePanelSelectPreset
        setIni={mockSetIni}
      />
    );

    // セレクトボックスを開いてCVを選択
    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);
    
    // CVメニューアイテムをクリック
    const cvMenuItem = screen.getByText('targetDirDialog.makePanel.CVPreset');
    fireEvent.click(cvMenuItem);

    // MakeJpCvが呼ばれることを確認
    expect(MakeJpCv).toHaveBeenCalled();
    
    // setIniにMakeJpCvの結果が渡されることを確認
    expect(mockSetIni).toHaveBeenCalledWith({ mockData: "CV" });
  });

  it("VCVが選択された場合、MakeJpVCVが呼ばれsetIniに結果が渡される", async () => {
    const mockSetIni = vi.fn();
    const { MakeJpVCV } = await import("../../../../src/lib/MakeOtoTemp/Preset");

    render(
      <MakePanelSelectPreset
        setIni={mockSetIni}
      />
    );

    // セレクトボックスを開いてVCVを選択
    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);
    
    // VCVメニューアイテムをクリック
    const vcvMenuItem = screen.getByText('targetDirDialog.makePanel.VCVPreset');
    fireEvent.click(vcvMenuItem);

    // MakeJpVCVが呼ばれることを確認
    expect(MakeJpVCV).toHaveBeenCalled();
    
    // setIniにMakeJpVCVの結果が渡されることを確認
    expect(mockSetIni).toHaveBeenCalledWith({ mockData: "VCV" });
  });

  it("CVVCが選択された場合、MakeJpCVVCが呼ばれsetIniに結果が渡される", async () => {
    const mockSetIni = vi.fn();
    const { MakeJpCVVC } = await import("../../../../src/lib/MakeOtoTemp/Preset");

    render(
      <MakePanelSelectPreset
        setIni={mockSetIni}
      />
    );

    // セレクトボックスを開いてCVVCを選択
    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);
    
    // CVVCメニューアイテムをクリック
    const cvvcMenuItem = screen.getByText('targetDirDialog.makePanel.CVVCPreset');
    fireEvent.click(cvvcMenuItem);

    // MakeJpCVVCが呼ばれることを確認
    expect(MakeJpCVVC).toHaveBeenCalled();
    
    // setIniにMakeJpCVVCの結果が渡されることを確認
    expect(mockSetIni).toHaveBeenCalledWith({ mockData: "CVVC" });
  });

  it("loadが選択された場合、inputRefのclickが発火する", async () => {
    const mockSetIni = vi.fn();

    render(
      <MakePanelSelectPreset
        setIni={mockSetIni}
      />
    );

    // 隠しinput要素をdata-testidで取得してclickをモック
    const hiddenInput = screen.getByTestId('make-panel-select-preset-file-input');
    const clickSpy = vi.spyOn(hiddenInput, 'click');

    // セレクトボックスを開いてloadを選択
    const selectInput = screen.getByRole('combobox');
    fireEvent.mouseDown(selectInput);
    
    // loadメニューアイテムをクリック
    const loadMenuItem = screen.getByText('targetDirDialog.makePanel.load');
    fireEvent.click(loadMenuItem);

    // 隠しinputのclickが呼ばれることを確認
    expect(clickSpy).toHaveBeenCalled();
    
    // プリセット関数は呼ばれないことを確認
    const { MakeJpCv, MakeJpVCV, MakeJpCVVC } = await import("../../../../src/lib/MakeOtoTemp/Preset");
    expect(MakeJpCv).not.toHaveBeenCalled();
    expect(MakeJpVCV).not.toHaveBeenCalled();
    expect(MakeJpCVVC).not.toHaveBeenCalled();
  });

  it("OnFileChange - ファイルがnullの場合、後段の処理が実行されない", async () => {
    const mockSetIni = vi.fn();

    render(
      <MakePanelSelectPreset
        setIni={mockSetIni}
      />
    );

    const hiddenInput = screen.getByTestId('make-panel-select-preset-file-input');
    
    // ファイルがnullのイベントを作成
    const event = {
      target: {
        // @ts-ignore
        files: null
      }
    };

    // OnFileChangeイベントを発火
    fireEvent.change(hiddenInput, event);

    // setIniが呼ばれていないことを確認
    expect(mockSetIni).not.toHaveBeenCalled();
  });

  it("OnFileChange - ファイル数が0の場合、後段の処理が実行されない", async () => {
    const mockSetIni = vi.fn();

    render(
      <MakePanelSelectPreset
        setIni={mockSetIni}
      />
    );

    const hiddenInput = screen.getByTestId('make-panel-select-preset-file-input');
    
    // ファイル数が0のイベントを作成
    const event = {
      target: {
        files: []
      }
    };

    // OnFileChangeイベントを発火
    fireEvent.change(hiddenInput, event);

    // setIniが呼ばれていないことを確認
    expect(mockSetIni).not.toHaveBeenCalled();
  });

  it("OnFileChange - ファイルが1つ渡された場合、InputFileが呼ばれsetIniに結果が渡される", async () => {
    const mockSetIni = vi.fn();
    const { InputFile } = await import("../../../../src/lib/MakeOtoTemp/Input");

    render(
      <MakePanelSelectPreset
        setIni={mockSetIni}
      />
    );

    const hiddenInput = screen.getByTestId('make-panel-select-preset-file-input');
    
    // モックファイルを作成
    const mockFile = new File(['content'], 'test.ini', { type: 'text/plain' });
    
    // ファイルが1つ含まれるイベントを作成
    const event = {
      target: {
        files: [mockFile]
      }
    };

    // OnFileChangeイベントを発火
    fireEvent.change(hiddenInput, event);

    // 非同期処理の完了を待つ
    await waitFor(() => {
      // InputFileが正しいファイルで呼ばれることを確認
      expect(InputFile).toHaveBeenCalledWith(mockFile);
      
      // setIniにInputFileの結果(mockの返り値)が渡されることを確認
      expect(mockSetIni).toHaveBeenCalledWith({ mockData: "loaded" });
    });
  });
});
