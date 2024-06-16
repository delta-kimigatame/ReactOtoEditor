export const product_name: string = "UTAU wav最適化";
export const setting: { [key: string]: string } = {
  product_name: "KIZAMU",
  product_url: "https://k-uta.jp/kizamu/",
  site_name: "きみがためtools",
  developer_x_url: "https://twitter.com/delta_kuro",
  github_url: "https://github.com/delta-kimigatame/ReactOtoEditor",
  discord_url: "",
};
export const fftSetting: { [key: string]: number } = {
  fftsize: 512,
  windowSize: 128,
  sampleRate: 44100,
  bitDepth: 16,
  channels: 1,
  maxFrq: 8000,
};
export const oto: { [key: string]: number } = {
  metronomeFlame: 66150,
  minParams: 0.001,
  defaultRange: 10,
};
export const layout: { [key: string]: number } = {
  requireHeader: 600,
  canvasMinHeight: 250,
  minButtonSize: 40,
  maxButtonSize: 100,
  minIconSize: 24,
  iconPadding: 16,
  tableMinSize: 75,
  headerHeight: 40,
  tableBrakePoint: 800,
};
