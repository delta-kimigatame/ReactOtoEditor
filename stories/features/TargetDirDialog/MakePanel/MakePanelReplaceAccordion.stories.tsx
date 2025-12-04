import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MakePanelReplaceAccordion } from "../../../../src/features/TargetDirDialog/MakePanel/MakePanelReplaceAccordion";

const meta = {
  title: "Components/TargetDirDialog/MakePanel/MakePanelReplaceAccordion",
  component: MakePanelReplaceAccordion,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MakePanelReplaceAccordion>;

export default meta;
type Story = StoryObj<typeof MakePanelReplaceAccordion>;

/**
 * デフォルト表示（一般的な置換パターン）
 */
export const Default: Story = {
  render: () => {
    const [replace, setReplace] = useState<Array<[string, string]>>([
      ["_", ""],
      ["-", ""],
    ]);

    return <MakePanelReplaceAccordion replace={replace} setReplace={setReplace} />;
  },
};

/**
 * 空の状態
 */
export const Empty: Story = {
  render: () => {
    const [replace, setReplace] = useState<Array<[string, string]>>([["", ""]]);

    return <MakePanelReplaceAccordion replace={replace} setReplace={setReplace} />;
  },
};

/**
 * 多数の置換ルール
 */
export const ManyRules: Story = {
  render: () => {
    const [replace, setReplace] = useState<Array<[string, string]>>([
      ["_", ""],
      ["-", ""],
      [".", ""],
      ["　", " "],
      ["１", "1"],
      ["２", "2"],
      ["３", "3"],
    ]);

    return <MakePanelReplaceAccordion replace={replace} setReplace={setReplace} />;
  },
};

/**
 * UTAU音源の実際の置換例
 */
export const RealWorldExample: Story = {
  render: () => {
    const [replace, setReplace] = useState<Array<[string, string]>>([
      ["_あ", "あ"],
      ["_い", "い"],
      ["_う", "う"],
      ["_え", "え"],
      ["_お", "お"],
      ["_", ""],
    ]);

    return <MakePanelReplaceAccordion replace={replace} setReplace={setReplace} />;
  },
};
