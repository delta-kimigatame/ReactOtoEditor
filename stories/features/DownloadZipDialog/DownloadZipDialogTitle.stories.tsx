import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { DownloadZipDialogTitle } from "../../../src/features/DownloadZipDialog/DownloadZipDialogTitle";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { Oto } from "utauoto";
import JSZip from "jszip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

const meta = {
  title: "Components/DownloadZipDialog/DownloadZipDialogTitle",
  component: DownloadZipDialogTitle,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadZipDialogTitle>;

export default meta;
type Story = StoryObj<typeof DownloadZipDialogTitle>;

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
};

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [targetList, setTargetList] = useState<Array<number> | null>([0]);

    return (
      <DownloadZipDialogTitle
        setMenuAnchor={setMenuAnchor}
        setDialogOpen={setOpen}
        storagedOto={sampleStoragedOto}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    );
  },
};

/**
 * ダイアログ内での表示
 */
export const InDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [targetList, setTargetList] = useState<Array<number> | null>([0]);
    const { setTargetDirs, setZipFileName, setReadZip, setOto } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs(["/samples"]);
      setZipFileName("sample.zip");
      
      const zip = new JSZip();
      zip.file("/samples/oto.ini", "dummy content");
      setReadZip(zip.files);

      const oto = createSampleOto("/samples");
      setOto(oto);

      return () => {
        setTargetDirs(null);
        setZipFileName("");
        setReadZip({});
        setOto(null);
      };
    }, [setTargetDirs, setZipFileName, setReadZip, setOto]);

    return (
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DownloadZipDialogTitle
          setMenuAnchor={setMenuAnchor}
          setDialogOpen={setOpen}
          storagedOto={sampleStoragedOto}
          targetList={targetList}
          setTargetList={setTargetList}
        />
        <DialogContent>
          <p>ダイアログの内容</p>
        </DialogContent>
      </Dialog>
    );
  },
};
