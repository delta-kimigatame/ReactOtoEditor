import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import TabContext from "@mui/lab/TabContext";
import { TargetDirDialogTabMakePanel } from "../../../src/features/TargetDirDialog/TargetDirDialogTabMakePanel";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import Box from "@mui/material/Box";

/**
 * `TargetDirDialogTabMakePanel` は、oto.iniを自動生成するタブパネルです。
 *
 * ## 主な機能
 * - **Singleモード**: wavファイル名からエイリアスを推定（簡易生成）
 * - **Multiモード**: 詳細設定（プリセット、母音・子音設定、置換ルール等）で生成
 * - プリセット選択（CV/VCV/CVVC）
 * - 母音・子音の詳細設定
 * - ファイル名置換ルール
 * - テンポ・オフセット等のパラメータ設定
 *
 * ## 生成の仕組み
 * - **Singleモード**: wavファイル名をそのままエイリアスとして使用
 * - **Multiモード**: 母音・子音の組み合わせからエイリアスを生成し、タイミングパラメータを計算
 */
const meta: Meta<typeof TargetDirDialogTabMakePanel> = {
  title: "Components/TargetDirDialog/TargetDirDialogTabMakePanel",
  component: TargetDirDialogTabMakePanel,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Box sx={{ width: "600px", maxHeight: "600px", overflow: "auto" }}>
        <TabContext value="4">
          <Story />
        </TabContext>
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TargetDirDialogTabMakePanel>;

/**
 * デフォルトのoto.ini生成パネル。モード未選択の初期状態です。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir, setReadZip, targetDir, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // サンプルzipデータを作成（wavファイルのダミーエントリ）
      const zip = new JSZip();
      const targetDir_ = "samples";
      
      // 日本語音源の典型的なファイル名
      ["a.wav", "i.wav", "u.wav", "e.wav", "o.wav"].forEach((filename) => {
        zip.file(`${targetDir_}/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDir(targetDir_);
          setReadZip(files);
          setIsReady(true);
        });
      });

      return () => {
        setTargetDir(null);
        setReadZip(null);
        setIsReady(false);
      };
    }, [setTargetDir, setReadZip]);

    if (!isReady || !targetDir || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabMakePanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * Singleモード選択状態。wavファイル名からエイリアスを簡易生成します。
 */
export const SingleMode: Story = {
  render: () => {
    const { setTargetDir, setReadZip, targetDir, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const zip = new JSZip();
      const targetDir_ = "single_samples";
      
      // 単独音用のファイル名（CV形式）
      ["a.wav", "i.wav", "ka.wav", "ki.wav", "sa.wav"].forEach((filename) => {
        zip.file(`${targetDir_}/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDir(targetDir_);
          setReadZip(files);
          setIsReady(true);
        });
      });

      return () => {
        setTargetDir(null);
        setReadZip(null);
        setIsReady(false);
      };
    }, [setTargetDir, setReadZip]);

    if (!isReady || !targetDir || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabMakePanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * Singleモード自動選択状態。生成方法でsingleが選択された状態です。
 */
export const SingleModeSelected: Story = {
  render: () => {
    const { setTargetDir, setReadZip, targetDir, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const zip = new JSZip();
      const targetDir_ = "single_samples";
      
      // 単独音用のファイル名（CV形式）
      ["a.wav", "i.wav", "ka.wav", "ki.wav", "sa.wav"].forEach((filename) => {
        zip.file(`${targetDir_}/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDir(targetDir_);
          setReadZip(files);
          setIsReady(true);
        });
      });

      return () => {
        setTargetDir(null);
        setReadZip(null);
        setIsReady(false);
      };
    }, [setTargetDir, setReadZip]);

    // 自動的にsingleを選択
    useEffect(() => {
      if (!isReady) return;

      const selectSingle = () => {
        const modeSelect = document.querySelector('[data-testid="mode-select"]') as HTMLElement;
        if (modeSelect) {
          // セレクトボックスをクリック
          modeSelect.click();
          
          setTimeout(() => {
            // singleオプションを選択
            const singleOption = document.querySelector('[data-testid="mode-single"]') as HTMLElement;
            if (singleOption) {
              singleOption.click();
            } else {
              // まだオプションが表示されていない場合は再試行
              setTimeout(selectSingle, 200);
            }
          }, 100);
        } else {
          // セレクトボックスがまだ表示されていない場合は再試行
          setTimeout(selectSingle, 200);
        }
      };

      const timer = setTimeout(selectSingle, 500);
      return () => clearTimeout(timer);
    }, [isReady]);

    if (!isReady || !targetDir || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabMakePanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * Multiモード選択状態。詳細設定で原音設定を生成します。
 */
export const MultiMode: Story = {
  render: () => {
    const { setTargetDir, setReadZip, targetDir, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const zip = new JSZip();
      const targetDir_ = "multi_samples";
      
      // VCV用のファイル名（連番付き）
      Array.from({ length: 10 }, (_, i) => `${String(i + 1).padStart(3, "0")}.wav`).forEach((filename) => {
        zip.file(`${targetDir_}/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDir(targetDir_);
          setReadZip(files);
          setIsReady(true);
        });
      });

      return () => {
        setTargetDir(null);
        setReadZip(null);
        setIsReady(false);
      };
    }, [setTargetDir, setReadZip]);

    if (!isReady || !targetDir || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabMakePanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 多数のwavファイルを含むケース。実際のUTAU音源制作を想定した規模です。
 */
export const WithManyFiles: Story = {
  render: () => {
    const { setTargetDir, setReadZip, targetDir, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const zip = new JSZip();
      const targetDir_ = "many_files";
      
      // 50ファイル（あ行〜ま行の組み合わせ想定）
      Array.from({ length: 50 }, (_, i) => `${String(i + 1).padStart(3, "0")}.wav`).forEach((filename) => {
        zip.file(`${targetDir_}/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDir(targetDir_);
          setReadZip(files);
          setIsReady(true);
        });
      });

      return () => {
        setTargetDir(null);
        setReadZip(null);
        setIsReady(false);
      };
    }, [setTargetDir, setReadZip]);

    if (!isReady || !targetDir || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabMakePanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 連番ファイル（001.wav, 002.wav等）のケース。連番をスキップしてエイリアス生成できます。
 */
export const WithNumberedFiles: Story = {
  render: () => {
    const { setTargetDir, setReadZip, targetDir, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const zip = new JSZip();
      const targetDir_ = "numbered";
      
      // 連番付きファイル（001〜020）
      Array.from({ length: 20 }, (_, i) => `${String(i + 1).padStart(3, "0")}.wav`).forEach((filename) => {
        zip.file(`${targetDir_}/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDir(targetDir_);
          setReadZip(files);
          setIsReady(true);
        });
      });

      return () => {
        setTargetDir(null);
        setReadZip(null);
        setIsReady(false);
      };
    }, [setTargetDir, setReadZip]);

    if (!isReady || !targetDir || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogTabMakePanel
        setDialogOpen={setDialogOpen}
      />
    );
  },
};
