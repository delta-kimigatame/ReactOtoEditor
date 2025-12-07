import type { Meta, StoryObj } from "@storybook/react";
import { TopView } from "../../../src/components/Top/TopView";

const meta = {
  title: "Components/Top/TopView",
  component: TopView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TopView>;

export default meta;
type Story = StoryObj<typeof TopView>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => <TopView />,
};
