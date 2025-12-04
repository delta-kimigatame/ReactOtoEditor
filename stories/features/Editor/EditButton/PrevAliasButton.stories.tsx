import type { Meta, StoryObj } from "@storybook/react";
import { PrevAliasButton } from "../../../../src/features/Editor/EditButtn/PrevAliasButtn";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";

/**
 * `PrevAliasButton` は、前のエイリアスに移動するボタンです。
 */
const meta: Meta<typeof PrevAliasButton> = {
  title: "Components/Editor/EditButton/PrevAliasButton",
  component: PrevAliasButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PrevAliasButton>;

/**
 * デフォルトの前へボタン。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir, setOto, setRecord } = useOtoProjectStore();
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(1);
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
        setRecord(oto_.GetRecord("/samples", "sample1.wav", "い"));
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
      <PrevAliasButton
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
 * 最初のエイリアス（無効状態）。
 */
export const Disabled: Story = {
  render: () => {
    const { setTargetDir, setOto, setRecord } = useOtoProjectStore();
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(0);
    const [maxAliasIndex, setMaxAliasIndex] = useState(2);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOtoText = `sample1.wav=あ,1000,100,50,120,-50
sample1.wav=い,1000,100,50,120,-50
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
      <PrevAliasButton
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
