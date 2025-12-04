import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import { TargetDirDialogTabPanelTemplate } from "../../../src/features/TargetDirDialog/TargetDirDialogTabPanelTemplate";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import Box from "@mui/material/Box";

/**
 * `TargetDirDialogTabPanelTemplate` は、テンプレート oto.ini をファイルから読み込むタブパネルです。
 */
const meta: Meta<typeof TargetDirDialogTabPanelTemplate> = {
  title: "Components/TargetDirDialog/TargetDirDialogTabPanelTemplate",
  component: TargetDirDialogTabPanelTemplate,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Box sx={{ width: "600px", maxHeight: "600px", overflow: "auto" }}>
        <TabContext value="3">
          <Story />
        </TabContext>
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TargetDirDialogTabPanelTemplate>;

/**
 * デフォルトのテンプレート読み込みパネル。ファイル読み込み前の初期状態です。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      setTargetDir("/samples");
      setIsReady(true);

      return () => {
        setTargetDir(null);
        setIsReady(false);
      };
    }, [setTargetDir]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabPanelTemplate
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * サブディレクトリのケース。
 */
export const WithSubDirectory: Story = {
  render: () => {
    const { setTargetDir } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      setTargetDir("/voice_bank/cv");
      setIsReady(true);

      return () => {
        setTargetDir(null);
        setIsReady(false);
      };
    }, [setTargetDir]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabPanelTemplate
        setDialogOpen={setDialogOpen}
      />
    );
  },
};
