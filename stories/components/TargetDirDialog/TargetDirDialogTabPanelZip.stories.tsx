import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Oto } from "utauoto";
import TabContext from "@mui/lab/TabContext";
import { TargetDirDialogTabPanelZip } from "../../../src/components/TargetDirDialog/TargetDirDialogTabPanelZip";

const meta = {
  title: "Components/TargetDirDialog/TargetDirDialogTabPanelZip",
  component: TargetDirDialogTabPanelZip,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TargetDirDialogTabPanelZip>;

export default meta;
type Story = StoryObj<typeof TargetDirDialogTabPanelZip>;

/**
 * 読み込み中の状態
 */
export const Loading: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [otoTemp, setOtoTemp] = useState<Oto | null>(null);
    const LoadOto = (encoding: string) => {
      console.log("LoadOto called with encoding:", encoding);
    };

    const dummyOto = new Oto();

    return (
      <TabContext value="1">
        <TargetDirDialogTabPanelZip
          setDialogOpen={setOpen}
          setOtoTemp={setOtoTemp}
          LoadOto={LoadOto}
          nothingOto={false}
          oto={dummyOto}
        />
      </TabContext>
    );
  },
};

/**
 * oto.iniが存在しない状態
 */
export const NothingOto: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [otoTemp, setOtoTemp] = useState<Oto | null>(null);
    const LoadOto = (encoding: string) => {
      console.log("LoadOto called with encoding:", encoding);
    };

    const dummyOto = new Oto();

    return (
      <TabContext value="1">
        <TargetDirDialogTabPanelZip
          setDialogOpen={setOpen}
          setOtoTemp={setOtoTemp}
          LoadOto={LoadOto}
          nothingOto={true}
          oto={dummyOto}
        />
      </TabContext>
    );
  },
};

/**
 * oto.iniが読み込まれた状態
 */
export const WithOtoData: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [otoTemp, setOtoTemp] = useState<Oto | null>(null);
    const LoadOto = (encoding: string) => {
      console.log("LoadOto called with encoding:", encoding);
    };

    const oto = new Oto();
    oto.ParseOto(
      "",
      `sample1.wav=,100,200,300,400,500
sample2.wav=,150,250,350,450,550`
    );

    return (
      <TabContext value="1">
        <TargetDirDialogTabPanelZip
          setDialogOpen={setOpen}
          setOtoTemp={setOtoTemp}
          LoadOto={LoadOto}
          nothingOto={false}
          oto={oto}
        />
      </TabContext>
    );
  },
};
