import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { TargetDirDialog } from "../../../src/components/TargetDirDialog/TargetDirDialog";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/TargetDirDialog/TargetDirDialog",
  component: TargetDirDialog,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TargetDirDialog>;

export default meta;
type Story = StoryObj<typeof TargetDirDialog>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const { setTargetDirs } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([""]);
      return () => {
        setTargetDirs(null);
      };
    }, [setTargetDirs]);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          ダイアログを開く
        </Button>
        <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />
      </>
    );
  },
};

/**
 * 開いた状態
 */
export const Opened: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const { setTargetDirs } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([""]);
      return () => {
        setTargetDirs(null);
      };
    }, [setTargetDirs]);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};
