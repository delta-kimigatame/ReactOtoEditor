import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Wave } from "utauwav";
import { EditorView } from "../../../src/features/Editor/EditorView";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { useCookieStore } from "../../../src/store/cookieStore";
import { fftSetting } from "../../../src/config/setting";
import { Oto } from "utauoto";

const meta: Meta<typeof EditorView> = {
  title: "Components/Editor/EditorView",
  component: EditorView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EditorView>;

export const Default: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100
01_あかきくけこ.wav=か,300,150,-200,50,100
01_あかきくけこ.wav=き,500,150,-200,50,100`;
          
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

    return <EditorView />;
  },
};

export const NoData: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

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
        setTargetDir(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return <EditorView />;
  },
};

export const MultipleRecords: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100
01_あかきくけこ.wav=か,300,150,-200,50,100
01_あかきくけこ.wav=き,500,150,-200,50,100
01_あかきくけこ.wav=く,700,150,-200,50,100
01_あかきくけこ.wav=け,900,150,-200,50,100
01_あかきくけこ.wav=こ,1100,150,-200,50,100`;
          
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

    return <EditorView />;
  },
};

export const GreenTheme: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("green");
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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100
01_あかきくけこ.wav=か,300,150,-200,50,100
01_あかきくけこ.wav=き,500,150,-200,50,100`;
          
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

    return <EditorView />;
  },
};

export const RedTheme: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme } = useCookieStore.getState();

      setColorTheme("red");
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
          const otoText = `01_あかきくけこ.wav=あ,100,150,-200,50,100
01_あかきくけこ.wav=か,300,150,-200,50,100
01_あかきくけこ.wav=き,500,150,-200,50,100`;
          
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

    return <EditorView />;
  },
};
