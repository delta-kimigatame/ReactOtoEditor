import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Oto } from 'utauoto';
import { EditorTable } from '../../../src/features/Editor/EditorTable';
import { useOtoProjectStore } from '../../../src/store/otoProjectStore';

describe('EditorTable', () => {
  let oto: Oto;
  let targetDir: string;
  let mockSetRecord: ReturnType<typeof vi.fn>;
  let mockSetFileIndex: ReturnType<typeof vi.fn>;
  let mockSetAliasIndex: ReturnType<typeof vi.fn>;
  let mockSetMaxAliasIndex: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    oto = new Oto();
    targetDir = 'A3';
    mockSetRecord = vi.fn();
    mockSetFileIndex = vi.fn();
    mockSetAliasIndex = vi.fn();
    mockSetMaxAliasIndex = vi.fn();

    // 複数ファイル、複数エイリアスのデータを準備
    oto.SetParams(targetDir, 'test1.wav', 'あ', 100, 200, 300, 400, 500);
    oto.SetParams(targetDir, 'test1.wav', 'い', 110, 210, 310, 410, 510);
    oto.SetParams(targetDir, 'test2.wav', 'う', 120, 220, 320, 420, 520);
  });

  describe('表示モード - showAllRecords=false（EditorView用）', () => {
    it('現在のrecordのみ表示される', () => {
      const currentRecord = oto.GetRecord(targetDir, 'test1.wav', 'あ');
      useOtoProjectStore.setState({
        oto,
        targetDir,
        record: currentRecord,
        setRecord: mockSetRecord,
      });

      render(
        <EditorTable
          windowWidth={1920}
          windowHeight={1080}
          updateSignal={0}
          showAllRecords={false}
        />
      );

      // 現在のrecordのデータが表示される
      expect(screen.getByText('test1.wav')).toBeInTheDocument();
      expect(screen.getByText('あ')).toBeInTheDocument();
      expect(screen.getByText('100.000')).toBeInTheDocument();
      expect(screen.getByText('200.000')).toBeInTheDocument();

      // 他のrecordは表示されない
      expect(screen.queryByText('い')).not.toBeInTheDocument();
    });

    it('recordがnullの場合、データ行は表示されない', () => {
      useOtoProjectStore.setState({
        oto,
        targetDir,
        record: null,
        setRecord: mockSetRecord,
      });

      render(
        <EditorTable
          windowWidth={1920}
          windowHeight={1080}
          updateSignal={0}
          showAllRecords={false}
        />
      );

      const tbody = screen.getByRole('table').querySelector('tbody');
      expect(tbody?.children).toHaveLength(0);
    });
  });

  describe('表示モード - showAllRecords=true（TableDialog用）', () => {
    beforeEach(() => {
      const currentRecord = oto.GetRecord(targetDir, 'test1.wav', 'あ');
      useOtoProjectStore.setState({
        oto,
        targetDir,
        record: currentRecord,
        setRecord: mockSetRecord,
      });
    });

    it('全レコードが表示される', () => {
      render(
        <EditorTable
          windowWidth={1920}
          windowHeight={1080}
          updateSignal={0}
          showAllRecords={true}
          fileIndex={0}
          aliasIndex={0}
          setFileIndex={mockSetFileIndex}
          setAliasIndex={mockSetAliasIndex}
          setMaxAliasIndex={mockSetMaxAliasIndex}
        />
      );

      // 全ファイル・全エイリアスが表示される
      expect(screen.getByText('あ')).toBeInTheDocument();
      expect(screen.getByText('い')).toBeInTheDocument();
      expect(screen.getByText('う')).toBeInTheDocument();
    });

    it('行クリックでsetRecordが呼ばれる', async () => {
      const user = userEvent.setup();

      render(
        <EditorTable
          windowWidth={1920}
          windowHeight={1080}
          updateSignal={0}
          showAllRecords={true}
          fileIndex={0}
          aliasIndex={0}
          setFileIndex={mockSetFileIndex}
          setAliasIndex={mockSetAliasIndex}
          setMaxAliasIndex={mockSetMaxAliasIndex}
        />
      );

      const rows = screen.getAllByRole('row');
      await user.click(rows[2]); // い

      expect(mockSetRecord).toHaveBeenCalledTimes(1);
      const recordArg = mockSetRecord.mock.calls[0][0];
      expect(recordArg.alias).toBe('い');
    });
  });
});