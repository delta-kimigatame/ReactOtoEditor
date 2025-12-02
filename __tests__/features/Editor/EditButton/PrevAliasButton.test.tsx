import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Oto } from 'utauoto';
import OtoRecord from 'utauoto/dist/OtoRecord';
import { PrevAliasButton, OnPrevAlias } from '../../../../src/features/Editor/EditButtn/PrevAliasButtn';
import { useOtoProjectStore } from '../../../../src/store/otoProjectStore';

describe('OnPrevAlias', () => {
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
    oto.SetParams(targetDir, 'test1.wav', 'う', 120, 220, 320, 420, 520);
    oto.SetParams(targetDir, 'test2.wav', 'え', 1000, 2000, 3000, 4000, 5000);
    oto.SetParams(targetDir, 'test2.wav', 'お', 10000, 20000, 30000, 40000, 50000);
  });

  describe('同じファイル内で前のエイリアスに移動', () => {
    it('現在のエイリアスが最初でない場合、同じファイル内の前のエイリアスに移動する', () => {
      const currentRecord = oto.GetRecord(targetDir, 'test1.wav', 'い');

      OnPrevAlias(
        oto,
        targetDir,
        currentRecord,
        1, // maxFileIndex (test1.wav, test2.wavの2ファイル、インデックスは0,1)
        0, // fileIndex (test1.wav)
        2, // maxAliasIndex (test1.wavには「あ」「い」「う」の3エイリアス、インデックスは0,1,2)
        1, // aliasIndex (「い」、最初ではない)
        mockSetRecord,
        mockSetFileIndex,
        mockSetAliasIndex,
        mockSetMaxAliasIndex
      );

      // 同じファイル内の前のエイリアス「あ」に移動することを確認
      expect(mockSetRecord).toHaveBeenCalledTimes(1);
      const recordArg = mockSetRecord.mock.calls[0][0] as OtoRecord;
      expect(recordArg.filename).toBe('test1.wav');
      expect(recordArg.alias).toBe('あ');
      expect(mockSetAliasIndex).toHaveBeenCalledWith(0);
      expect(mockSetFileIndex).not.toHaveBeenCalled();
      expect(mockSetMaxAliasIndex).not.toHaveBeenCalled();
    });
  });

  describe('前のファイルの最後のエイリアスに移動', () => {
    it('現在のエイリアスが最初で、前のファイルが存在する場合、前のファイルの最後のエイリアスに移動する', () => {
      const currentRecord = oto.GetRecord(targetDir, 'test2.wav', 'え');

      OnPrevAlias(
        oto,
        targetDir,
        currentRecord,
        1, // maxFileIndex (test1.wav, test2.wavの2ファイル、インデックスは0,1)
        1, // fileIndex (test2.wav、最初ではない)
        1, // maxAliasIndex (test2.wavには「え」「お」の2エイリアス、インデックスは0,1)
        0, // aliasIndex (「え」、test2.wavの最初のエイリアス)
        mockSetRecord,
        mockSetFileIndex,
        mockSetAliasIndex,
        mockSetMaxAliasIndex
      );

      // 前のファイルtest1.wavの最後のエイリアス「う」に移動することを確認
      expect(mockSetRecord).toHaveBeenCalledTimes(1);
      const recordArg = mockSetRecord.mock.calls[0][0] as OtoRecord;
      expect(recordArg.filename).toBe('test1.wav');
      expect(recordArg.alias).toBe('う');
      expect(mockSetFileIndex).toHaveBeenCalledWith(0);
      expect(mockSetAliasIndex).toHaveBeenCalledWith(2); // test1.wavの最後のエイリアス「う」のインデックスは2
      expect(mockSetMaxAliasIndex).toHaveBeenCalledWith(2); // test1.wavには「あ」「い」「う」の3エイリアス、maxは2
    });

    it('現在のエイリアスが最初で、現在のファイルも最初の場合、何も変更しない', () => {
      const currentRecord = oto.GetRecord(targetDir, 'test1.wav', 'あ');

      OnPrevAlias(
        oto,
        targetDir,
        currentRecord,
        1, // maxFileIndex (test1.wav, test2.wavの2ファイル、インデックスは0,1)
        0, // fileIndex (test1.wav、最初のファイル)
        2, // maxAliasIndex (test1.wavには「あ」「い」「う」の3エイリアス、インデックスは0,1,2)
        0, // aliasIndex (「あ」、test1.wavの最初のエイリアス)
        mockSetRecord,
        mockSetFileIndex,
        mockSetAliasIndex,
        mockSetMaxAliasIndex
      );

      // 何も変更されないことを確認
      expect(mockSetRecord).not.toHaveBeenCalled();
      expect(mockSetFileIndex).not.toHaveBeenCalled();
      expect(mockSetAliasIndex).not.toHaveBeenCalled();
      expect(mockSetMaxAliasIndex).not.toHaveBeenCalled();
    });
  });
});

