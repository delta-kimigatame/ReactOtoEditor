/**
 * ブラウザでメルスペクトログラムを計算するユーティリティ
 */
import * as tf from '@tensorflow/tfjs';

export class MelSpectrogramExtractor {
  private static tfBackendInitPromise: Promise<void> | null = null;
  private sampleRate: number = 44100;
  private nFft: number = 1024;
  private hopLength: number; // 1ms
  private nMels: number = 128;
  private fMin: number = 0;
  private fMax: number | null = null;
  private decoderContext: BaseAudioContext | null = null;

  constructor(sampleRate: number = 44100) {
    this.sampleRate = sampleRate;
    this.hopLength = Math.floor(sampleRate * 0.001); // 1ms
    this.fMax = sampleRate / 2; // Nyquist
  }

  /**
   * 長時間バッチでのWebGLコンテキストロストを避けるためCPUバックエンドを強制する
   */
  private async ensureTfBackend(): Promise<void> {
    if (!MelSpectrogramExtractor.tfBackendInitPromise) {
      MelSpectrogramExtractor.tfBackendInitPromise = (async () => {
        await tf.ready();
        if (tf.getBackend() !== "cpu") {
          await tf.setBackend("cpu");
          await tf.ready();
        }
      })();
    }

    await MelSpectrogramExtractor.tfBackendInitPromise;
  }

  /**
   * WAV ArrayBuffer をモノラル Float32Array にデコード
   */
  async decodeWav(wavArrayBuffer: ArrayBuffer): Promise<Float32Array> {
    const decoder = this.getDecoderContext();
    const audioBuffer = await decoder.decodeAudioData(wavArrayBuffer.slice(0));

    // モノラル化
    const mono = audioBuffer.getChannelData(0);
    return new Float32Array(mono);
  }

  /**
   * デコード用コンテキストを使い回して、AudioContext の乱立を防ぐ
   */
  private getDecoderContext(): BaseAudioContext {
    if (this.decoderContext) {
      return this.decoderContext;
    }

    if (typeof window.OfflineAudioContext !== "undefined") {
      this.decoderContext = new window.OfflineAudioContext(1, 1, this.sampleRate);
      return this.decoderContext;
    }

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.decoderContext = new AudioCtx();
    return this.decoderContext;
  }

  /**
   * 指定時刻付近のウィンドウを切り出す
   * @param audioData デコード済みオーディオ
   * @param centerMs 中心時刻（ミリ秒）
   * @param windowMs ウィンドウサイズ（ミリ秒）
   */
  extractWindow(
    audioData: Float32Array,
    centerMs: number,
    windowMs: number = 600
  ): Float32Array {
    const centerSample = Math.round((centerMs / 1000) * this.sampleRate);
    const halfWindowSamples = Math.round((windowMs / 1000 / 2) * this.sampleRate);

    const startSample = centerSample - halfWindowSamples;
    const endSample = centerSample + halfWindowSamples;

    const windowSize = halfWindowSamples * 2;
    const window = new Float32Array(windowSize);

    // パディング処理
    const validStart = Math.max(0, -startSample);
    const validEnd = Math.min(audioData.length - startSample, windowSize);

    if (validStart < validEnd) {
      window.set(audioData.slice(Math.max(0, startSample), Math.min(audioData.length, endSample)), validStart);
    }

    return window;
  }

