import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { DownloadOtoMenu } from "../../../../src/features/Header/HeaderMenuItem/DownloadOtoMenu";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";
import { Oto } from "utauoto";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/Header/HeaderMenuItem/DownloadOtoMenu",
  component: DownloadOtoMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadOtoMenu>;

export default meta;
type Story = StoryObj<typeof DownloadOtoMenu>;

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
 * メニュー内での表示
 */
export const Default: Story = {
  render: () => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [buttonAnchor, setButtonAnchor] = useState<null | HTMLElement>(null);
    const { setTargetDir, setOto, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setTargetDir("/samples");
      setOto(sampleOto);
      setIsReady(true);

      return () => {
        setTargetDir("");
        setOto(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !oto) {
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
          <DownloadOtoMenu setMenuAnchor={setMenuAnchor} />
        </Menu>
      </>
    );
  },
};
