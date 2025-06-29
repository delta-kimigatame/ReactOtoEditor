/**
 * RGB値を一括して扱う。
 */
export type Color = {
  /** 赤 0～255*/
  r: number;
  /** 緑 0～255*/
  g: number;
  /** 青 0～255*/
  b: number;
};

/**
 * canvasで使うRGB文字列を返す。
 * @param color 
 * @returns `rgb(r,g,b)`の形の文字列
 */
export const GetColor = (color: Color): string => {
  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};

/**
 * 複数の色設定列を補完し、canvasで使うRGB文字列を返す。\
 * \
 * `fillColor.length===3`の場合\
 * `0 < ratio <0.5`は`fillColor[0]`と`fillColor[1]`の線形補間 \
 * `0.5 < ratio <1`は`fillColor[1]`と`fillColor[2]`の線形補間となる。
 * 
 * @param ratio 全体の割合。0～1
 * @param fillColor 色のArray。
 * @returns ratioに基づいて、fillColorの内容を按分して生成した`rgb(r,g,b)`の形の文字列。
 */
export const GetColorInterp = (
  ratio: number,
  fillColor: Array<Color>
): string => {
  const r = Number.isNaN(ratio) ? 0 : ratio;
  const range: number = 1 / (fillColor.length - 1);
  const index1: number = Math.floor(r / range);
  const index2: number = Math.ceil(r / range);
  const rate: number = (r - index1 * range) / range;
  const color: Color = {
    r: Math.round(fillColor[index1].r * (1 - rate) + fillColor[index2].r * rate),
    g: Math.round(fillColor[index1].g * (1 - rate) + fillColor[index2].g * rate),
    b: Math.round(fillColor[index1].b * (1 - rate) + fillColor[index2].b * rate),
  };

  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};

/**
 * 複数の色設定列を補完し、canvasで使うColorを返す。\
 * \
 * `fillColor.length===3`の場合\
 * `0 < ratio <0.5`は`fillColor[0]`と`fillColor[1]`の線形補間 \
 * `0.5 < ratio <1`は`fillColor[1]`と`fillColor[2]`の線形補間となる。
 * 
 * @param ratio 全体の割合。0～1
 * @param fillColor 色のArray。
 * @returns ratioに基づいて、fillColorの内容を按分して生成したColor
 */
export const GetColorInterpParam = (
  ratio: number,
  fillColor: Array<Color>
): Color => {
  const r = Number.isNaN(ratio) ? 0 : ratio;
  const range: number = 1 / (fillColor.length - 1);
  const index1: number = Math.floor(r / range);
  const index2: number = Math.ceil(r / range);
  const rate: number = (r - index1 * range) / range;
  const color: Color = {
    r: Math.round(fillColor[index1].r * (1 - rate) + fillColor[index2].r * rate),
    g: Math.round(fillColor[index1].g * (1 - rate) + fillColor[index2].g * rate),
    b: Math.round(fillColor[index1].b * (1 - rate) + fillColor[index2].b * rate),
  };

  return color;
};
