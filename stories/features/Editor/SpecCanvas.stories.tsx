import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Wave, WaveAnalyse } from "utauwav";
import { SpecCanvas } from "../../../src/features/Editor/SpecCanvas";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { useCookieStore } from "../../../src/store/cookieStore";
import { fftSetting } from "../../../src/config/setting";

const meta: Meta<typeof SpecCanvas> = {
  title: "Components/Editor/SpecCanvas",
  component: SpecCanvas,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    canvasWidth: { control: "number" },
    canvasHeight: { control: "number" },
    frameWidth: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof SpecCanvas>;

/**
 * デフォルト状態（実際の音声ファイルからスペクトログラムを生成）。
 */
export const Default: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    frameWidth: 256,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [spec, setSpec] = useState<Array<Array<number>> | null>(null);
    const [specMax, setSpecMax] = useState(0);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");

      fetch("/samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          wav.channels = fftSetting.channels;
          wav.bitDepth = fftSetting.bitDepth;
          wav.sampleRate = fftSetting.sampleRate;
          wav.RemoveDCOffset();
          wav.VolumeNormalize();

          // スペクトログラム生成
          const wa = new WaveAnalyse();
          if (wav.data) {
            const spectrum = wa.Spectrogram(wav.data);

            let max = 0;
            for (let i = 0; i < spectrum.length; i++) {
              for (let j = 0; j < spectrum[0].length; j++) {
                if (max < Math.max(spectrum[i][j], 0) ** 2) {
                  max = Math.max(spectrum[i][j], 0) ** 2;
                }
              }
            }
            console.log("Spec max:", max);
            setWav(wav);
            setSpec(spectrum);
            setSpecMax(max);
          }
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setSpec(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <SpecCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        spec={spec}
        specMax={specMax}
        frameWidth={args.frameWidth}
        specProgress={specProgress}
        setSpecProgress={setSpecProgress}
      />
    );
  },
};

/**
 * スペクトログラム未生成状態（背景のみ表示）。
 */
export const NoSpectrum: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    frameWidth: 256,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setWav(null);
      setColorTheme("blue");
      setIsReady(true);

      return () => {
        setWav(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <SpecCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        spec={null}
        specMax={0}
        frameWidth={args.frameWidth}
        specProgress={specProgress}
        setSpecProgress={setSpecProgress}
      />
    );
  },
};

/**
 * 狭いキャンバス（400x150）。
 */
