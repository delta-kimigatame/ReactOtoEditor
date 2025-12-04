import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState, useRef } from "react";
import { Wave } from "utauwav";
import { OtoCanvas } from "../../../src/features/Editor/OtoCanvas";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { useCookieStore } from "../../../src/store/cookieStore";
import { fftSetting } from "../../../src/config/setting";
import { Oto } from "utauoto";
import Box from "@mui/material/Box";

const meta: Meta<typeof OtoCanvas> = {
  title: "Components/Editor/OtoCanvas",
  component: OtoCanvas,
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
type Story = StoryObj<typeof OtoCanvas>;

/**
 * 繝・ヵ繧ｩ繝ｫ繝育憾諷具ｼ亥ｮ滄圀縺ｮ髻ｳ螢ｰ繝輔ぃ繧､繝ｫ縺ｨ蜴滄浹險ｭ螳壹ｒ陦ｨ遉ｺ・峨・
 */
export const Default: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    const SetScrolled = (point: number) => {
      if (boxRef.current) {
        boxRef.current.scrollTo(Math.max(point, 0), 0);
      }
    };

    useEffect(() => {
      const { setWav, setOto, setRecord } = useOtoProjectStore.getState();
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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            const record = oto.GetRecord("samples", "01_あかきくけこ.wav", "あ");
            setRecord(record);
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
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: args.canvasHeight,
          position: "relative",
        }}
      >
        <canvas width={args.canvasWidth} height={args.canvasHeight} style={{ display: "block" }} />
        <OtoCanvas
          canvasWidth={args.canvasWidth}
          canvasHeight={args.canvasHeight}
          boxRef={boxRef}
          pixelPerMsec={args.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={updateSignal}
        />
      </Box>
    );
  },
};

/**
 * 蜴滄浹險ｭ螳壽悴隱ｭ霎ｼ迥ｶ諷具ｼ郁レ譎ｯ縺ｮ縺ｿ陦ｨ遉ｺ・峨・
 */
export const NoRecord: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    const SetScrolled = (point: number) => {
      if (boxRef.current) {
        boxRef.current.scrollTo(Math.max(point, 0), 0);
      }
    };

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setWav(null);
      setOto(null);
      setRecord(null);
      setTargetDir(null);
      setColorTheme("blue");
      setIsReady(true);

      return () => {
        setWav(null);
        setOto(null);
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: args.canvasHeight,
          position: "relative",
        }}
      >
        <canvas width={args.canvasWidth} height={args.canvasHeight} style={{ display: "block" }} />
        <OtoCanvas
          canvasWidth={args.canvasWidth}
          canvasHeight={args.canvasHeight}
          boxRef={boxRef}
          pixelPerMsec={args.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={updateSignal}
        />
      </Box>
    );
  },
};

/**
 * 迢ｭあ,く繝｣繝ｳ繝舌せ・・00x300・峨・
 */
export const SmallCanvas: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    const SetScrolled = (point: number) => {
      if (boxRef.current) {
        boxRef.current.scrollTo(Math.max(point, 0), 0);
      }
    };

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");
      setTargetDir("samples");

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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            const record = oto.GetRecord("samples", "01_あかきくけこ.wav", "あ");
            setRecord(record);
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
        setRecord(null);
        setTargetDir(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: args.canvasHeight,
          position: "relative",
        }}
      >
        <canvas width={args.canvasWidth} height={args.canvasHeight} style={{ display: "block" }} />
        <OtoCanvas
          canvasWidth={args.canvasWidth}
          canvasHeight={args.canvasHeight}
          boxRef={boxRef}
          pixelPerMsec={args.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={updateSignal}
        />
      </Box>
    );
  },
};

/**
 * 螟ｧ縺阪＞繧ｭ繝｣繝ｳ繝舌せ・・200x800・峨・
 */
export const LargeCanvas: Story = {
  args: {
    canvasWidth: 1200,
    canvasHeight: 800,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    const SetScrolled = (point: number) => {
      if (boxRef.current) {
        boxRef.current.scrollTo(Math.max(point, 0), 0);
      }
    };

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");
      setTargetDir("samples");

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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            const record = oto.GetRecord("samples", "01_あかきくけこ.wav", "あ");
            setRecord(record);
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
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: args.canvasHeight,
          position: "relative",
        }}
      >
        <canvas width={args.canvasWidth} height={args.canvasHeight} style={{ display: "block" }} />
        <OtoCanvas
          canvasWidth={args.canvasWidth}
          canvasHeight={args.canvasHeight}
          boxRef={boxRef}
          pixelPerMsec={args.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={updateSignal}
        />
      </Box>
    );
  },
};

