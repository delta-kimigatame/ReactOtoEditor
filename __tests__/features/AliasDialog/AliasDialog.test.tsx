import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Oto } from 'utauoto';
import OtoRecord from 'utauoto/dist/OtoRecord';
import { AliasDialog, AdjustIndexesAfterRecordDeletion, TableDialogProps } from '../../../src/features/AliasDialog/AliasDialog';
import { useOtoProjectStore } from '../../../src/store/otoProjectStore';

describe('AdjustIndexesAfterRecordDeletion', () => {
  let oto: Oto;
  let targetDir: string;
  let setRecord: (record: OtoRecord | null) => void;
  let setAliasIndex: (index: number) => void;
  let setFileIndex: (index: number) => void;
  let setMaxAliasIndex: (max: number) => void;

  beforeEach(() => {
    oto = new Oto();
    targetDir = 'A3';
    setRecord = vi.fn();
    setAliasIndex = vi.fn();
    setFileIndex = vi.fn();
    setMaxAliasIndex = vi.fn();

    // 複数ファイル、複数エイリアスのデータを準備
    oto.SetParams(targetDir, 'test1.wav', 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, 'test1.wav', 'い', 10, 20, 30, 40, 50);
    oto.SetParams(targetDir, 'test1.wav', 'う', 100, 200, 300, 400, 500);
    oto.SetParams(targetDir, 'test2.wav', 'え', 1000, 2000, 3000, 4000, 5000);
    oto.SetParams(targetDir, 'test2.wav', 'お', 10000, 20000, 30000, 40000, 50000);
  });

  it('ケース1: 最後のファイルの最後のエイリアスで、かつ複数エイリアスがある場合 → 1つ前のエイリアスに移動', () => {
    const record = oto.GetRecord(targetDir, 'test2.wav', 'お')!;
    oto.RemoveAlias(targetDir, record.filename, record.alias);
    AdjustIndexesAfterRecordDeletion(
      targetDir,
      oto,
      record,
      setRecord,
      1, // aliasIndex (最後)
      1, // maxAliasIndex (最後)
      1, // fileIndex (最後)
      1, // maxFileIndex (最後)
      setAliasIndex,
      setFileIndex,
      setMaxAliasIndex
    );

    expect(setAliasIndex).toHaveBeenCalledWith(0);
    expect(setMaxAliasIndex).toHaveBeenCalledWith(0);
    expect(setRecord).toHaveBeenCalledWith(oto.GetRecord(targetDir, 'test2.wav', 'え'));
  });

  it('ケース2: 最後のファイルの最初のエイリアス(かつ唯一)で、複数ファイルがある場合 → 前のファイルの最後のエイリアスに移動', () => {
    const record = oto.GetRecord(targetDir, 'test2.wav', 'え')!;
    oto.RemoveAlias(targetDir, record.filename, record.alias);
    // test2.wavのエイリアスを1つだけにする想定
    oto.RemoveAlias(targetDir, 'test2.wav', 'お');

    AdjustIndexesAfterRecordDeletion(
      targetDir,
      oto,
      record,
      setRecord,
      0, // aliasIndex (最初かつ最後)
      0, // maxAliasIndex (最初かつ最後)
      1, // fileIndex (最後)
      1, // maxFileIndex (最後)
      setAliasIndex,
      setFileIndex,
      setMaxAliasIndex
    );

    expect(setFileIndex).toHaveBeenCalledWith(0);
    expect(setAliasIndex).toHaveBeenCalledWith(2); // test1.wavの最後のインデックス
    expect(setMaxAliasIndex).toHaveBeenCalledWith(2);
    expect(setRecord).toHaveBeenCalledWith(oto.GetRecord(targetDir, 'test1.wav', 'う'));
  });

  it('ケース3: 最初のファイルの最初のエイリアス(かつ唯一、全体で最後)の場合 → recordをnullに設定', () => {
    // すべてのエイリアスを削除し、1つだけ残す
    oto.RemoveAlias(targetDir, 'test1.wav', 'い');
    oto.RemoveAlias(targetDir, 'test1.wav', 'う');
    oto.RemoveAlias(targetDir, 'test2.wav', 'え');
    oto.RemoveAlias(targetDir, 'test2.wav', 'お');
    const record = oto.GetRecord(targetDir, 'test1.wav', 'あ')!;
    oto.RemoveAlias(targetDir, record.filename, record.alias);

    AdjustIndexesAfterRecordDeletion(
      targetDir,
      oto,
      record,
      setRecord,
      0, // aliasIndex (最初かつ最後)
      0, // maxAliasIndex (最初かつ最後)
      0, // fileIndex (最初かつ最後)
      0, // maxFileIndex (最初かつ最後)
      setAliasIndex,
      setFileIndex,
      setMaxAliasIndex
    );

    expect(setFileIndex).toHaveBeenCalledWith(0);
    expect(setAliasIndex).toHaveBeenCalledWith(0);
    expect(setMaxAliasIndex).toHaveBeenCalledWith(0);
    expect(setRecord).toHaveBeenCalledWith(null);
  });

  it('ケース4: 現在のファイルの最後のエイリアス(だが最後のファイルではない)の場合 → 次のファイルの最初のエイリアスに移動', () => {
    const record = oto.GetRecord(targetDir, 'test1.wav', 'う')!;
    oto.RemoveAlias(targetDir, record.filename, record.alias);
    AdjustIndexesAfterRecordDeletion(
      targetDir,
      oto,
      record,
      setRecord,
      2, // aliasIndex (最後)
      2, // maxAliasIndex (最後)
      0, // fileIndex (最初)
      1, // maxFileIndex (最後ではない)
      setAliasIndex,
      setFileIndex,
      setMaxAliasIndex
    );

    expect(setFileIndex).toHaveBeenCalledWith(1);
    expect(setAliasIndex).toHaveBeenCalledWith(0);
    expect(setMaxAliasIndex).toHaveBeenCalledWith(1); // test2.wavの最後のインデックス
    expect(setRecord).toHaveBeenCalledWith(oto.GetRecord(targetDir, 'test2.wav', 'え'));
  });

  it('ケース5: 中間のエイリアスの場合 → 同じインデックスの次のエイリアスに移動', () => {
    const record = oto.GetRecord(targetDir, 'test1.wav', 'い')!;
    oto.RemoveAlias(targetDir, record.filename, record.alias);
    AdjustIndexesAfterRecordDeletion(
      targetDir,
      oto,
      record,
      setRecord,
      1, // aliasIndex (中間)
      2, // maxAliasIndex (最後ではない)
      0, // fileIndex
      1, // maxFileIndex
      setAliasIndex,
      setFileIndex,
      setMaxAliasIndex
    );

    expect(setMaxAliasIndex).toHaveBeenCalledWith(1);
    expect(setRecord).toHaveBeenCalledWith(oto.GetRecord(targetDir, 'test1.wav', 'う'));
    expect(setAliasIndex).not.toHaveBeenCalled();
    expect(setFileIndex).not.toHaveBeenCalled();
  });
});

