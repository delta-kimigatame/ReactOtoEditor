/** アプリ名 */
export const product_name: string = "UTAU wav最適化";

/** アプリに関する設定 */
export const setting: { [key: string]: string } = {
  /** アプリの名前 */
  product_name: "KIZAMU",
  /** アプリのURL */
  product_url: "https://k-uta.jp/kizamu/",
  /** webサイトの名前 */
  site_name: "きみがためtools",
  /** 開発者のXアカウントのURL */
  developer_x_url: "https://twitter.com/delta_kuro",
  /** githubリポジトリのurl */
  github_url: "https://github.com/delta-kimigatame/ReactOtoEditor",
  /** サポートdiscordのurl */
  discord_url: "",
};

/** fftに関する定数 */
export const fftSetting: { [key: string]: number } = {
  /** fftのフレーム数 */
  fftsize: 512,
  /** 窓関数の大きさ */
  windowSize: 128,
  /** サンプリング周波数 */
  sampleRate: 44100,
  /** ビット深度 */
  bitDepth: 16,
  /** モノラルなら1、ステレオなら2 */
  channels: 1,
  /** キャンバスに表示する最大周波数 */
  maxFrq: 8000,
};

/** 原音設定に関する定数 */
export const oto: { [key: string]: number } = {
  /** metronome.wavの先行発声を合わせる位置。BPM120の4拍目 */
  metronomeFlame: 66150,
  /** 伸縮範囲、固定範囲の最小値 */
  minParams: 0.001,
  /** キャンバスをタップした際に、パラメータを認識する最小距離 */
  defaultRange: 10,
};

/** レイアウトに関する定数 */
export const layout: { [key: string]: number } = {
  /** キャンバスの最小縦幅 */
  canvasMinHeight: 250,
  /** 操作ボタンの最小サイズ */
  minButtonSize: 40,
  /** 操作ボタンの最大サイズ */
  maxButtonSize: 100,
  /** 操作ボタンの最小アイコンサイズ */
  minIconSize: 24,
  /** 操作ボタンのパディング */
  iconPadding: 16,
  /** tableの最小縦幅 */
  tableMinSize: 75,
  /** ヘッダーの縦幅 */
  headerHeight: 40,
  /** tableのフォントサイズ変更点になる横幅 */
  tableBrakePoint: 800,
};
