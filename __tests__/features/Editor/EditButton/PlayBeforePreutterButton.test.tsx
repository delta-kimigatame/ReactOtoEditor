import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Wave } from 'utauwav';
import OtoRecord from 'utauoto/dist/OtoRecord';
import { PlayBeforePreutterButton } from '../../../../src/features/Editor/EditButtn/PlayBeforePreutterButton';
import { useOtoProjectStore } from '../../../../src/store/otoProjectStore';
import * as PlayModule from '../../../../src/utils/play';

describe('PlayBeforePreutterButton', () => {
  let mockRecord: OtoRecord;
  let mockWav: Wave;

  beforeEach(() => {
    // モックデータを作成
    mockRecord = {
      filename: 'test.wav',
      alias: 'あ',
      offset: 100,
      overlap: 50,
      pre: 30,
      velocity: 20,
      blank: 10,
    } as OtoRecord;

    mockWav = {
      sampleRate: 44100,
      channels: 1,
      data: new Float32Array(44100),
      LogicalNormalize: () => new Float32Array(44100),
    } as unknown as Wave;

    // useOtoProjectStoreの初期化
    const store = useOtoProjectStore.getState();
    store.record = mockRecord;
    store.wav = mockWav;
    
    vi.clearAllMocks();
  });

  it('ボタンクリックによりOnPlayBeforePreutter関数が呼び出される', async () => {
    const user = userEvent.setup();

    // OnPlayBeforePreutter関数をスパイして、実際の実行を防ぐ
    const spyOnPlayBeforePreutter = vi.spyOn(
      PlayModule,
      'OnPlayBeforePreutter'
    ).mockImplementation(() => {
      // AudioContextのエラーを防ぐため、何もしない
    });

    render(
      <PlayBeforePreutterButton
        size={40}
        iconSize={24}
      />
    );

    // ボタンをクリック
    const button = screen.getByRole('button', { name: /editor.playBeforePreutter/i });
    
    await user.click(button);

    // OnPlayBeforePreutter関数が正しい引数で呼び出されたことを確認
    expect(spyOnPlayBeforePreutter).toHaveBeenCalledTimes(1);
    expect(spyOnPlayBeforePreutter).toHaveBeenCalledWith(mockRecord, mockWav);
  });
});
