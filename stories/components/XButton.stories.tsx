import type { Meta, StoryObj } from "@storybook/react";
import { XButton } from "../../src/components/XButton";
import XIcon from "@mui/icons-material/X";

const meta = {
  title: "Components/XButton",
  component: XButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof XButton>;

export default meta;
type Story = StoryObj<typeof XButton>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  args: {
    children: "Xに共有",
  },
};

/**
 * アイコン付き
 */
export const WithIcon: Story = {
  args: {
    children: "Xに共有",
    startIcon: <XIcon />,
  },
};

/**
 * リンク付き
 */
export const WithLink: Story = {
  args: {
    children: "Xに共有",
    startIcon: <XIcon />,
    href: "https://twitter.com/intent/tweet?text=Sample",
    target: "_blank",
  },
};
