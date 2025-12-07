import type { Meta, StoryObj } from '@storybook/react';
import { EditorButton } from '../../../../src/components/Editor/EditButton/EditorButton';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

/**
 * EditorButtonは、音声編集画面で使用されるアイコンボタンの共通コンポーネントです。
 * ツールチップ、無効化、テーマモード対応が含まれています。
 */
const meta = {
  title: 'Components/Editor/EditButton/EditorButton',
  component: EditorButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '音声編集画面で使用されるアイコンボタン。MUIのIconButtonとAvatarをラップし、テーマモード対応とツールチップを提供します。実際にはPlayButton、PrevAliasButton、NextAliasButtonなどで使用されています。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'range', min: 24, max: 80, step: 8 },
      description: 'ボタンのサイズ（幅・高さ）',
    },
    icon: {
      control: false,
      description: 'MUI Iconコンポーネント',
    },
    title: {
      control: 'text',
      description: 'ツールチップに表示するタイトル',
    },
    background: {
      control: 'color',
      description: '背景色（カスタム指定時）',
    },
    disabled: {
      control: 'boolean',
      description: 'ボタンの無効化状態',
    },
    onClick: {
      control: false,
      description: 'クリック時のコールバック関数',
    },
  },
} satisfies Meta<typeof EditorButton>;

export default meta;
type Story = StoryObj<typeof EditorButton>;

/**
 * 再生ボタン（PlayButton）
 * メトロノームの4拍目に先行発声が合うように再生します
 */
export const PlayButton: Story = {
  args: {
    size: 40,
    icon: <MusicNoteIcon />,
    title: '再生',
    onClick: () => console.log('Play clicked'),
  },
};

/**
 * 前のエイリアスへ移動ボタン（PrevAliasButton）
 */
export const PreviousAliasButton: Story = {
  args: {
    size: 40,
    icon: <ArrowDropUpIcon />,
    title: '前のエイリアス',
    onClick: () => console.log('Previous alias clicked'),
  },
};

/**
 * 次のエイリアスへ移動ボタン（NextAliasButton）
 */
export const NextAliasButton: Story = {
  args: {
    size: 40,
    icon: <ArrowDropDownIcon />,
    title: '次のエイリアス',
    onClick: () => console.log('Next alias clicked'),
  },
};

/**
 * 無効化されたボタン
 * メトロノームがnullの場合や、最初/最後のエイリアスで移動できない場合に使用
 */
export const DisabledButton: Story = {
  args: {
    size: 40,
    icon: <MusicNoteIcon />,
    title: '再生（無効）',
    disabled: true,
    onClick: () => console.log('Should not fire'),
  },
};

/**
 * アイコンの変更例
 * iconプロパティに別のMUIアイコンを渡すことで、異なる見た目のボタンを作成できます
 */
export const WithDifferentIcon: Story = {
  args: {
    size: 40,
    icon: <ArrowDropDownIcon />,
    title: '別のアイコンの例',
    onClick: () => console.log('Different icon clicked'),
  },
};

/**
 * 編集画面のボタン配置例
 * 実際の編集画面では、前へ・再生・次へのボタンが横並びで配置されます
 */
export const EditorButtonLayout: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      padding: '16px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      alignItems: 'center',
    }}>
      <EditorButton
        size={40}
        icon={<ArrowDropUpIcon />}
        title="前のエイリアス"
        onClick={() => console.log('Previous alias')}
      />
      <EditorButton
        size={48}
        icon={<MusicNoteIcon />}
        title="再生"
        onClick={() => console.log('Play')}
      />
      <EditorButton
        size={40}
        icon={<ArrowDropDownIcon />}
        title="次のエイリアス"
        onClick={() => console.log('Next alias')}
      />
    </div>
  ),
};
