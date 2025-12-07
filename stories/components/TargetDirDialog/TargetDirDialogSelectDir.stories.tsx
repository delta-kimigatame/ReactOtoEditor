import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { TargetDirDialogSelectDir } from "../../../src/components/TargetDirDialog/TargetDirDialogSelectDir";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

const meta = {
  title: "Components/TargetDirDialog/TargetDirDialogSelectDir",
  component: TargetDirDialogSelectDir,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TargetDirDialogSelectDir>;

export default meta;
type Story = StoryObj<typeof TargetDirDialogSelectDir>;

/**
 * デフォルト表示（ルートディレクトリのみ）
 */
export const Default: Story = {
  render: () => {
    const { setTargetDirs, setTargetDir } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([""]);
      setTargetDir("");
      return () => {
        setTargetDirs(null);
        setTargetDir("");
      };
    }, [setTargetDirs, setTargetDir]);

    return <TargetDirDialogSelectDir />;
  },
};

/**
 * 複数のディレクトリ
 */
export const MultipleDirectories: Story = {
  render: () => {
    const { setTargetDirs, setTargetDir } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs(["", "samples/voice1", "samples/voice2", "samples/voice3"]);
      setTargetDir("");
      return () => {
        setTargetDirs(null);
        setTargetDir("");
      };
    }, [setTargetDirs, setTargetDir]);

    return <TargetDirDialogSelectDir />;
  },
};
