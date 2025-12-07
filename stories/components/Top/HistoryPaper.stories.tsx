import type { Meta, StoryObj } from "@storybook/react";
import { HistoryPaper } from "../../../src/components/Top/HistoryPaper";

const meta = {
  title: "Components/Top/HistoryPaper",
  component: HistoryPaper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HistoryPaper>;

export default meta;
type Story = StoryObj<typeof HistoryPaper>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => <HistoryPaper />,
};
