import OtoRecord from "utauoto/dist/OtoRecord";
import { oto } from "../config/setting";

/**
 * オフセット更新の計算結果
 */
export interface OffsetUpdateResult {
  offset: number;
  pre: number;
  overlap: number;
  velocity: number;
  blank: number;
}

/**
 * オフセットを更新する際の計算
 * @param record 現在のOtoRecord
 * @param clickX クリックされたX座標
 * @param pixelPerMsec 横方向1pixelあたりが何msを表すか
 * @param overlapLock オーバーラップロックモードかどうか
 * @returns 更新後のパラメータ
 */
export const calculateOffsetUpdate = (
  record: OtoRecord,
  clickX: number,
  pixelPerMsec: number,
  overlapLock: boolean
): OffsetUpdateResult => {
  /** 移動距離 */
  const moveValue = record.offset - clickX * pixelPerMsec;
  const newOffset = record.offset - moveValue;
  /** 先行発声の最小値は0 */
  const newPre = Math.max(record.pre + moveValue, 0);
  let newOverlap: number;
  if (overlapLock) {
    /** オーバーラップロックの場合、先行発声の1/3 */
    newOverlap = newPre / 3;
  } else {
    /** オーバーラップロックでない、元位置を維持 */
    newOverlap = record.overlap + moveValue;
  }
  /** 子音速度の最小値は設定値 */
  const newVelocity = Math.max(record.velocity + moveValue, oto.minParams);
  /** 右ブランクの最小値は設定値 */
  let newBlank = record.blank;
  if (record.blank < 0) {
    newBlank = Math.min(record.blank - moveValue, -2 * oto.minParams);
  }
  return {
    offset: newOffset,
    pre: newPre,
    overlap: newOverlap,
    velocity: newVelocity,
    blank: newBlank,
  };
};

/**
 * オーバーラップを更新する際の計算
 * @param record 現在のOtoRecord
 * @param clickX クリックされたX座標
 * @param pixelPerMsec 横方向1pixelあたりが何msを表すか
 * @returns 更新後のオーバーラップ
 */
export const calculateOverlapUpdate = (
  record: OtoRecord,
  clickX: number,
  pixelPerMsec: number
): number => {
  /** 移動距離 */
  const moveValue = record.offset + record.overlap - clickX * pixelPerMsec;
  return record.overlap - moveValue;
};

/**
 * 先行発声を更新する際の計算
 * @param record 現在のOtoRecord
 * @param clickX クリックされたX座標
 * @param pixelPerMsec 横方向1pixelあたりが何msを表すか
 * @returns 更新後のオフセット
 */
export const calculatePreUpdate = (
  record: OtoRecord,
  clickX: number,
  pixelPerMsec: number
): number => {
  /** 移動距離 */
  const moveValue = record.offset + record.pre - clickX * pixelPerMsec;
  return record.offset - moveValue;
};

/**
 * 子音速度更新の計算結果
 */
export interface VelocityUpdateResult {
  velocity: number;
  blank: number;
}

/**
 * 子音速度を更新する際の計算
 * @param record 現在のOtoRecord
 * @param clickX クリックされたX座標
 * @param pixelPerMsec 横方向1pixelあたりが何msを表すか
 * @returns 更新後のパラメータ
 */
export const calculateVelocityUpdate = (
  record: OtoRecord,
  clickX: number,
  pixelPerMsec: number
): VelocityUpdateResult => {
  /** 移動距離 */
  const moveValue = record.offset + record.velocity - clickX * pixelPerMsec;
  const newVelocity = Math.max(record.velocity - moveValue, oto.minParams);
  /** 伸縮範囲が設定値以下とならないようにする */
  const newBlank = Math.min(record.blank, -oto.minParams - newVelocity);
  return {
    velocity: newVelocity,
    blank: newBlank,
  };
};

/**
 * 右ブランクを更新する際の計算
 * @param record 現在のOtoRecord
 * @param clickX クリックされたX座標
 * @param pixelPerMsec 横方向1pixelあたりが何msを表すか
 * @returns 更新後の右ブランク
 */
export const calculateBlankUpdate = (
  record: OtoRecord,
  clickX: number,
  pixelPerMsec: number
): number => {
  const newBlankPos = record.offset - clickX * pixelPerMsec;
  return Math.min(newBlankPos, -oto.minParams - record.velocity);
};
