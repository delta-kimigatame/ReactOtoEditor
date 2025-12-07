import type { Meta, StoryObj } from '@storybook/react';
import { FullWidthTextField } from '../../../src/components/Common/FullWidthTextField';
import { useState } from 'react';
import { Box } from '@mui/material';

/**
 * FullWidthTextFieldは、全幅のMaterial-UIテキストフィールドコンポーネントです。
 * 統一されたスタイル（マージン、バリアント）を提供します。
 */
const meta = {
  title: 'Components/Common/FullWidthTextField',
  component: FullWidthTextField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '全幅で表示されるテキストフィールドコンポーネント。outlined variantで統一されたスタイルを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'テキストフィールドのラベル',
    },
    value: {
      control: 'text',
      description: '現在の入力値',
    },
    type: {
      control: 'select',
      options: ['text', 'number', 'email', 'password', 'tel', 'url'],
      description: 'input要素のtype属性',
    },
    onChange: {
      control: false,
      description: '値変更時のイベントハンドラ',
    },
    'data-testid': {
      control: 'text',
      description: 'テスト用のdata-testid属性',
    },
  },
} satisfies Meta<typeof FullWidthTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な使用例（テキスト入力）
 */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FullWidthTextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action('changed')(e.target.value);
        }}
      />
    );
  },
  args: {
    label: 'テキスト入力',
    type: 'text',
  },
};

/**
 * 初期値が設定されている例
 */
export const WithDefaultValue: Story = {
  render: (args) => {
    const [value, setValue] = useState('初期値');
    return (
      <FullWidthTextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action('changed')(e.target.value);
        }}
      />
    );
  },
  args: {
    label: 'デフォルト値あり',
    type: 'text',
  },
};

/**
 * 数値入力
 */
export const NumberInput: Story = {
  render: (args) => {
    const [value, setValue] = useState('100');
    return (
      <FullWidthTextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action('changed')(e.target.value);
        }}
      />
    );
  },
  args: {
    label: 'オフセット',
    type: 'number',
  },
};

/**
 * メールアドレス入力
 */
export const EmailInput: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FullWidthTextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action('changed')(e.target.value);
        }}
      />
    );
  },
  args: {
    label: 'メールアドレス',
    type: 'email',
  },
};

/**
 * パスワード入力
 */
export const PasswordInput: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FullWidthTextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action('changed')(e.target.value);
        }}
      />
    );
  },
  args: {
    label: 'パスワード',
    type: 'password',
  },
};

/**
 * URL入力
 */
export const UrlInput: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FullWidthTextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action('changed')(e.target.value);
        }}
      />
    );
  },
  args: {
    label: 'ウェブサイトURL',
    type: 'url',
  },
};

/**
 * 実際のユースケース例：プロジェクト設定
 */
export const ProjectSettingsExample: Story = {
  render: () => {
    const [projectName, setProjectName] = useState('新しいプロジェクト');
    const [alias, setAlias] = useState('あ');
    const [targetDir, setTargetDir] = useState('');

    return (
      <Box sx={{ maxWidth: 400 }}>
        <FullWidthTextField
          label="プロジェクト名"
          type="text"
          value={projectName}
          onChange={(e) => {
            setProjectName(e.target.value);
            console.log('project-name-changed', e.target.value);
          }}
        />
        <FullWidthTextField
          label="エイリアス"
          type="text"
          value={alias}
          onChange={(e) => {
            setAlias(e.target.value);
            console.log('alias-changed', e.target.value);
          }}
        />
        <FullWidthTextField
          label="ターゲットディレクトリ"
          type="text"
          value={targetDir}
          onChange={(e) => {
            setTargetDir(e.target.value);
            console.log('target-dir-changed', e.target.value);
          }}
        />
      </Box>
    );
  },
};

/**
 * 原音設定パラメータの例
 */
export const OtoParametersExample: Story = {
  render: () => {
    const [offset, setOffset] = useState('100');
    const [overlap, setOverlap] = useState('50');
    const [preutterance, setPreutterance] = useState('80');
    const [velocity, setVelocity] = useState('120');
    const [blank, setBlank] = useState('200');

    return (
      <Box sx={{ maxWidth: 400 }}>
        <FullWidthTextField
          label="オフセット"
          type="number"
          value={offset}
          onChange={(e) => {
            setOffset(e.target.value);
            console.log('offset-changed', e.target.value);
          }}
        />
        <FullWidthTextField
          label="オーバーラップ"
          type="number"
          value={overlap}
          onChange={(e) => {
            setOverlap(e.target.value);
            console.log('overlap-changed', e.target.value);
          }}
        />
        <FullWidthTextField
          label="先行発声"
          type="number"
          value={preutterance}
          onChange={(e) => {
            setPreutterance(e.target.value);
            console.log('preutterance-changed', e.target.value);
          }}
        />
        <FullWidthTextField
          label="子音速度"
          type="number"
          value={velocity}
          onChange={(e) => {
            setVelocity(e.target.value);
            console.log('velocity-changed', e.target.value);
          }}
        />
        <FullWidthTextField
          label="右ブランク"
          type="number"
          value={blank}
          onChange={(e) => {
            setBlank(e.target.value);
            console.log('blank-changed', e.target.value);
          }}
        />
      </Box>
    );
  },
};

/**
 * テスト用のdata-testid付き
 */
export const WithTestId: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FullWidthTextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action('changed')(e.target.value);
        }}
      />
    );
  },
  args: {
    label: 'テスト用テキストフィールド',
    type: 'text',
    'data-testid': 'test-textfield',
  },
};

/**
 * 長い初期値の例
 */
export const LongValue: Story = {
  render: (args) => {
    const [value, setValue] = useState(
      'これは非常に長いテキストの例です。ユーザーが長い文章を入力した場合の表示を確認できます。'
    );
    return (
      <FullWidthTextField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          action('changed')(e.target.value);
        }}
      />
    );
  },
  args: {
    label: '長いテキスト',
    type: 'text',
  },
};
