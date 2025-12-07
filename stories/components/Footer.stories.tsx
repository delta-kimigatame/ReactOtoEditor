import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "../../src/components/Fotter";

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof Footer>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => <Footer />,
};
