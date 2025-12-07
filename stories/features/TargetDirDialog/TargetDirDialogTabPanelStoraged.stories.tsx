import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import { TargetDirDialogTabPanelStoraged } from "../../../src/features/TargetDirDialog/TargetDirDialogTabPanelStoraged";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import Box from "@mui/material/Box";

/**
 * `TargetDirDialogTabPanelStoraged` は、localStorage に保存された編集履歴から oto.ini を読み込むタブパネルです。
 *
 * ## 主な機能
 * - localStorage から過去の編集履歴を読み込み
 * - zipファイル名とディレクトリ名で履歴を選択
 * - 更新日時の表示
 * - 選択した履歴の oto.ini プレビュー
 *
 * ## データ構造
 * localStorage の "oto" キーに以下の形式で保存:
 * ```
 * {
 *   "zipファイル名": {
 *     "ディレクトリ名": {
 *       "oto": "oto.ini の内容",
 *       "update_date": "更新日時"
 *     }
 *   }
 * }
 * ```
 */
const meta: Meta<typeof TargetDirDialogTabPanelStoraged> = {
  title: "Components/TargetDirDialog/TargetDirDialogTabPanelStoraged",
  component: TargetDirDialogTabPanelStoraged,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Box sx={{ width: "600px", maxHeight: "600px", overflow: "auto" }}>
        <TabContext value="2">
          <Story />
        </TabContext>
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TargetDirDialogTabPanelStoraged>;

/**
 * 編集履歴がない状態。初回使用時の表示です。
 */
export const NoHistory: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);

    useEffect(() => {
      // localStorageをクリア
      localStorage.removeItem("oto");

      return () => {
        localStorage.removeItem("oto");
      };
    }, []);

    return (
      <TargetDirDialogTabPanelStoraged
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * デフォルトの編集履歴表示。1つのzipファイル、1つのディレクトリの履歴があります。
 */
export const Default: Story = {
  render: () => {
    const { setZipFileName, setTargetDir } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // サンプル履歴データを作成
      const storagedOto = {
        "sample_voice.zip": {
          "/samples": {
            oto: `sample1.wav=あ,1000,100,50,120,-50
sample2.wav=い,1000,100,50,120,-50
sample3.wav=か,1000,80,50,100,-40`,
            update_date: "2024-12-01 10:30:00",
          },
        },
      };
      
      localStorage.setItem("oto", JSON.stringify(storagedOto));
      setZipFileName("sample_voice.zip");
      setTargetDir("/samples");
      setIsReady(true);

      return () => {
        localStorage.removeItem("oto");
        //@ts-ignore
        setZipFileName(null);
        setTargetDir(null);
        setIsReady(false);
      };
    }, [setZipFileName, setTargetDir]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabPanelStoraged
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 複数のzipファイルと複数のディレクトリの履歴。実際のプロジェクトでの使用を想定。
 */
export const MultipleHistories: Story = {
  render: () => {
    const { setZipFileName, setTargetDir } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // 複数のzipファイル、複数のディレクトリの履歴
      const storagedOto = {
        "voice_bank_01.zip": {
          "/cv": {
            oto: `a.wav=あ,1000,100,50,120,-50
i.wav=い,1000,100,50,120,-50
ka.wav=か,1000,80,50,100,-40`,
            update_date: "2024-12-01 09:15:00",
          },
          "/vcv": {
            oto: `vcv01.wav=a い,1000,100,50,120,-50
vcv02.wav=a う,1000,100,50,120,-50
vcv03.wav=i か,1000,80,50,100,-40`,
            update_date: "2024-12-01 10:30:00",
          },
        },
        "voice_bank_02.zip": {
          "/samples": {
            oto: `sample1.wav=さ,1000,80,50,100,-40
sample2.wav=し,1000,80,50,100,-40
sample3.wav=た,1000,80,50,100,-40`,
            update_date: "2024-12-02 14:20:00",
          },
        },
        "test_voice.zip": {
          "/test": {
            oto: `test1.wav=な,1000,80,50,100,-40
test2.wav=に,1000,80,50,100,-40`,
            update_date: "2024-11-30 16:45:00",
          },
        },
      };
      
      localStorage.setItem("oto", JSON.stringify(storagedOto));
      setZipFileName("voice_bank_01.zip");
      setTargetDir("/cv");
      setIsReady(true);

      return () => {
        localStorage.removeItem("oto");
        //@ts-ignore
        setZipFileName(null);
        setTargetDir(null);
        setIsReady(false);
      };
    }, [setZipFileName, setTargetDir]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabPanelStoraged
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 多数のエイリアスを含む履歴。大規模なUTAU音源の編集履歴を想定。
 */
export const WithManyAliases: Story = {
  render: () => {
    const { setZipFileName, setTargetDir } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // 多数のエイリアス（あ行〜た行）
      const aliases = [
        "あ", "い", "う", "え", "お",
        "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ",
        "た", "ち", "つ", "て", "と"
      ];
      const otoContent = aliases
        .map((alias, i) => `sample${i + 1}.wav=${alias},1000,${80 + i * 2},50,${100 + i * 2},-${40 + i}`)
        .join("\n");

      const storagedOto = {
        "large_voice_bank.zip": {
          "/complete": {
            oto: otoContent,
            update_date: "2024-12-03 11:00:00",
          },
        },
      };
      
      localStorage.setItem("oto", JSON.stringify(storagedOto));
      setZipFileName("large_voice_bank.zip");
      setTargetDir("/complete");
      setIsReady(true);

      return () => {
        localStorage.removeItem("oto");
        //@ts-ignore
        setZipFileName(null);
        setTargetDir(null);
        setIsReady(false);
      };
    }, [setZipFileName, setTargetDir]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabPanelStoraged
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 異なる日付の複数の履歴。時系列での編集履歴管理を確認できます。
 */
export const WithVariousDates: Story = {
  render: () => {
    const { setZipFileName, setTargetDir } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const storagedOto = {
        "project_v1.zip": {
          "/base": {
            oto: `v1_1.wav=あ,1000,100,50,120,-50
v1_2.wav=い,1000,100,50,120,-50`,
            update_date: "2024-11-15 09:00:00",
          },
        },
        "project_v2.zip": {
          "/base": {
            oto: `v2_1.wav=あ,1000,100,50,120,-50
v2_2.wav=い,1000,100,50,120,-50
v2_3.wav=か,1000,80,50,100,-40`,
            update_date: "2024-11-20 14:30:00",
          },
        },
        "project_v3.zip": {
          "/base": {
            oto: `v3_1.wav=あ,1000,100,50,120,-50
v3_2.wav=い,1000,100,50,120,-50
v3_3.wav=か,1000,80,50,100,-40
v3_4.wav=さ,1000,80,50,100,-40`,
            update_date: "2024-12-01 16:00:00",
          },
        },
        "project_final.zip": {
          "/base": {
            oto: `final_1.wav=あ,1000,100,50,120,-50
final_2.wav=い,1000,100,50,120,-50
final_3.wav=か,1000,80,50,100,-40
final_4.wav=さ,1000,80,50,100,-40
final_5.wav=た,1000,80,50,100,-40`,
            update_date: "2024-12-04 10:15:00",
          },
        },
      };
      
      localStorage.setItem("oto", JSON.stringify(storagedOto));
      setZipFileName("project_final.zip");
      setTargetDir("/base");
      setIsReady(true);

      return () => {
        localStorage.removeItem("oto");
        //@ts-ignore
        setZipFileName(null);
        setTargetDir(null);
        setIsReady(false);
      };
    }, [setZipFileName, setTargetDir]);

    if (!isReady) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabPanelStoraged
        setDialogOpen={setDialogOpen}
      />
    );
  },
};
