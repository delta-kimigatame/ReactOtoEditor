import type { Meta, StoryObj } from "@storybook/react";
import { ErrorPaper } from "../../src/features/ErrorPaper";

/**
 * `ErrorPaper` は、アプリケーションでエラーが発生した際に表示されるフォールバックコンポーネントです。
 * React Error Boundaryと連携して使用されます。
 */
const meta: Meta<typeof ErrorPaper> = {
  title: "Components/ErrorPaper",
  component: ErrorPaper,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorPaper>;

/**
 * 一般的なエラーの表示。
 */
export const Default: Story = {
  args: {
    error: new Error("予期しないエラーが発生しました"),
    resetErrorBoundary: () => console.log("resetErrorBoundary called"),
  },
};

/**
 * スタックトレース付きのエラー。
 */
export const WithStackTrace: Story = {
  args: {
    error: Object.assign(new Error("TypeError: Cannot read property 'map' of null"), {
      stack: `TypeError: Cannot read property 'map' of null
    at OtoCanvas.tsx:145:23
    at Array.map (<anonymous>)
    at renderWaveform (OtoCanvas.tsx:142:18)
    at OtoCanvas (OtoCanvas.tsx:89:5)`,
    }),
    resetErrorBoundary: () => console.log("resetErrorBoundary called"),
  },
};

/**
 * 長いエラーメッセージ。
 */
export const LongErrorMessage: Story = {
  args: {
    error: new Error(
      "ファイルの読み込み中にエラーが発生しました。zipファイルが破損しているか、対応していない形式の可能性があります。別のファイルを選択するか、ファイルの整合性を確認してください。"
    ),
    resetErrorBoundary: () => console.log("resetErrorBoundary called"),
  },
};

/**
 * Oto読み込みエラーのシミュレーション。
 */
export const OtoLoadError: Story = {
  args: {
    error: Object.assign(
      new Error("oto.iniの解析に失敗しました: Invalid format at line 15"),
      {
        stack: `Error: oto.iniの解析に失敗しました: Invalid format at line 15
    at Oto.InputOtoAsync (Oto.ts:87:15)
    at TargetDirDialogContent.tsx:72:10`,
      }
    ),
    resetErrorBoundary: () => console.log("resetErrorBoundary called"),
  },
};

/**
 * Zipファイル読み込みエラーのシミュレーション。
 */
export const ZipLoadError: Story = {
  args: {
    error: Object.assign(
      new Error("Zip file is corrupted or not a valid zip file"),
      {
        stack: `Error: Zip file is corrupted or not a valid zip file
    at JSZip.loadAsync (jszip.js:456:23)
    at LoadZipDialog.tsx:89:18
    at async onFileLoad (LoadZipDialog.tsx:85:5)`,
      }
    ),
    resetErrorBoundary: () => console.log("resetErrorBoundary called"),
  },
};
