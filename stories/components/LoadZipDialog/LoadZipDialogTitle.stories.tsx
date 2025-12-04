import type { Meta, StoryObj } from '@storybook/react';
import { LoadZipDialogTitle } from '../../../src/components/LoadZipDialog/LoadZipDialogTitle';
import { useState } from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';

/**
 * LoadZipDialogTitleは、zip読込待ちダイアログのタイトル部分です。
 * 閉じるボタンとタイトルテキストを含みます。
 */
const meta = {
  title: 'Components/LoadZipDialog/LoadZipDialogTitle',
  component: LoadZipDialogTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'zip読込待ちダイアログのタイトル部分。文字コード確認のメッセージと閉じるボタンを表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    setDialogOpen: {
      control: false,
      description: 'ダイアログを閉じるための関数',
    },
  },
} satisfies Meta<typeof LoadZipDialogTitle>;

export default meta;
type Story = StoryObj<typeof LoadZipDialogTitle>;

/**
 * 基本的な表示
 */
export const Default: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
      <div>
        <button onClick={() => setDialogOpen(true)}>ダイアログを開く</button>
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <LoadZipDialogTitle setDialogOpen={setDialogOpen} />
          <DialogContent>
            <Typography>ダイアログのコンテンツ</Typography>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
};

/**
 * ダイアログ内での表示（開いた状態）
 */
export const InDialog: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = useState(true);

    return (
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <LoadZipDialogTitle setDialogOpen={setDialogOpen} />
        <DialogContent>
          <Typography variant="body2">
            zipファイルの内容を読み込んでいます...
          </Typography>
        </DialogContent>
      </Dialog>
    );
  },
};
