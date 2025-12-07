import type { Meta, StoryObj } from '@storybook/react';
import { DownloadZipDialog } from '../../../src/components/DownloadZipDialog/DownloadZipDialog';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { Oto } from 'utauoto';
import { useOtoProjectStore } from '../../../src/store/otoProjectStore';
import JSZip from 'jszip';

/**
 * DownloadZipDialogは、原音設定をzipファイルとしてダウンロードするためのフルスクリーンダイアログです。
 * 複数のoto.iniファイルを選択してまとめてダウンロードできます。
 */
const meta = {
  title: 'Components/DownloadZipDialog',
  component: DownloadZipDialog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '原音設定をzipファイルとしてダウンロードするためのフルスクリーンダイアログコンポーネント。複数のディレクトリを選択してエクスポートできます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    dialogOpen: {
      control: 'boolean',
      description: 'ダイアログの表示状態',
    },
    storagedOto: {
      control: 'object',
      description: '保存された原音設定データ',
    },
    targetList: {
      control: 'object',
      description: '書き出すotoの対象インデックスリスト',
    },
    setMenuAnchor: {
      control: false,
      description: '親メニューを閉じる関数',
    },
    setDialogOpen: {
      control: false,
      description: 'ダイアログ表示状態を更新する関数',
    },
    setTargetList: {
      control: false,
      description: '対象リストを更新する関数',
    },
  },
} satisfies Meta<typeof DownloadZipDialog>;

export default meta;
type Story = StoryObj<typeof DownloadZipDialog>;

/**
 * サンプルデータ
 */
const createSampleOto = (dirname: string, records: Array<{
  alias: string;
  fileName: string;
  offset: number;
  overlap: number;
  preutterance: number;
  velocity: number;
  blank: number;
}>) => {
  return records.map((data) => {
    const oto = new Oto();
    oto.ParseOto(
      dirname,
      `${data.fileName}=${data.alias},${data.offset},${data.velocity},${data.blank},${data.preutterance},${data.overlap}`
    );
    return oto;
  });
};

const sampleStoragedOto = {
  '/samples': createSampleOto('/samples', [
    {
      alias: 'あ',
      fileName: 'あ.wav',
      offset: 100,
      overlap: 50,
      preutterance: 80,
      velocity: 120,
      blank: 200,
    },
    {
      alias: 'い',
      fileName: 'い.wav',
      offset: 110,
      overlap: 55,
      preutterance: 85,
      velocity: 125,
      blank: 210,
    },
    {
      alias: 'う',
      fileName: 'う.wav',
      offset: 105,
      overlap: 52,
      preutterance: 82,
      velocity: 122,
      blank: 205,
    },
  ]),
  '/samples/sub': createSampleOto('/samples/sub', [
    {
      alias: 'え',
      fileName: 'え.wav',
      offset: 95,
      overlap: 48,
      preutterance: 78,
      velocity: 118,
      blank: 195,
    },
    {
      alias: 'お',
      fileName: 'お.wav',
      offset: 100,
      overlap: 50,
      preutterance: 80,
      velocity: 120,
      blank: 200,
    },
  ]),
};

/**
 * 基本的な使用例
 */
export const Default: Story = {
  render: (args) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [targetList, setTargetList] = useState<Array<number> | null>(null);

    return (
      <>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          ダウンロードダイアログを開く
        </Button>
        <DownloadZipDialog
          {...args}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          setMenuAnchor={setMenuAnchor}
          targetList={targetList}
          setTargetList={setTargetList}
        />
      </>
    );
  },
  args: {
    storagedOto: sampleStoragedOto,
  },
};

/**
 * 初期表示時（データあり）
 */
export const WithData: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    // targetListはディレクトリ数に合わせて初期化（0: 現在, 1: 保存済み, 2: 読み込み済み, 3: なし）
    const [targetList, setTargetList] = useState<Array<number> | null>([0, 0]);
    const { setTargetDirs, setReadZip } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs(Object.keys(sampleStoragedOto));
      
      // readZipをJSZipオブジェクトとして定義
      const zip = new JSZip();
      zip.file('/samples/oto.ini', 'dummy content');
      zip.file('/samples/sub/oto.ini', 'dummy content');
      setReadZip(zip.files);
      
      return () => {
        setTargetDirs(null);
        setReadZip({});
      };
    }, [setTargetDirs, setReadZip]);

    return (
      <DownloadZipDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setMenuAnchor={setMenuAnchor}
        storagedOto={sampleStoragedOto}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    );
  },
};

