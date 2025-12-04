import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Header } from "../../../src/features/Header/Header";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { Oto } from "utauoto";

const meta = {
  title: "Components/Header/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof Header>;

const createSampleOto = (dirname: string) => {
  const oto = new Oto();
  oto.ParseOto(
    dirname,
    `sample1.wav=あ,100,200,300,400,500
sample1.wav=い,110,210,310,410,510
sample2.wav=う,120,220,320,420,520`
  );
  return oto;
};

/**
 * デフォルト表示（oto.ini読み込み前）
 */
export const Default: Story = {
  render: () => {
    const { setRecord } = useOtoProjectStore();

    useEffect(() => {
      setRecord(null);
      return () => {
        setRecord(null);
      };
    }, [setRecord]);

    return <Header />;
  },
};

/**
 * oto.ini読み込み後（レコード情報表示）
 */
export const WithRecord: Story = {
  render: () => {
    const { setOto, setTargetDir, setRecord, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setOto(sampleOto);
      setTargetDir("/samples");
      setRecord(sampleOto.GetRecord("/samples", "sample1.wav", "あ"));
      setIsReady(true);

      return () => {
        setOto(null);
        setTargetDir("");
        setRecord(null);
        setIsReady(false);
      };
    }, [setOto, setTargetDir, setRecord]);

    if (!isReady || !oto) {
      return <div>Loading...</div>;
    }

    return <Header />;
  },
};

/**
 * 長いファイル名とエイリアス
 */
export const LongText: Story = {
  render: () => {
    const { setOto, setTargetDir, setRecord, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const longOto = new Oto();
      longOto.ParseOto(
        "/samples",
        `very_long_filename_for_testing_overflow_behavior.wav=非常に長いエイリアス名でテキストのオーバーフロー動作を確認する,100,200,300,400,500`
      );
      setOto(longOto);
      setTargetDir("/samples");
      setRecord(
        longOto.GetRecord(
          "/samples",
          "very_long_filename_for_testing_overflow_behavior.wav",
          "非常に長いエイリアス名でテキストのオーバーフロー動作を確認する"
        )
      );
      setIsReady(true);

      return () => {
        setOto(null);
        setTargetDir("");
        setRecord(null);
        setIsReady(false);
      };
    }, [setOto, setTargetDir, setRecord]);

    if (!isReady || !oto) {
      return <div>Loading...</div>;
    }

    return <Header />;
  },
};

/**
 * メニューを開いた状態
 */
export const WithOpenMenu: Story = {
  render: () => {
    const { setOto, setTargetDir, setRecord, oto } = useOtoProjectStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOto = createSampleOto("/samples");
      setOto(sampleOto);
      setTargetDir("/samples");
      setRecord(sampleOto.GetRecord("/samples", "sample1.wav", "あ"));
      setIsReady(true);

      return () => {
        setOto(null);
        setTargetDir("");
        setRecord(null);
        setIsReady(false);
      };
    }, [setOto, setTargetDir, setRecord]);

    if (!isReady || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <Header />
        <p style={{ padding: 20 }}>
          ヘッダー右側のメニューアイコンをクリックしてメニューを開いてください
        </p>
      </div>
    );
  },
};
