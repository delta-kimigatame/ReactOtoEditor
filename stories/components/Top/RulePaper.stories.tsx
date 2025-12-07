import type { Meta, StoryObj } from "@storybook/react";
import { RulePaper } from "../../../src/components/Top/RulePaper";

const meta = {
  title: "Components/Top/RulePaper",
  component: RulePaper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RulePaper>;

export default meta;
type Story = StoryObj<typeof RulePaper>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => <RulePaper />,
};
