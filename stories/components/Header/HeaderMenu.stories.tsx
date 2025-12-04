import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HeaderMenu } from '../../../src/components/Header/HeaderMenu';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useOtoProjectStore } from '../../../src/store/otoProjectStore';
import { Oto } from 'utauoto';

/**
 * HeaderMenuは、アプリケーションのメインメニューです。
 * 言語切り替え、色設定、ダークモード、ディレクトリ選択、ダウンロード機能などを提供します。
 */
const meta = {
  title: 'Components/Header/HeaderMenu',
  component: HeaderMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'アプリケーションのメインメニュー。TargetDirMenu、DownloadOtoMenu、DownloadZipMenu、LanguageMenu、ColorMenu、DarkModeMenu、ClearCache、ShowLogMenuを含みます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    menuAnchor: {
      control: false,
      description: 'メニューの表示位置（nullの場合は非表示）',
    },
    setMenuAnchor: {
      control: false,
      description: 'メニュー表示制御の関数',
    },
  },
} satisfies Meta<typeof HeaderMenu>;

export default meta;
type Story = StoryObj<typeof HeaderMenu>;

/**
 * 基本的なメニュー表示（otoがnullの場合）
 * ダウンロード機能が表示されません
 */
export const WithoutOtoData: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { setOto } = useOtoProjectStore();

    useEffect(() => {
      setOto(null);
      return () => setOto(null);
    }, [setOto]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    return (
      <div>
        <Button
          variant="contained"
          startIcon={<MenuIcon />}
          onClick={handleClick}
        >
          メニューを開く
        </Button>
        <HeaderMenu
          menuAnchor={anchorEl}
          setMenuAnchor={setAnchorEl}
        />
      </div>
    );
  },
};

/**
 * otoデータがある場合のメニュー
 * DownloadOtoMenu、DownloadZipMenuが表示されます
 */
export const WithOtoData: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { setOto, setTargetDir } = useOtoProjectStore();

    useEffect(() => {
      // サンプルotoデータを設定
      const sampleOto = new Oto();
      sampleOto.ParseOto('/samples', 'あ.wav=- あ,100,50,80,120,200');
      setOto(sampleOto);
      setTargetDir('/samples');

      return () => {
        setOto(null);
        setTargetDir(null);
      };
    }, [setOto, setTargetDir]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    return (
      <div>
        <Button
          variant="contained"
          startIcon={<MenuIcon />}
          onClick={handleClick}
        >
          メニューを開く（otoあり）
        </Button>
        <HeaderMenu
          menuAnchor={anchorEl}
          setMenuAnchor={setAnchorEl}
        />
      </div>
    );
  },
};

/**
 * 初期状態で開いているメニュー
 */
export const OpenedMenu: Story = {
  render: () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
      // 初期表示時にメニューを開く
      if (buttonRef.current) {
        setAnchorEl(buttonRef.current);
      }
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    return (
      <div>
        <Button
          ref={buttonRef}
          variant="contained"
          startIcon={<MenuIcon />}
          onClick={handleClick}
        >
          メニュー
        </Button>
        <HeaderMenu
          menuAnchor={anchorEl}
          setMenuAnchor={setAnchorEl}
        />
      </div>
    );
  },
};

