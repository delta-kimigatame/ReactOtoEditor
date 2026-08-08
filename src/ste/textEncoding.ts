import * as iconv from "iconv-lite";

export type TextEncoding = "cp932" | "utf-8";

const textDecoderLabels: Record<TextEncoding, string> = {
  cp932: "shift_jis",
  "utf-8": "utf-8",
};

export const decodePlainText = (
  bytes: ArrayBuffer | Uint8Array,
  encoding: TextEncoding
): string => new TextDecoder(textDecoderLabels[encoding]).decode(bytes);

export const toCrLf = (text: string): string =>
  text.replace(/\r\n|\r|\n/g, "\r\n");

export const encodeCp932 = (text: string): Uint8Array =>
  iconv.encode(toCrLf(text), "CP932");

export const copyToArrayBuffer = (bytes: Uint8Array): Uint8Array<ArrayBuffer> =>
  Uint8Array.from(bytes);