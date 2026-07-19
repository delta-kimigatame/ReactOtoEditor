/**
 * 窓付き sinc 補間により、エイリアシングを抑えてデータをリサンプリングする。
 * @param data リサンプリングするデータ
 * @param sourceSampleRate 元データのサンプルレート
 * @param targetSampleRate 変換後のサンプルレート
 * @returns リサンプリング後のデータ
 */
export const resample = (
  data: Array<number>,
  sourceSampleRate: number,
  targetSampleRate: number
): Array<number> => {
  if (sourceSampleRate === targetSampleRate) return data;

  const ratio = targetSampleRate / sourceSampleRate;
  const targetLength = Math.round(data.length * ratio);
  const halfTaps = 32;
  const cutoff = Math.min(1, ratio) / 2;
  const result = new Array<number>(targetLength);

  for (let targetIndex = 0; targetIndex < targetLength; targetIndex++) {
    const sourcePosition = targetIndex / ratio;
    const firstIndex = Math.ceil(sourcePosition - halfTaps);
    const lastIndex = Math.floor(sourcePosition + halfTaps);
    let value = 0;
    let weightSum = 0;

    for (let sourceIndex = firstIndex; sourceIndex <= lastIndex; sourceIndex++) {
      if (sourceIndex < 0 || sourceIndex >= data.length) continue;

      const distance = sourceIndex - sourcePosition;
      const sinc =
        distance === 0
          ? 2 * cutoff
          : Math.sin(2 * Math.PI * cutoff * distance) /
            (Math.PI * distance);
      const window =
        0.5 + 0.5 * Math.cos((Math.PI * distance) / (halfTaps + 1));
      const weight = sinc * window;
      value += data[sourceIndex] * weight;
      weightSum += weight;
    }
    result[targetIndex] = weightSum === 0 ? 0 : value / weightSum;
  }

  return result;
};