import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { TopPaper } from "../../../src/features/Top/TopPaper";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

/**
 * `TopPaper` は、アプリケーションのトップ画面に表示されるメインコンポーネントです。
 * zipファイルの読み込みボタンとアプリケーション説明を表示します。
 */
const meta: Meta<typeof TopPaper> = {
  title: "Components/Top/TopPaper",
  component: TopPaper,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TopPaper>;

/**
 * デフォルトのTopPaper。zipファイル未読み込みの初期状態です。
 */
export const Default: Story = {
  render: () => {
    const { setReadZip } = useOtoProjectStore();

    useEffect(() => {
      setReadZip(null);

      return () => {
        setReadZip(null);
      };
    }, [setReadZip]);

    return <TopPaper />;
  },
};
