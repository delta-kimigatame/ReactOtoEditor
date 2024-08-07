import { MakeOtoTempIni } from "./Interface";
import { ParseIni } from "./Input";

const cvs = [
  "あ",
  "い",
  "う",
  "え",
  "お",
  "ん",
  "息",
  "吸",
  "ch",
  "ち",
  "ちぇ",
  "ちゃ",
  "ちゅ",
  "ちょ",
  "gy",
  "ぎ",
  "ぎぇ",
  "ぎゃ",
  "ぎゅ",
  "ぎょ",
  "ts",
  "つ",
  "つぁ",
  "つぃ",
  "つぇ",
  "つぉ",
  "ty",
  "てぃ",
  "てぇ",
  "てゃ",
  "てゅ",
  "てょ",
  "py",
  "ぴ",
  "ぴぇ",
  "ぴゃ",
  "ぴゅ",
  "ぴょ",
  "ry",
  "り",
  "りぇ",
  "りゃ",
  "りゅ",
  "りょ",
  "ny",
  "に",
  "にぇ",
  "にゃ",
  "にゅ",
  "にょ",
  "r",
  "ら",
  "る",
  "れ",
  "ろ",
  "hy",
  "ひ",
  "ひぇ",
  "ひゃ",
  "ひゅ",
  "ひょ",
  "dy",
  "でぃ",
  "でぇ",
  "でゃ",
  "でゅ",
  "でょ",
  "by",
  "び",
  "びぇ",
  "びゃ",
  "びゅ",
  "びょ",
  "b",
  "ば",
  "ぶ",
  "べ",
  "ぼ",
  "d",
  "だ",
  "で",
  "ど",
  "どぅ",
  "g",
  "が",
  "ぐ",
  "げ",
  "ご",
  "f",
  "ふ",
  "ふぁ",
  "ふぃ",
  "ふぇ",
  "ふぉ",
  "h",
  "は",
  "へ",
  "ほ",
  "k",
  "か",
  "く",
  "け",
  "こ",
  "j",
  "じ",
  "じぇ",
  "じゃ",
  "じゅ",
  "じょ",
  "m",
  "ま",
  "む",
  "め",
  "も",
  "n",
  "な",
  "ぬ",
  "ね",
  "の",
  "p",
  "ぱ",
  "ぷ",
  "ぺ",
  "ぽ",
  "s",
  "さ",
  "す",
  "すぃ",
  "せ",
  "そ",
  "sh",
  "し",
  "しぇ",
  "しゃ",
  "しゅ",
  "しょ",
  "t",
  "た",
  "て",
  "と",
  "とぅ",
  "w",
  "うぃ",
  "うぅ",
  "うぇ",
  "うぉ",
  "わ",
  "を",
  "v",
  "ヴ",
  "ヴぁ",
  "ヴぃ",
  "ヴぅ",
  "ヴぇ",
  "ヴぉ",
  "y",
  "いぃ",
  "いぇ",
  "や",
  "ゆ",
  "よ",
  "ゐ",
  "ゑ",
  "ky",
  "き",
  "きぇ",
  "きゃ",
  "きゅ",
  "きょ",
  "z",
  "ざ",
  "ず",
  "ずぃ",
  "ぜ",
  "ぞ",
  "my",
  "み",
  "みぇ",
  "みゃ",
  "みゅ",
  "みょ",
  "ガ",
  "グ",
  "ゲ",
  "ゴ",
  "ギャ",
  "ギ",
  "ギュ",
  "ギェ",
  "ギョ",
];

const vowelString =
  "[VOWEL]\n" +
  "a=ぁ,あ,か,が,さ,ざ,た,だ,な,は,ば,ぱ,ま,ゃ,や,ら,わ,ァ,ア,カ,ガ,サ,ザ,タ,ダ,ナ,ハ,バ,パ,マ,ャ,ヤ,ラ,ワ\n" +
  "e=ぇ,え,け,げ,せ,ぜ,て,で,ね,へ,べ,ぺ,め,れ,ゑ,ェ,エ,ケ,ゲ,セ,ゼ,テ,デ,ネ,ヘ,ベ,ペ,メ,レ,ヱ\n" +
  "i=ぃ,い,き,ぎ,し,じ,ち,ぢ,に,ひ,び,ぴ,み,り,ゐ,ィ,イ,キ,ギ,シ,ジ,チ,ヂ,ニ,ヒ,ビ,ピ,ミ,リ,ヰ\n" +
  "o=ぉ,お,こ,ご,そ,ぞ,と,ど,の,ほ,ぼ,ぽ,も,ょ,よ,ろ,を,ォ,オ,コ,ゴ,ソ,ゾ,ト,ド,ノ,ホ,ボ,ポ,モ,ョ,ヨ,ロ,ヲ\n" +
  "u=ぅ,う,く,ぐ,す,ず,つ,づ,ぬ,ふ,ぶ,ぷ,む,ゅ,ゆ,る,ゥ,ウ,ク,グ,ス,ズ,ツ,ヅ,ヌ,フ,ブ,プ,ム,ュ,ユ,ル,ヴ\n" +
  "n=ん,ン\n";

