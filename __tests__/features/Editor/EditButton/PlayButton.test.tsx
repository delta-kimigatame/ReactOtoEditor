import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Wave } from 'utauwav';
import OtoRecord from 'utauoto/dist/OtoRecord';
import { PlayButton } from '../../../../src/features/Editor/EditButtn/PlayButton';
import { useOtoProjectStore } from '../../../../src/store/otoProjectStore';
import * as PlayModule from '../../../../src/utils/play';

describe('PlayButton', () => {
  let mockRecord: OtoRecord;
  let mockWav: Wave;
  let mockMetronome: Wave;

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
    mockMetronome = {} as Wave;

    // useOtoProjectStoreの初期化
    const store = useOtoProjectStore.getState();
    store.record = mockRecord;
    store.wav = mockWav;
  });

  it('ボタンクリックによりOnPlay関数が呼び出される', async () => {
    const user = userEvent.setup();

    // OnPlay関数をスパイして、実際の実行を防ぐ
    const spyOnPlay = vi.spyOn(PlayModule, 'OnPlay').mockImplementation(() => {
      // AudioContextのエラーを防ぐため、何もしない
    });

    render(
      <PlayButton
        size={40}
        iconSize={24}
        metronome={mockMetronome}
      />
    );

    // ボタンをクリック
    const button = screen.getByRole('button', { name: /editor.play/i });
    await user.click(button);

    // OnPlay関数が正しい引数で呼ばれることを確認
    expect(spyOnPlay).toHaveBeenCalledWith(mockRecord, mockWav, mockMetronome);
    expect(spyOnPlay).toHaveBeenCalledTimes(1);
  });

  it('metronomeがnullの場合、ボタンがdisabledになる', () => {
    render(
      <PlayButton
        size={40}
        iconSize={24}
        metronome={null}
      />
    );

    const button = screen.getByRole('button', { name: /editor.play/i });
    expect(button).toBeDisabled();
  });

  it('metronomeがnullでない場合、ボタンが有効になる', () => {
    render(
      <PlayButton
        size={40}
        iconSize={24}
        metronome={mockMetronome}
      />
    );

    const button = screen.getByRole('button', { name: /editor.play/i });
    expect(button).not.toBeDisabled();
  });
});
