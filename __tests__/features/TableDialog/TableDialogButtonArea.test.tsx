import { describe, it, vi, expect, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import {
  ProcessBatch,
  TableDialogButtonArea,
} from "../../../src/features/TableDialog/TableDialogButtonArea";
import { Oto } from "utauoto";
import JSZip from "jszip";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { LOG } from "../../../src/lib/Logging";

// ダミーBatchProcess
const dummyEndPoint = vi.fn();
const batchList = [
  {
    description: "dummy",
    endPoint: dummyEndPoint,
  },
  //requireStringのケース
  {
    description: "dummy2",
    endPoint: dummyEndPoint,
    requireString: true,
  },
  //requireStringとrequireNumberのケース
  {
    description: "dummy3",
    endPoint: dummyEndPoint,
    requireString: true,
    requireNumber: true,
  },
  //requireNumberとrequireTargetのケース
  {
    description: "dummy4",
    endPoint: dummyEndPoint,
    requireNumber: true,
    requireTarget: true,
  },
  //requireZipのケース
  {
    description: "dummy5",
    endPoint: dummyEndPoint,
    requireZip: true,
  },
];

describe("ProcessBatch", () => {
  let oto: Oto;
  const targetDir: string = "A3";
  const value: number = 0;
  const zipFileName: string = "dummy.zip";
  let setUpdateSignal: ReturnType<typeof vi.fn>;
  let setBarOpen: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    oto = new Oto();
    oto.ParseOto(targetDir, `CV.wav=a,10,2,300,45,5`);
    setUpdateSignal = vi.fn();
    setBarOpen = vi.fn();
  });

  it("paramがnullならendPoint(oto, targetDir)が呼ばれる", () => {
    ProcessBatch(
      null,
      oto,
      targetDir,
      batchList,
      0,
      value,
      zipFileName,
      setUpdateSignal,
      setBarOpen
    );
    expect(dummyEndPoint).toHaveBeenCalledWith(oto, targetDir);
    expect(setUpdateSignal).toHaveBeenCalled();
    expect(setBarOpen).toHaveBeenCalledWith(true);
  });

  it("paramにstringが渡される場合、endPoint(oto, targetDir, param)が呼ばれる", () => {
    const surfix = "_test";
    ProcessBatch(
      surfix,
      oto,
      targetDir,
      batchList,
      1,
      value,
      zipFileName,
      setUpdateSignal,
      setBarOpen
    );
    expect(dummyEndPoint).toHaveBeenCalledWith(oto, targetDir, surfix);
    expect(setUpdateSignal).toHaveBeenCalled();
    expect(setBarOpen).toHaveBeenCalledWith(true);
  });
  it("paramにstringが渡され、numberが渡される場合、endPoint(oto, targetDir, param, value)が呼ばれる", () => {
    const surfix = "_test";
    ProcessBatch(
      surfix,
      oto,
      targetDir,
      batchList,
      2,
      value,
      zipFileName,
      setUpdateSignal,
      setBarOpen
    );
    expect(dummyEndPoint).toHaveBeenCalledWith(oto, targetDir, surfix, value);
    expect(setUpdateSignal).toHaveBeenCalled();
    expect(setBarOpen).toHaveBeenCalledWith(true);
  });
  it("paramにtargetが渡され、numberが渡される場合、endPoint(oto, targetDir, param, value)が呼ばれる", () => {
    const targetParam = "offset";
    ProcessBatch(
      targetParam,
      oto,
      targetDir,
      batchList,
      3,
      value,
      zipFileName,
      setUpdateSignal,
      setBarOpen
    );
    expect(dummyEndPoint).toHaveBeenCalledWith(
      oto,
      targetDir,
      targetParam,
      value
    );
    expect(setUpdateSignal).toHaveBeenCalled();
    expect(setBarOpen).toHaveBeenCalledWith(true);
  });
  it("paramにzipが渡される場合、endPoint(oto, targetDir, param)が呼ばれる", () => {
    const zip = new JSZip();
    ProcessBatch(
      zip.files,
      oto,
      targetDir,
      batchList,
      1,
      value,
      zipFileName,
      setUpdateSignal,
      setBarOpen
    );
    expect(dummyEndPoint).toHaveBeenCalledWith(oto, targetDir, zip.files);
    expect(setUpdateSignal).toHaveBeenCalled();
    expect(setBarOpen).toHaveBeenCalledWith(true);
  });
});

