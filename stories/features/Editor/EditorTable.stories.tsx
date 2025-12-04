import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { EditorTable } from "../../../src/features/Editor/EditorTable";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

const meta: Meta<typeof EditorTable> = {
  title: "Components/Editor/EditorTable",
  component: EditorTable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    windowWidth: { control: "number" },
    windowHeight: { control: "number" },
    showAllRecords: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof EditorTable>;

/**
 * デフォルト状態（単一レコード表示）。
 */
export const Default: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    updateSignal: 0,
    showAllRecords: false,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();

      const otoText = `a.wav=- あ,100.123,50.456,80.789,100.234,200.567
a.wav=a あ,400.321,50.654,80.987,100.432,200.765
i.wav=- い,100.111,50.222,80.333,100.444,200.555`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "a.wav", "- あ"));
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
      <EditorTable
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setTableHeight={setTableHeight}
        updateSignal={args.updateSignal}
        showAllRecords={args.showAllRecords}
      />
    );
  },
};

/**
 * 全レコード表示モード（TableDialog用）。
 */
export const AllRecords: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    updateSignal: 0,
    showAllRecords: true,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);
    const [fileIndex, setFileIndex] = useState(0);
    const [aliasIndex, setAliasIndex] = useState(0);
    const [maxAliasIndex, setMaxAliasIndex] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();

      const otoText = `a.wav=- あ,100.123,50.456,80.789,100.234,200.567
a.wav=a あ,400.321,50.654,80.987,100.432,200.765
i.wav=- い,100.111,50.222,80.333,100.444,200.555
i.wav=i い,400.111,50.222,80.333,100.444,200.555
u.wav=- う,100.999,50.888,80.777,100.666,200.555`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "a.wav", "- あ"));
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
      <EditorTable
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setTableHeight={setTableHeight}
        updateSignal={args.updateSignal}
        showAllRecords={args.showAllRecords}
        fileIndex={fileIndex}
        aliasIndex={aliasIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
      />
    );
  },
};

/**
 * 狭い画面幅（caption表示）。
 */
export const NarrowScreen: Story = {
  args: {
    windowWidth: 600,
    windowHeight: 800,
    updateSignal: 0,
    showAllRecords: false,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();

      const otoText = `a.wav=- あ,100.123,50.456,80.789,100.234,200.567`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "a.wav", "- あ"));
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
      <EditorTable
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setTableHeight={setTableHeight}
        updateSignal={args.updateSignal}
        showAllRecords={args.showAllRecords}
      />
    );
  },
};

/**
 * レコード未選択状態（record=null）。
 */
export const NoRecord: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    updateSignal: 0,
    showAllRecords: false,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();

      const otoText = `a.wav=- あ,100,50,80,100,200`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(null);
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
      <EditorTable
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setTableHeight={setTableHeight}
        updateSignal={args.updateSignal}
        showAllRecords={args.showAllRecords}
      />
    );
  },
};

/**
 * 多数のレコード（全レコード表示モード）。
 */
export const ManyRecords: Story = {
  args: {
    windowWidth: 1200,
    windowHeight: 800,
    updateSignal: 0,
    showAllRecords: true,
  },
  render: (args) => {
    const [isReady, setIsReady] = useState(false);
    const [tableHeight, setTableHeight] = useState(0);
    const [fileIndex, setFileIndex] = useState(1);
    const [aliasIndex, setAliasIndex] = useState(1);
    const [maxAliasIndex, setMaxAliasIndex] = useState(0);

    useEffect(() => {
      const { setTargetDir, setOto, setRecord } = useOtoProjectStore.getState();

      // 3ファイル×3エイリアス = 9レコード
      const otoText = `a.wav=- あ,100,50,80,100,200
a.wav=a あ,100,50,80,100,200
a.wav=k あ,100,50,80,100,200
i.wav=- あ,100,50,80,100,200
i.wav=a あ,100,50,80,100,200
i.wav=k あ,100,50,80,100,200
u.wav=- あ,100,50,80,100,200
u.wav=a あ,100,50,80,100,200
u.wav=k あ,100,50,80,100,200`;
      
      const oto = new Oto();
      oto.InputOtoAsync(
        "voice",
        new Blob([otoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("voice");
        setOto(oto);
        setRecord(oto.GetRecord("voice", "i.wav", "a あ"));
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
      <EditorTable
        windowWidth={args.windowWidth}
        windowHeight={args.windowHeight}
        setTableHeight={setTableHeight}
        updateSignal={args.updateSignal}
        showAllRecords={args.showAllRecords}
        fileIndex={fileIndex}
        aliasIndex={aliasIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
      />
    );
  },
};
