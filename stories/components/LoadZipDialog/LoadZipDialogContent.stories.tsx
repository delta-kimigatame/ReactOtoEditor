import type { Meta, StoryObj } from '@storybook/react';
import { LoadZipDialogContent } from '../../../src/components/LoadZipDialog/LoadZipDialogContent';
import { useState } from 'react';
import { Dialog } from '@mui/material';
import JSZip from 'jszip';

/**
 * LoadZipDialogContentは、zip読込待ちダイアログのコンテンツ部分です。
 * 読込中のスピナー、ファイル一覧表示、エンコーディング選択を含みます。
 */
const meta = {
  title: 'Components/LoadZipDialog/LoadZipDialogContent',
  component: LoadZipDialogContent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'zip読込待ちダイアログのコンテンツ部分。処理中はスピナーを表示し、読込完了後はファイル一覧とエンコーディング選択ボタンを表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    file: {
      control: false,
      description: '読み込んだファイル',
    },
    processing: {
      control: 'boolean',
      description: '読込待ち判定',
    },
    encoding: {
      control: 'text',
      description: 'zipのファイル名を解釈するための文字コード',
    },
    zipFiles: {
      control: false,
      description: '仮に読み込んだzipファイル',
    },
    LoadZip: {
      control: false,
      description: 'zipを読み込む処理',
    },
    setDialogOpen: {
      control: false,
      description: 'ダイアログを閉じる関数',
    },
    setProcessing: {
      control: false,
      description: '読込待ち状態を変更する関数',
    },
    setEncoding: {
      control: false,
      description: '文字コードを変更する関数',
    },
    setZipFiles: {
      control: false,
      description: 'zipファイルを変更する関数',
    },
  },
} satisfies Meta<typeof LoadZipDialogContent>;

export default meta;
type Story = StoryObj<typeof LoadZipDialogContent>;

/**
 * 読込中の状態
 */
export const Processing: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [processing, setProcessing] = useState(true);
    const [encoding, setEncoding] = useState('utf-8');
    const [zipFiles, setZipFiles] = useState<{ [key: string]: JSZip.JSZipObject } | null>(null);
    const file = new File([''], 'sample.zip', { type: 'application/zip' });

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <LoadZipDialogContent
          file={file}
          processing={processing}
          encoding={encoding}
          zipFiles={zipFiles}
          LoadZip={() => console.log('LoadZip')}
          setDialogOpen={setDialogOpen}
          setProcessing={setProcessing}
          setEncoding={setEncoding}
          setZipFiles={setZipFiles}
        />
      </Dialog>
    );
  },
};

/**
 * ファイル一覧表示（読込完了）
 */
export const WithFileList: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [encoding, setEncoding] = useState('utf-8');
    const file = new File([''], 'voice_library.zip', { type: 'application/zip' });

    // サンプルzipファイル構造を作成
    const zip = new JSZip();
    zip.file('あ.wav', 'dummy content');
    zip.file('い.wav', 'dummy content');
    zip.file('う.wav', 'dummy content');
    zip.file('え.wav', 'dummy content');
    zip.file('お.wav', 'dummy content');
    zip.file('oto.ini', 'dummy content');
    zip.file('character.txt', 'dummy content');
    zip.file('readme.txt', 'dummy content');
    
    const [zipFiles, setZipFiles] = useState<{ [key: string]: JSZip.JSZipObject } | null>(zip.files);

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <LoadZipDialogContent
          file={file}
          processing={processing}
          encoding={encoding}
          zipFiles={zipFiles}
          LoadZip={() => console.log('LoadZip')}
          setDialogOpen={setDialogOpen}
          setProcessing={setProcessing}
          setEncoding={setEncoding}
          setZipFiles={setZipFiles}
        />
      </Dialog>
    );
  },
};

/**
 * ネストされたディレクトリ構造
 */
export const WithNestedStructure: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [encoding, setEncoding] = useState('utf-8');
    const file = new File([''], 'voice_bank.zip', { type: 'application/zip' });

    const zip = new JSZip();
    zip.file('あ/oto.ini', 'dummy content');
    zip.file('あ/あ.wav', 'dummy content');
    zip.file('い/oto.ini', 'dummy content');
    zip.file('い/い.wav', 'dummy content');
    zip.file('う/oto.ini', 'dummy content');
    zip.file('う/う.wav', 'dummy content');
    zip.file('character.txt', 'dummy content');
    zip.file('readme.txt', 'dummy content');
    
    const [zipFiles, setZipFiles] = useState<{ [key: string]: JSZip.JSZipObject } | null>(zip.files);

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <LoadZipDialogContent
          file={file}
          processing={processing}
          encoding={encoding}
          zipFiles={zipFiles}
          LoadZip={() => console.log('LoadZip')}
          setDialogOpen={setDialogOpen}
          setProcessing={setProcessing}
          setEncoding={setEncoding}
          setZipFiles={setZipFiles}
        />
      </Dialog>
    );
  },
};

/**
 * エラー状態（zipFilesがnull）
 */
export const ErrorState: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [encoding, setEncoding] = useState('utf-8');
    const [zipFiles, setZipFiles] = useState<{ [key: string]: JSZip.JSZipObject } | null>(null);
    const file = new File([''], 'invalid.zip', { type: 'application/zip' });

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <LoadZipDialogContent
          file={file}
          processing={processing}
          encoding={encoding}
          zipFiles={zipFiles}
          LoadZip={() => console.log('LoadZip')}
          setDialogOpen={setDialogOpen}
          setProcessing={setProcessing}
          setEncoding={setEncoding}
          setZipFiles={setZipFiles}
        />
      </Dialog>
    );
  },
};

/**
 * Shift-JISエンコーディングの例
 */
export const ShiftJISEncoding: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [encoding, setEncoding] = useState('Shift-Jis');
    const file = new File([''], 'voice_sjis.zip', { type: 'application/zip' });

    const zip = new JSZip();
    zip.file('あ.wav', 'dummy content');
    zip.file('か.wav', 'dummy content');
    zip.file('さ.wav', 'dummy content');
    zip.file('oto.ini', 'dummy content');
    
    const [zipFiles, setZipFiles] = useState<{ [key: string]: JSZip.JSZipObject } | null>(zip.files);

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <LoadZipDialogContent
          file={file}
          processing={processing}
          encoding={encoding}
          zipFiles={zipFiles}
          LoadZip={() => console.log('LoadZip with shift-jis')}
          setDialogOpen={setDialogOpen}
          setProcessing={setProcessing}
          setEncoding={setEncoding}
          setZipFiles={setZipFiles}
        />
      </Dialog>
    );
  },
};
