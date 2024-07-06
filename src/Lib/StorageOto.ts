import { Oto } from "utauoto";

/**
 * localStorageのoto.iniを読み込む
 * @returns localStorageのoto
 */
export const GetStorageOto = (): {} => {
  const storagedOto_: string | null = localStorage.getItem("oto");
  const storagedOto: {} = storagedOto_ === null ? {} : JSON.parse(storagedOto_);
  return storagedOto;
};

/**
 * localStorageにoto.iniを書き込む
 * @param storagedOto 現在のstoragedOto
 * @param oto 書き込むoto.ini
 * @param zipFileName ファイル名
 * @param targetDir 原音設定中のフォルダ
 */
export const SaveStorageOto = (
  storagedOto: {},
  oto: Oto,
  zipFileName: string,
  targetDir: string
) => {
  if (!(zipFileName in storagedOto)) {
    storagedOto[zipFileName] = {};
  }
  storagedOto[zipFileName][targetDir] = {
    oto: oto.GetLines()[targetDir].join("\r\n"),
    update_date: new Date().toJSON(),
  };
  try {
    localStorage.setItem("oto", JSON.stringify(storagedOto));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.log("localStorageの容量が不足しています。");
    }else{
        console.log("未知のエラーでlocalStorageに書き込みできませんでした。")
    }
  }
};
