import type { Meta, StoryObj } from "@storybook/react";
import { PlayBeforePreutterButton } from "../../../../src/features/Editor/EditButtn/PlayBeforePreutterButton";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";

/**
 * `PlayBeforePreutterButton` は、左ブランクから先行発声までを再生するボタンです。
 */
const meta: Meta<typeof PlayBeforePreutterButton> = {
  title: "Components/Editor/EditButton/PlayBeforePreutterButton",
  component: PlayBeforePreutterButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlayBeforePreutterButton>;

/**
 * デフォルトの先行発声前再生ボタン。グレー→緑→グレー→赤のグラデーション背景。
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

    return <PlayBeforePreutterButton size={40} iconSize={30} />;
  },
};
