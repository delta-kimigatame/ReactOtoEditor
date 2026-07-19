import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useMemo, useState } from "react";
import { Wave } from "utauwav";

import { fftSetting } from "../../../src/config/setting";
import { MelSpecCanvas } from "../../../src/features/Editor/MelSpecCanvas";
import { useCookieStore } from "../../../src/store/cookieStore";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

const meta: Meta<typeof MelSpecCanvas> = {
  title: "Components/Editor/MelSpecCanvas",
  component: MelSpecCanvas,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MelSpecCanvas>;

/** 80ビンのパワーメルスペクトログラム描画例 */
export const Default: Story = {
  render: () => {
    const [specProgress, setSpecProgress] = useState(false);
    const melSpec = useMemo(() => {
      const frames = 100;
      const values = new Float32Array(frames * fftSetting.melBins);
      for (let frame = 0; frame < frames; frame++) {
        for (let bin = 0; bin < fftSetting.melBins; bin++) {
          const firstBand = Math.exp(-((bin - 18 - frame * 0.1) ** 2) / 30);
          const secondBand = Math.exp(-((bin - 48) ** 2) / 60);
          values[frame * fftSetting.melBins + bin] = firstBand + secondBand;
        }
      }
      return values;
    }, []);

    useEffect(() => {
      useCookieStore.getState().setColorTheme("blue");
      useOtoProjectStore.getState().setWav({
        data: new Array(16000).fill(0),
      } as Wave);
      return () => useOtoProjectStore.getState().setWav(null);
    }, []);

    return (
      <MelSpecCanvas
        canvasWidth={800}
        canvasHeight={300}
        melSpec={melSpec}
        melFrames={100}
        melBins={fftSetting.melBins}
        melSpecMax={2}
        frameWidth={16}
        spectrogramSampleRate={fftSetting.spectrogramSampleRate}
        spectrogramHopSize={fftSetting.hopSize}
        setSpecProgress={setSpecProgress}
      />
    );
  },
};
