import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MakePanelConsonantAccordion } from "../../../../src/features/TargetDirDialog/MakePanel/MakePanelConsonantAccordion";

const meta = {
  title: "Components/TargetDirDialog/MakePanel/MakePanelConsonantAccordion",
  component: MakePanelConsonantAccordion,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MakePanelConsonantAccordion>;

export default meta;
type Story = StoryObj<typeof MakePanelConsonantAccordion>;

/**
 * デフォルト表示（日本語子音）
 */
export const Default: Story = {
  render: () => {
    const [consonant, setConsonant] = useState([
      { consonant: "k", variant: "か,カ", length: 60 },
      { consonant: "s", variant: "さ,サ", length: 80 },
      { consonant: "t", variant: "た,タ", length: 60 },
      { consonant: "n", variant: "な,ナ", length: 60 },
      { consonant: "h", variant: "は,ハ", length: 80 },
    ]);

    return <MakePanelConsonantAccordion consonant={consonant} setConsonant={setConsonant} />;
  },
};

/**
 * 空の状態
 */
export const Empty: Story = {
  render: () => {
    const [consonant, setConsonant] = useState([{ consonant: "", variant: "", length: 0 }]);

    return <MakePanelConsonantAccordion consonant={consonant} setConsonant={setConsonant} />;
  },
};

/**
 * 多数の子音（正確な設定例）
 */
export const ManyConsonants: Story = {
  render: () => {
    const [consonant, setConsonant] = useState([
      { consonant: "k", variant: "か,カ", length: 60 },
      { consonant: "s", variant: "さ,サ", length: 80 },
      { consonant: "t", variant: "た,タ", length: 60 },
      { consonant: "n", variant: "な,ナ", length: 60 },
      { consonant: "h", variant: "は,ハ", length: 80 },
      { consonant: "m", variant: "ま,マ", length: 60 },
      { consonant: "y", variant: "や,ヤ", length: 80 },
      { consonant: "r", variant: "ら,ラ", length: 60 },
      { consonant: "w", variant: "わ,ワ", length: 60 },
      { consonant: "g", variant: "が,ガ", length: 60 },
      { consonant: "z", variant: "ざ,ザ", length: 80 },
      { consonant: "d", variant: "だ,ダ", length: 60 },
      { consonant: "b", variant: "ば,バ", length: 60 },
      { consonant: "p", variant: "ぱ,パ", length: 60 },
    ]);

    return <MakePanelConsonantAccordion consonant={consonant} setConsonant={setConsonant} />;
  },
};

/**
 * 様々な長さの子音
 */
export const VariousLengths: Story = {
  render: () => {
    const [consonant, setConsonant] = useState([
      { consonant: "k", variant: "か", length: 40 },
      { consonant: "s", variant: "さ", length: 100 },
      { consonant: "t", variant: "た", length: 50 },
      { consonant: "ch", variant: "ちゃ", length: 120 },
    ]);

    return <MakePanelConsonantAccordion consonant={consonant} setConsonant={setConsonant} />;
  },
};