export const SmallCanvas: Story = {
  args: {
    canvasWidth: 400,
    canvasHeight: 150,
    frameWidth: 256,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [spec, setSpec] = useState<Array<Array<number>> | null>(null);
    const [specMax, setSpecMax] = useState(0);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");

      fetch("/samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          wav.channels = fftSetting.channels;
          wav.bitDepth = fftSetting.bitDepth;
          wav.sampleRate = fftSetting.sampleRate;
          wav.RemoveDCOffset();
          wav.VolumeNormalize();

          setWav(wav);

          const wa = new WaveAnalyse();
          if (wav.data) {
            const spectrum = wa.Spectrogram(wav.data);

            let max = 0;
            for (let i = 0; i < spectrum.length; i++) {
              for (let j = 0; j < spectrum[0].length; j++) {
                if (max < Math.max(spectrum[i][j], 0) ** 2) {
                  max = Math.max(spectrum[i][j], 0) ** 2;
                }
              }
            }

            setSpec(spectrum);
            setSpecMax(max);
          }
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setSpec(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <SpecCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        spec={spec}
        specMax={specMax}
        frameWidth={args.frameWidth}
        specProgress={specProgress}
        setSpecProgress={setSpecProgress}
      />
    );
  },
};

/**
 * 大きいキャンバス（1200x400）。
 */
export const LargeCanvas: Story = {
  args: {
    canvasWidth: 1200,
    canvasHeight: 400,
    frameWidth: 256,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [spec, setSpec] = useState<Array<Array<number>> | null>(null);
    const [specMax, setSpecMax] = useState(0);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");

      fetch("/samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          wav.channels = fftSetting.channels;
          wav.bitDepth = fftSetting.bitDepth;
          wav.sampleRate = fftSetting.sampleRate;
          wav.RemoveDCOffset();
          wav.VolumeNormalize();

          setWav(wav);

          const wa = new WaveAnalyse();
          if (wav.data) {
            const spectrum = wa.Spectrogram(wav.data);

            let max = 0;
            for (let i = 0; i < spectrum.length; i++) {
              for (let j = 0; j < spectrum[0].length; j++) {
                if (max < Math.max(spectrum[i][j], 0) ** 2) {
                  max = Math.max(spectrum[i][j], 0) ** 2;
                }
              }
            }

            setSpec(spectrum);
            setSpecMax(max);
          }
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setSpec(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <SpecCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        spec={spec}
        specMax={specMax}
        frameWidth={args.frameWidth}
        specProgress={specProgress}
        setSpecProgress={setSpecProgress}
      />
    );
  },
};

/**
 * フレーム幅を変更（frameWidth=512、より粗い解像度）。
 */
export const WideFrame: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    frameWidth: 512,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [spec, setSpec] = useState<Array<Array<number>> | null>(null);
    const [specMax, setSpecMax] = useState(0);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");

      fetch("/samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          wav.channels = fftSetting.channels;
          wav.bitDepth = fftSetting.bitDepth;
          wav.sampleRate = fftSetting.sampleRate;
          wav.RemoveDCOffset();
          wav.VolumeNormalize();

          setWav(wav);

          const wa = new WaveAnalyse();
          if (wav.data) {
            const spectrum = wa.Spectrogram(wav.data);

            let max = 0;
            for (let i = 0; i < spectrum.length; i++) {
              for (let j = 0; j < spectrum[0].length; j++) {
                if (max < Math.max(spectrum[i][j], 0) ** 2) {
                  max = Math.max(spectrum[i][j], 0) ** 2;
                }
              }
            }

            setSpec(spectrum);
            setSpecMax(max);
          }
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setSpec(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <SpecCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        spec={spec}
        specMax={specMax}
        frameWidth={args.frameWidth}
        specProgress={specProgress}
        setSpecProgress={setSpecProgress}
      />
    );
  },
};

/**
 * グリーンテーマのスペクトログラム。
 */
export const GreenTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    frameWidth: 256,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [spec, setSpec] = useState<Array<Array<number>> | null>(null);
    const [specMax, setSpecMax] = useState(0);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("green");

      fetch("/samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          wav.channels = fftSetting.channels;
          wav.bitDepth = fftSetting.bitDepth;
          wav.sampleRate = fftSetting.sampleRate;
          wav.RemoveDCOffset();
          wav.VolumeNormalize();

          setWav(wav);

          const wa = new WaveAnalyse();
          if (wav.data) {
            const spectrum = wa.Spectrogram(wav.data);

            let max = 0;
            for (let i = 0; i < spectrum.length; i++) {
              for (let j = 0; j < spectrum[0].length; j++) {
                if (max < Math.max(spectrum[i][j], 0) ** 2) {
                  max = Math.max(spectrum[i][j], 0) ** 2;
                }
              }
            }

            setSpec(spectrum);
            setSpecMax(max);
          }
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setSpec(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <SpecCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        spec={spec}
        specMax={specMax}
        frameWidth={args.frameWidth}
        specProgress={specProgress}
        setSpecProgress={setSpecProgress}
      />
    );
  },
};

/**
 * レッドテーマのスペクトログラム。
 */
export const RedTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    frameWidth: 256,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [spec, setSpec] = useState<Array<Array<number>> | null>(null);
    const [specMax, setSpecMax] = useState(0);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("red");

      fetch("/samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          wav.channels = fftSetting.channels;
          wav.bitDepth = fftSetting.bitDepth;
          wav.sampleRate = fftSetting.sampleRate;
          wav.RemoveDCOffset();
          wav.VolumeNormalize();

          setWav(wav);

          const wa = new WaveAnalyse();
          if (wav.data) {
            const spectrum = wa.Spectrogram(wav.data);

            let max = 0;
            for (let i = 0; i < spectrum.length; i++) {
              for (let j = 0; j < spectrum[0].length; j++) {
                if (max < Math.max(spectrum[i][j], 0) ** 2) {
                  max = Math.max(spectrum[i][j], 0) ** 2;
                }
              }
            }

            setSpec(spectrum);
            setSpecMax(max);
          }
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setSpec(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <SpecCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        spec={spec}
        specMax={specMax}
        frameWidth={args.frameWidth}
        specProgress={specProgress}
        setSpecProgress={setSpecProgress}
      />
    );
  },
};
