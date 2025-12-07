import type { Meta, StoryObj } from "@storybook/react";
import { PrivacyPaper } from "../../../src/components/Top/PrivacyPaper";

const meta = {
  title: "Components/Top/PrivacyPaper",
  component: PrivacyPaper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PrivacyPaper>;

export default meta;
type Story = StoryObj<typeof PrivacyPaper>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => <PrivacyPaper />,
};
