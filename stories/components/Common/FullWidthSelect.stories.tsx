import type { Meta, StoryObj } from '@storybook/react';
import { FullWidthSelect } from '../../../src/components/Common/FullWidthSelect';
import { useState } from 'react';
import { MenuItem, Box } from '@mui/material';

/**
 * FullWidthSelectは、全幅のMaterial-UIセレクトコンポーネントです。
 * 統一されたスタイル（マージン、バリアント）を提供します。
 */
const meta = {
  title: 'Components/Common/FullWidthSelect',
  component: FullWidthSelect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '全幅で表示されるセレクトコンポーネント。filled variantで統一されたスタイルを提供します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'セレクトのラベル',
    },
    value: {
      control: 'text',
      description: '現在選択されている値',
    },
    onChange: {
      control: false,
      description: '値変更時のイベントハンドラ',
    },
    children: {
      control: false,
      description: 'MenuItemコンポーネント',
    },
    'data-testid': {
      control: 'text',
      description: 'テスト用のdata-testid属性',
    },
  },
} satisfies Meta<typeof FullWidthSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な使用例
 */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <FullWidthSelect
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          console.log('changed', e.target.value);
        }}
      >
        <MenuItem value="option1">オプション1</MenuItem>
        <MenuItem value="option2">オプション2</MenuItem>
        <MenuItem value="option3">オプション3</MenuItem>
      </FullWidthSelect>
    );
  },
  args: {
    label: '選択してください',
  },
};

/**
 * 初期値が設定されている例
 */
export const WithDefaultValue: Story = {
  render: (args) => {
    const [value, setValue] = useState('option2');
    return (
      <FullWidthSelect
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          console.log('changed', e.target.value);
        }}
      >
        <MenuItem value="option1">オプション1</MenuItem>
        <MenuItem value="option2">オプション2</MenuItem>
        <MenuItem value="option3">オプション3</MenuItem>
      </FullWidthSelect>
    );
  },
  args: {
    label: 'デフォルト値あり',
  },
};

/**
 * 言語選択の例
 */
export const LanguageSelect: Story = {
  render: () => {
    const [language, setLanguage] = useState('ja');
    return (
      <FullWidthSelect
        label="言語"
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          console.log('language-changed', e.target.value);
        }}
      >
        <MenuItem value="ja">日本語</MenuItem>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="zh">中文</MenuItem>
      </FullWidthSelect>
    );
  },
};

/**
 * エイリアス選択の例
 */
export const AliasSelect: Story = {
  render: () => {
    const [alias, setAlias] = useState('a');
    return (
      <FullWidthSelect
        label="エイリアス"
        value={alias}
        onChange={(e) => {
          setAlias(e.target.value);
          console.log('alias-changed', e.target.value);
        }}
      >
        <MenuItem value="a">あ</MenuItem>
        <MenuItem value="i">い</MenuItem>
        <MenuItem value="u">う</MenuItem>
        <MenuItem value="e">え</MenuItem>
        <MenuItem value="o">お</MenuItem>
      </FullWidthSelect>
    );
  },
};

/**
 * 数値選択の例
 */
export const NumberSelect: Story = {
  render: () => {
    const [size, setSize] = useState('256');
    return (
      <FullWidthSelect
        label="キャンバスの高さ"
        value={size}
        onChange={(e) => {
          setSize(e.target.value);
          console.log('size-changed', e.target.value);
        }}
      >
        <MenuItem value="128">128px</MenuItem>
        <MenuItem value="256">256px</MenuItem>
        <MenuItem value="512">512px</MenuItem>
        <MenuItem value="1024">1024px</MenuItem>
      </FullWidthSelect>
    );
  },
};

/**
 * 複数のセレクトを組み合わせた例
 */
export const MultipleSelectsExample: Story = {
  render: () => {
    const [language, setLanguage] = useState('ja');
    const [theme, setTheme] = useState('light');
    const [fontSize, setFontSize] = useState('medium');

    return (
      <Box sx={{ maxWidth: 400 }}>
        <FullWidthSelect
          label="言語"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            console.log('language-changed', e.target.value);
          }}
        >
          <MenuItem value="ja">日本語</MenuItem>
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="zh">中文</MenuItem>
        </FullWidthSelect>

        <FullWidthSelect
          label="テーマ"
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
            console.log('theme-changed', e.target.value);
          }}
        >
          <MenuItem value="light">ライト</MenuItem>
          <MenuItem value="dark">ダーク</MenuItem>
          <MenuItem value="auto">自動</MenuItem>
        </FullWidthSelect>

        <FullWidthSelect
          label="フォントサイズ"
          value={fontSize}
          onChange={(e) => {
            setFontSize(e.target.value);
            console.log('font-size-changed', e.target.value);
          }}
        >
          <MenuItem value="small">小</MenuItem>
          <MenuItem value="medium">中</MenuItem>
          <MenuItem value="large">大</MenuItem>
        </FullWidthSelect>
      </Box>
    );
  },
};

/**
 * 多くの選択肢がある例
 */
export const ManyOptions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const options = Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `オプション ${i + 1}`,
    }));

    return (
      <FullWidthSelect
        label="たくさんの選択肢"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          console.log('changed', e.target.value);
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </FullWidthSelect>
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
      <FullWidthSelect
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          console.log('changed', e.target.value);
        }}
      >
        <MenuItem value="test1">テスト1</MenuItem>
        <MenuItem value="test2">テスト2</MenuItem>
      </FullWidthSelect>
    );
  },
  args: {
    label: 'テスト用セレクト',
    'data-testid': 'test-select',
  },
};
