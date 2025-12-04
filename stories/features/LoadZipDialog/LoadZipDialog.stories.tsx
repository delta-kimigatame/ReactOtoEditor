import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { LoadZipDialog } from "../../../src/features/LoadZipDialog/LoadZipDialog";
import JSZip from "jszip";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/LoadZipDialog/LoadZipDialog",
  component: LoadZipDialog,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LoadZipDialog>;

export default meta;
type Story = StoryObj<typeof LoadZipDialog>;

/**
 * デフォルト表示（ファイル選択前）
 */
export const Default: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [zipFiles, setZipFiles] = useState<{
      [key: string]: JSZip.JSZipObject;
    } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
        setDialogOpen(true);
      }
    };

    return (
      <>
        <div style={{ padding: 20 }}>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button variant="contained" component="span">
              zipファイルを選択
            </Button>
          </label>
        </div>
        <LoadZipDialog
          file={file}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          setZipFiles={setZipFiles}
        />
      </>
    );
  },
};

/**
 * ダイアログを開いた状態（サンプルファイル）
 */
export const Opened: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [zipFiles, setZipFiles] = useState<{
      [key: string]: JSZip.JSZipObject;
    } | null>(null);

    // サンプルzipファイルを作成
    const createSampleFile = async () => {
      const zip = new JSZip();
      zip.file("samples/sample1.wav", "dummy audio data");
      zip.file("samples/sample2.wav", "dummy audio data");
      zip.file("samples/oto.ini", "sample oto.ini content");
      
      const blob = await zip.generateAsync({ type: "blob" });
      return new File([blob], "sample.zip", { type: "application/zip" });
    };

    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
      createSampleFile().then(setFile);
    }, []);

    if (!file) {
      return <div>Loading...</div>;
    }

    return (
      <LoadZipDialog
        file={file}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setZipFiles={setZipFiles}
      />
    );
  },
};
