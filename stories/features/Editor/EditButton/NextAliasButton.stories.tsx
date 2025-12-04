import type { Meta, StoryObj } from "@storybook/react";
import { NextAliasButton } from "../../../../src/features/Editor/EditButtn/NextAliasButton";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";

/**
 * `NextAliasButton` は、次のエイリアスに移動するボタンです。
 */
const meta: Meta<typeof NextAliasButton> = {
  title: "Components/Editor/EditButton/NextAliasButton",
  component: NextAliasButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NextAliasButton>;

/**
 * デフォルトの次へボタン。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir, setOto, setRecord } = useOtoProjectStore();
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(0);
    const [maxAliasIndex, setMaxAliasIndex] = useState(2);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOtoText = `sample1.wav=あ,1000,100,50,120,-50
sample1.wav=い,1000,100,50,120,-50
sample1.wav=う,1000,100,50,120,-50
sample2.wav=か,1000,80,50,100,-40`;

      const oto_ = new Oto();
      oto_.InputOtoAsync("/samples", new Blob([sampleOtoText], { type: "text/plain" }), "UTF-8").then(() => {
        setTargetDir("/samples");
        setOto(oto_);
        setRecord(oto_.GetRecord("/samples", "sample1.wav", "あ"));
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setRecord(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto, setRecord]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <NextAliasButton
        size={40}
        iconSize={30}
        maxFileIndex={1}
        fileIndex={fileIndex}
        maxAliasIndex={maxAliasIndex}
        aliasIndex={aliasIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
        progress={false}
      />
    );
  },
};

/**
 * 最後のエイリアス（無効状態）。
 */
export const Disabled: Story = {
  render: () => {
    const { setTargetDir, setOto, setRecord } = useOtoProjectStore();
    const [fileIndex, setFileIndex] = useState(1);
    const [aliasIndex, setAliasIndex] = useState(0);
    const [maxAliasIndex, setMaxAliasIndex] = useState(0);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOtoText = `sample1.wav=あ,1000,100,50,120,-50
sample2.wav=か,1000,80,50,100,-40`;

      const oto_ = new Oto();
      oto_.InputOtoAsync("/samples", new Blob([sampleOtoText], { type: "text/plain" }), "UTF-8").then(() => {
        setTargetDir("/samples");
        setOto(oto_);
        setRecord(oto_.GetRecord("/samples", "sample2.wav", "か"));
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setRecord(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto, setRecord]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <NextAliasButton
        size={40}
        iconSize={30}
        maxFileIndex={1}
        fileIndex={fileIndex}
        maxAliasIndex={maxAliasIndex}
        aliasIndex={aliasIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
        progress={false}
      />
    );
  },
};
