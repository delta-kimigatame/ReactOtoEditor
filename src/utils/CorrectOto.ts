import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

export const aliasVariant = ["CV", "VCV", "VC"] as const;
export type AliasValiant = (typeof aliasVariant)[number];

/**
 * 読み込んだoto.iniテンプレートをオフセットとテンポで補正する。
 * @param oto oto.ini
 * @param targetDir 現在原音設定の対象になっているディレクトリ
 * @param aliasVariant エイリアスの種類
 * @param beforeOffset 変更前のオフセット(ms)
 * @param afterOffset 変更後のオフセット(ms)
 * @param beforeTempo 変更前のテンポ
 * @param afterTempo 変更後のテンポ
 */
export const CorrectTempo = (
  oto: Oto,
  targetDir: string,
  aliasVariant: Array<AliasValiant> | null,
  beforeOffset: number,
  afterOffset: number,
  beforeTempo: number,
  afterTempo: number
): void => {
  /** aliasVariantのindex */
  let index = 0;
  /** テンプレートのテンポにおける1拍分の長さ(ms) */
  const beforeTempoMs = (60 / beforeTempo) * 1000;
  /** 変更後のテンポにおける1拍分の長さ(ms) */
  const afterTempoMs = (60 / afterTempo) * 1000;
  /** テンポの変換に伴う各パラメータの変換係数 */
  const tempoRate = afterTempoMs / beforeTempoMs;
  oto.GetFileNames(targetDir).forEach((f) => {
    oto.GetAliases(targetDir, f).forEach((a) => {
      const record = oto.GetRecord(targetDir, f, a);
      /** 先行発声の位置(ms) */
      const position = record.offset + record.pre;
      if (aliasVariant[index] === "VCV") {
        CorrectVCV(
          record,
          position,
          beforeOffset,
          afterOffset,
          beforeTempoMs,
          afterTempoMs,
          tempoRate
        );
      } else if (aliasVariant[index] === "VC") {
        CorrectVC(
          record,
          position,
          beforeOffset,
          afterOffset,
          beforeTempoMs,
          afterTempoMs,
          tempoRate
        );
      } else {
        CorrectCV(
          record,
          position,
          beforeOffset,
          afterOffset,
          beforeTempoMs,
          afterTempoMs,
          tempoRate
        );
      }
      index++;
    });
  });
};

/**
 * 連続音における補正処理 \
 * \
 * オーバーラップ、先行発声、子音速度、右ブランクに`tempoRate`をかける。 \
 * 左ブランクは、先行発声が`拍子の位置 + 元の差分*tempoRate`となるようにする。
 * @param record 編集するoto.iniのrecord
 * @param position wavの頭からみた元の先行発声の位置(ms)
 * @param beforeOffset 変更前のオフセット(ms)
 * @param afterOffset 変更後のオフセット(ms)
 * @param beforeTempoMs 変更前のテンポにおける1泊の長さ(ms)
 * @param afterTempoMs  変更後のテンポにおける1泊の長さ(ms)
 * @param tempoRate テンポの変更比
 */
const CorrectVCV = (
  record: OtoRecord,
  position: number,
  beforeOffset: number,
  afterOffset: number,
  beforeTempoMs: number,
  afterTempoMs: number,
  tempoRate: number
) => {
  /** このレコードが何拍目か */
  const beats = Math.max(
    Math.floor((position - beforeOffset) / beforeTempoMs),
    0
  );
  /** 拍子の頭とレコードの先行発声の位置の差 */
  const positionDif = position - beforeOffset - beats * beforeTempoMs;
  /** 補正後の先行発声の位置(ms) */
  const targetPosition =
    beats * afterTempoMs + positionDif * tempoRate + afterOffset;
  record.overlap *= tempoRate;
  record.pre *= tempoRate;
  record.velocity *= tempoRate;
  record.blank *= tempoRate;
  record.offset = targetPosition - record.pre;
};

/**
 * VCにおける補正処理 \
 * \
 * オーバーラップ、先行発声に`tempoRate`をかける。 \
 * 固定範囲、右ブランクから先行発声の長さを維持する。 \
 * 左ブランクは、先行発声～次の拍子の頭までの長さが変更前と同じになるようにする。
 * @param record 編集するoto.iniのrecord
 * @param position wavの頭からみた元の先行発声の位置(ms)
 * @param beforeOffset 変更前のオフセット(ms)
 * @param afterOffset 変更後のオフセット(ms)
 * @param beforeTempoMs 変更前のテンポにおける1泊の長さ(ms)
 * @param afterTempoMs  変更後のテンポにおける1泊の長さ(ms)
 * @param tempoRate テンポの変更比
 */
const CorrectVC = (
  record: OtoRecord,
  position: number,
  beforeOffset: number,
  afterOffset: number,
  beforeTempoMs: number,
  afterTempoMs: number,
  tempoRate: number
) => {
  /** このレコードが何拍目か + 1 */
  const beats = Math.max(
    Math.ceil((position - beforeOffset) / beforeTempoMs),
    1
  );
  /** 拍子の頭とレコードの先行発声の位置の差 */
  const positionDif = position - beforeOffset - beats * beforeTempoMs;
  /** 補正後の先行発声の位置(ms) */
  const targetPosition = beats * afterTempoMs + positionDif + afterOffset;
  /** 先行発声から子音速度までの長さ(ms) */
  const velocityOffset = record.velocity - record.pre;
  /** 先行発声から右ブランクまでの長さ * -1 (ms) */
  const blankOffset = record.pre + record.blank;
  record.overlap *= tempoRate;
  record.pre *= tempoRate;
  record.velocity = record.pre + velocityOffset;
  record.blank = blankOffset - record.pre;
  record.offset = targetPosition - record.pre;
};

/**
 * CVにおける補正処理 \
 * \
 * オーバーラップ、先行発声、固定範囲は長さを維持する。 \
 * 右ブランクに`tempoRate`をかける。 \
 * 左ブランクは、先行発声が`拍子の位置 + 元の差分*tempoRate`となるようにする。
 * @param record 編集するoto.iniのrecord
 * @param position wavの頭からみた元の先行発声の位置(ms)
 * @param beforeOffset 変更前のオフセット(ms)
 * @param afterOffset 変更後のオフセット(ms)
 * @param beforeTempoMs 変更前のテンポにおける1泊の長さ(ms)
 * @param afterTempoMs  変更後のテンポにおける1泊の長さ(ms)
 * @param tempoRate テンポの変更比
 */
const CorrectCV = (
  record: OtoRecord,
  position: number,
  beforeOffset: number,
  afterOffset: number,
  beforeTempoMs: number,
  afterTempoMs: number,
  tempoRate: number
) => {
  /** このレコードが何拍目か */
  const beats = Math.max(
    Math.floor((position - beforeOffset) / beforeTempoMs),
    0
  );
  /** 拍子の頭とレコードの先行発声の位置の差 */
  const positionDif = position - beforeOffset - beats * beforeTempoMs;
  /** 補正後の先行発声の位置(ms) */
  const targetPosition =
    beats * afterTempoMs + positionDif * tempoRate + afterOffset;
  record.blank *= tempoRate;
  record.offset = targetPosition - record.pre;
};
