import type { Meta, StoryObj } from '@storybook/react';
import { FullWidthButton } from '../../../src/components/Common/FullWidthButton';
import { Box } from '@mui/material';

/**
 * FullWidthButtonは、全幅のMaterial-UIボタンコンポーネントです。
 * 統一されたスタイル（マージン、サイズ）を提供します。
 */
const meta = {
  title: 'Components/Common/FullWidthButton',
  component: FullWidthButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '全幅で表示されるボタンコンポーネント。マージンやサイズが統一されており、一貫したUIを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'ボタンに表示するテキスト',
    },
    onClick: {
      control: false,
      description: 'クリック時のイベントハンドラ',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態にするかどうか',
    },
    color: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'],
      description: 'ボタンの色',
    },
    'data-testid': {
      control: 'text',
      description: 'テスト用のdata-testid属性',
    },
  },
} satisfies Meta<typeof FullWidthButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な使用例（デフォルトカラー）
 */
export const Default: Story = {
  args: {
    children: 'ボタン',
    onClick: () => console.log('clicked'),
  },
};

/**
 * プライマリカラー
 */
export const Primary: Story = {
  args: {
    children: 'プライマリボタン',
    color: 'primary',
    onClick: () => console.log('clicked'),
  },
};

/**
 * セカンダリカラー
 */
export const Secondary: Story = {
  args: {
    children: 'セカンダリボタン',
    color: 'secondary',
    onClick: () => console.log('clicked'),
  },
};

/**
 * 成功カラー
 */
export const Success: Story = {
  args: {
    children: '保存',
    color: 'success',
    onClick: () => console.log('clicked'),
  },
};

/**
 * エラーカラー
 */
export const Error: Story = {
  args: {
    children: '削除',
    color: 'error',
    onClick: () => console.log('clicked'),
  },
};

/**
 * 情報カラー
 */
export const Info: Story = {
  args: {
    children: '詳細を表示',
    color: 'info',
    onClick: () => console.log('clicked'),
  },
};

/**
 * 警告カラー
 */
export const Warning: Story = {
  args: {
    children: '注意が必要',
    color: 'warning',
    onClick: () => console.log('clicked'),
  },
};

/**
 * 無効状態
 */
export const Disabled: Story = {
  args: {
    children: '無効なボタン',
    disabled: true,
    onClick: () => console.log('clicked'),
  },
};

/**
 * 実際のユースケース例：アクションボタン群
 */
export const ActionButtonsExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <FullWidthButton color="primary" onClick={() => console.log('open-file')}>
        zipファイルを開く
      </FullWidthButton>
      <FullWidthButton color="success" onClick={() => console.log('save')}>
        プロジェクトを保存
      </FullWidthButton>
      <FullWidthButton color="info" onClick={() => console.log('download')}>
        zipファイルをダウンロード
      </FullWidthButton>
      <FullWidthButton color="error" onClick={() => console.log('reset')}>
        設定をリセット
      </FullWidthButton>
    </Box>
  ),
};

/**
 * エディター操作の例
 */
export const EditorActionsExample: Story = {
  render: () => (
    <Box sx={{ maxWidth: 400 }}>
      <FullWidthButton color="primary" onClick={() => console.log('play')}>
        再生
      </FullWidthButton>
      <FullWidthButton color="secondary" onClick={() => console.log('stop')}>
        停止
      </FullWidthButton>
      <FullWidthButton color="info" onClick={() => console.log('next')}>
        次のエイリアスへ
      </FullWidthButton>
      <FullWidthButton color="warning" onClick={() => console.log('auto-adjust')}>
        自動調整
      </FullWidthButton>
    </Box>
  ),
};

/**
 * テスト用のdata-testid付き
 */
export const WithTestId: Story = {
  args: {
    children: 'テスト用ボタン',
    color: 'primary',
    'data-testid': 'test-button',
    onClick: () => console.log('clicked'),
  },
};

/**
 * 長いテキストの例
 */
export const LongText: Story = {
  args: {
    children: 'このボタンには非常に長いテキストが含まれていますが、全幅で表示されるため問題ありません',
    color: 'primary',
    onClick: () => console.log('clicked'),
  },
};
