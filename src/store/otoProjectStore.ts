import JSZip from "jszip";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";
import { create } from "zustand";

interface OtoProjectStore {
  oto: Oto | null;
  setOto: (oto: Oto | null) => void;
  record: OtoRecord | null;
  setRecord: (record: OtoRecord | null) => void;
  targetDir: string | null;
  setTargetDir: (targetDir: string | null) => void;
  targetDirs: Array<string> | null;
  setTargetDirs: (targetDirs: Array<string> | null) => void;
  wavFileName: string | null;
  setWavFileName: (wavFileName: string | null) => void;
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  setReadZip: (readZip: { [key: string]: JSZip.JSZipObject } | null) => void;
  zipFileName: string;
  setZipFileName: (zipFileName: string) => void;
  wav: Wave | null;
  setWav: (wav: Wave | null) => void;
}

export const useOtoProjectStore = create<OtoProjectStore>()((set) => ({
  oto: null,
  setOto: (oto) => set({ oto }),
  record: null,
  setRecord: (record) => set({ record }),
  targetDir: null,
  setTargetDir: (targetDir) => set({ targetDir }),
  targetDirs: null,
  setTargetDirs: (targetDirs) => set({ targetDirs }),
  wavFileName: null,
  setWavFileName: (wavFileName) => set({ wavFileName }),
  readZip: null,
  setReadZip: (readZip) => set({ readZip }),
  zipFileName: "",
  setZipFileName: (zipFileName) => set({ zipFileName }),
  wav: null,
  setWav: (wav) => set({ wav }),
}));
