import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { LanguageMenu } from "../../../../src/features/Header/HeaderMenuItem/LanguageMenu";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/Header/HeaderMenuItem/LanguageMenu",
  component: LanguageMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LanguageMenu>;

export default meta;
type Story = StoryObj<typeof LanguageMenu>;

/**
 * メニュー内での表示
 */
export const Default: Story = {
  render: () => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [buttonAnchor, setButtonAnchor] = useState<null | HTMLElement>(null);

    return (
      <>
        <Button variant="contained" onClick={(e) => setButtonAnchor(e.currentTarget)}>
          メニューを開く
        </Button>
        <Menu
          anchorEl={buttonAnchor}
          open={Boolean(buttonAnchor)}
          onClose={() => setButtonAnchor(null)}
        >
          <LanguageMenu setMenuAnchor={setMenuAnchor} />
        </Menu>
      </>
    );
  },
};
