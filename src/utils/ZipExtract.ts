import JSZip from "jszip";
import { LOG } from "../lib/Logging";

/**
 * zipファイルを再帰呼出しで生成する。
 * @param files zip内のファイル一覧
 * @param index 読み込むファイルのインデックス
 * @param newZip 新しく生成するzip
 * @returns Promise<JSZip> 完成したzipオブジェクト
 */
export const ZipExtract = async (
  files: { [key: string]: JSZip.JSZipObject },
  index: number,
  newZip: JSZip
): Promise<JSZip> => {
  const k = Object.keys(files)[index];
  const result = await files[k].async("arraybuffer");
  newZip.file(k, result);

  if (index < Object.keys(files).length - 1) {
    return ZipExtract(files, index + 1, newZip);
  } else {
    LOG.debug("元zipの複製完了", "ZipExtract");
    return newZip;
  }
};