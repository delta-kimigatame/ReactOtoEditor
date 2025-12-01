import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
/**
 * エイリアスを変更するユーティリティ関数
 * 単にrecordの値を変更した場合、GetAliasesで取得できるエイリアス一覧が更新されないため、
 * 一度既存のエイリアスを全て削除し、新しいエイリアスで再登録することで対応する。
 *
 * @param targetDir 対象のディレクトリ
 * @param record 変更対象の原音設定レコード
 * @param alias 新しいエイリアス
 * @param currentIndex 現在のエイリアスのインデックス
 * @param oto Otoインスタンス
 */
export const ChangeAlias = (
  targetDir: string,
  record: OtoRecord,
  alias: string,
  currentIndex: number,
  oto: Oto
) => {
  const allAliases = oto.GetAliases(targetDir, record.filename);
  const allRecords = allAliases.map((a) =>
    oto.GetRecord(targetDir, record.filename, a)
  );
  const oldAlias = allAliases[currentIndex];
  allAliases[currentIndex] = alias;
  allAliases.forEach((a, i) => {
    const aliasToRemove = i === currentIndex ? oldAlias : a;
    oto.RemoveAlias(targetDir, record.filename, aliasToRemove);
  });
  allRecords[currentIndex].alias = alias;

  allRecords.forEach((rec) => {
    oto.SetParams(
      targetDir,
      rec.filename,
      rec.alias,
      rec.offset,
      rec.overlap,
      rec.pre,
      rec.velocity,
      rec.blank
    );
  });
};

type RecordLike =
  | OtoRecord
  | {
      filename: string;
      alias: string;
      offset: number;
      overlap: number;
      pre: number;
      velocity: number;
      blank: number;
    };

/**
 * 原音設定レコードを複製するユーティリティ関数
 * 単にsetParamsで新しいエイリアスを追加した場合、GetAliasesで取得できるエイリアス一覧の順番が変わってしまうため、
 * 全てのエイリアスを一度削除し、複製したレコードを元のインデックスの直後に挿入することで対応する。
 * @param targetDir 対象のディレクトリ
 * @param record 複製対象の原音設定レコード
 * @param alias 新しいエイリアス
 * @param currentIndex 現在のエイリアスのインデックス
 * @param oto Otoインスタンス
 */
export const DuplicateOtoRecord = (
  targetDir: string,
  record: OtoRecord,
  alias: string,
  currentIndex: number,
  oto: Oto
) => {
  const allAliases = oto.GetAliases(targetDir, record.filename);
  const allRecords: RecordLike[] = allAliases.map((a) =>
    oto.GetRecord(targetDir, record.filename, a)
  );
  const duplicatedRecord: RecordLike = {
    filename: record.filename,
    alias: alias,
    offset: record.offset,
    overlap: record.overlap,
    pre: record.pre,
    velocity: record.velocity,
    blank: record.blank,
  };
  allRecords.splice(currentIndex + 1, 0, duplicatedRecord);
  allAliases.forEach((a) => {
    oto.RemoveAlias(targetDir, record.filename, a);
  });
  allRecords.forEach((rec) => {
    oto.SetParams(
      targetDir,
      rec.filename,
      rec.alias,
      rec.offset,
      rec.overlap,
      rec.pre,
      rec.velocity,
      rec.blank
    );
  });
};
