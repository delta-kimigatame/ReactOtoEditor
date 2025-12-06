import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { MakePanelSettingsAccordion } from "../../../src/components/TargetDirDialog/MakePanelSettingsAccordion";

const meta = {
  title: "Components/TargetDirDialog/MakePanelSettingsAccordion",
  component: MakePanelSettingsAccordion,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MakePanelSettingsAccordion>;

export default meta;
type Story = StoryObj<typeof MakePanelSettingsAccordion>;

/**
 * デフォルト表示（閉じた状態）
 */
export const Default: Story = {
  render: () => {
    const [tempo, setTempo] = useState(120);
    const [offset, setOffset] = useState(1000);
    const [maxnum, setMaxnum] = useState(2);
    const [underbar, setUnderbar] = useState(false);
    const [beginingCv, setBeginingCv] = useState(false);
    const [requireHead, setRequireHead] = useState(true);
    const [requireVCV, setRequireVCV] = useState(true);
    const [requireOnlyConsonant, setRequireOnlyConsonant] = useState(false);
    const [vowel, setVowel] = useState<Array<{ vowel: string; variant: string }>>([
      { vowel: "a", variant: "あ,ア" },
      { vowel: "i", variant: "い,イ" },
      { vowel: "u", variant: "う,ウ" },
      { vowel: "e", variant: "え,エ" },
      { vowel: "o", variant: "お,オ" },
    ]);
    const [consonant, setConsonant] = useState<
      Array<{ consonant: string; variant: string; length: number }>
    >([
      { consonant: "k", variant: "か,カ", length: 60 },
      { consonant: "s", variant: "さ,サ", length: 60 },
      { consonant: "t", variant: "た,タ", length: 60 },
    ]);
    const [replace, setReplace] = useState<Array<[before: string, after: string]>>([]);

    return (
      <MakePanelSettingsAccordion
        tempo={tempo}
        setTempo={setTempo}
        offset={offset}
        setOffset={setOffset}
        maxnum={maxnum}
        setMaxnum={setMaxnum}
        underbar={underbar}
        setUnderbar={setUnderbar}
        beginingCv={beginingCv}
        setBeginingCv={setBeginingCv}
        requireHead={requireHead}
        setRequireHead={setRequireHead}
        requireVCV={requireVCV}
        setRequireVCV={setRequireVCV}
        requireOnlyConsonant={requireOnlyConsonant}
        setRequireOnlyConsonant={setRequireOnlyConsonant}
        vowel={vowel}
        setVowel={setVowel}
        consonant={consonant}
        setConsonant={setConsonant}
        replace={replace}
        setReplace={setReplace}
      />
    );
  },
};

/**
 * 開いた状態
 */
export const Expanded: Story = {
  render: () => {
    const [tempo, setTempo] = useState(120);
    const [offset, setOffset] = useState(1000);
    const [maxnum, setMaxnum] = useState(2);
    const [underbar, setUnderbar] = useState(false);
    const [beginingCv, setBeginingCv] = useState(false);
    const [requireHead, setRequireHead] = useState(true);
    const [requireVCV, setRequireVCV] = useState(true);
    const [requireOnlyConsonant, setRequireOnlyConsonant] = useState(false);
    const [vowel, setVowel] = useState<Array<{ vowel: string; variant: string }>>([
      { vowel: "a", variant: "あ,ア" },
      { vowel: "i", variant: "い,イ" },
      { vowel: "u", variant: "う,ウ" },
      { vowel: "e", variant: "え,エ" },
      { vowel: "o", variant: "お,オ" },
    ]);
    const [consonant, setConsonant] = useState<
      Array<{ consonant: string; variant: string; length: number }>
    >([
      { consonant: "k", variant: "か,カ", length: 60 },
      { consonant: "s", variant: "さ,サ", length: 60 },
      { consonant: "t", variant: "た,タ", length: 60 },
    ]);
    const [replace, setReplace] = useState<Array<[before: string, after: string]>>([]);

    // Accordionを自動的に開く
    useEffect(() => {
      const expandAccordion = () => {
        const accordionSummary = document.querySelector('[data-testid="settings-accordion-summary"]') as HTMLElement;
        
        if (accordionSummary && accordionSummary.getAttribute('aria-expanded') === 'false') {
          accordionSummary.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
          accordionSummary.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
          accordionSummary.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }
      };

      const timer = setTimeout(expandAccordion, 100);
      return () => clearTimeout(timer);
    }, []);

    return (
      <MakePanelSettingsAccordion
        tempo={tempo}
        setTempo={setTempo}
        offset={offset}
        setOffset={setOffset}
        maxnum={maxnum}
        setMaxnum={setMaxnum}
        underbar={underbar}
        setUnderbar={setUnderbar}
        beginingCv={beginingCv}
        setBeginingCv={setBeginingCv}
        requireHead={requireHead}
        setRequireHead={setRequireHead}
        requireVCV={requireVCV}
        setRequireVCV={setRequireVCV}
        requireOnlyConsonant={requireOnlyConsonant}
        setRequireOnlyConsonant={setRequireOnlyConsonant}
        vowel={vowel}
        setVowel={setVowel}
        consonant={consonant}
        setConsonant={setConsonant}
        replace={replace}
        setReplace={setReplace}
      />
    );
  },
};
