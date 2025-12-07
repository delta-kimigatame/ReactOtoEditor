import type { Meta, StoryObj } from '@storybook/react';
import { BasePaper } from '../../../src/components/Common/BasePaper';
import { Box, Button, TextField, Typography } from '@mui/material';

/**
 * BasePaperは、タイトルと内容を持つ基本的なペーパーコンポーネントです。
 * Material-UIのPaperコンポーネントをラップし、一貫したスタイルを提供します。
 */
const meta = {
  title: 'Components/Common/BasePaper',
  component: BasePaper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'BasePaperは、タイトルと本文を持つ基本的なペーパーコンポーネントです。Material-UIのPaperをベースに、統一されたスタイルを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'ペーパーのタイトル',
    },
    elevation: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'ペーパーの影の深さ（0-24）',
    },
    children: {
      control: false,
      description: 'ペーパーの本文コンテンツ',
    },
    sx: {
      control: false,
      description: 'Material-UIのsxプロパティ（追加スタイル）',
    },
  },
} satisfies Meta<typeof BasePaper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な使用例
 */
export const Default: Story = {
  args: {
    title: 'サンプルタイトル',
    children: (
      <Typography>
        これはBasePaperコンポーネントの基本的な使用例です。
        タイトルと本文が表示されます。
      </Typography>
    ),
  },
};

/**
 * テキストコンテンツの例
 */
export const WithTextContent: Story = {
  args: {
    title: '原音設定について',
    children: (
      <Box>
        <Typography paragraph>
          原音設定とは、UTAU音源の各音声ファイルに対して、発音のタイミングや音の長さを調整するためのパラメータです。
        </Typography>
        <Typography paragraph>
          主なパラメータ：
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>オフセット：音声ファイルの開始位置</li>
          <li>先行発声：発音開始位置</li>
          <li>オーバーラップ：音の重なり</li>
          <li>子音速度：子音部分の長さ</li>
          <li>右ブランク：音声の終了位置</li>
        </Typography>
      </Box>
    ),
  },
};

/**
 * フォームコンテンツの例
 */
export const WithFormContent: Story = {
  args: {
    title: 'プロジェクト設定',
    children: (
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="プロジェクト名"
          defaultValue="新しいプロジェクト"
          fullWidth
        />
        <TextField
          label="エイリアス"
          defaultValue="あ"
          fullWidth
        />
        <TextField
          label="ターゲットディレクトリ"
          defaultValue="/samples"
          fullWidth
        />
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button variant="outlined">キャンセル</Button>
          <Button variant="contained">保存</Button>
        </Box>
      </Box>
    ),
  },
};

/**
 * 影なし（elevation=0）
 */
export const NoElevation: Story = {
  args: {
    title: '影なしペーパー',
    elevation: 0,
    children: (
      <Typography>
        elevation=0を指定すると、影のないフラットなペーパーになります。
      </Typography>
    ),
  },
};

/**
 * 深い影（elevation=12）
 */
export const HighElevation: Story = {
  args: {
    title: '深い影のペーパー',
    elevation: 12,
    children: (
      <Typography>
        elevation=12を指定すると、より深い影が表示され、浮き上がった印象になります。
      </Typography>
    ),
  },
};

/**
 * カスタムスタイル
 */
export const CustomStyle: Story = {
  args: {
    title: 'カスタムスタイル',
    children: (
      <Typography>
        sxプロパティを使用して、背景色やボーダーなどをカスタマイズできます。
      </Typography>
    ),
    sx: {
      backgroundColor: '#f0f8ff',
      border: '2px solid #1976d2',
      borderRadius: 2,
    },
  },
};

/**
 * 幅を制限した例
 */
export const LimitedWidth: Story = {
  args: {
    title: '幅制限あり',
    children: (
      <Typography>
        sxプロパティでmaxWidthを指定することで、ペーパーの幅を制限できます。
      </Typography>
    ),
    sx: {
      maxWidth: 400,
    },
  },
};

/**
 * 複雑なコンテンツの例
 */
export const ComplexContent: Story = {
  args: {
    title: 'エディター設定',
    children: (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          表示設定
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          <TextField
            label="キャンバスの高さ"
            type="number"
            defaultValue={256}
            size="small"
          />
          <TextField
            label="スペクトログラムの高さ"
            type="number"
            defaultValue={256}
            size="small"
          />
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          言語設定
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" size="small">日本語</Button>
          <Button variant="outlined" size="small">English</Button>
          <Button variant="outlined" size="small">中文</Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button variant="outlined">リセット</Button>
          <Button variant="contained">適用</Button>
        </Box>
      </Box>
    ),
    elevation: 3,
  },
};
