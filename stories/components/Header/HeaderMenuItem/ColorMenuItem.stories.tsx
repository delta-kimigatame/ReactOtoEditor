import type { Meta, StoryObj } from '@storybook/react';
import { ColorMenuItem } from '../../../../src/components/Header/HeaderMenuItem/ColorMenuItem';
import { useState } from 'react';
import { List } from '@mui/material';

/**
 * ColorMenuItemは、スペクトログラムの配色を選択するメニューアイテムです。
 * ColorAvatarを含み、クリックで色を変更します。
 */
const meta = {
  title: 'Components/Header/HeaderMenuItem/ColorMenuItem',
  component: ColorMenuItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'スペクトログラムの配色を選択するためのメニューアイテム。ColorAvatarと色名を表示し、クリックで配色を変更します。',
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
    setColor: {
      control: false,
      description: '配色を更新する関数',
    },
    setMenuAnchor: {
      control: false,
      description: 'メニューを閉じる関数',
    },
    parentSetMenuAnchor: {
      control: false,
      description: '親メニューを閉じる関数',
    },
  },
} satisfies Meta<typeof ColorMenuItem>;

export default meta;
type Story = StoryObj<typeof ColorMenuItem>;

/**
 * 赤色メニューアイテム
 */
export const RedMenuItem: Story = {
  render: () => {
    const [selectedColor, setSelectedColor] = useState('red');
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [parentMenuAnchor, setParentMenuAnchor] = useState<HTMLElement | null>(null);

    return (
      <div>
        <List sx={{ width: 200, bgcolor: 'background.paper' }}>
          <ColorMenuItem
            mode="light"
            color="red"
            setColor={setSelectedColor}
            setMenuAnchor={setMenuAnchor}
            parentSetMenuAnchor={setParentMenuAnchor}
          />
        </List>
        <div style={{ marginTop: '16px', fontSize: '14px' }}>
          選択された色: {selectedColor}
        </div>
      </div>
    );
  },
};

/**
 * 青色メニューアイテム
 */
export const BlueMenuItem: Story = {
  render: () => {
    const [selectedColor, setSelectedColor] = useState('blue');
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [parentMenuAnchor, setParentMenuAnchor] = useState<HTMLElement | null>(null);

    return (
      <div>
        <List sx={{ width: 200, bgcolor: 'background.paper' }}>
          <ColorMenuItem
            mode="light"
            color="blue"
            setColor={setSelectedColor}
            setMenuAnchor={setMenuAnchor}
            parentSetMenuAnchor={setParentMenuAnchor}
          />
        </List>
        <div style={{ marginTop: '16px', fontSize: '14px' }}>
          選択された色: {selectedColor}
        </div>
      </div>
    );
  },
};

/**
 * 色選択メニューの完全な例
 */
export const ColorSelectionMenu: Story = {
  render: () => {
    const [selectedColor, setSelectedColor] = useState('blue');
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [parentMenuAnchor, setParentMenuAnchor] = useState<HTMLElement | null>(null);
    const colors = ['gray', 'red', 'blue', 'green', 'orange', 'aqua', 'magenta', 'rainbow'];

    return (
      <div>
        <List sx={{ width: 250, bgcolor: 'background.paper', border: '1px solid #ddd' }}>
          {colors.map((color) => (
            <ColorMenuItem
              key={color}
              mode="light"
              color={color}
              setColor={setSelectedColor}
              setMenuAnchor={setMenuAnchor}
              parentSetMenuAnchor={setParentMenuAnchor}
            />
          ))}
        </List>
        <div style={{ marginTop: '16px', fontSize: '14px', fontWeight: 'bold' }}>
          現在選択中: {selectedColor}
        </div>
      </div>
    );
  },
};

/**
 * ダークモードでの色選択メニュー
 */
export const ColorSelectionMenuDark: Story = {
  render: () => {
    const [selectedColor, setSelectedColor] = useState('red');
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [parentMenuAnchor, setParentMenuAnchor] = useState<HTMLElement | null>(null);
    const colors = ['gray', 'red', 'blue', 'green', 'orange', 'aqua', 'magenta', 'rainbow'];

    return (
      <div>
        <List sx={{ width: 250, bgcolor: 'background.paper', border: '1px solid #555' }}>
          {colors.map((color) => (
            <ColorMenuItem
              key={color}
              mode="dark"
              color={color}
              setColor={setSelectedColor}
              setMenuAnchor={setMenuAnchor}
              parentSetMenuAnchor={setParentMenuAnchor}
            />
          ))}
        </List>
        <div style={{ marginTop: '16px', fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
          現在選択中: {selectedColor}
        </div>
      </div>
    );
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};
