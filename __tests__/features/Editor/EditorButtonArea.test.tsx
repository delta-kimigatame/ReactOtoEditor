import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Oto } from 'utauoto';
import { Wave,GenerateWave } from 'utauwav';
import { EditorButtonArea } from '../../../src/features/Editor/EditorButtonArea';
import { useOtoProjectStore } from '../../../src/store/otoProjectStore';
import { useCookieStore } from '../../../src/store/cookieStore';
import * as PlayModule from '../../../src/utils/play';

// fetchをモック化
global.fetch = vi.fn();

describe('EditorButtonArea', () => {
  let oto: Oto;
  let targetDir: string;
  let mockSetRecord: ReturnType<typeof vi.fn>;
  let mockSetPixelPerMsec: ReturnType<typeof vi.fn>;
  let mockSetButtonAreaHeight: ReturnType<typeof vi.fn>;
  let mockSetUpdateSignal: ReturnType<typeof vi.fn>;
  let mockSetOverlapLock: ReturnType<typeof vi.fn>;
  let mockSetTouchMode: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    oto = new Oto();
    targetDir = 'A3';
    mockSetRecord = vi.fn();
    mockSetPixelPerMsec = vi.fn();
    mockSetButtonAreaHeight = vi.fn();
    mockSetUpdateSignal = vi.fn();
    mockSetOverlapLock = vi.fn();
    mockSetTouchMode = vi.fn();

    // 複数ファイル、複数エイリアスのデータを準備
    oto.SetParams(targetDir, 'test1.wav', 'あ', 100, 200, 300, 400, 500);
    oto.SetParams(targetDir, 'test1.wav', 'い', 110, 210, 310, 410, 510);
    oto.SetParams(targetDir, 'test2.wav', 'う', 120, 220, 320, 420, 520);

    const currentRecord = oto.GetRecord(targetDir, 'test1.wav', 'あ');
    const mockWav = GenerateWave(44100,16,[0,0,0,0,0,0,0,0]);

    useOtoProjectStore.setState({
      oto,
      targetDir,
      record: currentRecord,
      wav: mockWav,
      setRecord: mockSetRecord,
    });

    useCookieStore.setState({
      overlapLock: false,
      setOverlapLock: mockSetOverlapLock,
      touchMode: false,
      setTouchMode: mockSetTouchMode,
    });

    // fetchをモック化（metronome読み込み用）
    // 有効なwavデータを生成
    const mockMetronomeWav = GenerateWave(44100, 16, [0, 0, 0, 0]);
    const mockMetronomeBuffer = mockMetronomeWav.Output();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      arrayBuffer: () => Promise.resolve(mockMetronomeBuffer),
    } as Response);
  });

  describe('Zoom機能', () => {
    it('ZoomInボタンクリックでpixelPerMsecが縮小される（20→10）', async () => {
      const user = userEvent.setup();

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={20}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const zoomInButton = screen.getByRole('button', { name: /editor.zoomin/i });
      await user.click(zoomInButton);

      expect(mockSetPixelPerMsec).toHaveBeenCalledWith(10);
    });

    it('ZoomInボタンクリックでpixelPerMsecが縮小される（10→5）', async () => {
      const user = userEvent.setup();

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const zoomInButton = screen.getByRole('button', { name: /editor.zoomin/i });
      await user.click(zoomInButton);

      expect(mockSetPixelPerMsec).toHaveBeenCalledWith(5);
    });

    it('ZoomOutボタンクリックでpixelPerMsecが拡大される（1→2）', async () => {
      const user = userEvent.setup();

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={1}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const zoomOutButton = screen.getByRole('button', { name: /editor.zoomout/i });
      await user.click(zoomOutButton);

      expect(mockSetPixelPerMsec).toHaveBeenCalledWith(2);
    });

    it('pixelPerMsec=1の場合、ZoomInボタンがdisabledになる', () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={1}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const zoomInButton = screen.getByRole('button', { name: /editor.zoomin/i });
      expect(zoomInButton).toBeDisabled();
    });

    it('pixelPerMsec=20の場合、ZoomOutボタンがdisabledになる', () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={20}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const zoomOutButton = screen.getByRole('button', { name: /editor.zoomout/i });
      expect(zoomOutButton).toBeDisabled();
    });

    it('progress=trueの場合、Zoom両ボタンがdisabledになる', () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={true}
        />
      );

      const zoomInButton = screen.getByRole('button', { name: /editor.zoomin/i });
      const zoomOutButton = screen.getByRole('button', { name: /editor.zoomout/i });
      
      expect(zoomInButton).toBeDisabled();
      expect(zoomOutButton).toBeDisabled();
    });
  });

  describe('キーボードショートカット - エイリアス移動', () => {
    it('ArrowRightでOnNextAliasが呼ばれる（setRecordで確認）', async () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'ArrowRight' });
      });

      // OnNextAliasが実行され、次のエイリアス「い」に移動
      expect(mockSetRecord).toHaveBeenCalledTimes(1);
      const recordArg = mockSetRecord.mock.calls[0][0];
      expect(recordArg.alias).toBe('い');
    });

    it('ArrowLeftでOnPrevAliasが呼ばれる（setRecordで確認）', async () => {
      // 2番目のエイリアス「い」から開始
      const currentRecord = oto.GetRecord(targetDir, 'test1.wav', 'い');
      useOtoProjectStore.setState({ record: currentRecord, setRecord: mockSetRecord });

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      mockSetRecord.mockClear(); // renderの後でクリア（useEffect実行後）

      await waitFor(() => {
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
      });

      // OnPrevAliasが実行され、前のエイリアス「あ」に移動
      expect(mockSetRecord).toHaveBeenCalledTimes(1);
      const recordArg = mockSetRecord.mock.calls[0][0];
      expect(recordArg.alias).toBe('あ');
    });
  });

  describe('キーボードショートカット - Zoom', () => {
    it('+キーでOnZoomInが呼ばれる', async () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '+' });
      });

      expect(mockSetPixelPerMsec).toHaveBeenCalledWith(5);
    });

    it('-キーでOnZoomOutが呼ばれる', async () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '-' });
      });

      expect(mockSetPixelPerMsec).toHaveBeenCalledWith(20);
    });
  });

  describe('キーボードショートカット - Play機能', () => {
    it('1キーでOnPlayBeforePreutterが呼ばれる', async () => {
      const spyOnPlayBeforePreutter = vi.spyOn(PlayModule, 'OnPlayBeforePreutter').mockImplementation(() => {});

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '1' });
      });

      expect(spyOnPlayBeforePreutter).toHaveBeenCalledTimes(1);
    });

    it('2キーでOnPlayAfterPreutterが呼ばれる', async () => {
      const spyOnPlayAfterPreutter = vi.spyOn(PlayModule, 'OnPlayAfterPreutter').mockImplementation(() => {});

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '2' });
      });

      expect(spyOnPlayAfterPreutter).toHaveBeenCalledTimes(1);
    });

    it('3キーでOnPlayが呼ばれる', async () => {
      const spyOnPlay = vi.spyOn(PlayModule, 'OnPlay').mockImplementation(() => {});

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '3' });
      });

      expect(spyOnPlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('キーボードショートカット - Lock/TouchMode', () => {
    it('4キーでoverlapLockが切り替わる', async () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '4' });
      });

      expect(mockSetOverlapLock).toHaveBeenCalledWith(true);
    });

    it('5キーでtouchModeが切り替わる', async () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '5' });
      });

      expect(mockSetTouchMode).toHaveBeenCalledWith(true);
    });
  });

  describe('キーボードショートカット - ダイアログ表示', () => {
    it('6キーでAliasDialogが表示される', async () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '6' });
      });

      // AliasDialogが表示されることを確認（dialogOpen=trueが渡される）
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('7キーでTableDialogが表示される', async () => {
      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      await waitFor(() => {
        fireEvent.keyDown(window, { key: '7' });
      });

      // TableDialogが表示されることを確認
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('キーボードショートカット - 無効化条件', () => {
    it('INPUT要素内ではキーボードショートカットが無効化される', async () => {
      render(
        <div>
          <input type="text" />
          <EditorButtonArea
            windowWidth={1920}
            windowHeight={1080}
            setButtonAreaHeight={mockSetButtonAreaHeight}
            pixelPerMsec={10}
            setPixelPerMsec={mockSetPixelPerMsec}
            setUpdateSignal={mockSetUpdateSignal}
            progress={false}
          />
        </div>
      );

      const input = screen.getByRole('textbox');
      input.focus();

      await waitFor(() => {
        fireEvent.keyDown(input, { key: '+' });
      });

      // Zoomが呼ばれないことを確認
      expect(mockSetPixelPerMsec).not.toHaveBeenCalled();
    });
  });

  describe('Lock/TouchMode切り替え', () => {
    it('LockボタンクリックでoverlapLockが切り替わる', async () => {
      const user = userEvent.setup();

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const lockButton = screen.getByRole('button', { name: /editor.lockOverlap/i });
      await user.click(lockButton);

      expect(mockSetOverlapLock).toHaveBeenCalledWith(true);
    });

    it('TouchModeボタンクリックでtouchModeが切り替わる', async () => {
      const user = userEvent.setup();

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const touchModeButton = screen.getByRole('button', { name: /editor.touchMode/i });
      await user.click(touchModeButton);

      expect(mockSetTouchMode).toHaveBeenCalledWith(true);
    });
  });

  describe('ダイアログ表示', () => {
    it('EditAliasボタンクリックでAliasDialogが表示される', async () => {
      const user = userEvent.setup();

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const editAliasButton = screen.getByRole('button', { name: /editor.editAlias/i });
      await user.click(editAliasButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('recordがnullの場合、EditAliasボタンがdisabledになる', () => {
      useOtoProjectStore.setState({ record: null });

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const editAliasButton = screen.getByRole('button', { name: /editor.editAlias/i });
      expect(editAliasButton).toBeDisabled();
    });

    it('ShowTableボタンクリックでTableDialogが表示される', async () => {
      const user = userEvent.setup();

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const showTableButton = screen.getByRole('button', { name: /editor.showTable/i });
      await user.click(showTableButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('状態初期化', () => {
    it('otoがnullの場合、全indexが0にリセットされる', () => {
      useOtoProjectStore.setState({ oto: null });

      const { rerender } = render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      // PrevAliasButtonとNextAliasButtonがdisabledになることで確認
      const prevButton = screen.getByRole('button', { name: /editor.prev/i });
      const nextButton = screen.getByRole('button', { name: /editor.next/i });
      
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('recordがnullの場合、EditAliasボタンがdisabledになる', () => {
      useOtoProjectStore.setState({ record: null });

      render(
        <EditorButtonArea
          windowWidth={1920}
          windowHeight={1080}
          setButtonAreaHeight={mockSetButtonAreaHeight}
          pixelPerMsec={10}
          setPixelPerMsec={mockSetPixelPerMsec}
          setUpdateSignal={mockSetUpdateSignal}
          progress={false}
        />
      );

      const editAliasButton = screen.getByRole('button', { name: /editor.editAlias/i });
      expect(editAliasButton).toBeDisabled();
    });
  });
});