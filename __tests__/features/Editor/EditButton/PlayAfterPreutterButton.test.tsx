import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Wave } from 'utauwav';
import OtoRecord from 'utauoto/dist/OtoRecord';
import { PlayAfterPreutterButton } from '../../../../src/features/Editor/EditButtn/PlayAfterPreutterButton';
import { useOtoProjectStore } from '../../../../src/store/otoProjectStore';
import * as PlayModule from '../../../../src/utils/play';

describe('PlayAfterPreutterButton', () => {
  let mockRecord: OtoRecord;
  let mockWav: Wave;

  beforeEach(() => {
    vi.clearAllMocks();

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

    mockWav = {} as Wave;

    // useOtoProjectStoreの初期化
    const store = useOtoProjectStore.getState();
    store.record = mockRecord;
    store.wav = mockWav;
  });

  it('ボタンクリックによりOnPlayAfterPreutter関数が呼び出される', async () => {
    const user = userEvent.setup();

    // OnPlayAfterPreutter関数をスパイして、実際の実行を防ぐ
    const spyOnPlayAfterPreutter = vi.spyOn(
      PlayModule,
      'OnPlayAfterPreutter'
    ).mockImplementation(() => {
      // AudioContextのエラーを防ぐため、何もしない
    });

    render(
      <PlayAfterPreutterButton
        size={40}
        iconSize={24}
      />
    );

    // ボタンをクリック
    const button = screen.getByRole('button', { name: /editor.playAfterPreutter/i });
    await user.click(button);

    // OnPlayAfterPreutter関数が正しい引数で呼ばれることを確認
    expect(spyOnPlayAfterPreutter).toHaveBeenCalledWith(mockRecord, mockWav);
    expect(spyOnPlayAfterPreutter).toHaveBeenCalledTimes(1);
  });
});
