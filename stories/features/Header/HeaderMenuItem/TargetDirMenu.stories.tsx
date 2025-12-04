import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { TargetDirMenu } from "../../../../src/features/Header/HeaderMenuItem/TargetDirMenu";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";
import { Oto } from "utauoto";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/Header/HeaderMenuItem/TargetDirMenu",
  component: TargetDirMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TargetDirMenu>;

export default meta;
type Story = StoryObj<typeof TargetDirMenu>;

const createSampleOto = (dirname: string) => {
  const oto = new Oto();
  oto.ParseOto(
    dirname,
    `sample1.wav=,100,200,300,400,500
sample2.wav=,150,250,350,450,550`
  );
  return oto;
};

/**
 * メニュー内での表示（複数ディレクトリ）
 */
export const Default: Story = {
  render: () => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [buttonAnchor, setButtonAnchor] = useState<null | HTMLElement>(null);
    const { setZipFileName, setTargetDirs, setTargetDir, setOto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setZipFileName("sample.zip");
      setTargetDirs(["/samples", "/samples/sub"]);
      setTargetDir("/samples");
      setOto(sampleOto);
      setIsReady(true);

      return () => {
        setZipFileName("");
        setTargetDirs(null);
        setTargetDir("");
        setOto(null);
        setIsReady(false);
      };
    }, [setZipFileName, setTargetDirs, setTargetDir, setOto]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <Button variant="contained" onClick={(e) => setButtonAnchor(e.currentTarget)}>
          メニューを開く
        </Button>
        <Menu
          anchorEl={buttonAnchor}
          open={Boolean(buttonAnchor)}
          onClose={() => setButtonAnchor(null)}
        >
          <TargetDirMenu setMenuAnchor={setMenuAnchor} />
        </Menu>
      </>
    );
  },
};

/**
 * 単一ディレクトリ（メニューが表示されない）
 */
export const SingleDirectory: Story = {
  render: () => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [buttonAnchor, setButtonAnchor] = useState<null | HTMLElement>(null);
    const { setZipFileName, setTargetDirs, setTargetDir, setOto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setZipFileName("sample.zip");
      setTargetDirs(["/samples"]);
      setTargetDir("/samples");
      setOto(sampleOto);
      setIsReady(true);

      return () => {
        setZipFileName("");
        setTargetDirs(null);
        setTargetDir("");
        setOto(null);
        setIsReady(false);
      };
    }, [setZipFileName, setTargetDirs, setTargetDir, setOto]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <Button variant="contained" onClick={(e) => setButtonAnchor(e.currentTarget)}>
          メニューを開く
        </Button>
        <Menu
          anchorEl={buttonAnchor}
          open={Boolean(buttonAnchor)}
          onClose={() => setButtonAnchor(null)}
        >
          <TargetDirMenu setMenuAnchor={setMenuAnchor} />
        </Menu>
      </>
    );
  },
};