describe('PrevAliasButton', () => {
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
    oto.SetParams(targetDir, 'test1.wav', 'う', 120, 220, 320, 420, 520);
    oto.SetParams(targetDir, 'test2.wav', 'え', 1000, 2000, 3000, 4000, 5000);
    oto.SetParams(targetDir, 'test2.wav', 'お', 10000, 20000, 30000, 40000, 50000);

    // useOtoProjectStoreの初期化
    const currentRecord = oto.GetRecord(targetDir, 'test1.wav', 'い');
    useOtoProjectStore.setState({
      oto: oto,
      targetDir: targetDir,
      record: currentRecord,
      setRecord: mockSetRecord,
    });
  });

  it('ボタンクリックによりOnPrevAlias関数が呼び出され、同じファイル内の前のエイリアスに移動する', async () => {
    const user = userEvent.setup();

    render(
      <PrevAliasButton
        size={40}
        iconSize={24}
        fileIndex={0}
        aliasIndex={1}
        maxFileIndex={1}
        maxAliasIndex={2}
        setFileIndex={mockSetFileIndex}
        setAliasIndex={mockSetAliasIndex}
        setMaxAliasIndex={mockSetMaxAliasIndex}
        progress={false}
      />
    );

    const button = screen.getByRole('button', { name: /editor.prev/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();

    await user.click(button);

    // OnPrevAlias関数が実行され、同じファイル内の前のエイリアス「あ」に移動することを確認
    expect(mockSetRecord).toHaveBeenCalledTimes(1);
    const recordArg = mockSetRecord.mock.calls[0][0] as OtoRecord;
    expect(recordArg.filename).toBe('test1.wav');
    expect(recordArg.alias).toBe('あ');
    expect(mockSetAliasIndex).toHaveBeenCalledWith(0);
    expect(mockSetFileIndex).not.toHaveBeenCalled();
    expect(mockSetMaxAliasIndex).not.toHaveBeenCalled();
  });

  it('最初のファイルの最初のエイリアスの場合、ボタンがdisabledになる', () => {
    render(
      <PrevAliasButton
        size={40}
        iconSize={24}
        fileIndex={0}
        aliasIndex={0}
        maxFileIndex={1}
        maxAliasIndex={2}
        setFileIndex={mockSetFileIndex}
        setAliasIndex={mockSetAliasIndex}
        setMaxAliasIndex={mockSetMaxAliasIndex}
        progress={false}
      />
    );

    const button = screen.getByRole('button', { name: /editor.prev/i });
    expect(button).toBeDisabled();
  });

  it('progress=trueの場合、ボタンがdisabledになる', () => {
    render(
      <PrevAliasButton
        size={40}
        iconSize={24}
        fileIndex={0}
        aliasIndex={1}
        maxFileIndex={1}
        maxAliasIndex={2}
        setFileIndex={mockSetFileIndex}
        setAliasIndex={mockSetAliasIndex}
        setMaxAliasIndex={mockSetMaxAliasIndex}
        progress={true}
      />
    );

    const button = screen.getByRole('button', { name: /editor.prev/i });
    expect(button).toBeDisabled();
  });
});