const consonantString =
  "[CONSONANT]\n" +
  "=あ,い,う,え,お,ん,息,吸=0\n" +
  "ch=ch,ち,ちぇ,ちゃ,ちゅ,ちょ=150\n" +
  "gy=gy,ぎ,ぎぇ,ぎゃ,ぎゅ,ぎょ=60\n" +
  "ts=ts,つ,つぁ,つぃ,つぇ,つぉ=170\n" +
  "ty=ty,てぃ,てぇ,てゃ,てゅ,てょ=75\n" +
  "py=py,ぴ,ぴぇ,ぴゃ,ぴゅ,ぴょ=100\n" +
  "ry=ry,り,りぇ,りゃ,りゅ,りょ=70\n" +
  "ny=ny,に,にぇ,にゃ,にゅ,にょ=70\n" +
  "r=r,ら,る,れ,ろ=70\n" +
  "hy=hy,ひ,ひぇ,ひゃ,ひゅ,ひょ=100\n" +
  "dy=dy,でぃ,でぇ,でゃ,でゅ,でょ=75\n" +
  "by=by,び,びぇ,びゃ,びゅ,びょ=45\n" +
  "b=b,ば,ぶ,べ,ぼ=50\n" +
  "d=d,だ,で,ど,どぅ=60\n" +
  "g=g,が,ぐ,げ,ご=80\n" +
  "f=f,ふ,ふぁ,ふぃ,ふぇ,ふぉ=130\n" +
  "h=h,は,へ,ほ=110\n" +
  "k=k,か,く,け,こ=100\n" +
  "j=j,じ,じぇ,じゃ,じゅ,じょ=110\n" +
  "m=m,ま,む,め,も=75\n" +
  "n=n,な,ぬ,ね,の=70\n" +
  "p=p,ぱ,ぷ,ぺ,ぽ=100\n" +
  "s=s,さ,す,すぃ,せ,そ=150\n" +
  "sh=sh,し,しぇ,しゃ,しゅ,しょ=200\n" +
  "t=t,た,て,と,とぅ=100\n" +
  "w=w,うぃ,うぅ,うぇ,うぉ,わ,を=50\n" +
  "v=v,ヴ,ヴぁ,ヴぃ,ヴぅ,ヴぇ,ヴぉ=100\n" +
  "y=y,いぃ,いぇ,や,ゆ,よ,ゐ,ゑ=30\n" +
  "ky=ky,き,きぇ,きゃ,きゅ,きょ=130\n" +
  "z=z,ざ,ず,ずぃ,ぜ,ぞ=80\n" +
  "my=my,み,みぇ,みゃ,みゅ,みょ=60\n" +
  "ng=ガ,グ,ゲ,ゴ=50\n" +
  "ngy=ギャ,ギ,ギュ,ギェ,ギョ=40\n" +
  "・=・あ,・い,・う,・え,・お,・ん=50\n";

export const MakeJpCv = (): MakeOtoTempIni => {
  const ini = ParseIni(consonantString);
  ini.noVCV = true;
  ini.beginingCv = false;
  ini.noHead = false;
  const vowel = {};
  const consonant = {};
  cvs.forEach((cv) => {
    vowel[cv] = "-";
  });
  ini.vowel = vowel;
  return ini;
};

export const MakeJpVCV = (): MakeOtoTempIni => {
  const ini = ParseIni(vowelString);
  ini.noVCV = false;
  ini.beginingCv = true;
  ini.noHead = false;
  const consonant = {};
  cvs.forEach((cv) => {
    consonant[cv] = { consonant: "", length: 0 };
  });
  ini.consonant = consonant;
  return ini;
};

export const MakeJpCVVC = (): MakeOtoTempIni => {
    const ini = ParseIni(vowelString+consonantString);
    ini.noVCV = false;
    ini.beginingCv = false;
    ini.noHead = false;
    return ini;
  };
