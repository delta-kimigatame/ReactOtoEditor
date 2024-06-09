export type Color = {
  r: number;
  g: number;
  b: number;
};

export const GetColor = (color: Color): string => {
  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};

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
    r: fillColor[index1].r * (1 - rate) + fillColor[index2].r * rate,
    g: fillColor[index1].g * (1 - rate) + fillColor[index2].g * rate,
    b: fillColor[index1].b * (1 - rate) + fillColor[index2].b * rate,
  };

  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};
