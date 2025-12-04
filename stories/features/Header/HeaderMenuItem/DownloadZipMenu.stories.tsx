import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { DownloadZipMenu } from "../../../../src/features/Header/HeaderMenuItem/DownloadZipMenu";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";
import JSZip from "jszip";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/Header/HeaderMenuItem/DownloadZipMenu",
  component: DownloadZipMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadZipMenu>;

export default meta;
type Story = StoryObj<typeof DownloadZipMenu>;

/**
 * メニュー内での表示
 */
export const Default: Story = {
  render: () => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [buttonAnchor, setButtonAnchor] = useState<null | HTMLElement>(null);
    const { setZipFileName, setReadZip, setTargetDirs, setTargetDir } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      setZipFileName("sample.zip");
      setTargetDirs(["/samples"]);
      setTargetDir("/samples");
      
      const zip = new JSZip();
      zip.file("/samples/oto.ini", "dummy content");
      setReadZip(zip.files);
      setIsReady(true);

      return () => {
        setZipFileName("");
        setTargetDirs(null);
        setTargetDir("");
        setReadZip({});
        setIsReady(false);
      };
    }, [setZipFileName, setReadZip, setTargetDirs, setTargetDir]);

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
          <DownloadZipMenu setMenuAnchor={setMenuAnchor} />
        </Menu>
      </>
    );
  },
};
