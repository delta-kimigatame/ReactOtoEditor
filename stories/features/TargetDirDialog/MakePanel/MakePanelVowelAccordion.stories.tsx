import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
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

/**
 * 開いた状態
 */
export const Expanded: Story = {
  render: () => {
    const [vowel, setVowel] = useState([
      { vowel: "a", variant: "あ,ア" },
      { vowel: "i", variant: "い,イ" },
      { vowel: "u", variant: "う,ウ" },
      { vowel: "e", variant: "え,エ" },
      { vowel: "o", variant: "お,オ" },
    ]);

    // Accordionを自動的に開く
    useEffect(() => {
      const expandAccordion = () => {
        const accordionSummary = document.querySelector('.MuiAccordionSummary-root') as HTMLElement;
        
        if (accordionSummary && accordionSummary.getAttribute('aria-expanded') === 'false') {
          accordionSummary.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          accordionSummary.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          accordionSummary.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
      };

      const timer = setTimeout(expandAccordion, 100);
      return () => clearTimeout(timer);
    }, []);

    return <MakePanelVowelAccordion vowel={vowel} setVowel={setVowel} />;
  },
};