describe('AliasDialog', () => {
  let oto: Oto;
  let targetDir: string;
  let props: TableDialogProps;

  beforeEach(() => {
    oto = new Oto();
    targetDir = 'A3';
    
    // useOtoProjectStoreの初期化
    const store = useOtoProjectStore.getState();
    store.oto = oto;
    store.targetDir = targetDir;
    store.record = null;

    props = {
      dialogOpen: true,
      setDialogOpen: vi.fn(),
      setUpdateSignal: vi.fn(),
      fileIndex: 0,
      aliasIndex: 0,
      maxAliasIndex: 0,
      maxFileIndex: 0,
      setFileIndex: vi.fn(),
      setAliasIndex: vi.fn(),
      setMaxAliasIndex: vi.fn(),
    };
  });

  it('初期値確認：recordがnullの場合、各フィールドの初期値が正しく表示される', () => {
    render(<AliasDialog {...props} />);

    // エイリアステキストフィールドが空文字
    const aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input');
    expect(aliasInput?.value).toBe('');

    // 各パラメータフィールドが0
    const offsetInput = screen.getByTestId('AliasDialog-offset').querySelector('input');
    expect(offsetInput?.value).toBe('0');

    const overlapInput = screen.getByTestId('AliasDialog-overlap').querySelector('input');
    expect(overlapInput?.value).toBe('0');

    const preutterInput = screen.getByTestId('AliasDialog-preutter').querySelector('input');
    expect(preutterInput?.value).toBe('0');

    const velocityInput = screen.getByTestId('AliasDialog-velocity').querySelector('input');
    expect(velocityInput?.value).toBe('0');

    const blankInput = screen.getByTestId('AliasDialog-blank').querySelector('input');
    expect(blankInput?.value).toBe('0');

    // パラメータ変更ボタンがdisabled
    const paramChangeButton = screen.getByTestId('AliasDialog-paramchange');
    expect(paramChangeButton).toBeDisabled();
  });

  it('初期値確認：recordが定義されている場合、recordの値が正しく表示される', () => {
    // recordを設定
    oto.SetParams(targetDir, 'test.wav', 'あ', 100, 200, 300, 400, 500);
    const record = oto.GetRecord(targetDir, 'test.wav', 'あ')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    render(<AliasDialog {...props} />);

    // エイリアステキストフィールドにrecordのaliasが表示される
    const aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input');
    expect(aliasInput?.value).toBe('あ');

    // 各パラメータフィールドにrecordの値が表示される
    const offsetInput = screen.getByTestId('AliasDialog-offset').querySelector('input');
    expect(offsetInput?.value).toBe('100');

    const overlapInput = screen.getByTestId('AliasDialog-overlap').querySelector('input');
    expect(overlapInput?.value).toBe('200');

    const preutterInput = screen.getByTestId('AliasDialog-preutter').querySelector('input');
    expect(preutterInput?.value).toBe('300');

    const velocityInput = screen.getByTestId('AliasDialog-velocity').querySelector('input');
    expect(velocityInput?.value).toBe('400');

    const blankInput = screen.getByTestId('AliasDialog-blank').querySelector('input');
    expect(blankInput?.value).toBe('500');

    // パラメータ変更ボタンが有効
    const paramChangeButton = screen.getByTestId('AliasDialog-paramchange');
    expect(paramChangeButton).not.toBeDisabled();
  });

  it('useEffect確認：recordが変更された場合、UI表示値も更新される', () => {
    // 初期record
    oto.SetParams(targetDir, 'test.wav', 'あ', 10, 20, 30, 40, 50);
    const initialRecord = oto.GetRecord(targetDir, 'test.wav', 'あ')!;
    const store = useOtoProjectStore.getState();
    store.record = initialRecord;

    const { rerender } = render(<AliasDialog {...props} />);

    // 初期値確認
    let aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input');
    expect(aliasInput?.value).toBe('あ');
    let offsetInput = screen.getByTestId('AliasDialog-offset').querySelector('input');
    expect(offsetInput?.value).toBe('10');

    // recordを変更
    oto.SetParams(targetDir, 'test.wav', 'い', 100, 200, 300, 400, 500);
    const newRecord = oto.GetRecord(targetDir, 'test.wav', 'い')!;
    store.record = newRecord;

    // 再レンダリング
    rerender(<AliasDialog {...props} />);

    // 変更後の値確認
    aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input');
    expect(aliasInput?.value).toBe('い');

    offsetInput = screen.getByTestId('AliasDialog-offset').querySelector('input');
    expect(offsetInput?.value).toBe('100');

    const overlapInput = screen.getByTestId('AliasDialog-overlap').querySelector('input');
    expect(overlapInput?.value).toBe('200');

    const preutterInput = screen.getByTestId('AliasDialog-preutter').querySelector('input');
    expect(preutterInput?.value).toBe('300');

    const velocityInput = screen.getByTestId('AliasDialog-velocity').querySelector('input');
    expect(velocityInput?.value).toBe('400');

    const blankInput = screen.getByTestId('AliasDialog-blank').querySelector('input');
    expect(blankInput?.value).toBe('500');
  });

  it('TextField変更確認：6つのTextFieldがそれぞれ期待通りに変更できる（相互副作用なし）', async () => {
    const user = userEvent.setup();

    // recordを設定
    oto.SetParams(targetDir, 'test.wav', 'あ', 10, 20, 30, 40, 50);
    const record = oto.GetRecord(targetDir, 'test.wav', 'あ')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    render(<AliasDialog {...props} />);

    // 各TextFieldを順番に変更
    const aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input')!;
    await user.clear(aliasInput);
    await user.type(aliasInput, 'い');

    const offsetInput = screen.getByTestId('AliasDialog-offset').querySelector('input')!;
    await user.clear(offsetInput);
    await user.type(offsetInput, '100');

    const overlapInput = screen.getByTestId('AliasDialog-overlap').querySelector('input')!;
    await user.clear(overlapInput);
    await user.type(overlapInput, '200');

    const preutterInput = screen.getByTestId('AliasDialog-preutter').querySelector('input')!;
    await user.clear(preutterInput);
    await user.type(preutterInput, '300');

    const velocityInput = screen.getByTestId('AliasDialog-velocity').querySelector('input')!;
    await user.clear(velocityInput);
    await user.type(velocityInput, '400');

    const blankInput = screen.getByTestId('AliasDialog-blank').querySelector('input')!;
    await user.clear(blankInput);
    await user.type(blankInput, '500');

    // 全ての変更が反映され、相互に副作用がないことを確認
    expect(aliasInput.value).toBe('い');
    expect(offsetInput.value).toBe('100');
    expect(overlapInput.value).toBe('200');
    expect(preutterInput.value).toBe('300');
    expect(velocityInput.value).toBe('400');
    expect(blankInput.value).toBe('500');
  });

  it('OnParameterChangeClick：パラメータを変更してボタンをクリックすると、recordが更新される', async () => {
    const user = userEvent.setup();

    // recordを設定
    oto.SetParams(targetDir, 'test.wav', 'あ', 10, 20, 30, 40, 50);
    const record = oto.GetRecord(targetDir, 'test.wav', 'あ')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    render(<AliasDialog {...props} />);

    // パラメータを変更
    const offsetInput = screen.getByTestId('AliasDialog-offset').querySelector('input')!;
    await user.clear(offsetInput);
    await user.type(offsetInput, '100');

    const overlapInput = screen.getByTestId('AliasDialog-overlap').querySelector('input')!;
    await user.clear(overlapInput);
    await user.type(overlapInput, '200');

    const preutterInput = screen.getByTestId('AliasDialog-preutter').querySelector('input')!;
    await user.clear(preutterInput);
    await user.type(preutterInput, '300');

    const velocityInput = screen.getByTestId('AliasDialog-velocity').querySelector('input')!;
    await user.clear(velocityInput);
    await user.type(velocityInput, '400');

    const blankInput = screen.getByTestId('AliasDialog-blank').querySelector('input')!;
    await user.clear(blankInput);
    await user.type(blankInput, '500');

    // パラメータ変更ボタンをクリック
    const paramChangeButton = screen.getByTestId('AliasDialog-paramchange');
    await user.click(paramChangeButton);

    // recordが更新されていることを確認
    expect(record.offset).toBe(100);
    expect(record.overlap).toBe(200);
    expect(record.pre).toBe(300);
    expect(record.velocity).toBe(400);
    expect(record.blank).toBe(500);

    // setUpdateSignalが呼ばれることを確認
    expect(props.setUpdateSignal).toHaveBeenCalled();

    // ダイアログが閉じられることを確認
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('OnParameterChangeClick：パラメータが変更されていない場合、setUpdateSignalは呼ばれない', async () => {
    const user = userEvent.setup();

    // recordを設定
    oto.SetParams(targetDir, 'test.wav', 'あ', 10, 20, 30, 40, 50);
    const record = oto.GetRecord(targetDir, 'test.wav', 'あ')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    render(<AliasDialog {...props} />);

    // パラメータを変更せずにボタンをクリック
    const paramChangeButton = screen.getByTestId('AliasDialog-paramchange');
    await user.click(paramChangeButton);

    // setUpdateSignalが呼ばれないことを確認
    expect(props.setUpdateSignal).not.toHaveBeenCalled();

    // ダイアログは閉じられる
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('OnParameterChangeClick：一部のパラメータのみ変更した場合、変更されたパラメータのみが更新される', async () => {
    const user = userEvent.setup();

    // recordを設定
    oto.SetParams(targetDir, 'test.wav', 'あ', 10, 20, 30, 40, 50);
    const record = oto.GetRecord(targetDir, 'test.wav', 'あ')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    render(<AliasDialog {...props} />);

    // offsetとvelocityのみ変更
    const offsetInput = screen.getByTestId('AliasDialog-offset').querySelector('input')!;
    await user.clear(offsetInput);
    await user.type(offsetInput, '100');

    const velocityInput = screen.getByTestId('AliasDialog-velocity').querySelector('input')!;
    await user.clear(velocityInput);
    await user.type(velocityInput, '400');

    // パラメータ変更ボタンをクリック
    const paramChangeButton = screen.getByTestId('AliasDialog-paramchange');
    await user.click(paramChangeButton);

    // 変更したパラメータのみ更新されている
    expect(record.offset).toBe(100);
    expect(record.velocity).toBe(400);

    // 変更していないパラメータは元のまま
    expect(record.overlap).toBe(20);
    expect(record.pre).toBe(30);
    expect(record.blank).toBe(50);

    // setUpdateSignalが呼ばれることを確認
    expect(props.setUpdateSignal).toHaveBeenCalled();
  });

  it('OnChangeClick：エイリアス変更が成功する（順番が維持される）', async () => {
    const user = userEvent.setup();

    // 複数のレコードを登録
    oto.SetParams(targetDir, 'test.wav', 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, 'test.wav', 'い', 10, 20, 30, 40, 50);
    oto.SetParams(targetDir, 'test.wav', 'う', 100, 200, 300, 400, 500);

    const record = oto.GetRecord(targetDir, 'test.wav', 'い')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    // aliasIndexを1（'い'の位置）に設定
    props.aliasIndex = 1;

    render(<AliasDialog {...props} />);

    // エイリアス名を変更
    const aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input')!;
    await user.clear(aliasInput);
    await user.type(aliasInput, 'え');

    // 変更ボタンをクリック
    const changeButton = screen.getByTestId('AliasDialog-change');
    await user.click(changeButton);

    // エイリアスが変更され、順番が維持されている
    const aliases = oto.GetAliases(targetDir, 'test.wav');
    expect(aliases).toEqual(['あ', 'え', 'う']);

    // 変更後のレコードが取得できる
    const changedRecord = oto.GetRecord(targetDir, 'test.wav', 'え');
    expect(changedRecord).toBeDefined();
    expect(changedRecord!.alias).toBe('え');
    expect(changedRecord!.offset).toBe(10);

    // setAliasIndexが現在のインデックスで呼ばれる（順番維持）
    expect(props.setAliasIndex).toHaveBeenCalledWith(1);

    // setUpdateSignalが呼ばれる
    expect(props.setUpdateSignal).toHaveBeenCalled();

    // ダイアログが閉じられる
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('OnChangeClick：既に存在するエイリアス名に変更しようとするとエラー', async () => {
    const user = userEvent.setup();

    // 複数のレコードを登録
    oto.SetParams(targetDir, 'test.wav', 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, 'test.wav', 'い', 10, 20, 30, 40, 50);

    const record = oto.GetRecord(targetDir, 'test.wav', 'い')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    render(<AliasDialog {...props} />);

    // 既に存在するエイリアス名に変更しようとする
    const aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input')!;
    await user.clear(aliasInput);
    await user.type(aliasInput, 'あ');

    // 変更ボタンをクリック
    const changeButton = screen.getByTestId('AliasDialog-change');
    await user.click(changeButton);

    // エラーになり、エイリアスは変更されない
    const aliases = oto.GetAliases(targetDir, 'test.wav');
    expect(aliases).toEqual(['あ', 'い']);

    // setAliasIndexやsetUpdateSignalは呼ばれない
    expect(props.setAliasIndex).not.toHaveBeenCalled();
    expect(props.setUpdateSignal).not.toHaveBeenCalled();

    // ダイアログは閉じられない
    expect(props.setDialogOpen).not.toHaveBeenCalled();
  });

  it('OnDuplicationClick：エイリアス複製が成功する（現在のレコードの次に挿入される）', async () => {
    const user = userEvent.setup();

    // 複数のレコードを登録
    oto.SetParams(targetDir, 'test.wav', 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, 'test.wav', 'い', 10, 20, 30, 40, 50);
    oto.SetParams(targetDir, 'test.wav', 'う', 100, 200, 300, 400, 500);

    const record = oto.GetRecord(targetDir, 'test.wav', 'い')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    // aliasIndexを1（'い'の位置）、maxAliasIndexを2に設定
    props.aliasIndex = 1;
    props.maxAliasIndex = 2;

    render(<AliasDialog {...props} />);

    // 複製先のエイリアス名を入力
    const aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input')!;
    await user.clear(aliasInput);
    await user.type(aliasInput, 'お');

    // 複製ボタンをクリック
    const duplicationButton = screen.getByTestId('AliasDialog-duplication');
    await user.click(duplicationButton);

    // エイリアスが複製され、'い'の次に挿入されている
    const aliases = oto.GetAliases(targetDir, 'test.wav');
    expect(aliases).toEqual(['あ', 'い', 'お', 'う']);

    // 複製されたレコードのパラメータが元のレコードと同じ
    const duplicatedRecord = oto.GetRecord(targetDir, 'test.wav', 'お');
    expect(duplicatedRecord).toBeDefined();
    expect(duplicatedRecord!.alias).toBe('お');
    expect(duplicatedRecord!.offset).toBe(10);
    expect(duplicatedRecord!.overlap).toBe(20);
    expect(duplicatedRecord!.pre).toBe(30);
    expect(duplicatedRecord!.velocity).toBe(40);
    expect(duplicatedRecord!.blank).toBe(50);

    // setAliasIndexが現在のインデックス+1で呼ばれる
    expect(props.setAliasIndex).toHaveBeenCalledWith(2);

    // setMaxAliasIndexがインクリメントされる
    expect(props.setMaxAliasIndex).toHaveBeenCalledWith(3);

    // setUpdateSignalが呼ばれる
    expect(props.setUpdateSignal).toHaveBeenCalled();

    // ダイアログが閉じられる
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('OnDuplicationClick：既に存在するエイリアス名で複製しようとするとエラー', async () => {
    const user = userEvent.setup();

    // 複数のレコードを登録
    oto.SetParams(targetDir, 'test.wav', 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, 'test.wav', 'い', 10, 20, 30, 40, 50);

    const record = oto.GetRecord(targetDir, 'test.wav', 'い')!;
    const store = useOtoProjectStore.getState();
    store.record = record;

    props.maxAliasIndex = 1;

    render(<AliasDialog {...props} />);

    // 既に存在するエイリアス名で複製しようとする
    const aliasInput = screen.getByTestId('AliasDialog-alias').querySelector('input')!;
    await user.clear(aliasInput);
    await user.type(aliasInput, 'あ');

    // 複製ボタンをクリック
    const duplicationButton = screen.getByTestId('AliasDialog-duplication');
    await user.click(duplicationButton);

    // エラーになり、エイリアスは複製されない
    const aliases = oto.GetAliases(targetDir, 'test.wav');
    expect(aliases).toEqual(['あ', 'い']);

    // setAliasIndexやsetUpdateSignalは呼ばれない
    expect(props.setAliasIndex).not.toHaveBeenCalled();
    expect(props.setUpdateSignal).not.toHaveBeenCalled();

    // ダイアログは閉じられない
    expect(props.setDialogOpen).not.toHaveBeenCalled();
  });

  it('OnDeleteClick：中間のエイリアスを削除すると、同じインデックスの次のエイリアスに移動', async () => {
    const user = userEvent.setup();

    // 複数のレコードを登録
    oto.SetParams(targetDir, 'test.wav', 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, 'test.wav', 'い', 10, 20, 30, 40, 50);
    oto.SetParams(targetDir, 'test.wav', 'う', 100, 200, 300, 400, 500);

    const record = oto.GetRecord(targetDir, 'test.wav', 'い')!;
    const store = useOtoProjectStore.getState();
    store.record = record;
    store.setRecord = vi.fn();

    // aliasIndexを1（'い'の位置）、maxAliasIndexを2に設定
    props.aliasIndex = 1;
    props.maxAliasIndex = 2;
    props.fileIndex = 0;
    props.maxFileIndex = 0;

    render(<AliasDialog {...props} />);

    // 削除ボタンをクリック
    const deleteButton = screen.getByTestId('AliasDialog-delete');
    await user.click(deleteButton);

    // エイリアスが削除されている
    const aliases = oto.GetAliases(targetDir, 'test.wav');
    expect(aliases).toEqual(['あ', 'う']);

    // AdjustIndexesAfterRecordDeletionが呼ばれ、次のエイリアス（'う'）に移動
    expect(props.setMaxAliasIndex).toHaveBeenCalledWith(1);
    expect(store.setRecord).toHaveBeenCalledWith(oto.GetRecord(targetDir, 'test.wav', 'う'));

    // ダイアログが閉じられる
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('OnDeleteClick：最後のファイルの最後のエイリアスを削除すると、1つ前のエイリアスに移動', async () => {
    const user = userEvent.setup();

    // 複数のレコードを登録
    oto.SetParams(targetDir, 'test.wav', 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, 'test.wav', 'い', 10, 20, 30, 40, 50);
    oto.SetParams(targetDir, 'test.wav', 'う', 100, 200, 300, 400, 500);

    const record = oto.GetRecord(targetDir, 'test.wav', 'う')!;
    const store = useOtoProjectStore.getState();
    store.record = record;
    store.setRecord = vi.fn();

    // aliasIndexを2（'う'の位置）、maxAliasIndexを2に設定（最後）
    props.aliasIndex = 2;
    props.maxAliasIndex = 2;
    props.fileIndex = 0;
    props.maxFileIndex = 0;

    render(<AliasDialog {...props} />);

    // 削除ボタンをクリック
    const deleteButton = screen.getByTestId('AliasDialog-delete');
    await user.click(deleteButton);

    // エイリアスが削除されている
    const aliases = oto.GetAliases(targetDir, 'test.wav');
    expect(aliases).toEqual(['あ', 'い']);

    // AdjustIndexesAfterRecordDeletionが呼ばれ、1つ前のエイリアス（'い'）に移動
    expect(props.setAliasIndex).toHaveBeenCalledWith(1);
    expect(props.setMaxAliasIndex).toHaveBeenCalledWith(1);
    expect(store.setRecord).toHaveBeenCalledWith(oto.GetRecord(targetDir, 'test.wav', 'い'));

    // ダイアログが閉じられる
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('OnDeleteClick：唯一のエイリアスを削除すると、recordがnullになる', async () => {
    const user = userEvent.setup();

    // 1つのレコードのみ登録
    oto.SetParams(targetDir, 'test.wav', 'あ', 1, 2, 3, 4, 5);

    const record = oto.GetRecord(targetDir, 'test.wav', 'あ')!;
    const store = useOtoProjectStore.getState();
    store.record = record;
    store.setRecord = vi.fn();

    // aliasIndex、maxAliasIndex、fileIndex、maxFileIndexすべて0（唯一）
    props.aliasIndex = 0;
    props.maxAliasIndex = 0;
    props.fileIndex = 0;
    props.maxFileIndex = 0;

    render(<AliasDialog {...props} />);

    // 削除ボタンをクリック
    const deleteButton = screen.getByTestId('AliasDialog-delete');
    await user.click(deleteButton);

    // エイリアスが削除されている
    const aliases = oto.GetAliases(targetDir, 'test.wav');
    expect(aliases).toEqual([]);

    // AdjustIndexesAfterRecordDeletionが呼ばれ、recordがnullに設定される
    expect(props.setFileIndex).toHaveBeenCalledWith(0);
    expect(props.setAliasIndex).toHaveBeenCalledWith(0);
    expect(props.setMaxAliasIndex).toHaveBeenCalledWith(0);
    expect(store.setRecord).toHaveBeenCalledWith(null);

    // ダイアログが閉じられる
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
  });

  it('OnDeleteClick：現在のファイルの最後のエイリアスを削除すると、次のファイルの最初のエイリアスに移動', async () => {
    const user = userEvent.setup();

    // 複数ファイルに複数レコードを登録
    oto.SetParams(targetDir, 'test1.wav', 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, 'test1.wav', 'い', 10, 20, 30, 40, 50);
    oto.SetParams(targetDir, 'test2.wav', 'う', 100, 200, 300, 400, 500);
    oto.SetParams(targetDir, 'test2.wav', 'え', 1000, 2000, 3000, 4000, 5000);

    const record = oto.GetRecord(targetDir, 'test1.wav', 'い')!;
    const store = useOtoProjectStore.getState();
    store.record = record;
    store.setRecord = vi.fn();

    // test1.wavの最後のエイリアス（'い'）を削除
    props.aliasIndex = 1;
    props.maxAliasIndex = 1;
    props.fileIndex = 0;
    props.maxFileIndex = 1;

    render(<AliasDialog {...props} />);

    // 削除ボタンをクリック
    const deleteButton = screen.getByTestId('AliasDialog-delete');
    await user.click(deleteButton);

    // エイリアスが削除されている
    const aliases = oto.GetAliases(targetDir, 'test1.wav');
    expect(aliases).toEqual(['あ']);

    // AdjustIndexesAfterRecordDeletionが呼ばれ、次のファイルの最初のエイリアス（'う'）に移動
    expect(props.setFileIndex).toHaveBeenCalledWith(1);
    expect(props.setAliasIndex).toHaveBeenCalledWith(0);
    expect(props.setMaxAliasIndex).toHaveBeenCalledWith(1);
    expect(store.setRecord).toHaveBeenCalledWith(oto.GetRecord(targetDir, 'test2.wav', 'う'));

    // ダイアログが閉じられる
    expect(props.setDialogOpen).toHaveBeenCalledWith(false);
  });
});
