import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Wave } from "utauwav";
import { CanvasBase } from "../../../src/features/Editor/CanvasBase";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { useCookieStore } from "../../../src/store/cookieStore";
import { fftSetting } from "../../../src/config/setting";
import { Oto } from "utauoto";

const meta: Meta<typeof CanvasBase> = {
  title: "Components/Editor/CanvasBase",
  component: CanvasBase,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    canvasWidth: { control: "number" },
    canvasHeight: { control: "number" },
    pixelPerMsec: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof CanvasBase>;

/**
 * チE��ォルト状態（実際の音声ファイルと原音設定を表示�E�、E
 */
export const Default: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setWav, setOto } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");

      // 音声ファイル読込
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

          // 原音設定を作�E
          const oto = new Oto();
          const otoText = `01_あかきくけこ.wav=ぁE100,150,200,50,100
01_あかきくけこ.wav=ぁE300,150,200,50,100
01_あかきくけこ.wav=ぁE500,150,200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            setIsReady(true);
          });
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setOto(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <CanvasBase
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        pixelPerMsec={args.pixelPerMsec}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
        setUpdateSignal={setUpdateSignal}
      />
    );
  },
};

/**
 * 波形未読込状態（背景のみ表示�E�、E
 */
export const NoWave: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setWav, setOto } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setWav(null);
      setOto(null);
      setColorTheme("blue");
      setIsReady(true);

      return () => {
        setWav(null);
        setOto(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <CanvasBase
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        pixelPerMsec={args.pixelPerMsec}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
        setUpdateSignal={setUpdateSignal}
      />
    );
  },
};

/**
 * 狭ぁE��ャンバス�E�E00x300�E�、E
 */
export const SmallCanvas: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setWav, setOto } = useOtoProjectStore.getState();
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

          const oto = new Oto();
          const otoText = `01_あかきくけこ.wav=ぁE100,150,200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            setIsReady(true);
          });
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setOto(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <CanvasBase
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        pixelPerMsec={args.pixelPerMsec}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
        setUpdateSignal={setUpdateSignal}
      />
    );
  },
};

/**
 * 大きいキャンバス�E�E200x800�E�、E
 */
export const LargeCanvas: Story = {
  args: {
    canvasWidth: 1200,
    canvasHeight: 800,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setWav, setOto } = useOtoProjectStore.getState();
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

          const oto = new Oto();
          const otoText = `01_あかきくけこ.wav=ぁE100,150,200,50,100
01_あかきくけこ.wav=ぁE300,150,200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            setIsReady(true);
          });
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setOto(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <CanvasBase
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        pixelPerMsec={args.pixelPerMsec}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
        setUpdateSignal={setUpdateSignal}
      />
    );
  },
};

/**
 * 最大ズーム�E�EixelPerMsec=1�E�、E
 */
export const MaxZoom: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 1,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setWav, setOto } = useOtoProjectStore.getState();
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

          const oto = new Oto();
          const otoText = `01_あかきくけこ.wav=ぁE100,150,200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            setIsReady(true);
          });
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setOto(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <CanvasBase
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        pixelPerMsec={args.pixelPerMsec}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
        setUpdateSignal={setUpdateSignal}
      />
    );
  },
};

/**
 * 最小ズーム�E�EixelPerMsec=20�E�、E
 */
export const MinZoom: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 20,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setWav, setOto } = useOtoProjectStore.getState();
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

          const oto = new Oto();
          const otoText = `01_あかきくけこ.wav=ぁE100,150,200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            setIsReady(true);
          });
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setOto(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <CanvasBase
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        pixelPerMsec={args.pixelPerMsec}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
        setUpdateSignal={setUpdateSignal}
      />
    );
  },
};

/**
 * グリーンチE�Eマ、E
 */
export const GreenTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setWav, setOto } = useOtoProjectStore.getState();
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

          const oto = new Oto();
          const otoText = `01_あかきくけこ.wav=ぁE100,150,200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            setIsReady(true);
          });
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setOto(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <CanvasBase
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        pixelPerMsec={args.pixelPerMsec}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
        setUpdateSignal={setUpdateSignal}
      />
    );
  },
};

/**
 * レチE��チE�Eマ、E
 */
export const RedTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setWav, setOto } = useOtoProjectStore.getState();
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

          const oto = new Oto();
          const otoText = `01_あかきくけこ.wav=ぁE100,150,200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            setIsReady(true);
          });
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
        setOto(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <CanvasBase
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        pixelPerMsec={args.pixelPerMsec}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
        setUpdateSignal={setUpdateSignal}
      />
    );
  },
};

