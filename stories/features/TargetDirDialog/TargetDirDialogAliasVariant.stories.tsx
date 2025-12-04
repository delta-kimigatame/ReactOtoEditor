import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import { Oto } from "utauoto";
import { TargetDirDialogAliasVariant } from "../../../src/features/TargetDirDialog/TargetDirDialogAliasVariant";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

/**
 * `TargetDirDialogAliasVariant` は、テンプレートoto.iniを読み込む際の補正画面で、各エイリアスの種類（CV/VCV/VC）を選択するアコーディオンコンポーネントです。
 *
 * ## 主な機能
 * - エイリアスごとにCV/VCV/VCを選択
 * - エイリアス名をラベルとして表示
 * - アコーディオンで開閉可能
 */
const meta: Meta<typeof TargetDirDialogAliasVariant> = {
  title: "Components/TargetDirDialog/TargetDirDialogAliasVariant",
  component: TargetDirDialogAliasVariant,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TargetDirDialogAliasVariant>;

/**
 * デフォルトのエイリアス種類選択画面。複数のエイリアスを持つoto.iniで、CV/VCV/VCを選択します。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [aliasVariant, setAliasVariant] = useState<Array<"CV" | "VCV" | "VC"> | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // サンプルoto.iniデータを作成（日本語UTAU音源の一般的なエイリアス）
      const sampleOtoText = `sample1.wav=あ,0,100,50,120,-50
sample2.wav=- い,0,100,50,120,-50
sample3.wav=- う,0,100,50,120,-50
sample4.wav=か,0,80,50,100,-40
sample5.wav=a き,0,80,50,100,-40
sample6.wav=a く,0,80,50,100,-40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/samples");
        setOto(oto_);
        // デフォルトの種類を設定（CV多め）
        setAliasVariant(["CV", "VCV", "VCV", "CV", "VCV", "VCV"]);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setAliasVariant(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto || !aliasVariant) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogAliasVariant
        aliasVariant={aliasVariant}
        setAliasVariant={setAliasVariant}
      />
    );
  },
};

/**
 * CV（単独音）のみのエイリアス。すべてのエイリアスがCVとして選択されています。
 */
export const AllCV: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [aliasVariant, setAliasVariant] = useState<Array<"CV" | "VCV" | "VC"> | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOtoText = `cv_a.wav=あ,0,100,50,120,-50
cv_i.wav=い,0,100,50,120,-50
cv_u.wav=う,0,100,50,120,-50
cv_ka.wav=か,0,80,50,100,-40
cv_ki.wav=き,0,80,50,100,-40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/cv_samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/cv_samples");
        setOto(oto_);
        setAliasVariant(["CV", "CV", "CV", "CV", "CV"]);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setAliasVariant(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto || !aliasVariant) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogAliasVariant
        aliasVariant={aliasVariant}
        setAliasVariant={setAliasVariant}
      />
    );
  },
};

/**
 * VCV（連続音）のみのエイリアス。すべてのエイリアスがVCVとして選択されています。
 */
export const AllVCV: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [aliasVariant, setAliasVariant] = useState<Array<"CV" | "VCV" | "VC"> | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const sampleOtoText = `vcv_01.wav=a い,0,100,50,120,-50
vcv_02.wav=a う,0,100,50,120,-50
vcv_03.wav=a え,0,100,50,120,-50
vcv_04.wav=i か,0,80,50,100,-40
vcv_05.wav=i き,0,80,50,100,-40`;
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/vcv_samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/vcv_samples");
        setOto(oto_);
        setAliasVariant(["VCV", "VCV", "VCV", "VCV", "VCV"]);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setAliasVariant(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto || !aliasVariant) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogAliasVariant
        aliasVariant={aliasVariant}
        setAliasVariant={setAliasVariant}
      />
    );
  },
};

/**
 * 多数のエイリアスを持つoto.ini。スクロール可能な状態を確認できます。
 */
export const ManyAliases: Story = {
  render: () => {
    const { setTargetDir, setOto, targetDir, oto } = useOtoProjectStore();
    const [aliasVariant, setAliasVariant] = useState<Array<"CV" | "VCV" | "VC"> | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // 14個のエイリアス（日本語音源の典型的な行）
      const aliases = [
        "あ", "い", "う", "え", "お",
        "- か", "- き", "- く", "- け", "- こ",
        "a さ", "a し", "a す", "a せ"
      ];
      const sampleOtoText = aliases
        .map((alias, i) => `sample${i + 1}.wav=${alias},0,${80 + i * 5},50,${100 + i * 5},-${40 + i * 2}`)
        .join("\n");
      
      const oto_ = new Oto();
      oto_.InputOtoAsync(
        "/many_samples",
        new Blob([sampleOtoText], { type: "text/plain" }),
        "UTF-8"
      ).then(() => {
        setTargetDir("/many_samples");
        setOto(oto_);
        // CV、VCV、VCを混在させる
        const variants: Array<"CV" | "VCV" | "VC"> = [
          "CV", "CV", "CV", "CV", "CV", // 母音はCV
          "VCV", "VCV", "VCV", "VCV", "VCV", // - で始まるのはVCV
          "VCV", "VCV", "VCV", "VCV" // 母音 子音のパターンはVCV
        ];
        setAliasVariant(variants);
        setIsReady(true);
      });

      return () => {
        setTargetDir(null);
        setOto(null);
        setAliasVariant(null);
        setIsReady(false);
      };
    }, [setTargetDir, setOto]);

    if (!isReady || !targetDir || !oto || !aliasVariant) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogAliasVariant
        aliasVariant={aliasVariant}
        setAliasVariant={setAliasVariant}
      />
    );
  },
};
