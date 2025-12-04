import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { Oto } from "utauoto";
import { TargetDirDialogCheckList } from "../../../src/components/TargetDirDialog/TargetDirDialogCheckList";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

const meta = {
  title: "Components/TargetDirDialog/TargetDirDialogCheckList",
  component: TargetDirDialogCheckList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TargetDirDialogCheckList>;

export default meta;
type Story = StoryObj<typeof TargetDirDialogCheckList>;

/**
 * デフォルト表示（サンプルデータ）
 */
export const Default: Story = {
  render: () => {
    const { setTargetDir } = useOtoProjectStore();
    const oto = new Oto();
    
    useEffect(() => {
      setTargetDir("");
      return () => {
        setTargetDir("");
      };
    }, [setTargetDir]);

    oto.ParseOto(
      "",
      `sample1.wav=,100,200,300,400,500
sample2.wav=,150,250,350,450,550
sample3.wav=,200,300,400,500,600`
    );

    return <TargetDirDialogCheckList oto={oto} />;
  },
};
