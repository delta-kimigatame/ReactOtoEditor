import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState, useRef } from "react";
import { Wave } from "utauwav";
import { CanvasBase } from "../../../src/features/Editor/CanvasBase";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { useCookieStore } from "../../../src/store/cookieStore";
import { fftSetting } from "../../../src/config/setting";
import { Oto } from "utauoto";
import JSZip from "jszip";
import { Box } from "@mui/material";

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
 * デフォルト状態（実際の音声ファイルと原音設定を表示）
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

          // 原音設定を定義
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
 * 波形未読込状態（背景のみ表示)
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
 * 狭いキャンバス（800x300）
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
 * 大きいキャンバス（1200x800）
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
 * 最大ズーム（pixelPerMsec=1）
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
 * 最小ズーム（pixelPerMsec=20）
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
 * グリーンテーマ
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
 * レッドテーマ
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


/**
 * グレーテーマ（oto有り）
 */
export const GrayTheme: Story = {
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
      const { setWav, setOto,setRecord,setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme('gray');

      fetch('/samples/01_あかきくけこ.wav')
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
          const otoText = `01_あかきくけこ.wav=- あ,1400,150,-500,50,100`;
          
          oto.InputOtoAsync(
            'samples',
            new Blob([otoText], { type: 'text/plain' }),
            'UTF-8'
          ).then(() => {
            setOto(oto);
            setTargetDir('samples');
            const record=oto.GetRecord('samples','01_あかきくけこ.wav','- あ');
            setRecord(record);
            setIsReady(true);
          });
        })
        .catch((error) => {
          console.error('Failed to load wav file:', error);
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

// ============================================================
// Tutorial 12: 基本パターン (11 stories)
// ============================================================

/**
 * チュートリアル用ストーリーの共通ロジック
 */
const createTutorialStory = (
  wavFilename: string,
  aliasName: string,
  pixelPerMsec: number = 5
): Story => ({
  args: {
    canvasWidth: 360,
    canvasHeight: 200,
    pixelPerMsec,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);
    const [specProgress, setSpecProgress] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme('gray');

      fetch('/samples/tutorial_patterns.zip')
        .then((res) => res.arrayBuffer())
        .then((zipBuf) => JSZip.loadAsync(zipBuf))
        .then((zip) => {
          const wavFile = zip.file(`samples/${wavFilename}`);
          const otoFile = zip.file('samples/oto.ini');
          
          if (!wavFile || !otoFile) throw new Error('Required files not found in zip');
          
          return Promise.all([
            wavFile.async('arraybuffer'),
            otoFile.async('blob')
          ]);
        })
        .then(([wavBuf, otoBlob]) => {
          const wav = new Wave(wavBuf);
          wav.channels = fftSetting.channels;
          wav.bitDepth = fftSetting.bitDepth;
          wav.sampleRate = fftSetting.sampleRate;
          wav.RemoveDCOffset();
          wav.VolumeNormalize();
          setWav(wav);

          const oto = new Oto();
          return oto.InputOtoAsync('samples', otoBlob).then(() => oto);
        })
        .then((oto) => {
          setOto(oto);
          setTargetDir('samples');
          const record = oto.GetRecord('samples', wavFilename, aliasName);
          setRecord(record);
          
          // スクロール位置を設定（左ブランクより少し左が映るように）
          if (record && boxRef.current) {
            const scrollMs = record.offset - 50;
            const scrollPos = scrollMs / args.pixelPerMsec;
            boxRef.current.scrollTo(Math.max(scrollPos, 0), 0);
          }
          
          setIsReady(true);
        })
        .catch((error) => {
          console.error('Failed to load files:', error);
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
      <Box
        ref={boxRef}
        sx={{
          overflowX: 'scroll',
          height: args.canvasHeight,
          position: 'relative',
          width: args.canvasWidth,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
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
      </Box>
    );
  },
});

/**
 * CV_Simple - シンプルな単独音（さ.wav → さ）
 */
export const CV_Simple: Story = createTutorialStory('さ.wav', 'さ', 7);

/**
 * CV_FromContinuous - 連続発声から切り出し（02_いさしすせそ.wav → さ）
 */
export const CV_FromContinuous: Story = createTutorialStory('02_いさしすせそ.wav', 'さ', 2);

/**
 * VowelConnection - 母音結合用（あ.wav → * あ）
 */
export const VowelConnection: Story = createTutorialStory('あ.wav', '* あ', 5);

/**
 * VCV_First - 連続音の最初（_ささしすせそさ.wav → - さ）
 */
export const VCV_First: Story = createTutorialStory('_ささしすせそさ.wav', '- さ', 2);

/**
 * VCV_Middle - 連続音の途中（_ささしすせそさ.wav → a さ）
 */
export const VCV_Middle: Story = createTutorialStory('_ささしすせそさ.wav', 'a さ', 3);

/**
 * VCV_NeedsAdjustment_Bad - 修正が必要な連続音・修正前（_ささしすせそさfast.wav → a さbad）
 */
export const VCV_NeedsAdjustment_Bad: Story = createTutorialStory('_ささしすせそさfast.wav', 'a さbad', 1.5);

/**
 * VCV_NeedsAdjustment_Good - 修正が必要な連続音・修正後（_ささしすせそさfast.wav → a さgood）
 */
export const VCV_NeedsAdjustment_Good: Story = createTutorialStory('_ささしすせそさfast.wav', 'a さgood', 1.5);

/**
 * VC_Sample - VCサンプル（02_いさしすせそ.wav → i s）
 */
export const VC_Sample: Story = createTutorialStory('02_いさしすせそ.wav', 'i s', 2);

/**
 * BlankRange_Stable - 伸縮範囲が安定（あ.wav → あ）
 */
export const BlankRange_Stable: Story = createTutorialStory('あ.wav', 'あ', 5);

/**
 * BlankRange_Bad - 伸縮範囲が不安定・音量変動（あbad.wav → あbad）
 */
export const BlankRange_Bad: Story = createTutorialStory('あbad.wav', 'あbad', 5);

/**
 * BlankRange_Fade - 伸縮範囲が不安定・フェードアウト（あfade.wav → あfade）
 */
export const BlankRange_Fade: Story = createTutorialStory('あfade.wav', 'あfade', 5);

// ============================================================
// Tutorial 13: 音の種類別設定（基本編） (9 stories)
// ============================================================

/**
 * Fricative_S - 無声摩擦音s（さ.wav → さ）
 */
export const Fricative_S: Story = createTutorialStory('さ.wav', 'さ', 1.5);

/**
 * Fricative_Z - 有声摩擦音z（ざ.wav → ざ）
 */
export const Fricative_Z: Story = createTutorialStory('ざ.wav', 'ざ', 1.5);

/**
 * Nasal_N - 鼻音n（な.wav → な）
 */
export const Nasal_N: Story = createTutorialStory('な.wav', 'な', 1.5);

/**
 * Nasal_M - 鼻音m（ま.wav → ま）
 */
export const Nasal_M: Story = createTutorialStory('ま.wav', 'ま', 1.5);

/**
 * Plosive_K - 無声破裂音k（か.wav → か）
 */
export const Plosive_K: Story = createTutorialStory('か.wav', 'か', 1.5);
/**
 * Plosive_G - 有声破裂音g（が.wav → が）
 */
export const Plosive_G: Story = createTutorialStory('が.wav', 'が', 1.5);
/**
 * Plosive_NG - 鼻音化ng（ガ.wav → ガ）
 */
export const Plosive_NG: Story = createTutorialStory('ガ.wav', 'ガ', 1.5);

/**
 * Vowel_A_A - 連続音の母音・同じ母音（_ああいあうえあ.wav → a あ）
 */
export const Vowel_A_A: Story = createTutorialStory('_ああいあうえあ.wav', 'a あ', 2);

/**
 * Vowel_A_I - 連続音の母音・異なる母音（_ああいあうえあ.wav → a い）
 */
export const Vowel_A_I: Story = createTutorialStory('_ああいあうえあ.wav', 'a い', 2);

// ============================================================
// Tutorial 14: 音の種類別設定（応用編） (23 stories)
// ============================================================

// は行（8ストーリー）

/**
 * HRow_First - は行・最初の音（_ははひふへほはほ.wav → - は）
 */
export const HRow_First: Story = createTutorialStory('_ははひふへほはほ.wav', '- は', 1.5);

/**
 * HRow_A_Ha - は行・a は（_ははひふへほはほ.wav → a は）
 */
export const HRow_A_Ha: Story = createTutorialStory('_ははひふへほはほ.wav', 'a は', 1.5);

/**
 * HRow_A_Hi - は行・a ひ（_ははひふへほはほ.wav → a ひ）
 */
export const HRow_A_Hi: Story = createTutorialStory('_ははひふへほはほ.wav', 'a ひ', 1.5);

/**
 * HRow_I_Fu - は行・i ふ（_ははひふへほはほ.wav → i ふ）
 */
export const HRow_I_Fu: Story = createTutorialStory('_ははひふへほはほ.wav', 'i ふ', 1.5);

/**
 * HRow_U_He - は行・u へ（_ははひふへほはほ.wav → u へ）
 */
export const HRow_U_He: Story = createTutorialStory('_ははひふへほはほ.wav', 'u へ', 1.5);

/**
 * HRow_E_Ho - は行・e ほ（_ははひふへほはほ.wav → e ほ）
 */
export const HRow_E_Ho: Story = createTutorialStory('_ははひふへほはほ.wav', 'e ほ', 1.5);

/**
 * HRow_O_Ha - は行・o は（_ははひふへほはほ.wav → o は）
 */
export const HRow_O_Ha: Story = createTutorialStory('_ははひふへほはほ.wav', 'o は', 1.5);

/**
 * HRow_A_Ho - は行・a ほ（_ははひふへほはほ.wav → a ほ）
 */
export const HRow_A_Ho: Story = createTutorialStory('_ははひふへほはほ.wav', 'a ほ', 1.5);

// や行（6ストーリー）

/**
 * YRow_First - や行・最初の音（_ややいゆえよやよ.wav → - や）
 */
export const YRow_First: Story = createTutorialStory('_ややいゆえよやよ.wav', '- や', 1.5);

/**
 * YRow_A_Ya - や行・a や（_ややいゆえよやよ.wav → a や）
 */
export const YRow_A_Ya: Story = createTutorialStory('_ややいゆえよやよ.wav', 'a や', 1.5);

/**
 * YRow_I_Yu - や行・i ゆ（_ややいゆえよやよ.wav → i ゆ）
 */
export const YRow_I_Yu: Story = createTutorialStory('_ややいゆえよやよ.wav', 'i ゆ', 1.5);

/**
 * YRow_E_Yo - や行・e よ（_ややいゆえよやよ.wav → e よ）
 */
export const YRow_E_Yo: Story = createTutorialStory('_ややいゆえよやよ.wav', 'e よ', 1.5);

/**
 * YRow_O_Ya - や行・o や（_ややいゆえよやよ.wav → o や）
 */
export const YRow_O_Ya: Story = createTutorialStory('_ややいゆえよやよ.wav', 'o や', 1.5);

/**
 * YRow_A_Yo - や行・a よ（_ややいゆえよやよ.wav → a よ）
 */
export const YRow_A_Yo: Story = createTutorialStory('_ややいゆえよやよ.wav', 'a よ', 1.5);

// わ行（6ストーリー）

/**
 * WRow_First - わ行・最初の音（_わわうぃわううぇわ.wav → - わ）
 */
export const WRow_First: Story = createTutorialStory('_わわうぃわううぇわ.wav', '- わ', 1.5);

/**
 * WRow_A_Wa - わ行・a わ（_わわうぃわううぇわ.wav → a わ）
 */
export const WRow_A_Wa: Story = createTutorialStory('_わわうぃわううぇわ.wav', 'a わ', 1.5);

/**
 * WRow_A_Wi - わ行・a うぃ（_わわうぃわううぇわ.wav → a うぃ）
 */
export const WRow_A_Wi: Story = createTutorialStory('_わわうぃわううぇわ.wav', 'a うぃ', 1.5);

/**
 * WRow_I_Wa - わ行・i わ（_わわうぃわううぇわ.wav → i わ）
 */
export const WRow_I_Wa: Story = createTutorialStory('_わわうぃわううぇわ.wav', 'i わ', 1.5);

/**
 * WRow_U_We - わ行・u うぇ（_わわうぃわううぇわ.wav → u うぇ）
 */
export const WRow_U_We: Story = createTutorialStory('_わわうぃわううぇわ.wav', 'u うぇ', 1.5);

/**
 * WRow_E_Wa - わ行・e わ（_わわうぃわううぇわ.wav → e わ）
 */
export const WRow_E_Wa: Story = createTutorialStory('_わわうぃわううぇわ.wav', 'e わ', 1.5);

