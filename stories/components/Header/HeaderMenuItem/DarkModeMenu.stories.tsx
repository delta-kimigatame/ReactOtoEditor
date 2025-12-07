import type { Meta, StoryObj } from '@storybook/react';
import { DarkModeMenu } from '../../../../src/components/Header/HeaderMenuItem/DarkModeMenu';
import { useState, useEffect } from 'react';
import { Menu, Button, List } from '@mui/material';
import { useCookieStore } from '../../../../src/store/cookieStore';

/**
 * DarkModeMenuは、ライトモード・ダークモードを切り替えるメニューアイテムです。
 * クリックでテーマモードをトグルし、アイコンとテキストが動的に変わります。
 */
const meta = {
  title: 'Components/Header/HeaderMenuItem/DarkModeMenu',
  component: DarkModeMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'ライトモード・ダークモードを切り替えるメニューアイテム。現在のモードに応じてアイコン（太陽/月）とテキストが変わります。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    setMenuAnchor: {
      control: false,
      description: '親メニューを閉じる関数',
    },
  },
} satisfies Meta<typeof DarkModeMenu>;

export default meta;
type Story = StoryObj<typeof DarkModeMenu>;

/**
 * ライトモードから切り替え（ダークモードへ）
 */
export const FromLightMode: Story = {
  render: () => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const { mode, setMode } = useCookieStore();

    useEffect(() => {
      setMode('light');
      return () => setMode('light');
    }, [setMode]);

    return (
      <List sx={{ width: 250, bgcolor: 'background.paper', border: '1px solid #ddd' }}>
        <DarkModeMenu setMenuAnchor={setMenuAnchor} />
      </List>
    );
  },
};

/**
 * ダークモードから切り替え（ライトモードへ）
 */
export const FromDarkMode: Story = {
  render: () => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const { mode, setMode } = useCookieStore();

    useEffect(() => {
      setMode('dark');
      return () => setMode('light');
    }, [setMode]);

    return (
      <List sx={{ width: 250, bgcolor: 'background.paper', border: '1px solid #555' }}>
        <DarkModeMenu setMenuAnchor={setMenuAnchor} />
      </List>
    );
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * メニュー内でのインタラクション例
 */
export const InteractiveMenu: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div>
        <Button
          variant="contained"
          onClick={handleClick}
        >
          設定メニューを開く
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <DarkModeMenu setMenuAnchor={setAnchorEl} />
        </Menu>
      </div>
    );
  },
};

/**
 * 複数のメニューアイテムと組み合わせた例
 */
export const WithOtherMenuItems: Story = {
  render: () => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const { mode } = useCookieStore();

    return (
      <div>
        <List sx={{ width: 250, bgcolor: 'background.paper', border: '1px solid #ddd' }}>
          <DarkModeMenu setMenuAnchor={setMenuAnchor} />
          {/* 他のメニューアイテムと並んで表示されることを想定 */}
        </List>
        <div style={{ marginTop: '16px', fontSize: '14px' }}>
          現在のモード: {mode}
        </div>
      </div>
    );
  },
};
