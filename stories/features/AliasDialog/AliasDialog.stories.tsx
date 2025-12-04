import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { AliasDialog } from "../../../src/features/AliasDialog/AliasDialog";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { Oto } from "utauoto";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/AliasDialog/AliasDialog",
  component: AliasDialog,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AliasDialog>;

export default meta;
type Story = StoryObj<typeof AliasDialog>;

const createSampleOto = (dirname: string) => {
  const oto = new Oto();
  oto.ParseOto(
    dirname,
    `sample1.wav=あ,100,200,300,400,500
sample1.wav=い,110,210,310,410,510
sample2.wav=う,120,220,320,420,520`
  );
  return oto;
};

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(0);
    const [maxAliasIndex, setMaxAliasIndex] = useState(1);
    const [maxFileIndex, setMaxFileIndex] = useState(1);
    const { setTargetDir, setOto, setRecord, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setTargetDir("/samples");
      setOto(sampleOto);
      setRecord(sampleOto.GetRecord("/samples", "sample1.wav", "あ"));
      setIsReady(true);

      return () => {
        setTargetDir("");
        setOto(null);
        setRecord(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto, setRecord]);

    if (!isReady || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          エイリアスダイアログを開く
        </Button>
        <AliasDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          setUpdateSignal={setUpdateSignal}
          fileIndex={fileIndex}
          aliasIndex={aliasIndex}
          maxAliasIndex={maxAliasIndex}
          maxFileIndex={maxFileIndex}
          setFileIndex={setFileIndex}
          setAliasIndex={setAliasIndex}
          setMaxAliasIndex={setMaxAliasIndex}
        />
      </>
    );
  },
};

/**
 * 開いた状態
 */
export const Opened: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(0);
    const [maxAliasIndex, setMaxAliasIndex] = useState(1);
    const [maxFileIndex, setMaxFileIndex] = useState(1);
    const { setTargetDir, setOto, setRecord, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setTargetDir("/samples");
      setOto(sampleOto);
      setRecord(sampleOto.GetRecord("/samples", "sample1.wav", "あ"));
      setIsReady(true);

      return () => {
        setTargetDir("");
        setOto(null);
        setRecord(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto, setRecord]);

    if (!isReady || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <AliasDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setUpdateSignal={setUpdateSignal}
        fileIndex={fileIndex}
        aliasIndex={aliasIndex}
        maxAliasIndex={maxAliasIndex}
        maxFileIndex={maxFileIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
      />
    );
  },
};

/**
 * 2つ目のエイリアスを選択
 */
export const SecondAlias: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(1);
    const [maxAliasIndex, setMaxAliasIndex] = useState(1);
    const [maxFileIndex, setMaxFileIndex] = useState(1);
    const { setTargetDir, setOto, setRecord, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setTargetDir("/samples");
      setOto(sampleOto);
      setRecord(sampleOto.GetRecord("/samples", "sample1.wav", "い"));
      setIsReady(true);

      return () => {
        setTargetDir("");
        setOto(null);
        setRecord(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto, setRecord]);

    if (!isReady || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <AliasDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setUpdateSignal={setUpdateSignal}
        fileIndex={fileIndex}
        aliasIndex={aliasIndex}
        maxAliasIndex={maxAliasIndex}
        maxFileIndex={maxFileIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
      />
    );
  },
};