describe("TableDialogButtonArea", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const oto = new Oto();
    oto.ParseOto(
      "A3",
      "CV.wav=あ,1,2,-3,4,5\r\nCV.wav=* い,6,7,-8,9,10\r\n_VCV.wav=a う,11,12,-13,14,15"
    );
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");
    useOtoProjectStore.getState().setZipFileName("dummy.zip");
    useOtoProjectStore.getState().setReadZip(new JSZip().files);

    // getBatchListをモック化
    vi.mock("../../../src/config/batchList", () => ({
      getBatchList: () => batchList,
    }));
    LOG.clear();
  });

  it("useMemoの確認:batchListが設定ファイルに基づいた値になっていることをUIを使って確認する", async () => {
    const setDialogOpenSpy = vi.fn();
    const setUpdateSignalSpy = vi.fn();
    render(
      <TableDialogButtonArea
        setDialogOpen={setDialogOpenSpy}
        setUpdateSignal={setUpdateSignalSpy}
      />
    );
    // accordion table-dialog-accordionが表示されていることを確認
    expect(screen.getByTestId("table-dialog-accordion")).toBeInTheDocument();

    // accordionを開く
    fireEvent.click(
      screen.getByTestId("table-dialog-accordion").querySelector("button")!
    );

    // "table-dialog-batch-select"が表示されることをwaitforで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-batch-select")
      ).toBeInTheDocument();
    });

    // "table-dialog-batch-select"のオプションがbatchListの内容になっていることを確認
    const select = screen.getByTestId("table-dialog-batch-select");
    const combobox = select.querySelector('[role="combobox"]');
    expect(combobox).toHaveTextContent("dummy");

    // dummyはstringもtargetもnumberも不要なので、各テキストボックスが描画されていないことを確認する。
    expect(
      screen.queryByTestId("table-dialog-surfix-input")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("table-dialog-number-input")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("table-dialog-target-select")
    ).not.toBeInTheDocument();
  });

  it("OnBatchProcessChangeの確認:dummy2を選択した場合、string入力欄が表示されることを確認", async () => {
    const setDialogOpenSpy = vi.fn();
    const setUpdateSignalSpy = vi.fn();
    render(
      <TableDialogButtonArea
        setDialogOpen={setDialogOpenSpy}
        setUpdateSignal={setUpdateSignalSpy}
      />
    );
    // accordion table-dialog-accordionが表示されていることを確認
    expect(screen.getByTestId("table-dialog-accordion")).toBeInTheDocument();

    // accordionを開く
    fireEvent.click(
      screen.getByTestId("table-dialog-accordion").querySelector("button")!
    );

    // "table-dialog-batch-select"が表示されることをwaitforで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-batch-select")
      ).toBeInTheDocument();
    });
    // "dummy2"を選択
    const select = screen.getByTestId("table-dialog-batch-select");
    // 選択表示部を直接取得
    const displayDiv = select.querySelector(
      'div[aria-haspopup="listbox"][tabindex="0"]'
    );
    expect(displayDiv).toHaveTextContent("dummy");

    // メニューを開く
    fireEvent.mouseDown(displayDiv!);

    // "dummy2"のMenuItemを選択
    const dummy2Option = screen.getByText("dummy2");
    fireEvent.click(dummy2Option);

    // string入力欄が表示されることをwaitForで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-surfix-input")
      ).toBeInTheDocument();
    });

    // targetとnumberは表示されていないことを確認
    expect(
      screen.queryByTestId("table-dialog-number-input")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("table-dialog-target-select")
    ).not.toBeInTheDocument();
  });

  it("OnBatchProcessChangeの確認:dummy3を選択した場合、stringとnumber入力欄が表示されることを確認", async () => {
    const setDialogOpenSpy = vi.fn();
    const setUpdateSignalSpy = vi.fn();
    render(
      <TableDialogButtonArea
        setDialogOpen={setDialogOpenSpy}
        setUpdateSignal={setUpdateSignalSpy}
      />
    );
    // accordion table-dialog-accordionが表示されていることを確認
    expect(screen.getByTestId("table-dialog-accordion")).toBeInTheDocument();

    // accordionを開く
    fireEvent.click(
      screen.getByTestId("table-dialog-accordion").querySelector("button")!
    );

    // "table-dialog-batch-select"が表示されることをwaitforで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-batch-select")
      ).toBeInTheDocument();
    });
    // "dummy2"を選択
    const select = screen.getByTestId("table-dialog-batch-select");
    // 選択表示部を直接取得
    const displayDiv = select.querySelector(
      'div[aria-haspopup="listbox"][tabindex="0"]'
    );
    expect(displayDiv).toHaveTextContent("dummy");

    // メニューを開く
    fireEvent.mouseDown(displayDiv!);

    // "dummy3"のMenuItemを選択
    const dummy3Option = screen.getByText("dummy3");
    fireEvent.click(dummy3Option);

    // stringとnumber入力欄が表示されることをwaitForで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-surfix-input")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("table-dialog-number-input")
      ).toBeInTheDocument();
    });

    // targetは表示されていないことを確認
    expect(
      screen.queryByTestId("table-dialog-target-select")
    ).not.toBeInTheDocument();
  });

  it("OnBatchProcessChangeの確認:dummy4を選択した場合、targetとnumber入力欄が表示されることを確認", async () => {
    const setDialogOpenSpy = vi.fn();
    const setUpdateSignalSpy = vi.fn();
    render(
      <TableDialogButtonArea
        setDialogOpen={setDialogOpenSpy}
        setUpdateSignal={setUpdateSignalSpy}
      />
    );
    // accordion table-dialog-accordionが表示されていることを確認
    expect(screen.getByTestId("table-dialog-accordion")).toBeInTheDocument();

    // accordionを開く
    fireEvent.click(
      screen.getByTestId("table-dialog-accordion").querySelector("button")!
    );

    // "table-dialog-batch-select"が表示されることをwaitforで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-batch-select")
      ).toBeInTheDocument();
    });
    // "dummy2"を選択
    const select = screen.getByTestId("table-dialog-batch-select");
    // 選択表示部を直接取得
    const displayDiv = select.querySelector(
      'div[aria-haspopup="listbox"][tabindex="0"]'
    );
    expect(displayDiv).toHaveTextContent("dummy");

    // メニューを開く
    fireEvent.mouseDown(displayDiv!);

    // "dummy4"のMenuItemを選択
    const dummy4Option = screen.getByText("dummy4");
    fireEvent.click(dummy4Option);

    // targetとnumber入力欄が表示されることをwaitForで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-target-select")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("table-dialog-number-input")
      ).toBeInTheDocument();
    });

    // stringは表示されていないことを確認
    expect(
      screen.queryByTestId("table-dialog-surfix-input")
    ).not.toBeInTheDocument();
  });

  it("OnSubmitClickの確認:param===nullのケース", async () => {
    const setDialogOpenSpy = vi.fn();
    const setUpdateSignalSpy = vi.fn();
    render(
      <TableDialogButtonArea
        setDialogOpen={setDialogOpenSpy}
        setUpdateSignal={setUpdateSignalSpy}
      />
    );
    // accordion table-dialog-accordionが表示されていることを確認
    expect(screen.getByTestId("table-dialog-accordion")).toBeInTheDocument();

    // accordionを開く
    fireEvent.click(
      screen.getByTestId("table-dialog-accordion").querySelector("button")!
    );

    // "table-dialog-batch-select"が表示されることをwaitforで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-batch-select")
      ).toBeInTheDocument();
    });

    // "table-dialog-batch-select"のオプションがbatchListの内容になっていることを確認
    const select = screen.getByTestId("table-dialog-batch-select");
    const combobox = select.querySelector('[role="combobox"]');
    expect(combobox).toHaveTextContent("dummy");

    // 実行ボタンをクリック
    const subimitButton = screen.getByTestId("table-dialog-submit-button");
    fireEvent.click(subimitButton);

    // setUpdateSignalが呼ばれていることを確認
    expect(setUpdateSignalSpy).toHaveBeenCalled();
  });

  it("OnSubmitClickの確認:paramがstringのケース", async () => {
    const setDialogOpenSpy = vi.fn();
    const setUpdateSignalSpy = vi.fn();
    render(
      <TableDialogButtonArea
        setDialogOpen={setDialogOpenSpy}
        setUpdateSignal={setUpdateSignalSpy}
      />
    );
    // accordion table-dialog-accordionが表示されていることを確認
    expect(screen.getByTestId("table-dialog-accordion")).toBeInTheDocument();

    // accordionを開く
    fireEvent.click(
      screen.getByTestId("table-dialog-accordion").querySelector("button")!
    );

    // "table-dialog-batch-select"が表示されることをwaitforで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-batch-select")
      ).toBeInTheDocument();
    });

    // "dummy2"を選択
    const select = screen.getByTestId("table-dialog-batch-select");
    // 選択表示部を直接取得
    const displayDiv = select.querySelector(
      'div[aria-haspopup="listbox"][tabindex="0"]'
    );
    expect(displayDiv).toHaveTextContent("dummy");

    // メニューを開く
    fireEvent.mouseDown(displayDiv!);

    // "dummy2"のMenuItemを選択
    const dummy2Option = screen.getByText("dummy2");
    fireEvent.click(dummy2Option);

    // string入力欄が表示されることをwaitForで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-surfix-input")
      ).toBeInTheDocument();
    });

    // suffixに値を入力
    const surfixInput = screen.getByTestId(
      "table-dialog-surfix-input"
    ).querySelector("input");
    fireEvent.change(surfixInput!, { target: { value: "_test" } });


    // LOGで結果を確認するため、実行前にログをクリア
    LOG.clear();
    // 実行ボタンをクリック
    const subimitButton = screen.getByTestId("table-dialog-submit-button");
    fireEvent.click(subimitButton);

    // LOG.datasをjoinしたもののなかに、surfix:_testが含まれていることを確認
    expect(LOG.datas.join("\n")).toContain("surfix:_test");

    // setUpdateSignalが呼ばれていることを確認
    expect(setUpdateSignalSpy).toHaveBeenCalled();
  });

  it("OnSubmitClickの確認:paramがstringでvalueをとるケース", async () => {
    const setDialogOpenSpy = vi.fn();
    const setUpdateSignalSpy = vi.fn();
    render(
      <TableDialogButtonArea
        setDialogOpen={setDialogOpenSpy}
        setUpdateSignal={setUpdateSignalSpy}
      />
    );
    // accordion table-dialog-accordionが表示されていることを確認
    expect(screen.getByTestId("table-dialog-accordion")).toBeInTheDocument();

    // accordionを開く
    fireEvent.click(
      screen.getByTestId("table-dialog-accordion").querySelector("button")!
    );

    // "table-dialog-batch-select"が表示されることをwaitforで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-batch-select")
      ).toBeInTheDocument();
    });

    // "dummy3"を選択
    const select = screen.getByTestId("table-dialog-batch-select");
    // 選択表示部を直接取得
    const displayDiv = select.querySelector(
      'div[aria-haspopup="listbox"][tabindex="0"]'
    );
    expect(displayDiv).toHaveTextContent("dummy");

    // メニューを開く
    fireEvent.mouseDown(displayDiv!);

    // "dummy3"のMenuItemを選択
    const dummy2Option = screen.getByText("dummy3");
    fireEvent.click(dummy2Option);

    // string入力欄が表示されることをwaitForで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-surfix-input")
      ).toBeInTheDocument();
    });

    // suffixに値を入力
    const surfixInput = screen.getByTestId(
      "table-dialog-surfix-input"
    ).querySelector("input");
    fireEvent.change(surfixInput!, { target: { value: "_test" } });

    // numberに値を入力
    const numberInput = screen.getByTestId(
      "table-dialog-number-input"
    ).querySelector("input");
    fireEvent.change(numberInput!, { target: { value: 123 } });


    // LOGで結果を確認するため、実行前にログをクリア
    LOG.clear();
    // 実行ボタンをクリック
    const subimitButton = screen.getByTestId("table-dialog-submit-button");
    fireEvent.click(subimitButton);

    // LOG.datasをjoinしたもののなかに、surfix:_testが含まれていることを確認
    expect(LOG.datas.join("\n")).toContain("surfix:_test");
    // LOG.datasをjoinしたもののなかに、value:123が含まれていることを確認
    expect(LOG.datas.join("\n")).toContain("value:123");

    // setUpdateSignalが呼ばれていることを確認
    expect(setUpdateSignalSpy).toHaveBeenCalled();
  });

  it("OnSubmitClickの確認:paramがtargetParamでvalueをとるケース", async () => {
    const setDialogOpenSpy = vi.fn();
    const setUpdateSignalSpy = vi.fn();
    render(
      <TableDialogButtonArea
        setDialogOpen={setDialogOpenSpy}
        setUpdateSignal={setUpdateSignalSpy}
      />
    );
    // accordion table-dialog-accordionが表示されていることを確認
    expect(screen.getByTestId("table-dialog-accordion")).toBeInTheDocument();

    // accordionを開く
    fireEvent.click(
      screen.getByTestId("table-dialog-accordion").querySelector("button")!
    );

    // "table-dialog-batch-select"が表示されることをwaitforで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-batch-select")
      ).toBeInTheDocument();
    });

    // "dummy4"を選択
    const select = screen.getByTestId("table-dialog-batch-select");
    // 選択表示部を直接取得
    const displayDiv = select.querySelector(
      'div[aria-haspopup="listbox"][tabindex="0"]'
    );
    expect(displayDiv).toHaveTextContent("dummy");

    // メニューを開く
    fireEvent.mouseDown(displayDiv!);

    // "dummy4"のMenuItemを選択
    const dummy4Option = screen.getByText("dummy4");
    fireEvent.click(dummy4Option);

    // targetとnumber入力欄が表示されることをwaitForで確認
    await waitFor(() => {
      expect(
        screen.getByTestId("table-dialog-target-select")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("table-dialog-number-input")
      ).toBeInTheDocument();
    });

    // numberに値を入力
    const numberInput = screen.getByTestId(
      "table-dialog-number-input"
    ).querySelector("input");
    fireEvent.change(numberInput!, { target: { value: 123 } });

    // targetParamを選択
    const targetSelect = screen.getByTestId("table-dialog-target-select");
    const targetDisplayDiv = targetSelect.querySelector(
      'div[aria-haspopup="listbox"][tabindex="0"]'
    );
    fireEvent.mouseDown(targetDisplayDiv!);
    // "dummy4"のMenuItemを選択
    const blankOption = screen.getByText("oto.blank");
    fireEvent.click(blankOption);


    // LOGで結果を確認するため、実行前にログをクリア
    LOG.clear();
    // 実行ボタンをクリック
    const subimitButton = screen.getByTestId("table-dialog-submit-button");
    fireEvent.click(subimitButton);

    // LOG.datasをjoinしたもののなかに、targetParam:blankが含まれていることを確認
    expect(LOG.datas.join("\n")).toContain("targetParam:blank");
    // LOG.datasをjoinしたもののなかに、value:123が含まれていることを確認
    expect(LOG.datas.join("\n")).toContain("value:123");

    // setUpdateSignalが呼ばれていることを確認
    expect(setUpdateSignalSpy).toHaveBeenCalled();
  });
});
