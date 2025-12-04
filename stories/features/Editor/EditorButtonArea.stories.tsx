import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { EditorButtonArea } from "../../../src/features/Editor/EditorButtonArea";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { useCookieStore } from "../../../src/store/cookieStore";

const meta: Meta<typeof EditorButtonArea> = {
  title: "Components/Editor/EditorButtonArea",
  component: EditorButtonArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    windowWidth: { control: "number" },
    windowHeight: { control: "number" },
    pixelPerMsec: { control: { type: "select" }, options: [1, 2, 5, 10, 20] },
    progress: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof EditorButtonArea>;

/**
 * デフォルト状態。
 */
export const Default: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    pixelPerMsec: 1,
    progress: false,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [buttonAreaHeight, setButtonAreaHeight] = useState(0);
    const [pixelPerMsec, setPixelPerMsec] = useState(args.pixelPerMsec);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();
      const { setOverlapLock, setTouchMode } = useCookieStore.getState();

      const otoText = `a.wav=- あ,100,50,80,100,200
a.wav=a あ,400,50,80,100,200
i.wav=- い,100,50,80,100,200`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "a.wav", "- あ"));
        setOverlapLock(false);
        setTouchMode(false);
        setIsReady(true);
      });

      return () => {
        setTargetDir("");
        setOto(null);
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <EditorButtonArea
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setButtonAreaHeight={setButtonAreaHeight}
        pixelPerMsec={pixelPerMsec}
        setPixelPerMsec={setPixelPerMsec}
        setUpdateSignal={setUpdateSignal}
        progress={args.progress}
      />
    );
  },
};

/**
 * 読込中状態（progress=true）。ズームボタンとナビゲーションボタンが無効化。
 */
export const Loading: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    pixelPerMsec: 1,
    progress: true,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [buttonAreaHeight, setButtonAreaHeight] = useState(0);
    const [pixelPerMsec, setPixelPerMsec] = useState(args.pixelPerMsec);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();
      const { setOverlapLock, setTouchMode } = useCookieStore.getState();

      const otoText = `a.wav=- あ,100,50,80,100,200`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "a.wav", "- あ"));
        setOverlapLock(false);
        setTouchMode(false);
        setIsReady(true);
      });

      return () => {
        setTargetDir("");
        setOto(null);
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <EditorButtonArea
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setButtonAreaHeight={setButtonAreaHeight}
        pixelPerMsec={pixelPerMsec}
        setPixelPerMsec={setPixelPerMsec}
        setUpdateSignal={setUpdateSignal}
        progress={args.progress}
      />
    );
  },
};

/**
 * オーバーラップロックとタッチモードが有効。
 */
export const LockedAndTouchMode: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    pixelPerMsec: 1,
    progress: false,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [buttonAreaHeight, setButtonAreaHeight] = useState(0);
    const [pixelPerMsec, setPixelPerMsec] = useState(args.pixelPerMsec);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();
      const { setOverlapLock, setTouchMode } = useCookieStore.getState();

      const otoText = `a.wav=- あ,100,50,80,100,200`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "a.wav", "- あ"));
        setOverlapLock(true);
        setTouchMode(true);
        setIsReady(true);
      });

      return () => {
        setTargetDir("");
        setOto(null);
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <EditorButtonArea
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setButtonAreaHeight={setButtonAreaHeight}
        pixelPerMsec={pixelPerMsec}
        setPixelPerMsec={setPixelPerMsec}
        setUpdateSignal={setUpdateSignal}
        progress={args.progress}
      />
    );
  },
};

/**
 * 最大ズーム状態（pixelPerMsec=1）。ZoomInボタンが無効化。
 */
export const MaxZoom: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    pixelPerMsec: 1,
    progress: false,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [buttonAreaHeight, setButtonAreaHeight] = useState(0);
    const [pixelPerMsec, setPixelPerMsec] = useState(args.pixelPerMsec);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();
      const { setOverlapLock, setTouchMode } = useCookieStore.getState();

      const otoText = `a.wav=- あ,100,50,80,100,200`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "a.wav", "- あ"));
        setOverlapLock(false);
        setTouchMode(false);
        setIsReady(true);
      });

      return () => {
        setTargetDir("");
        setOto(null);
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <EditorButtonArea
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setButtonAreaHeight={setButtonAreaHeight}
        pixelPerMsec={pixelPerMsec}
        setPixelPerMsec={setPixelPerMsec}
        setUpdateSignal={setUpdateSignal}
        progress={args.progress}
      />
    );
  },
};

/**
 * 最小ズーム状態（pixelPerMsec=20）。ZoomOutボタンが無効化。
 */
export const MinZoom: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    pixelPerMsec: 20,
    progress: false,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [buttonAreaHeight, setButtonAreaHeight] = useState(0);
    const [pixelPerMsec, setPixelPerMsec] = useState(args.pixelPerMsec);
    const [updateSignal, setUpdateSignal] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();
      const { setOverlapLock, setTouchMode } = useCookieStore.getState();

      const otoText = `a.wav=- あ,100,50,80,100,200`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "a.wav", "- あ"));
        setOverlapLock(false);
        setTouchMode(false);
        setIsReady(true);
      });

      return () => {
        setTargetDir("");
        setOto(null);
        setRecord(null);
      };
    }, []);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <EditorButtonArea
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setButtonAreaHeight={setButtonAreaHeight}
        pixelPerMsec={pixelPerMsec}
        setPixelPerMsec={setPixelPerMsec}
        setUpdateSignal={setUpdateSignal}
        progress={args.progress}
      />
    );
  },
};
