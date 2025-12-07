import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { TargetDirDialogCorrectPanel } from "../../../src/features/TargetDirDialog/TargetDirDialogCorrectPanel";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

/**
 * `TargetDirDialogCorrectPanel` は、テンプレートoto.iniを読み込む際の補正パネルです。
 *
 * ## 主な機能
 * - オフセット補正（テンプレートと変更後のオフセット差分を補正）
 * - テンポ補正（異なるテンポで録音された音源の補正）
 * - エイリアス種類（CV/VCV/VC）の自動推定と選択
 * - 右ブランクが正の値の場合はテンポ補正不可（エラー表示）
 *
 * ## 補正の仕組み
 * - **オフセット補正**: テンプレートのオフセット値と変更後のオフセット値の差分を各パラメータに加算
 * - **テンポ補正**: テンポの変化に応じて時間パラメータを比例計算
 */
const meta: Meta<typeof TargetDirDialogCorrectPanel> = {
  title: "Components/TargetDirDialog/TargetDirDialogCorrectPanel",
  component: TargetDirDialogCorrectPanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TargetDirDialogCorrectPanel>;

/**
 * デフォルトの補正パネル。オフセット補正のみが選択可能な状態です。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // サンプルoto.iniデータ（右ブランクが負の値で、テンポ補正可能）
      const sampleOtoText = `sample1.wav=あ,1000,100,50,120,-50
sample2.wav=い,1000,100,50,120,-50
sample3.wav=か,1000,80,50,100,-40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/samples");
        setOto(oto_);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogCorrectPanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 右ブランクが正の値のケース。テンポ補正が不可能であることをエラー表示します。
 */
export const WithPositiveBlank: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // 右ブランクが正の値（テンポ補正不可）
      const sampleOtoText = `sample1.wav=あ,1000,100,50,120,50
sample2.wav=い,1000,100,50,120,30
sample3.wav=か,1000,80,50,100,40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/positive_blank_samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/positive_blank_samples");
        setOto(oto_);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogCorrectPanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * VCV（連続音）エイリアスを含むoto.ini。エイリアス種類が自動推定されます。
 */
export const WithVCVAliases: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // VCV（半角スペース + 全角文字）のパターン
      const sampleOtoText = `vcv01.wav=a い,1000,100,50,120,-50
vcv02.wav=a う,1000,100,50,120,-50
vcv03.wav=i か,1000,80,50,100,-40
vcv04.wav=i き,1000,80,50,100,-40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/vcv_samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/vcv_samples");
        setOto(oto_);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogCorrectPanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 多数のエイリアスを持つoto.ini。CV/VCV混在パターンです。
 */
export const MixedAliases: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // CV（単独音）とVCV（連続音）の混在
      const sampleOtoText = `cv01.wav=あ,1000,100,50,120,-50
cv02.wav=い,1000,100,50,120,-50
vcv01.wav=- か,1000,80,50,100,-40
vcv02.wav=- き,1000,80,50,100,-40
vcv03.wav=a さ,1000,80,50,100,-40
vcv04.wav=a し,1000,80,50,100,-40
cv03.wav=た,1000,80,50,100,-40
vcv05.wav=i な,1000,80,50,100,-40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/mixed_samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/mixed_samples");
        setOto(oto_);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogCorrectPanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 様々なオフセット値を持つoto.ini。テンポ120BPMで録音されたテンプレートを想定。
 */
export const WithVariousOffsets: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // 様々なオフセット値（500〜1500ms）
      const offsets = [500, 750, 1000, 1200, 1500];
      const aliases = ["あ", "い", "う", "か", "さ"];
      const sampleOtoText = offsets
        .map((offset, i) => `sample${i + 1}.wav=${aliases[i]},${offset},${80 + i * 10},50,${100 + i * 10},-${40 + i * 5}`)
        .join("\n");
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/various_offsets",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/various_offsets");
        setOto(oto_);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogCorrectPanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};
