import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MakePanelSelectPreset } from "../../../../src/features/TargetDirDialog/MakePanel/MakePanelSelectPreset";
import { MakeOtoTempIni } from "../../../../src/lib/MakeOtoTemp/Interface";

const meta = {
  title: "Components/TargetDirDialog/MakePanel/MakePanelSelectPreset",
  component: MakePanelSelectPreset,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MakePanelSelectPreset>;

export default meta;
type Story = StoryObj<typeof MakePanelSelectPreset>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => {
    const [ini, setIni] = useState<MakeOtoTempIni | null>(null);

    return (
      <div>
        <MakePanelSelectPreset setIni={setIni} />
        {ini && (
          <div style={{ marginTop: 20, padding: 10, background: "#f5f5f5" }}>
            <strong>選択されたプリセット:</strong>
            <pre>{JSON.stringify(ini, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  },
};