/**
 * 空のデータ
 */
export const EmptyData: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [targetList, setTargetList] = useState<Array<number> | null>([]);
    const { setTargetDirs, setReadZip } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([]);
      setReadZip({});
      
      return () => {
        setTargetDirs(null);
        setReadZip({});
      };
    }, [setTargetDirs, setReadZip]);

    return (
      <DownloadZipDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setMenuAnchor={setMenuAnchor}
        storagedOto={{}}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    );
  },
};

/**
 * ターゲットリストが指定されている例
 */
export const WithTargetList: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    // 最初のディレクトリは保存済み(1)、2つ目はなし(3)
    const [targetList, setTargetList] = useState<Array<number> | null>([1, 3]);
    const { setTargetDirs, setReadZip } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs(Object.keys(sampleStoragedOto));
      
      const zip = new JSZip();
      zip.file('/samples/oto.ini', 'dummy content');
      zip.file('/samples/sub/oto.ini', 'dummy content');
      setReadZip(zip.files);
      
      return () => {
        setTargetDirs(null);
        setReadZip({});
      };
    }, [setTargetDirs, setReadZip]);

    return (
      <DownloadZipDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setMenuAnchor={setMenuAnchor}
        storagedOto={sampleStoragedOto}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    );
  },
};

/**
 * 単一ディレクトリのみ
 */
export const SingleDirectory: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [targetList, setTargetList] = useState<Array<number> | null>([0]);
    const { setTargetDirs, setReadZip } = useOtoProjectStore();

    const singleDirData = {
      '/samples': sampleStoragedOto['/samples'],
    };

    useEffect(() => {
      setTargetDirs(Object.keys(singleDirData));
      
      const zip = new JSZip();
      zip.file('/samples/oto.ini', 'dummy content');
      setReadZip(zip.files);
      
      return () => {
        setTargetDirs(null);
        setReadZip({});
      };
    }, [setTargetDirs, setReadZip]);

    return (
      <DownloadZipDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setMenuAnchor={setMenuAnchor}
        storagedOto={singleDirData}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    );
  },
};

/**
 * 多数のディレクトリ
 */
export const ManyDirectories: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [targetList, setTargetList] = useState<Array<number> | null>([0, 1, 2, 3, 0]);
    const { setTargetDirs, setReadZip } = useOtoProjectStore();

    const manyDirData = {
      '/samples/dir1': sampleStoragedOto['/samples'],
      '/samples/dir2': sampleStoragedOto['/samples'],
      '/samples/dir3': sampleStoragedOto['/samples/sub'],
      '/samples/dir4': sampleStoragedOto['/samples'],
      '/samples/dir5': sampleStoragedOto['/samples/sub'],
    };

    useEffect(() => {
      setTargetDirs(Object.keys(manyDirData));
      
      const zip = new JSZip();
      zip.file('/samples/dir1/oto.ini', 'dummy content');
      zip.file('/samples/dir2/oto.ini', 'dummy content');
      zip.file('/samples/dir3/oto.ini', 'dummy content');
      zip.file('/samples/dir4/oto.ini', 'dummy content');
      zip.file('/samples/dir5/oto.ini', 'dummy content');
      setReadZip(zip.files);
      
      return () => {
        setTargetDirs(null);
        setReadZip({});
      };
    }, [setTargetDirs, setReadZip]);

    return (
      <DownloadZipDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        setMenuAnchor={setMenuAnchor}
        storagedOto={manyDirData}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    );
  },
};

/**
 * インタラクション例：ダイアログの開閉
 */
export const InteractiveExample: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [targetList, setTargetList] = useState<Array<number> | null>([0, 0]);
    const { setTargetDirs, setReadZip } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs(Object.keys(sampleStoragedOto));
      
      const zip = new JSZip();
      zip.file('/samples/oto.ini', 'dummy content');
      zip.file('/samples/sub/oto.ini', 'dummy content');
      setReadZip(zip.files);
      
      return () => {
        setTargetDirs(null);
        setReadZip({});
      };
    }, [setTargetDirs, setReadZip]);

    return (
      <div style={{ padding: 20 }}>
        <Button 
          variant="contained" 
          color="success"
          onClick={() => setDialogOpen(true)}
        >
          zipファイルをダウンロード
        </Button>
        <DownloadZipDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          setMenuAnchor={setMenuAnchor}
          storagedOto={sampleStoragedOto}
          targetList={targetList}
          setTargetList={setTargetList}
        />
      </div>
    );
  },
};
