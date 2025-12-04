import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TargetDirDialogTitle } from "../../../src/components/TargetDirDialog/TargetDirDialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

const meta = {
  title: "Components/TargetDirDialog/TargetDirDialogTitle",
  component: TargetDirDialogTitle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TargetDirDialogTitle>;

export default meta;
type Story = StoryObj<typeof TargetDirDialogTitle>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return <TargetDirDialogTitle setDialogOpen={setOpen} />;
  },
};

/**
 * ダイアログ内での表示
 */
export const InDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <>
        <button onClick={() => setOpen(true)}>ダイアログを開く</button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <TargetDirDialogTitle setDialogOpen={setOpen} />
          <DialogContent>
            <Typography>ダイアログの内容</Typography>
          </DialogContent>
        </Dialog>
      </>
    );
  },
};
