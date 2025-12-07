import type { Meta, StoryObj } from '@storybook/react';
import { ColorAvatar } from '../../../../src/components/Header/HeaderMenuItem/ColorAvatar';

/**
 * ColorAvatarは、色設定メニューで各色のサンプルとして表示されるアイコンです。
 * スペクトログラムの配色をプレビューするために使用されます。
 */
const meta = {
  title: 'Components/Header/HeaderMenuItem/ColorAvatar',
  component: ColorAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'スペクトログラムの配色設定メニューで、各色のプレビューとして表示される小さなアイコン。ライトモード・ダークモードに対応したグラデーションが適用されます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'テーマモード',
    },
    color: {
      control: 'select',
      options: ['gray', 'red', 'blue', 'green', 'orange', 'aqua', 'magenta', 'rainbow'],
      description: 'スペクトログラムの配色',
    },
  },
} satisfies Meta<typeof ColorAvatar>;

export default meta;
type Story = StoryObj<typeof ColorAvatar>;

/**
 * ライトモード - グレー
 */
export const LightGray: Story = {
  args: {
    mode: 'light',
    color: 'gray',
  },
};

/**
 * ライトモード - 赤
 */
export const LightRed: Story = {
  args: {
    mode: 'light',
    color: 'red',
  },
};

/**
 * ライトモード - 青
 */
export const LightBlue: Story = {
  args: {
    mode: 'light',
    color: 'blue',
  },
};

/**
 * ライトモード - 緑
 */
export const LightGreen: Story = {
  args: {
    mode: 'light',
    color: 'green',
  },
};

/**
 * ライトモード - オレンジ
 */
export const LightOrange: Story = {
  args: {
    mode: 'light',
    color: 'orange',
  },
};

/**
 * ライトモード - アクア
 */
export const LightAqua: Story = {
  args: {
    mode: 'light',
    color: 'aqua',
  },
};

/**
 * ライトモード - マゼンタ
 */
export const LightMagenta: Story = {
  args: {
    mode: 'light',
    color: 'magenta',
  },
};

/**
 * ライトモード - レインボー
 */
export const LightRainbow: Story = {
  args: {
    mode: 'light',
    color: 'rainbow',
  },
};

/**
 * ダークモード - グレー
 */
export const DarkGray: Story = {
  args: {
    mode: 'dark',
    color: 'gray',
  },
};

/**
 * ダークモード - 赤
 */
export const DarkRed: Story = {
  args: {
    mode: 'dark',
    color: 'red',
  },
};

/**
 * ダークモード - 青
 */
export const DarkBlue: Story = {
  args: {
    mode: 'dark',
    color: 'blue',
  },
};

/**
 * ダークモード - レインボー
 */
export const DarkRainbow: Story = {
  args: {
    mode: 'dark',
    color: 'rainbow',
  },
};

/**
 * 全色パレット表示（ライトモード）
 */
export const AllColorsLight: Story = {
  render: () => {
    const colors = ['gray', 'red', 'blue', 'green', 'orange', 'aqua', 'magenta', 'rainbow'];
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {colors.map((color) => (
          <div key={color} style={{ textAlign: 'center' }}>
            <ColorAvatar mode="light" color={color} />
            <div style={{ fontSize: '10px', marginTop: '4px' }}>{color}</div>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * 全色パレット表示（ダークモード）
 */
export const AllColorsDark: Story = {
  render: () => {
    const colors = ['gray', 'red', 'blue', 'green', 'orange', 'aqua', 'magenta', 'rainbow'];
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {colors.map((color) => (
          <div key={color} style={{ textAlign: 'center' }}>
            <ColorAvatar mode="dark" color={color} />
            <div style={{ fontSize: '10px', marginTop: '4px', color: '#fff' }}>{color}</div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