  /**
   * Hann ウィンドウ関数
   */
  private hannWindow(length: number): Float32Array {
    const window = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      window[i] = 0.5 * (1.0 - Math.cos((2.0 * Math.PI * i) / (length - 1)));
    }
    return window;
  }

  /**
   * メル周波数への変換（ヘルツ → メル）
   */
  private hzToMel(hz: number): number {
    return 2595 * Math.log10(1 + hz / 700);
  }

  /**
   * メル周波数からヘルツへの変換（メル → ヘルツ）
   */
  private melToHz(mel: number): number {
    return 700 * (Math.pow(10, mel / 2595) - 1);
  }

  /**
   * メル・スケーリング用フィルタバンク
   */
  private createMelFilterbank(): number[][] {
    const melMax = this.hzToMel(this.fMax || this.sampleRate / 2);
    const melMin = this.hzToMel(this.fMin);

    const numFreqBins = Math.floor(this.nFft / 2) + 1;
    const mel_points = new Array(this.nMels + 2);

    for (let i = 0; i < this.nMels + 2; i++) {
      const mel = melMin + ((melMax - melMin) / (this.nMels + 1)) * i;
      const hz = this.melToHz(mel);
      mel_points[i] = Math.floor((hz / (this.sampleRate / 2)) * numFreqBins);
    }

    const filterbank: number[][] = [];
    for (let m = 1; m < this.nMels + 1; m++) {
      const filter = new Array(numFreqBins).fill(0);

      const left = mel_points[m - 1];
      const center = mel_points[m];
      const right = mel_points[m + 1];

      for (let k = left; k < center; k++) {
        filter[k] = (k - left) / (center - left);
      }
      for (let k = center; k < right; k++) {
        filter[k] = (right - k) / (right - center);
      }

      filterbank.push(filter);
    }

    return filterbank;
  }

  /**
   * STFT を計算（TensorFlow.js 使用）
   */
  private async computeStft(audio: Float32Array): Promise<number[][]> {
    const stftTensor = tf.tidy(() => {
      const signal = tf.tensor1d(audio);
      const stftResult = tf.signal.stft(signal, this.nFft, this.hopLength, this.nFft);
      const magnitude = tf.abs(stftResult);
      return tf.square(magnitude);
    });

    const power2d = await stftTensor.array() as number[][];
    stftTensor.dispose();
    return power2d;
  }

  /**
   * メル・スケーリング
   */
  private melScale(powerSpectrum: number[][], filterbank: number[][]): number[][] {
    const melSpec: number[][] = [];

    for (const power of powerSpectrum) {
      const mel = new Array(this.nMels).fill(0);

      for (let m = 0; m < this.nMels; m++) {
        for (let k = 0; k < Math.min(filterbank[m].length, power.length); k++) {
          mel[m] += filterbank[m][k] * power[k];
        }
        mel[m] = Math.max(mel[m], 1e-10);
      }

      melSpec.push(mel);
    }

    return melSpec;
  }

  /**
   * メルスペクトログラムをテンソルにリサイズ
   */
  private async resizeToTargetShape(
    melSpec: number[][],
    targetShape: [number, number]
  ): Promise<Float32Array> {
    const frameCount = melSpec.length;
    const melBinCount = melSpec[0].length;
    const [targetNMels, targetNFrames] = targetShape;

    // 転置 [frame, mel] -> [mel, frame]
    const melFlat = new Float32Array(melBinCount * frameCount);
    for (let m = 0; m < melBinCount; m++) {
      for (let f = 0; f < frameCount; f++) {
        melFlat[m * frameCount + f] = melSpec[f][m] || 0;
      }
    }

    // 純TSの双線形補間でWebGL依存を排除
    const result = new Float32Array(targetNMels * targetNFrames);

    const srcH = melBinCount;
    const srcW = frameCount;
    const dstH = targetNMels;
    const dstW = targetNFrames;

    const scaleY = srcH > 1 ? (srcH - 1) / Math.max(dstH - 1, 1) : 0;
    const scaleX = srcW > 1 ? (srcW - 1) / Math.max(dstW - 1, 1) : 0;

    for (let y = 0; y < dstH; y++) {
      const srcY = scaleY * y;
      const y0 = Math.floor(srcY);
      const y1 = Math.min(y0 + 1, srcH - 1);
      const wy = srcY - y0;

      for (let x = 0; x < dstW; x++) {
        const srcX = scaleX * x;
        const x0 = Math.floor(srcX);
        const x1 = Math.min(x0 + 1, srcW - 1);
        const wx = srcX - x0;

        const v00 = melFlat[y0 * srcW + x0];
        const v01 = melFlat[y0 * srcW + x1];
        const v10 = melFlat[y1 * srcW + x0];
        const v11 = melFlat[y1 * srcW + x1];

        const top = v00 + (v01 - v00) * wx;
        const bottom = v10 + (v11 - v10) * wx;
        result[y * dstW + x] = top + (bottom - top) * wy;
      }
    }

    return result;
  }

  /**
   * メイン: WAV → メルスペクトログラム（デシベル）
   * @param wavArrayBuffer WAV ファイルのバイナリデータ
   * @param centerMs 中心時刻（ミリ秒）
   * @returns [128, 980] の Float32Array（デシベルスケール）
   */
  async waveToMelSpectrogram(
    wavArrayBuffer: ArrayBuffer,
    centerMs: number
  ): Promise<Float32Array> {
    await this.ensureTfBackend();

    // 1. WAV デコード
    const audioData = await this.decodeWav(wavArrayBuffer);

    // 2. ウィンドウ切り出し
    const window = this.extractWindow(audioData, centerMs, 600);

    // 3. STFT → パワースペクトログラム
    const stft = await this.computeStft(window);

    // 4. メル・フィルタバンク作成
    const filterbank = this.createMelFilterbank();

    // 5. メル・スケーリング
    const melSpec = this.melScale(stft, filterbank);

    // 6. デシベル変換
    const melDb = melSpec.map((frame) =>
      frame.map((power) => 10 * Math.log10(power))
    );

    // 7. [128, 980] にリサイズ
    const resized = await this.resizeToTargetShape(melDb, [128, 980]);

    return resized;
  }
}
