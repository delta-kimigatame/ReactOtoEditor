import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { LoadZipButtonArea } from "../../../src/features/LoadZipDialog/LoadZipButtonArea";
import JSZip from "jszip";

const meta = {
  title: "Components/LoadZipDialog/LoadZipButtonArea",
  component: LoadZipButtonArea,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LoadZipButtonArea>;

export default meta;
type Story = StoryObj<typeof LoadZipButtonArea>;

/**
 * デフォルト表示（UTF-8）
 */
export const Default: Story = {
  render: () => {
    const [encoding, setEncoding] = useState("utf-8");
    const [processing, setProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [zipFiles, setZipFiles] = useState<{
      [key: string]: JSZip.JSZipObject;
    } | null>(null);

    const createSampleZipFiles = () => {
      const zip = new JSZip();
      zip.file("samples/sample1.wav", "dummy");
      zip.file("samples/sample2.wav", "dummy");
      zip.file("samples/oto.ini", "dummy");
      return zip.files;
    };

    useEffect(() => {
      setZipFiles(createSampleZipFiles());
    }, []);

    const dummyFile = new File([""], "sample.zip", { type: "application/zip" });

    const LoadZip = (file: File, encoding?: string) => {
      console.log("LoadZip called with encoding:", encoding);
    };

    return (
      <LoadZipButtonArea
        file={dummyFile}
        encoding={encoding}
        zipFiles={zipFiles}
        LoadZip={LoadZip}
        setDialogOpen={setDialogOpen}
        setProcessing={setProcessing}
        setEncoding={setEncoding}
        setZipFiles={setZipFiles}
      />
    );
  },
};

/**
 * Shift-JIS選択状態
 */
export const ShiftJIS: Story = {
  render: () => {
    const [encoding, setEncoding] = useState("Shift-Jis");
    const [processing, setProcessing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [zipFiles, setZipFiles] = useState<{
      [key: string]: JSZip.JSZipObject;
    } | null>(null);

    const createSampleZipFiles = () => {
      const zip = new JSZip();
      zip.file("samples/sample1.wav", "dummy");
      zip.file("samples/sample2.wav", "dummy");
      zip.file("samples/oto.ini", "dummy");
      return zip.files;
    };

    useEffect(() => {
      setZipFiles(createSampleZipFiles());
    }, []);

    const dummyFile = new File([""], "sample.zip", { type: "application/zip" });

    const LoadZip = (file: File, encoding?: string) => {
      console.log("LoadZip called with encoding:", encoding);
    };

    return (
      <LoadZipButtonArea
        file={dummyFile}
        encoding={encoding}
        zipFiles={zipFiles}
        LoadZip={LoadZip}
        setDialogOpen={setDialogOpen}
        setProcessing={setProcessing}
        setEncoding={setEncoding}
        setZipFiles={setZipFiles}
      />
    );
  },
};
