import type { Meta, StoryObj } from "@storybook/react";
import { LogPaper } from "../../../src/components/Top/LogPaper";
import { LOG } from "../../../src/lib/Logging";

const meta = {
  title: "Components/Top/LogPaper",
  component: LogPaper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LogPaper>;

export default meta;
type Story = StoryObj<typeof LogPaper>;

/**
 * デフォルト表示（ログなし）
 */
export const Default: Story = {
  render: () => <LogPaper />,
};

/**
 * ログがある状態
 */
export const WithLogs: Story = {
  render: () => {
    LOG.clear();
    LOG.info("サンプルログメッセージ 1");
    LOG.warn("サンプルログメッセージ 2");
    LOG.error("サンプルログメッセージ 3");
    
    return <LogPaper />;
  },
};
