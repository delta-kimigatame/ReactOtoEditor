import * as React from "react";
import DownloadIcon from "@mui/icons-material/Download";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import RefreshIcon from "@mui/icons-material/Refresh";
import Fab from "@mui/material/Fab";
import GlobalStyles from "@mui/material/GlobalStyles";
import Stack from "@mui/material/Stack";

import {
  copyToArrayBuffer,
  decodePlainText,
  encodeCp932,
  type TextEncoding,
} from "./textEncoding";

const FALLBACK_FILE_NAME = "ste.txt";

const nextEncoding = (encoding: TextEncoding): TextEncoding =>
  encoding === "cp932" ? "utf-8" : "cp932";

export const SteApp: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [fileName, setFileName] = React.useState(FALLBACK_FILE_NAME);
  const [encoding, setEncoding] = React.useState<TextEncoding>("cp932");

  const readFile = React.useCallback(
    async (target: File, targetEncoding: TextEncoding) => {
      const bytes = await target.arrayBuffer();
      setText(decodePlainText(bytes, targetEncoding));
    },
    []
  );

  const handleLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name || FALLBACK_FILE_NAME);
    setEncoding("cp932");
    await readFile(selectedFile, "cp932");
  };

  const handleReload = async () => {
    if (!file) {
      return;
    }

    const targetEncoding = nextEncoding(encoding);
    setEncoding(targetEncoding);
    await readFile(file, targetEncoding);
  };

  const handleDownload = () => {
    const blob = new Blob([copyToArrayBuffer(encodeCp932(text))], {
      type: "text/plain;charset=shift_jis",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <GlobalStyles
        styles={{
          "html, body, #root": { height: "100%", margin: 0 },
        }}
      />
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        style={{
          boxSizing: "border-box",
          display: "block",
          height: "100%",
          margin: 0,
          overflow: "scroll",
          resize: "none",
          width: "100%",
        }}
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{ bottom: 16, position: "fixed", right: 16 }}
      >
        <Fab onClick={() => inputRef.current?.click()} size="medium">
          <FolderOpenIcon />
        </Fab>
        <Fab onClick={handleReload} size="medium">
          <RefreshIcon />
        </Fab>
        <Fab onClick={handleDownload} size="medium">
          <DownloadIcon />
        </Fab>
      </Stack>
      <input
        ref={inputRef}
        accept="text/plain"
        type="file"
        onChange={handleLoad}
        style={{ display: "none" }}
      />
    </>
  );
};