/**
 * 繧ｿ繝・メ繝｢繝ｼ繝画怏蜉ｹ縲・
 */
export const TouchMode: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    const SetScrolled = (point: number) => {
      if (boxRef.current) {
        boxRef.current.scrollTo(Math.max(point, 0), 0);
      }
    };

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme, setTouchMode } = useCookieStore.getState();

      setColorTheme("blue");
      setTouchMode(true);
      setTargetDir("samples");

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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            const record = oto.GetRecord("samples", "01_あかきくけこ.wav", "あ");
            setRecord(record);
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
        setRecord(null);
        setTouchMode(false);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: args.canvasHeight,
          position: "relative",
        }}
      >
        <canvas width={args.canvasWidth} height={args.canvasHeight} style={{ display: "block" }} />
        <OtoCanvas
          canvasWidth={args.canvasWidth}
          canvasHeight={args.canvasHeight}
          boxRef={boxRef}
          pixelPerMsec={args.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={updateSignal}
        />
      </Box>
    );
  },
};

/**
 * 繧ｪ繝ｼ繝舌・繝ｩ繝・・繝ｭ繝・け譛牙柑縲・
 */
export const OverlapLock: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 10,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    const SetScrolled = (point: number) => {
      if (boxRef.current) {
        boxRef.current.scrollTo(Math.max(point, 0), 0);
      }
    };

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme, setOverlapLock } = useCookieStore.getState();

      setColorTheme("blue");
      setOverlapLock(true);
      setTargetDir("samples");

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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            const record = oto.GetRecord("samples", "01_あかきくけこ.wav", "あ");
            setRecord(record);
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
        setRecord(null);
        setOverlapLock(false);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: args.canvasHeight,
          position: "relative",
        }}
      >
        <canvas width={args.canvasWidth} height={args.canvasHeight} style={{ display: "block" }} />
        <OtoCanvas
          canvasWidth={args.canvasWidth}
          canvasHeight={args.canvasHeight}
          boxRef={boxRef}
          pixelPerMsec={args.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={updateSignal}
        />
      </Box>
    );
  },
};

/**
 * 譛螟ｧ繧ｺ繝ｼ繝・・ixelPerMsec=1・峨・
 */
export const MaxZoom: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 1,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    const SetScrolled = (point: number) => {
      if (boxRef.current) {
        boxRef.current.scrollTo(Math.max(point, 0), 0);
      }
    };

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");
      setTargetDir("samples");

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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            const record = oto.GetRecord("samples", "01_あかきくけこ.wav", "あ");
            setRecord(record);
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
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: args.canvasHeight,
          position: "relative",
        }}
      >
        <canvas width={args.canvasWidth} height={args.canvasHeight} style={{ display: "block" }} />
        <OtoCanvas
          canvasWidth={args.canvasWidth}
          canvasHeight={args.canvasHeight}
          boxRef={boxRef}
          pixelPerMsec={args.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={updateSignal}
        />
      </Box>
    );
  },
};

/**
 * 譛蟆上ぜ繝ｼ繝・・ixelPerMsec=20・峨・
 */
export const MinZoom: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 600,
    pixelPerMsec: 20,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [updateSignal, setUpdateSignal] = useState(0);
    const [scrollable, setScrollable] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    const SetScrolled = (point: number) => {
      if (boxRef.current) {
        boxRef.current.scrollTo(Math.max(point, 0), 0);
      }
    };

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");
      setTargetDir("samples");

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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100`;
          
          oto.InputOtoAsync(
            "samples",
            new Blob([otoText], { type: "text/plain" }),
            "UTF-8"
          ).then(() => {
            setOto(oto);
            const record = oto.GetRecord("samples", "01_あかきくけこ.wav", "あ");
            setRecord(record);
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
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: args.canvasHeight,
          position: "relative",
        }}
      >
        <canvas width={args.canvasWidth} height={args.canvasHeight} style={{ display: "block" }} />
        <OtoCanvas
          canvasWidth={args.canvasWidth}
          canvasHeight={args.canvasHeight}
          boxRef={boxRef}
          pixelPerMsec={args.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={updateSignal}
        />
      </Box>
    );
  },
};


