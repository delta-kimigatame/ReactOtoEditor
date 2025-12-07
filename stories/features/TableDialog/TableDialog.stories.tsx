import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { TableDialog } from "../../../src/features/TableDialog/TableDialog";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { Oto } from "utauoto";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/TableDialog/TableDialog",
  component: TableDialog,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TableDialog>;

export default meta;
type Story = StoryObj<typeof TableDialog>;

const createSampleOto = (dirname: string) => {
  const oto = new Oto();
  oto.ParseOto(
    dirname,
    `01_あかきくけこ.wav=あ,100,150,200,50,100
01_あかきくけこ.wav=か,120,150,210,60,110
01_あかきくけこ.wav=き,140,150,220,70,120
01_あかきくけこ.wav=く,160,150,230,80,130
01_あかきくけこ.wav=け,180,150,240,90,140
01_あかきくけこ.wav=こ,200,150,250,100,150
02_あいうえお.wav=あ,100,150,200,50,100
02_あいうえお.wav=い,120,150,210,60,110
02_あいうえお.wav=う,140,150,220,70,120
02_あいうえお.wav=え,160,150,230,80,130
02_あいうえお.wav=お,180,150,240,90,140`
  );
  return oto;
};

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(0);
    const [maxAliasIndex, setMaxAliasIndex] = useState(5);
    const { setTargetDir, setOto, setRecord, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setTargetDir("/samples");
      setOto(sampleOto);
      setRecord(sampleOto.GetRecord("/samples", "01_あかきくけこ.wav", "あ"));
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
          パラメータ一覧を開く
        </Button>
        <TableDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          windowWidth={1200}
          windowHeight={800}
          updateSignal={0}
          fileIndex={fileIndex}
          aliasIndex={aliasIndex}
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
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(0);
    const [maxAliasIndex, setMaxAliasIndex] = useState(5);
    const { setTargetDir, setOto, setRecord, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setTargetDir("/samples");
      setOto(sampleOto);
      setRecord(sampleOto.GetRecord("/samples", "01_あかきくけこ.wav", "あ"));
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
      <TableDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        windowWidth={1200}
        windowHeight={800}
        updateSignal={0}
        fileIndex={fileIndex}
        aliasIndex={aliasIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
      />
    );
  },
};
