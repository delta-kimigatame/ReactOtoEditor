import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { DownloadZipDialogContent } from "../../../src/features/DownloadZipDialog/DownloadZipDialogContent";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { Oto } from "utauoto";
import JSZip from "jszip";

const meta = {
  title: "Components/DownloadZipDialog/DownloadZipDialogContent",
  component: DownloadZipDialogContent,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadZipDialogContent>;

export default meta;
type Story = StoryObj<typeof DownloadZipDialogContent>;

const createSampleOto = (dirname: string) => {
  const oto = new Oto();
  oto.ParseOto(
    dirname,
    `sample1.wav=,100,200,300,400,500
sample2.wav=,150,250,350,450,550`
  );
  return oto;
};

const sampleStoragedOto = {
  "/samples": {
    oto: createSampleOto("/samples"),
    update_date: "2025-12-01 10:00",
  },
  "/samples/sub": {
    oto: createSampleOto("/samples/sub"),
    update_date: "2025-12-02 15:30",
  },
};

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => {
    const [targetList, setTargetList] = useState<Array<number> | null>([0, 0]);
    const { setTargetDirs, setTargetDir, setReadZip, targetDirs } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      setTargetDirs(["/samples", "/samples/sub"]);
      setTargetDir("/samples");
      
      const zip = new JSZip();
      zip.file("/samples/oto.ini", "dummy content");
      zip.file("/samples/sub/oto.ini", "dummy content");
      setReadZip(zip.files);
      setIsReady(true);

      return () => {
        setTargetDirs(null);
        setTargetDir("");
        setReadZip({});
        setIsReady(false);
      };
    }, [setTargetDirs, setTargetDir, setReadZip]);

    if (!isReady || !targetDirs) {
      return <div>Loading...</div>;
    }

    return (
      <DownloadZipDialogContent
        storagedOto={sampleStoragedOto}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    );
  },
};

/**
 * 単一ディレクトリ
 */
export const SingleDirectory: Story = {
  render: () => {
    const [targetList, setTargetList] = useState<Array<number> | null>([0]);
    const { setTargetDirs, setTargetDir, setReadZip, targetDirs } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      setTargetDirs(["/samples"]);
      setTargetDir("/samples");
      
      const zip = new JSZip();
      zip.file("/samples/oto.ini", "dummy content");
      setReadZip(zip.files);
      setIsReady(true);

      return () => {
        setTargetDirs(null);
        setTargetDir("");
        setReadZip({});
        setIsReady(false);
      };
    }, [setTargetDirs, setTargetDir, setReadZip]);

    if (!isReady || !targetDirs) {
      return <div>Loading...</div>;
    }

    return (
      <DownloadZipDialogContent
        storagedOto={{ "/samples": sampleStoragedOto["/samples"] }}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    );
  },
};
