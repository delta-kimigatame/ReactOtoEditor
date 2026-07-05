/**
 * パフォーマンス計測ユーティリティ
 */

export interface PerformanceResult {
  label: string;
  duration: number; // ms
  startTime: number;
  endTime: number;
}

export interface MemoryInfo {
  usedJSHeapSize?: number; // bytes
  totalJSHeapSize?: number; // bytes
  jsHeapSizeLimit?: number; // bytes
  timestamp: number;
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  hardwareConcurrency: number;
  deviceMemory?: number; // GB
  maxTouchPoints: number;
  isTablet: boolean;
  isMobile: boolean;
}

/**
 * パフォーマンス計測クラス
 */
export class PerformanceTracker {
  private measurements: PerformanceResult[] = [];
  private memorySnapshots: MemoryInfo[] = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = performance.now();
  }

  /**
   * 計測を開始する
   */
  mark(label: string): () => void {
    const start = performance.now();
    return () => {
      const end = performance.now();
      this.measurements.push({
        label,
        duration: end - start,
        startTime: start - this.startTime,
        endTime: end - this.startTime,
      });
    };
  }

  /**
   * メモリスナップショットを記録
   */
  recordMemory(): void {
    if ((performance as any).memory) {
      this.memorySnapshots.push({
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        timestamp: performance.now() - this.startTime,
      });
    }
  }

  /**
   * メモリピークを取得
   */
  getMemoryPeak(): number {
    if (this.memorySnapshots.length === 0) return 0;
    return Math.max(
      ...this.memorySnapshots.map((m) => m.usedJSHeapSize || 0)
    );
  }

  /**
   * メモリピークを MB で取得
   */
  getMemoryPeakMB(): number {
    return this.getMemoryPeak() / 1024 / 1024;
  }

  /**
   * 全計測結果を取得
   */
  getMeasurements(): PerformanceResult[] {
    return this.measurements;
  }

  /**
   * ラベルごとの統計情報
   */
  getStats(label: string): {
    count: number;
    totalDuration: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
  } | null {
    const items = this.measurements.filter((m) => m.label === label);
    if (items.length === 0) return null;

    const durations = items.map((m) => m.duration);
    return {
      count: items.length,
      totalDuration: durations.reduce((a, b) => a + b, 0),
      avgDuration: durations.reduce((a, b) => a + b, 0) / items.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
    };
  }

  /**
   * 全体の統計サマリー
   */
  getSummary(): {
    totalTime: number;
    measurementCount: number;
    peakMemoryMB: number;
    uniqueLabels: string[];
  } {
    return {
      totalTime: performance.now() - this.startTime,
      measurementCount: this.measurements.length,
      peakMemoryMB: this.getMemoryPeakMB(),
      uniqueLabels: Array.from(new Set(this.measurements.map((m) => m.label))),
    };
  }

  /**
   * JSON レポート出力
   */
  toJSON(): {
    summary: ReturnType<PerformanceTracker['getSummary']>;
    measurements: PerformanceResult[];
    memorySnapshots: MemoryInfo[];
    deviceInfo: DeviceInfo;
  } {
    return {
      summary: this.getSummary(),
      measurements: this.measurements,
      memorySnapshots: this.memorySnapshots,
      deviceInfo: getDeviceInfo(),
    };
  }

  /**
   * コンソールに見やすく出力
   */
  printReport(): void {
    const summary = this.getSummary();
    console.log('=== Performance Report ===');
    console.log(`Total Time: ${summary.totalTime.toFixed(2)} ms`);
    console.log(`Peak Memory: ${summary.peakMemoryMB.toFixed(2)} MB`);
    console.log(`Measurements: ${summary.measurementCount}`);
    console.log('\n--- Breakdown by Label ---');

    for (const label of summary.uniqueLabels) {
      const stats = this.getStats(label);
      if (stats) {
        console.log(`${label}:`);
        console.log(`  Count: ${stats.count}`);
        console.log(`  Avg: ${stats.avgDuration.toFixed(2)} ms`);
        console.log(`  Min: ${stats.minDuration.toFixed(2)} ms`);
        console.log(`  Max: ${stats.maxDuration.toFixed(2)} ms`);
        console.log(`  Total: ${stats.totalDuration.toFixed(2)} ms`);
      }
    }
  }
}

/**
 * デバイス情報を取得
 */
export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /Android|iPad/i.test(ua) && !isMobile;

  return {
    userAgent: ua,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    isTablet,
    isMobile,
  };
}

/**
 * CSVフォーマットでエクスポート
 */
export function exportMetricsAsCSV(tracker: PerformanceTracker): string {
  const measurements = tracker.getMeasurements();
  const lines = ['Label,Duration (ms),Start (ms),End (ms)'];

  for (const m of measurements) {
    lines.push(
      `${m.label},${m.duration.toFixed(2)},${m.startTime.toFixed(2)},${m.endTime.toFixed(2)}`
    );
  }

  return lines.join('\n');
}
