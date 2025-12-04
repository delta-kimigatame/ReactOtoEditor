import type { Meta, StoryObj } from '@storybook/react';
import { TargetParamSelect } from '../../../src/components/TableDialog/TargetParamSelect';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';

/**
 * TargetParamSelectは、原音設定の対象パラメータを選択するセレクトボックスです。
 * TableDialog内で使用され、どのパラメータに対して一括処理を行うかを選択します。
 */
const meta = {
  title: 'Components/TableDialog/TargetParamSelect',
  component: TargetParamSelect,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '原音設定の対象パラメータ（オフセット、オーバーラップ、先行発声、子音速度、ブランク）を選択するセレクトボックス。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'セレクトボックスのラベル',
    },
    value: {
      control: 'select',
      options: ['offset', 'overlap', 'preutter', 'velocity', 'blank'],
      description: '選択されているパラメータ',
    },
    onChange: {
      control: false,
      description: '選択変更時のコールバック関数',
    },
  },
} satisfies Meta<typeof TargetParamSelect>;

export default meta;
type Story = StoryObj<typeof TargetParamSelect>;

/**
 * オフセットが選択されている状態
 */
export const OffsetSelected: Story = {
  render: () => {
    const [value, setValue] = useState('offset');

    const handleChange = (e: SelectChangeEvent) => {
      setValue(e.target.value);
      console.log('Selected parameter:', e.target.value);
    };

    return (
      <div style={{ width: 300 }}>
        <TargetParamSelect
          label="対象パラメータ"
          value={value}
          onChange={handleChange}
        />
        <div style={{ marginTop: '16px', fontSize: '14px' }}>
          選択中: {value}
        </div>
      </div>
    );
  },
};

/**
 * オーバーラップが選択されている状態
 */
export const OverlapSelected: Story = {
  render: () => {
    const [value, setValue] = useState('overlap');

    const handleChange = (e: SelectChangeEvent) => {
      setValue(e.target.value);
    };

    return (
      <div style={{ width: 300 }}>
        <TargetParamSelect
          label="パラメータ選択"
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  },
};

/**
 * 先行発声が選択されている状態
 */
export const PreutterSelected: Story = {
  render: () => {
    const [value, setValue] = useState('preutter');

    const handleChange = (e: SelectChangeEvent) => {
      setValue(e.target.value);
    };

    return (
      <div style={{ width: 300 }}>
        <TargetParamSelect
          label="編集対象"
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  },
};

/**
 * 子音速度が選択されている状態
 */
export const VelocitySelected: Story = {
  render: () => {
    const [value, setValue] = useState('velocity');

    const handleChange = (e: SelectChangeEvent) => {
      setValue(e.target.value);
    };

    return (
      <div style={{ width: 300 }}>
        <TargetParamSelect
          label="対象パラメータ"
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  },
};

/**
 * ブランクが選択されている状態
 */
export const BlankSelected: Story = {
  render: () => {
    const [value, setValue] = useState('blank');

    const handleChange = (e: SelectChangeEvent) => {
      setValue(e.target.value);
    };

    return (
      <div style={{ width: 300 }}>
        <TargetParamSelect
          label="対象パラメータ"
          value={value}
          onChange={handleChange}
        />
      </div>
    );
  },
};

/**
 * インタラクティブな例（全パラメータ切り替え）
 */
export const AllParameters: Story = {
  render: () => {
    const [value, setValue] = useState('offset');

    const handleChange = (e: SelectChangeEvent) => {
      setValue(e.target.value);
    };

    const paramDescriptions: { [key: string]: string } = {
      offset: 'サンプルパラメータ A',
      overlap: 'サンプルパラメータ B',
      preutter: 'サンプルパラメータ C',
      velocity: 'サンプルパラメータ D',
      blank: 'サンプルパラメータ E',
    };

    return (
      <div style={{ width: 350 }}>
        <TargetParamSelect
          label="原音設定パラメータ"
          value={value}
          onChange={handleChange}
        />
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          fontSize: '14px',
        }}>
          <strong>{value}</strong>
          <div style={{ marginTop: '4px', color: '#666' }}>
            {paramDescriptions[value]}
          </div>
        </div>
      </div>
    );
  },
};
