export const backgroundColorPallet: { [mode: string]: Color } = {
  light: { r: 255, g: 255, b: 255 },
  dark: { r: 0, g: 0, b: 0 },
};

export const lineColorPallet: { [mode: string]: Color } = {
  dark: { r: 255, g: 255, b: 255 },
  light: { r: 0, g: 0, b: 0 },
};

export const wavColorPallet: { [key: string]: { [mode: string]: Color } } = {
  gray: { dark: { r: 255, g: 255, b: 255 }, light: { r: 0, g: 0, b: 0 } },
  red: { dark: { r: 255, g: 0, b: 0 }, light: { r: 255, g: 0, b: 0 } },
  blue: { dark: { r: 0, g: 0, b: 255 }, light: { r: 0, g: 0, b: 255 } },
  green: { dark: { r: 0, g: 255, b: 0 }, light: { r: 0, g: 255, b: 0 } },
  orange: { dark: { r: 255, g: 128, b: 0 }, light: { r: 255, g: 128, b: 0 } },
  aqua: { dark: { r: 0, g: 255, b: 255 }, light: { r: 0, g: 255, b: 255 } },
  magenta: { dark: { r: 255, g: 0, b: 255 }, light: { r: 255, g: 0, b: 255 } },
  rainbow: { dark: { r: 255, g: 255, b: 255 }, light: { r: 0, g: 0, b: 0 } },
};
const SpecColorProvider = (color: Color): { [mode: string]: Array<Color> } => {
  const pallet = { dark: new Array<Color>(), light: new Array<Color>() };
  pallet["dark"].push(backgroundColorPallet["dark"]);
  pallet["light"].push(backgroundColorPallet["light"]);
  for (let i = 0; i < 5; i++) {
    pallet["dark"].push({
      r: backgroundColorPallet["dark"].r * (1 - 0.25 * i) + color.r * 0.25 * i,
      g: backgroundColorPallet["dark"].g * (1 - 0.25 * i) + color.g * 0.25 * i,
      b: backgroundColorPallet["dark"].b * (1 - 0.25 * i) + color.b * 0.25 * i,
    });
    pallet["light"].push({
      r: backgroundColorPallet["light"].r * (1 - 0.25 * i) + color.r * 0.25 * i,
      g: backgroundColorPallet["light"].g * (1 - 0.25 * i) + color.g * 0.25 * i,
      b: backgroundColorPallet["light"].b * (1 - 0.25 * i) + color.b * 0.25 * i,
    });
  }
  return pallet;
};

export const specColor: { [key: string]: { [mode: string]: Array<Color> } } = {
  gray: {
    light: [
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 191, b: 191, g: 191 },
      { r: 127, b: 127, g: 127 },
      { r: 63, b: 63, g: 63 },
      { r: 0, b: 0, g: 0 },
    ],
    dark: [
      { r: 0, b: 0, g: 0 },
      { r: 0, b: 0, g: 0 },
      { r: 63, b: 63, g: 63 },
      { r: 127, b: 127, g: 127 },
      { r: 191, b: 191, g: 191 },
      { r: 255, b: 255, g: 255 },
    ],
  },
  red: SpecColorProvider({ r: 255, g: 0, b: 0 }),
  blue: SpecColorProvider({ r: 0, g: 0, b: 255 }),
  green: SpecColorProvider({ r: 0, g: 255, b: 0 }),
  orange: SpecColorProvider({ r: 255, g: 127, b: 0 }),
  aqua: SpecColorProvider({ r: 0, g: 255, b: 255 }),
  magenta: SpecColorProvider({ r: 255, g: 0, b: 255 }),
  rainbow: {
    light: [
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 0, b: 255, g: 0 },
      { r: 0, b: 255, g: 255 },
      { r: 0, b: 0, g: 255 },
      { r: 255, b: 0, g: 255 },
      { r: 255, b: 0, g: 0 },
    ],
    dark: [
      { r: 0, b: 0, g: 0 },
      { r: 0, b: 0, g: 0 },
      { r: 0, b: 255, g: 0 },
      { r: 0, b: 255, g: 255 },
      { r: 0, b: 0, g: 255 },
      { r: 255, b: 0, g: 255 },
      { r: 255, b: 0, g: 0 },
    ],
  },
};
type Color = {
  r: number;
  g: number;
  b: number;
};
