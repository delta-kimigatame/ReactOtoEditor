import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOtoProjectStore } from "../../src/store/otoProjectStore";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";
import { GetStorageOto, SaveStorageOto } from "../../src/services/StorageOto";



describe("otoProjectStore", () => {
  beforeEach(() => {
    // ストアの状態をリセット
    useOtoProjectStore.setState({
      oto: null,
      record: null,
      targetDir: null,
      wavFileName: null,
      targetDirs: null,
      readZip: null,
      zipFileName: "",
      wav: null,
    });
    vi.clearAllMocks();
    vi.mock("../../src/services/StorageOto", () => ({
        GetStorageOto: vi.fn().mockReturnValue({}),
        SaveStorageOto: vi.fn(),
      }));
      
      vi.mock("utauwav", () => ({
        Wave: vi.fn().mockImplementation(() => ({
          RemoveDCOffset: vi.fn(),
          VolumeNormalize: vi.fn(),
        })),
      }));
  });

  it("setOto: oto を設定し、初期状態を更新する", () => {
    const mockOto = {
      GetFileNames: vi.fn().mockReturnValue(["test.wav"]),
      GetAliases: vi.fn().mockReturnValue(["alias"]),
      GetRecord: vi.fn().mockReturnValue({ filename: "test.wav" } as OtoRecord),
    } as unknown as Oto;
    useOtoProjectStore.getState().setTargetDir("testDir");
    useOtoProjectStore.getState().setOto(mockOto);

    const state = useOtoProjectStore.getState();
    expect(state.oto).toBe(mockOto);
    expect(state.wavFileName).toBe("test.wav");
    expect(state.record).toEqual({ filename: "test.wav" });
  });

  it("setOto: otoがnullの場合、wavFileNamerとrecordもnullになる", () => {
    useOtoProjectStore.getState().setTargetDir("testDir");
    useOtoProjectStore.getState().setRecord({ filename: "test2.wav" } as OtoRecord);
    useOtoProjectStore.getState().setWavFileName("test2.wav");
    useOtoProjectStore.getState().setOto(null);

    const state = useOtoProjectStore.getState();
    expect(state.oto).toBe(null);
    expect(state.wavFileName).toBe(null);
    expect(state.record).toEqual(null);
  });

  it("setOto: targetDirがnullの場合、otoを更新してもwavbFileNameとrecordは更新されない。", () => {
    const mockOto = {
      GetFileNames: vi.fn().mockReturnValue(["test.wav"]),
      GetAliases: vi.fn().mockReturnValue(["alias"]),
      GetRecord: vi.fn().mockReturnValue({ filename: "test.wav" } as OtoRecord),
    } as unknown as Oto;
    useOtoProjectStore.getState().setTargetDir(null);
    useOtoProjectStore.getState().setRecord({ filename: "test2.wav" } as OtoRecord);
    useOtoProjectStore.getState().setWavFileName("test2.wav");
    useOtoProjectStore.getState().setOto(mockOto);

    const state = useOtoProjectStore.getState();
    expect(state.oto).toBe(mockOto);
    expect(state.wavFileName).toBe("test2.wav");
    expect(state.record).toEqual({ filename: "test2.wav" });
  });

  it("setRecord: record を設定し、localStorage に保存する", () => {
    const mockRecord = { filename: "test.wav" } as OtoRecord;
    const mockOto = {
      GetLines: vi.fn().mockReturnValue({
        testDir: ["line1", "line2"],
      }),
    } as unknown as Oto;

    useOtoProjectStore.setState({
      oto: mockOto,
      zipFileName: "testZip",
      targetDir: "testDir",
    });

    useOtoProjectStore.getState().setRecord(mockRecord);

    const state = useOtoProjectStore.getState();
    expect(state.record).toBe(mockRecord);
    expect(state.wavFileName).toBe("test.wav");
    expect(SaveStorageOto).toHaveBeenCalledWith(
      expect.any(Object),
      mockOto,
      "testZip",
      "testDir"
    );
  });

  it("setRecord: record をnullに設定し、wavFileNameを初期化する", () => {
    // 初期状態を設定
    useOtoProjectStore.setState({
      record: { filename: "test.wav" } as OtoRecord,
      wavFileName: "test.wav",
    });
  
    // record を null に設定
    useOtoProjectStore.getState().setRecord(null);
  
    // ストアの状態を確認
    const state = useOtoProjectStore.getState();
    expect(state.record).toBeNull(); // record が null に設定されていることを確認
    expect(state.wavFileName).toBeNull(); // wavFileName が初期化されていることを確認
  });
  
  it("wavFileName が null の場合、wav を初期化する", () => {
    useOtoProjectStore.setState({
      wav: new Wave(new ArrayBuffer(8)),
    });

    useOtoProjectStore.getState().setWavFileName(null);

    const state = useOtoProjectStore.getState();
    expect(state.wavFileName).toBeNull();
    expect(state.wav).toBeNull();
  });

  it("readZip が null の場合、wav を初期化する", () => {
    useOtoProjectStore.setState({
      readZip: null,
    });

    useOtoProjectStore.getState().setWavFileName("test.wav");

    const state = useOtoProjectStore.getState();
    expect(state.wavFileName).toBe("test.wav");
    expect(state.wav).toBeNull();
  });

  it("readZip に wavFileName が存在しない場合、wav を初期化する", () => {
    const mockReadZip = {
      "otherDir/other.wav": {
        async: vi.fn(),
      },
    };

    useOtoProjectStore.setState({
      readZip: mockReadZip,
      targetDir: "testDir",
    });

    useOtoProjectStore.getState().setWavFileName("test.wav");

    const state = useOtoProjectStore.getState();
    expect(state.wavFileName).toBe("test.wav");
    expect(state.wav).toBeNull();
  });

  it("setWavFileName: wavFileName を設定し、Wave を読み込む", async () => {
    const mockReadZip = {
      "testDir/test.wav": {
        async: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      },
    };

    useOtoProjectStore.setState({
      readZip: mockReadZip,
      targetDir: "testDir",
    });

    await useOtoProjectStore.getState().setWavFileName("test.wav");

    const state = useOtoProjectStore.getState();
    expect(state.wavFileName).toBe("test.wav");
    expect(Wave).toHaveBeenCalledWith(expect.any(ArrayBuffer));
  });

  it("setWavFileName: wavFileName が null の場合、wav を初期化する", () => {
    useOtoProjectStore.setState({
      wav: new Wave(new ArrayBuffer(8)),
    });

    useOtoProjectStore.getState().setWavFileName(null);

    const state = useOtoProjectStore.getState();
    expect(state.wavFileName).toBeNull();
    expect(state.wav).toBeNull();
  });

  it("setReadZip: readZip を設定する", () => {
    const mockReadZip = { "test/file": {} };

    useOtoProjectStore.getState().setReadZip(mockReadZip);

    const state = useOtoProjectStore.getState();
    expect(state.readZip).toBe(mockReadZip);
  });

  it("setTargetDir: targetDir を設定する", () => {
    useOtoProjectStore.getState().setTargetDir("testDir");

    const state = useOtoProjectStore.getState();
    expect(state.targetDir).toBe("testDir");
  });

  it("setZipFileName: zipFileName を設定する", () => {
    useOtoProjectStore.getState().setZipFileName("testZip");

    const state = useOtoProjectStore.getState();
    expect(state.zipFileName).toBe("testZip");
  });
});