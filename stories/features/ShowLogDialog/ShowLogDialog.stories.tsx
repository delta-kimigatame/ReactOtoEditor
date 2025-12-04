import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ShowLogDialog } from "../../../src/features/ShowLogDialog/ShowLogDialog";
import { LOG } from "../../../src/lib/Logging";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/ShowLogDialog/ShowLogDialog",
  component: ShowLogDialog,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShowLogDialog>;

export default meta;
type Story = StoryObj<typeof ShowLogDialog>;

/**
 * デフォルト表示（ログなし）
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          ログダイアログを開く
        </Button>
        <ShowLogDialog
          open={open}
          onClose={() => setOpen(false)}
          setMenuAnchor={setMenuAnchor}
        />
      </>
    );
  },
};

/**
 * 開いた状態（ログなし）
 */
export const Opened: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    LOG.clear();

    return (
      <ShowLogDialog
        open={open}
        onClose={() => setOpen(false)}
        setMenuAnchor={setMenuAnchor}
      />
    );
  },
};

/**
 * ログがある状態
 */
export const WithLogs: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    LOG.clear();
    LOG.info("アプリケーション起動", "App");
    LOG.debug("デバッグメッセージ 1", "Component1");
    LOG.debug("デバッグメッセージ 2", "Component2");
    LOG.warn("警告メッセージ", "System");
    LOG.error("エラーメッセージ", "System");
    LOG.info("処理完了", "App");

    return (
      <ShowLogDialog
        open={open}
        onClose={() => setOpen(false)}
        setMenuAnchor={setMenuAnchor}
      />
    );
  },
};

/**
 * 多数のログ
 */
export const ManyLogs: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    LOG.clear();
    for (let i = 0; i < 50; i++) {
      LOG.debug(`ログメッセージ ${i + 1}`, `Component${i % 5}`);
      if (i % 10 === 0) {
        LOG.warn(`警告メッセージ ${i}`, "System");
      }
      if (i % 20 === 0) {
        LOG.error(`エラーメッセージ ${i}`, "System");
      }
    }

    return (
      <ShowLogDialog
        open={open}
        onClose={() => setOpen(false)}
        setMenuAnchor={setMenuAnchor}
      />
    );
  },
};
