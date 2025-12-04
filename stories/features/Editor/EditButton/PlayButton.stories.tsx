import type { Meta, StoryObj } from "@storybook/react";
import { PlayButton } from "../../../../src/features/Editor/EditButtn/PlayButton";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { GenerateWave, Wave } from "utauwav";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";

/**
 * `PlayButton` は、メトロノームの4拍目に先行発声が合うように再生するボタンです。
 */
const meta: Meta<typeof PlayButton> = {
  title: "Components/Editor/EditButton/PlayButton",
  component: PlayButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlayButton>;

/**
 * デフォルトの再生ボタン（メトロノームなし・無効状態）。
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

    return <PlayButton size={40} iconSize={30} metronome={null} />;
  },
};

/**
 * メトロノーム有効状態。
 */
export const WithMetronome: Story = {
  render: () => {
    const { setTargetDir, setOto, setRecord } = useOtoProjectStore();
    const [metronome, setMetronome] = useState<Wave | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOtoText = `sample1.wav=あ,1000,100,50,120,-50`;

      const oto_ = new Oto();
      oto_.InputOtoAsync("/samples", new Blob([sampleOtoText], { type: "text/plain" }), "UTF-8").then(() => {
        setTargetDir("/samples");
        setOto(oto_);
        setRecord(oto_.GetRecord("/samples", "sample1.wav", "あ"));
        
        // ダミーのメトロノームWaveを作成
        const dummyMetronome = GenerateWave(44100,16,[0,0,0,0])
        setMetronome(dummyMetronome);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setRecord(null);
        setMetronome(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto, setRecord]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return <PlayButton size={40} iconSize={30} metronome={metronome} />;
  },
};
