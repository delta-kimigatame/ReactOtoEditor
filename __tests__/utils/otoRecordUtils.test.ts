import { ChangeAlias, DuplicateOtoRecord } from '../../src/utils/otoRecordUtils';
import { Oto } from 'utauoto';
import OtoRecord from 'utauoto/dist/OtoRecord';

describe('otoRecordUtils', () => {
  let oto: Oto;
  let targetDir: string;
  let filename: string;

  beforeEach(() => {
    oto = new Oto();
    targetDir = 'A3';
    filename = 'test.wav';
    // 初期データ登録
    oto.SetParams(targetDir, filename, 'あ', 1, 2, 3, 4, 5);
    oto.SetParams(targetDir, filename, 'い', 10, 20, 30, 40, 50);
    oto.SetParams(targetDir, filename, 'う', 100, 200, 300, 400, 500);
  });

  it('changeAlias: 順番を維持してエイリアス名を変更できる', () => {
    const record = oto.GetRecord(targetDir, filename, 'い') as OtoRecord;
    ChangeAlias(targetDir, record, 'え', 1, oto);
    const aliases = oto.GetAliases(targetDir, filename);
    expect(aliases).toEqual(['あ', 'え', 'う']);
    const rec = oto.GetRecord(targetDir, filename, 'え');
    expect(rec?.offset).toBe(10);
    expect(rec?.overlap).toBe(20);
  });

  it('duplicateAlias: 現在の次に複製できる', () => {
    const record = oto.GetRecord(targetDir, filename, 'い') as OtoRecord;
    DuplicateOtoRecord(targetDir, record, 'お', 1, oto);
    const aliases = oto.GetAliases(targetDir, filename);
    expect(aliases).toEqual(['あ', 'い', 'お', 'う']);
    const rec = oto.GetRecord(targetDir, filename, 'お');
    expect(rec?.offset).toBe(10);
    expect(rec?.velocity).toBe(40);
  });
});
