import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MakePanelVowelAccordion } from "../../../../src/features/TargetDirDialog/MakePanel/MakePanelVowelAccordion";

const meta = {
  title: "Components/TargetDirDialog/MakePanel/MakePanelVowelAccordion",
  component: MakePanelVowelAccordion,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MakePanelVowelAccordion>;

export default meta;
type Story = StoryObj<typeof MakePanelVowelAccordion>;

/**
 * デフォルト表示（日本語母音）
 */
export const Default: Story = {
  render: () => {
    const [vowel, setVowel] = useState([
      { vowel: "a", variant: "あ" },
      { vowel: "i", variant: "い" },
      { vowel: "u", variant: "う" },
      { vowel: "e", variant: "え" },
      { vowel: "o", variant: "お" },
    ]);

    return <MakePanelVowelAccordion vowel={vowel} setVowel={setVowel} />;
  },
};

/**
 * 空の状態
 */
export const Empty: Story = {
  render: () => {
    const [vowel, setVowel] = useState([{ vowel: "", variant: "" }]);

    return <MakePanelVowelAccordion vowel={vowel} setVowel={setVowel} />;
  },
};

/**
 * 多数の母音
 */
export const ManyVowels: Story = {
  render: () => {
    const [vowel, setVowel] = useState([
      { vowel: "a", variant: "あ,ア" },
      { vowel: "i", variant: "い,イ" },
      { vowel: "u", variant: "う,ウ" },
      { vowel: "e", variant: "え,エ" },
      { vowel: "o", variant: "お,オ" },
      { vowel: "n", variant: "ん,ン" },
    ]);

    return <MakePanelVowelAccordion vowel={vowel} setVowel={setVowel} />;
  },
};
