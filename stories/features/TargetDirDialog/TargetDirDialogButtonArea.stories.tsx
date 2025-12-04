import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { TargetDirDialogButtonArea } from "../../../src/features/TargetDirDialog/TargetDirDialogButtonArea";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

/**
 * `TargetDirDialogButtonArea` は、原音設定対象ディレクトリ選択ダイアログの文字コード設定エリアです。
 *
 * ## 主な機能
 * - oto.iniの文字コード選択（UTF-8/Shift-JIS）
 * - Submit（確定）ボタンで親コンポーネントに反映
 * - 文字コード変更時の再読み込み
 */
const meta: Meta<typeof TargetDirDialogButtonArea> = {
  title: "Components/TargetDirDialog/TargetDirDialogButtonArea",
  component: TargetDirDialogButtonArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TargetDirDialogButtonArea>;

/**
 * デフォルトの文字コード設定エリア。Shift-JIS（日本語UTAU音源の標準）で読み込まれています。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir, targetDir } = useOtoProjectStore();
    const [encoding, setEncoding] = useState("SJIS");
    const [oto, setOtoTemp] = useState<Oto | null>(null);
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const LoadOto = (encoding_: string = "SJIS") => {
      // サンプルoto.iniデータを作成
      const sampleOtoText = `sample1.wav=あ,0,100,50,120,-50
sample2.wav=い,0,100,50,120,-50
sample3.wav=か,0,80,50,100,-40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        encoding_
      ).then(() => {
        setOtoTemp(oto_);
      });
    };

    useEffect(() => {
      setTargetDir("/samples");
      LoadOto("SJIS");
      setIsReady(true);

      return () => {
        setTargetDir(null);
        setOtoTemp(null);
        setIsReady(false);
      };
    }, [setTargetDir]);

    if (!isReady || !targetDir || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogButtonArea
        setDialogOpen={setDialogOpen}
        oto={oto}
        setOtoTemp={setOtoTemp}
        LoadOto={LoadOto}
        encoding={encoding}
        setEncoding={setEncoding}
      />
    );
  },
};

/**
 * UTF-8で読み込まれた状態。最近のUTAU音源ではUTF-8も使用されます。
 */
export const UTF8Encoding: Story = {
  render: () => {
    const { setTargetDir, targetDir } = useOtoProjectStore();
    const [encoding, setEncoding] = useState("UTF8");
    const [oto, setOtoTemp] = useState<Oto | null>(null);
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const LoadOto = (encoding_: string = "UTF8") => {
      const sampleOtoText = `utf8_sample1.wav=あ,0,100,50,120,-50
utf8_sample2.wav=い,0,100,50,120,-50
utf8_sample3.wav=か,0,80,50,100,-40
utf8_sample4.wav=さ,0,80,50,100,-40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/utf8_samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        encoding_
      ).then(() => {
        setOtoTemp(oto_);
      });
    };

    useEffect(() => {
      setTargetDir("/utf8_samples");
      LoadOto("UTF8");
      setIsReady(true);

      return () => {
        setTargetDir(null);
        setOtoTemp(null);
        setIsReady(false);
      };
    }, [setTargetDir]);

    if (!isReady || !targetDir || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogButtonArea
        setDialogOpen={setDialogOpen}
        oto={oto}
        setOtoTemp={setOtoTemp}
        LoadOto={LoadOto}
        encoding={encoding}
        setEncoding={setEncoding}
      />
    );
  },
};

/**
 * 多数のエイリアスを含むoto.ini。実際のプロジェクトでの使用状況を想定。
 */
export const WithManyAliases: Story = {
  render: () => {
    const { setTargetDir, targetDir } = useOtoProjectStore();
    const [encoding, setEncoding] = useState("SJIS");
    const [oto, setOtoTemp] = useState<Oto | null>(null);
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const LoadOto = (encoding_: string = "SJIS") => {
      // 日本語母音・子音の組み合わせ（あ行〜さ行）
      const aliases = [
        "あ", "い", "う", "え", "お",
        "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ"
      ];
      const sampleOtoText = aliases
        .map((alias, i) => `sample${i + 1}.wav=${alias},0,${80 + i * 3},50,${100 + i * 3},-${40 + i}`)
        .join("\n");
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/many_samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        encoding_
      ).then(() => {
        setOtoTemp(oto_);
      });
    };

    useEffect(() => {
      setTargetDir("/many_samples");
      LoadOto("SJIS");
      setIsReady(true);

      return () => {
        setTargetDir(null);
        setOtoTemp(null);
        setIsReady(false);
      };
    }, [setTargetDir]);

    if (!isReady || !targetDir || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogButtonArea
        setDialogOpen={setDialogOpen}
        oto={oto}
        setOtoTemp={setOtoTemp}
        LoadOto={LoadOto}
        encoding={encoding}
        setEncoding={setEncoding}
      />
    );
  },
};
