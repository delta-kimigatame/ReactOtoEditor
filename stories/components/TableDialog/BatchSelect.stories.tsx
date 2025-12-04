import type { Meta, StoryObj } from '@storybook/react';
import { BatchSelect } from '../../../src/components/TableDialog/BatchSelect';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

/**
 * BatchSelectは、一括処理のバッチを選択するセレクトボックスです。
 * TableDialog内で使用され、どのバッチ処理を適用するかを選択します。
 */
const meta = {
  title: 'Components/TableDialog/BatchSelect',
  component: BatchSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '一括処理のバッチを選択するセレクトボックス。各バッチの説明文を表示し、選択されたバッチのインデックスを返します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'セレクトボックスのラベル',
    },
    batchIndex: {
      control: 'number',
      description: '現在選択されているバッチのインデックス',
    },
    batchList: {
      control: 'object',
      description: 'バッチのリスト（各バッチは description を持つ）',
    },
    onChange: {
      control: false,
      description: '選択変更時のコールバック関数',
    },
  },
} satisfies Meta<typeof BatchSelect>;

export default meta;
type Story = StoryObj<typeof BatchSelect>;

/**
 * 基本的な使用例
 */
export const Default: Story = {
  render: () => {
    const [batchIndex, setBatchIndex] = useState(0);
    const batchList = [
      { description: 'オフセットを100に設定' },
      { description: 'オーバーラップを50に設定' },
      { description: '先行発声を80に設定' },
    ];

    const handleChange = (e: SelectChangeEvent) => {
      setBatchIndex(Number(e.target.value));
      console.log('Selected batch:', e.target.value);
    };

    return (
      <div style={{ width: 300 }}>
        <BatchSelect
          label="バッチ処理"
          batchIndex={batchIndex}
          batchList={batchList}
          onChange={handleChange}
        />
        <div style={{ marginTop: '16px', fontSize: '14px' }}>
          選択中: {batchList[batchIndex].description}
        </div>
      </div>
    );
  },
};

/**
 * 多数のバッチがある場合
 */
export const ManyBatches: Story = {
  render: () => {
    const [batchIndex, setBatchIndex] = useState(0);
    const batchList = [
      { description: 'オフセットを100に設定' },
      { description: 'オーバーラップを50に設定' },
      { description: '先行発声を80に設定' },
      { description: '子音速度を120に設定' },
      { description: 'ブランクを200に設定' },
      { description: '全パラメータをリセット' },
      { description: 'オフセットを2倍にする' },
      { description: 'オーバーラップを半分にする' },
      { description: '先行発声を+10する' },
      { description: '子音速度を-20する' },
    ];

    const handleChange = (e: SelectChangeEvent) => {
      setBatchIndex(Number(e.target.value));
    };

    return (
      <div style={{ width: 350 }}>
        <BatchSelect
          label="バッチ処理を選択"
          batchIndex={batchIndex}
          batchList={batchList}
          onChange={handleChange}
        />
        <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
          現在: {batchList[batchIndex].description}
        </div>
      </div>
    );
  },
};

/**
 * 2番目のバッチが選択されている例
 */
export const SecondBatchSelected: Story = {
  render: () => {
    const [batchIndex, setBatchIndex] = useState(1);
    const batchList = [
      { description: '標準設定を適用' },
      { description: 'CVVC用設定を適用' },
      { description: '連続音用設定を適用' },
    ];

    const handleChange = (e: SelectChangeEvent) => {
      setBatchIndex(Number(e.target.value));
    };

    return (
      <div style={{ width: 300 }}>
        <BatchSelect
          label="設定テンプレート"
          batchIndex={batchIndex}
          batchList={batchList}
          onChange={handleChange}
        />
      </div>
    );
  },
};

/**
 * 日本語の長い説明文
 */
export const LongDescriptions: Story = {
  render: () => {
    const [batchIndex, setBatchIndex] = useState(0);
    const batchList = [
      { description: 'オフセットを100に設定し、オーバーラップを50、先行発声を80に自動調整します' },
      { description: '全てのパラメータを初期値にリセットして、デフォルト設定に戻します' },
      { description: 'CVVC音源用の最適化された設定を適用します（推奨設定）' },
    ];

    const handleChange = (e: SelectChangeEvent) => {
      setBatchIndex(Number(e.target.value));
    };

    return (
      <div style={{ width: 400 }}>
        <BatchSelect
          label="一括処理"
          batchIndex={batchIndex}
          batchList={batchList}
          onChange={handleChange}
        />
      </div>
    );
  },
};
