import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Wave } from "utauwav";
import { WavCanvas } from "../../../src/features/Editor/WavCanvas";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { useCookieStore } from "../../../src/store/cookieStore";

const meta: Meta<typeof WavCanvas> = {
  title: "Components/Editor/WavCanvas",
  component: WavCanvas,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    canvasWidth: { control: "number" },
    canvasHeight: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof WavCanvas>;

/**
 * デフォルト状態（実際の音声ファイルを読み込み）。
 */
export const Default: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");

      fetch("samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          setWav(wav);
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <WavCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        wavProgress={wavProgress}
        setWavProgress={setWavProgress}
      />
    );
  },
};

/**
 * 波形未読込状態（0線のみ表示）。
 */
export const NoWave: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);

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
      <WavCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        wavProgress={wavProgress}
        setWavProgress={setWavProgress}
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
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");

      fetch("samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          setWav(wav);
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <WavCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        wavProgress={wavProgress}
        setWavProgress={setWavProgress}
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
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("blue");

      fetch("samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          setWav(wav);
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <WavCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        wavProgress={wavProgress}
        setWavProgress={setWavProgress}
      />
    );
  },
};

/**
 * グリーンテーマの波形。
 */
export const GreenTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("green");

      fetch("samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          setWav(wav);
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <WavCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        wavProgress={wavProgress}
        setWavProgress={setWavProgress}
      />
    );
  },
};

/**
 * レッドテーマの波形。
 */
export const RedTheme: Story = {
  args: {
    canvasWidth: 800,
    canvasHeight: 300,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [wavProgress, setWavProgress] = useState(false);

    useEffect(() => {
      const { setWav } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("red");

      fetch("samples/01_あかきくけこ.wav")
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          const wav = new Wave(buf);
          setWav(wav);
          setIsReady(true);
        })
        .catch((error) => {
          console.error("Failed to load wav file:", error);
          setIsReady(true);
        });

      return () => {
        setWav(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <WavCanvas
        canvasWidth={args.canvasWidth}
        canvasHeight={args.canvasHeight}
        wavProgress={wavProgress}
        setWavProgress={setWavProgress}
      />
    );
  },
};
