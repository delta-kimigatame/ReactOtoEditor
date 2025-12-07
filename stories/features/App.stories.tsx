import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Wave } from "utauwav";
import { App } from "../../src/features/App";
import { useOtoProjectStore } from "../../src/store/otoProjectStore";
import { useCookieStore } from "../../src/store/cookieStore";
import { fftSetting } from "../../src/config/setting";
import { Oto } from "utauoto";
import JSZip from "jszip";

const meta: Meta<typeof App> = {
  title: "App",
  component: App,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof App>;

export const TopView: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme, setLanguage } = useCookieStore.getState();

      setWav(null);
      setOto(null);
      setRecord(null);
      setTargetDir(null);
      setColorTheme("blue");
      setLanguage("ja");
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

    return <App />;
  },
};

export const EditorViewWithData: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme, setLanguage } = useCookieStore.getState();

      setColorTheme("blue");
      setLanguage("ja");
      setTargetDir("samples");

      fetch("samples/01_あかきくけこ.wav")
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

    return <App />;
  },
};

export const EditorViewWithZipFile: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme, setLanguage } = useCookieStore.getState();

      setColorTheme("blue");
      setLanguage("ja");

      fetch("samples/sjis_CV_jp.zip")
        .then((res) => res.arrayBuffer())
        .then(async (buf) => {
          const zip = await JSZip.loadAsync(buf);

          const wavFile = zip.file("01_あ.wav");
          const otoFile = zip.file("oto.ini");

          if (wavFile && otoFile) {
            const wavBuffer = await wavFile.async("arraybuffer");
            const wav = new Wave(wavBuffer);
            wav.channels = fftSetting.channels;
            wav.bitDepth = fftSetting.bitDepth;
            wav.sampleRate = fftSetting.sampleRate;
            wav.RemoveDCOffset();
            wav.VolumeNormalize();

            setWav(wav);
            setTargetDir(".");

            const otoText = await otoFile.async("string");
            const oto = new Oto();
            
            await oto.InputOtoAsync(
              ".",
              new Blob([otoText], { type: "text/plain" }),
              "Shift_JIS"
            );

            setOto(oto);
            const record = oto.GetRecord(".", "01_あ.wav", "あ");
            if (record) {
              setRecord(record);
            }
            setIsReady(true);
          }
        })
        .catch((error) => {
          console.error("Failed to load zip file:", error);
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

    return <App />;
  },
};

export const EnglishLanguage: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme, setLanguage } = useCookieStore.getState();

      setWav(null);
      setOto(null);
      setRecord(null);
      setTargetDir(null);
      setColorTheme("blue");
      setLanguage("en");
      setIsReady(true);

      return () => {
        setWav(null);
        setOto(null);
        setRecord(null);
        setTargetDir(null);
        setLanguage("ja");
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return <App />;
  },
};

export const DarkMode: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme, setLanguage } = useCookieStore.getState();

      setWav(null);
      setOto(null);
      setRecord(null);
      setTargetDir(null);
      setColorTheme("blue");
      setLanguage("ja");
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

    return <App />;
  },
};

export const DarkModeWithEditor: Story = {
  render: () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const { setWav, setOto, setRecord, setTargetDir } = useOtoProjectStore.getState();
      const { setColorTheme, setLanguage } = useCookieStore.getState();

      setColorTheme("blue");
      setLanguage("ja");
      setTargetDir("samples");

      fetch("samples/01_あかきくけこ.wav")
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

    return <App />;
  },
};
