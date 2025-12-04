import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { TargetDirDialogContent } from "../../../src/features/TargetDirDialog/TargetDirDialogContent";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

/**
 * `TargetDirDialogContent` は、原音設定対象ディレクトリを選択するダイアログのメインコンテンツです。
 *
 * ## 主な機能
 * - **4つのタブパネル**:
 *   1. **Zip**: zipファイル内のoto.iniを読み込み
 *   2. **Storaged**: localStorage履歴から読み込み
 *   3. **Template**: ファイルからテンプレートoto.iniを読み込み
 *   4. **Make**: oto.iniを自動生成（Single/Multiモード）
 * - ディレクトリ選択
 * - タブ切り替え
 * - 各タブパネルの統合
 *
 * ## ワークフロー
 * 1. zipファイルを読み込み済みの状態で開く
 * 2. ターゲットディレクトリを選択
 * 3. 4つの方法からoto.ini読み込み方法を選択
 * 4. 必要に応じて補正・設定を行う
 * 5. Submit（確定）してダイアログを閉じる
 */
const meta: Meta<typeof TargetDirDialogContent> = {
  title: "Components/TargetDirDialog/TargetDirDialogContent",
  component: TargetDirDialogContent,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Dialog open={true} fullScreen>
        <DialogTitle>原音設定対象ディレクトリ選択</DialogTitle>
        <Story />
      </Dialog>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TargetDirDialogContent>;

/**
 * デフォルトのTargetDirDialogContent。zipファイル内にoto.iniが存在する場合です。
 */
export const Default: Story = {
  render: () => {
    const { setTargetDirs, setReadZip, setZipFileName, targetDirs, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // サンプルzipデータを作成
      const zip = new JSZip();
      const otoContent = `sample1.wav=あ,1000,100,50,120,-50
sample2.wav=い,1000,100,50,120,-50
sample3.wav=か,1000,80,50,100,-40`;

      zip.file("samples/oto.ini", otoContent);
      ["sample1.wav", "sample2.wav", "sample3.wav"].forEach((filename) => {
        zip.file(`samples/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDirs(["samples"]);
          setReadZip(files);
          setZipFileName("voice_bank.zip");
          setIsReady(true);
        });
      });

      return () => {
        setTargetDirs(null);
        setReadZip(null);
        //@ts-ignore
        setZipFileName(null);
        setIsReady(false);
      };
    }, [setTargetDirs, setReadZip, setZipFileName]);

    if (!isReady || !targetDirs || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogContent
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * oto.iniが存在しない場合。自動的にStoragedタブ（タブ2）に切り替わります。
 */
export const NoOtoIni: Story = {
  render: () => {
    const { setTargetDirs, setReadZip, setZipFileName, targetDirs, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const zip = new JSZip();
      
      // oto.iniなし、wavファイルのみ
      ["a.wav", "i.wav", "u.wav", "ka.wav", "ki.wav"].forEach((filename) => {
        zip.file(`new_voice/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDirs(["new_voice"]);
          setReadZip(files);
          setZipFileName("new_voice_bank.zip");
          setIsReady(true);
        });
      });

      return () => {
        setTargetDirs(null);
        setReadZip(null);
        //@ts-ignore
        setZipFileName(null);
        setIsReady(false);
      };
    }, [setTargetDirs, setReadZip, setZipFileName]);

    if (!isReady || !targetDirs || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogContent
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 複数のディレクトリを含むzipファイル。ディレクトリ選択でタブコンテンツが更新されます。
 */
export const MultipleDirectories: Story = {
  render: () => {
    const { setTargetDirs, setReadZip, setZipFileName, targetDirs, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const zip = new JSZip();
      
      // CV（単独音）ディレクトリ
      const cvOto = `a.wav=あ,1000,100,50,120,-50
i.wav=い,1000,100,50,120,-50
ka.wav=か,1000,80,50,100,-40`;
      zip.file("cv/oto.ini", cvOto);
      ["a.wav", "i.wav", "ka.wav"].forEach((f) => {
        zip.file(`cv/${f}`, new Blob(["dummy"], { type: "audio/wav" }));
      });

      // VCV（連続音）ディレクトリ
      const vcvOto = `vcv01.wav=a い,1000,100,50,120,-50
vcv02.wav=a う,1000,100,50,120,-50
vcv03.wav=i か,1000,80,50,100,-40`;
      zip.file("vcv/oto.ini", vcvOto);
      ["vcv01.wav", "vcv02.wav", "vcv03.wav"].forEach((f) => {
        zip.file(`vcv/${f}`, new Blob(["dummy"], { type: "audio/wav" }));
      });

      // サブディレクトリ
      const subOto = `sub1.wav=さ,1000,80,50,100,-40
sub2.wav=し,1000,80,50,100,-40`;
      zip.file("cv/sub/oto.ini", subOto);
      ["sub1.wav", "sub2.wav"].forEach((f) => {
        zip.file(`cv/sub/${f}`, new Blob(["dummy"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDirs(["cv", "vcv", "cv/sub"]);
          setReadZip(files);
          setZipFileName("complete_voice_bank.zip");
          setIsReady(true);
        });
      });

      return () => {
        setTargetDirs(null);
        setReadZip(null);
        //@ts-ignore
        setZipFileName(null);
        setIsReady(false);
      };
    }, [setTargetDirs, setReadZip, setZipFileName]);

    if (!isReady || !targetDirs || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogContent
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * 多数のエイリアスを含むoto.ini。大規模なUTAU音源での使用を想定。
 */
export const LargeVoiceBank: Story = {
  render: () => {
    const { setTargetDirs, setReadZip, setZipFileName, targetDirs, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      const zip = new JSZip();
      
      // あ行〜た行（20エイリアス）
      const aliases = [
        "あ", "い", "う", "え", "お",
        "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ",
        "た", "ち", "つ", "て", "と"
      ];
      const otoContent = aliases
        .map((alias, i) => `sample${i + 1}.wav=${alias},1000,${80 + i * 2},50,${100 + i * 2},-${40 + i}`)
        .join("\n");
      
      zip.file("complete/oto.ini", otoContent);
      aliases.forEach((_, i) => {
        zip.file(`complete/sample${i + 1}.wav`, new Blob(["dummy"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDirs(["complete"]);
          setReadZip(files);
          setZipFileName("large_voice_bank.zip");
          setIsReady(true);
        });
      });

      return () => {
        setTargetDirs(null);
        setReadZip(null);
        //@ts-ignore
        setZipFileName(null);
        setIsReady(false);
      };
    }, [setTargetDirs, setReadZip, setZipFileName]);

    if (!isReady || !targetDirs || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogContent
        setDialogOpen={setDialogOpen}
      />
    );
  },
};

/**
 * localStorage履歴がある場合。Storagedタブで履歴から読み込めます。
 */
export const WithStorageHistory: Story = {
  render: () => {
    const { setTargetDirs, setReadZip, setZipFileName, targetDirs, readZip } = useOtoProjectStore();
    const [dialogOpen, setDialogOpen] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      // localStorage履歴を設定
      const storagedOto = {
        "voice_bank.zip": {
          "samples": {
            oto: `sample1.wav=あ,1000,100,50,120,-50
sample2.wav=い,1000,100,50,120,-50
sample3.wav=か,1000,80,50,100,-40`,
            update_date: "2024-12-01 10:00:00",
          },
        },
      };
      localStorage.setItem("oto", JSON.stringify(storagedOto));

      const zip = new JSZip();
      const otoContent = `sample1.wav=あ,1000,100,50,120,-50
sample2.wav=い,1000,100,50,120,-50
sample3.wav=か,1000,80,50,100,-40`;

      zip.file("samples/oto.ini", otoContent);
      ["sample1.wav", "sample2.wav", "sample3.wav"].forEach((filename) => {
        zip.file(`samples/${filename}`, new Blob(["dummy wav data"], { type: "audio/wav" }));
      });

      zip.generateAsync({ type: "blob" }).then((blob) => {
        zip.loadAsync(blob).then((loadedZip) => {
          const files: { [key: string]: JSZip.JSZipObject } = {};
          loadedZip.forEach((relativePath, file) => {
            files[relativePath] = file;
          });
          setTargetDirs(["samples"]);
          setReadZip(files);
          setZipFileName("voice_bank.zip");
          setIsReady(true);
        });
      });

      return () => {
        localStorage.removeItem("oto");
        setTargetDirs(null);
        setReadZip(null);
        //@ts-ignore
        setZipFileName(null);
        setIsReady(false);
      };
    }, [setTargetDirs, setReadZip, setZipFileName]);

    if (!isReady || !targetDirs || !readZip) {
      return <div>Loading...</div>;
    }

    return (
      <TargetDirDialogContent
        setDialogOpen={setDialogOpen}
      />
    );
  },
};
