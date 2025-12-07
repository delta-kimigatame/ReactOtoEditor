import type { Meta, StoryObj } from "@storybook/react";
import { ShortcutPaper } from "../../../src/components/Top/ShortcutPaper";

const meta = {
  title: "Components/Top/ShortcutPaper",
  component: ShortcutPaper,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShortcutPaper>;

export default meta;
type Story = StoryObj<typeof ShortcutPaper>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => <ShortcutPaper />,
};
