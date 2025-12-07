import type { Meta, StoryObj } from '@storybook/react';
import { CommonCheckBox } from '../../../src/components/Common/CommonCheckBox';
import { useState } from 'react';
import { Box } from '@mui/material';

/**
 * CommonCheckBoxは、Material-UIのCheckboxをラップした共通チェックボックスコンポーネントです。
 * ラベルとチェック状態を簡単に管理できます。
 */
const meta = {
  title: 'Components/Common/CommonCheckBox',
  component: CommonCheckBox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'FormControlLabelとCheckboxを組み合わせた、状態管理が簡単な共通チェックボックスコンポーネントです。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'チェックボックスのチェック状態',
    },
    label: {
      control: 'text',
      description: 'チェックボックスのラベル',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態にするかどうか',
    },
    setChecked: {
      control: false,
      description: 'チェック状態を更新する関数',
    },
    'data-testid': {
      control: 'text',
      description: 'テスト用のdata-testid属性',
    },
  },
} satisfies Meta<typeof CommonCheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基本的な使用例
 */
export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <CommonCheckBox {...args} checked={checked} setChecked={setChecked} />;
  },
  args: {
    label: 'チェックボックス',
  },
};

/**
 * チェック済み状態
 */
export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <CommonCheckBox {...args} checked={checked} setChecked={setChecked} />;
  },
  args: {
    label: 'チェック済み',
  },
};

/**
 * 無効状態（チェックなし）
 */
export const DisabledUnchecked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <CommonCheckBox {...args} checked={checked} setChecked={setChecked} />;
  },
  args: {
    label: '無効（チェックなし）',
    disabled: true,
  },
};

/**
 * 無効状態（チェック済み）
 */
export const DisabledChecked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <CommonCheckBox {...args} checked={checked} setChecked={setChecked} />;
  },
  args: {
    label: '無効（チェック済み）',
    disabled: true,
  },
};

/**
 * 実際のユースケース例：設定画面
 */
export const SettingsExample: Story = {
  render: () => {
    const [autoSave, setAutoSave] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    const [playSound, setPlaySound] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
        <CommonCheckBox
          checked={autoSave}
          setChecked={setAutoSave}
          label="自動保存を有効にする"
        />
        <CommonCheckBox
          checked={showGrid}
          setChecked={setShowGrid}
          label="グリッド線を表示"
        />
        <CommonCheckBox
          checked={playSound}
          setChecked={setPlaySound}
          label="音声再生を有効にする"
        />
        <CommonCheckBox
          checked={darkMode}
          setChecked={setDarkMode}
          label="ダークモード"
        />
      </Box>
    );
  },
};

/**
 * エディター設定の例
 */
export const EditorSettingsExample: Story = {
  render: () => {
    const [showWaveform, setShowWaveform] = useState(true);
    const [showSpectrogram, setShowSpectrogram] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
        <CommonCheckBox
          checked={showWaveform}
          setChecked={setShowWaveform}
          label="波形を表示"
        />
        <CommonCheckBox
          checked={showSpectrogram}
          setChecked={setShowSpectrogram}
          label="スペクトログラムを表示"
        />
        <CommonCheckBox
          checked={snapToGrid}
          setChecked={setSnapToGrid}
          label="グリッドにスナップ"
        />
        <CommonCheckBox
          checked={showCursor}
          setChecked={setShowCursor}
          label="カーソル位置を表示"
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
    const [checked, setChecked] = useState(false);
    return <CommonCheckBox {...args} checked={checked} setChecked={setChecked} />;
  },
  args: {
    label: 'テスト用チェックボックス',
    'data-testid': 'test-checkbox',
  },
};
