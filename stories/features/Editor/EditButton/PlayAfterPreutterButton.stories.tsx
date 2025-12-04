import type { Meta, StoryObj } from "@storybook/react";
import { PlayAfterPreutterButton } from "../../../../src/features/Editor/EditButtn/PlayAfterPreutterButton";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";

/**
 * `PlayAfterPreutterButton` は、先行発声から右ブランクまでを再生するボタンです。
 */
const meta: Meta<typeof PlayAfterPreutterButton> = {
  title: "Components/Editor/EditButton/PlayAfterPreutterButton",
  component: PlayAfterPreutterButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlayAfterPreutterButton>;

/**
 * デフォルトの先行発声後再生ボタン。赤→グレー→青のグラデーション背景。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir, setOto, setRecord } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOtoText = `sample1.wav=あ,1000,100,50,120,-50`;

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

    return <PlayAfterPreutterButton size={40} iconSize={30} />;
  },
};
