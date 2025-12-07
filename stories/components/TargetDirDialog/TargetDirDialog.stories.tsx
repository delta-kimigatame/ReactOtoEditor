import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import { TargetDirDialog } from "../../../src/components/TargetDirDialog/TargetDirDialog";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import Button from "@mui/material/Button";

const meta = {
  title: "Components/TargetDirDialog/TargetDirDialog",
  component: TargetDirDialog,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TargetDirDialog>;

export default meta;
type Story = StoryObj<typeof TargetDirDialog>;

/**
 * デフォルト表示
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const { setTargetDirs } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([""]);
      return () => {
        setTargetDirs(null);
      };
    }, [setTargetDirs]);

    return (
      <>
        <Button variant="contained" onClick={() => setOpen(true)}>
          ダイアログを開く
        </Button>
        <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />
      </>
    );
  },
};

/**
 * 開いた状態
 */
export const Opened: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const { setTargetDirs } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([""]);
      return () => {
        setTargetDirs(null);
      };
    }, [setTargetDirs]);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};

/**
 * zip内タブを選択した状態
 */
export const ZipTabSelected: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const { setTargetDirs, setTargetDir, setReadZip } = useOtoProjectStore();

    useEffect(() => {
      // サンプルzipを読み込む
      fetch("samples/sjis_CV_jp.zip")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => JSZip.loadAsync(arrayBuffer))
        .then((zip) => {
          setReadZip(zip.files);
          console.log("サンプルzip読み込み完了", zip.files);
          setTargetDirs(["denoise"]);
          // 自動的にルートフォルダを選択
          setTimeout(() => {
            setTargetDir("denoise");
          }, 100);
        });

      return () => {
        setTargetDirs(null);
        setTargetDir(null);
        setReadZip(null);
      };
    }, [setTargetDirs, setTargetDir, setReadZip]);

    // タブを自動選択するためのeffect
    useEffect(() => {
      const selectTab = () => {
        // タブが表示されるまで待機
        const tabs = document.querySelectorAll('[role="tab"]');
        if (tabs.length > 0) {
          // Tab 1（インデックス0）をクリック
          const tab1 = tabs[0] as HTMLElement;
          if (tab1) {
            tab1.click();
          }
        } else {
          // まだタブが表示されていない場合は再試行
          setTimeout(selectTab, 200);
        }
      };

      // 少し待ってからタブを選択
      const timer = setTimeout(selectTab, 500);

      return () => clearTimeout(timer);
    }, []);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};

/**
 * テンプレート読込タブを選択した状態
 */
export const TemplateTabSelected: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const { setTargetDirs, setTargetDir } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([""]);
      // 自動的にルートフォルダを選択
      setTimeout(() => {
        setTargetDir("");
      }, 100);

      return () => {
        setTargetDirs(null);
        setTargetDir(null);
      };
    }, [setTargetDirs, setTargetDir]);

    // タブを自動選択するためのeffect
    useEffect(() => {
      const selectTab = () => {
        // タブが表示されるまで待機
        const tabs = document.querySelectorAll('[role="tab"]');
        if (tabs.length > 2) {
          // Tab 3（インデックス2）をクリック
          const tab3 = tabs[2] as HTMLElement;
          if (tab3) {
            tab3.click();
          }
        } else {
          // まだタブが表示されていない場合は再試行
          setTimeout(selectTab, 200);
        }
      };

      // 少し待ってからタブを選択
      const timer = setTimeout(selectTab, 500);

      return () => clearTimeout(timer);
    }, []);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};

/**
 * 履歴タブを選択した状態
 */
export const StoragedTabSelected: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const { setTargetDirs, setTargetDir } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([""]);
      // 自動的にルートフォルダを選択
      setTimeout(() => {
        setTargetDir("");
      }, 100);

      return () => {
        setTargetDirs(null);
        setTargetDir(null);
      };
    }, [setTargetDirs, setTargetDir]);

    // タブを自動選択するためのeffect
    useEffect(() => {
      const selectTab = () => {
        // タブが表示されるまで待機
        const tabs = document.querySelectorAll('[role="tab"]');
        if (tabs.length > 1) {
          // Tab 2（インデックス1）をクリック
          const tab2 = tabs[1] as HTMLElement;
          if (tab2) {
            tab2.click();
          }
        } else {
          // まだタブが表示されていない場合は再試行
          setTimeout(selectTab, 200);
        }
      };

      // 少し待ってからタブを選択
      const timer = setTimeout(selectTab, 500);

      return () => clearTimeout(timer);
    }, []);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};

/**
 * テンプレートoto.iniが読み込まれた状態
 */
export const TemplateLoaded: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [tabSelected, setTabSelected] = useState(false);
    const { setTargetDirs, setTargetDir } = useOtoProjectStore();

    useEffect(() => {
      setTargetDirs([""]);
      // 自動的にルートフォルダを選択
      setTimeout(() => {
        setTargetDir("");
      }, 100);

      return () => {
        setTargetDirs(null);
        setTargetDir(null);
      };
    }, [setTargetDirs, setTargetDir]);

    // タブを自動選択するeffect
    useEffect(() => {
      const selectTab = () => {
        // タブが表示されるまで待機
        const tabs = document.querySelectorAll('[role="tab"]');
        if (tabs.length > 2) {
          // Tab 3（インデックス2）をクリック
          const tab3 = tabs[2] as HTMLElement;
          if (tab3) {
            tab3.click();
            // タブ選択完了を通知
            setTimeout(() => setTabSelected(true), 100);
          }
        } else {
          // まだタブが表示されていない場合は再試行
          setTimeout(selectTab, 200);
        }
      };

      // 少し待ってからタブ選択を実行
      const timer = setTimeout(selectTab, 500);

      return () => clearTimeout(timer);
    }, []);

    // タブ選択後、ファイルを読み込むeffect
    useEffect(() => {
      if (!tabSelected) return;
      
      let retryCount = 0;
      const maxRetries = 10;
      
      const loadFile = () => {
        try {
          const hiddenInput = document.querySelector(
            '[data-testid="hidden-template-oto-input"]'
          ) as HTMLInputElement;

          if (hiddenInput) {
            // サンプルoto.iniの内容を作成（半角文字のみ）
            const otoContent = `a.wav=a,100,50,-100,80,20
i.wav=i,100,50,-100,80,20
u.wav=u,100,50,-100,80,20
e.wav=e,100,50,-100,80,20
o.wav=o,100,50,-100,80,20`;
            const file = new File([otoContent], "oto.ini", {
              type: "text/plain",
            });

            // FileListのモックを作成
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            
            // 既存のfilesプロパティを削除してから再定義
            try {
              delete (hiddenInput as any).files;
            } catch (e) {
              // 削除できない場合は無視
            }
            
            // hiddenInputのfilesプロパティを設定
            Object.defineProperty(hiddenInput, 'files', {
              value: dataTransfer.files,
              writable: false,
              configurable: true,
            });

            // changeイベントを発火
            const changeEvent = new Event("change", { bubbles: true });
            hiddenInput.dispatchEvent(changeEvent);
          } else if (retryCount < maxRetries) {
            // hiddenInputが見つからない場合は再試行
            retryCount++;
            setTimeout(loadFile, 200);
          }
        } catch (error) {
          console.error("ファイル読込エラー:", error);
        }
      };

      // タブ選択後、少し待ってからファイル読込を実行
      const timer = setTimeout(loadFile, 300);

      return () => {
        clearTimeout(timer);
        retryCount = maxRetries; // クリーンアップ時は再試行を停止
      };
    }, [tabSelected]);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};

/**
 * 生成タブでsingleモードを選択した状態
 */
export const MakeTabSingleSelected: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const { setTargetDirs, setTargetDir, setReadZip } = useOtoProjectStore();

    useEffect(() => {
      // サンプルzipを読み込む
      fetch("samples/sjis_CV_jp.zip")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => JSZip.loadAsync(arrayBuffer))
        .then((zip) => {
          setReadZip(zip.files);
          setTargetDirs(["denoise"]);
          // 自動的にルートフォルダを選択
          setTimeout(() => {
            setTargetDir("denoise");
          }, 100);
        });

      return () => {
        setTargetDirs(null);
        setTargetDir(null);
        setReadZip(null);
      };
    }, [setTargetDirs, setTargetDir, setReadZip]);

    // タブを自動選択し、singleモードを選択するeffect
    useEffect(() => {
      let retryCount = 0;
      const maxRetries = 10;
      
      const selectTabAndMode = () => {
        if (retryCount >= maxRetries) {
          console.log(`[MakeTabSingleSelected] Max retries reached, giving up`);
          return;
        }
        
        // タブが表示されるまで待機
        const tabs = document.querySelectorAll('[role="tab"]');
        
        if (tabs.length > 3) {
          // Tab 4（インデックス3）をクリック
          const tab4 = tabs[3] as HTMLElement;
          
          if (tab4) {
            tab4.click();
            
            // タブ選択後、パネルの表示を待ってからsingleモードを選択
            setTimeout(() => {
              const modeSelectContainer = document.querySelector('[data-testid="mode-select"]') as HTMLElement;
              
              if (modeSelectContainer) {
                // Material-UIのSelectは、内部のinput要素を見つけて変更イベントを発火
                const selectInput = modeSelectContainer.querySelector('input') as HTMLInputElement;
                
                if (selectInput) {
                  // Reactの内部プロパティを使用して値を変更
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value'
                  )?.set;
                  
                  if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(selectInput, 'single');
                    
                    // changeイベントを発火
                    const changeEvent = new Event('change', { bubbles: true });
                    selectInput.dispatchEvent(changeEvent);
                    
                    // inputイベントも発火
                    const inputEvent = new Event('input', { bubbles: true });
                    selectInput.dispatchEvent(inputEvent);
                  }
                } else {
                  // inputが見つからない場合は再試行
                  retryCount++;
                  setTimeout(selectTabAndMode, 200);
                }
              } else {
                // コンテナが見つからない場合は再試行
                retryCount++;
                setTimeout(selectTabAndMode, 200);
              }
            }, 500);
          }
        } else {
          // まだタブが表示されていない場合は再試行
          retryCount++;
          setTimeout(selectTabAndMode, 200);
        }
      };

      // 少し待ってからタブを選択
      const timer = setTimeout(selectTabAndMode, 500);

      return () => {
        clearTimeout(timer);
        retryCount = maxRetries; // クリーンアップ時は再試行を停止
      };
    }, []);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};

/**
 * 生成タブでmultiモードを選択した状態
 */
export const MakeTabMultiSelected: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const { setTargetDirs, setTargetDir, setReadZip } = useOtoProjectStore();

    useEffect(() => {
      // サンプルzipを読み込む
      fetch("samples/sjis_CV_jp.zip")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => JSZip.loadAsync(arrayBuffer))
        .then((zip) => {
          setReadZip(zip.files);
          setTargetDirs(["denoise"]);
          // 自動的にルートフォルダを選択
          setTimeout(() => {
            setTargetDir("denoise");
          }, 100);
        });

      return () => {
        setTargetDirs(null);
        setTargetDir(null);
        setReadZip(null);
      };
    }, [setTargetDirs, setTargetDir, setReadZip]);

    // タブを自動選択し、multiモードを選択するeffect
    useEffect(() => {
      let retryCount = 0;
      const maxRetries = 10;
      
      const selectTabAndMode = () => {
        if (retryCount >= maxRetries) {
          console.log(`[MakeTabMultiSelected] Max retries reached, giving up`);
          return;
        }
        
        // タブが表示されるまで待機
        const tabs = document.querySelectorAll('[role="tab"]');
        
        if (tabs.length > 3) {
          // Tab 4（インデックス3）をクリック
          const tab4 = tabs[3] as HTMLElement;
          
          if (tab4) {
            tab4.click();
            
            // タブ選択後、パネルの表示を待ってからmultiモードを選択
            setTimeout(() => {
              const modeSelectContainer = document.querySelector('[data-testid="mode-select"]') as HTMLElement;
              
              if (modeSelectContainer) {
                // Material-UIのSelectは、内部のinput要素を見つけて変更イベントを発火
                const selectInput = modeSelectContainer.querySelector('input') as HTMLInputElement;
                
                if (selectInput) {
                  // Reactの内部プロパティを使用して値を変更
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value'
                  )?.set;
                  
                  if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(selectInput, 'multi');
                    
                    // changeイベントを発火
                    const changeEvent = new Event('change', { bubbles: true });
                    selectInput.dispatchEvent(changeEvent);
                    
                    // inputイベントも発火
                    const inputEvent = new Event('input', { bubbles: true });
                    selectInput.dispatchEvent(inputEvent);
                  }
                } else {
                  // inputが見つからない場合は再試行
                  retryCount++;
                  setTimeout(selectTabAndMode, 200);
                }
              } else {
                // コンテナが見つからない場合は再試行
                retryCount++;
                setTimeout(selectTabAndMode, 200);
              }
            }, 500);
          }
        } else {
          // まだタブが表示されていない場合は再試行
          retryCount++;
          setTimeout(selectTabAndMode, 200);
        }
      };

      // 少し待ってからタブを選択
      const timer = setTimeout(selectTabAndMode, 500);

      return () => {
        clearTimeout(timer);
        retryCount = maxRetries; // クリーンアップ時は再試行を停止
      };
    }, []);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};

/**
 * 生成タブでmultiモード・日本語連続音を選択し、設定を展開した状態
 */
export const MakeTabMultiWithVcvSettingsExpanded: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const { setTargetDirs, setTargetDir, setReadZip } = useOtoProjectStore();

    useEffect(() => {
      // サンプルzipを読み込む
      fetch("samples/sjis_CV_jp.zip")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => JSZip.loadAsync(arrayBuffer))
        .then((zip) => {
          setReadZip(zip.files);
          setTargetDirs(["denoise"]);
          // 自動的にルートフォルダを選択
          setTimeout(() => {
            setTargetDir("denoise");
          }, 100);
        });

      return () => {
        setTargetDirs(null);
        setTargetDir(null);
        setReadZip(null);
      };
    }, [setTargetDirs, setTargetDir, setReadZip]);

    // タブ選択、multiモード選択、accordion展開
    useEffect(() => {
      let retryCount = 0;
      const maxRetries = 20;
      
      const selectAll = () => {
        if (retryCount >= maxRetries) {
          console.log(`[MakeTabMultiWithVcvSettingsExpanded] Max retries reached, giving up`);
          return;
        }
        
        // タブが表示されるまで待機
        const tabs = document.querySelectorAll('[role="tab"]');
        
        if (tabs.length > 3) {
          // Tab 4（インデックス3）をクリック
          const tab4 = tabs[3] as HTMLElement;
          
          if (tab4) {
            tab4.click();
            
            // タブ選択後、パネルの表示を待ってからmultiモードを選択
            setTimeout(() => {
              const modeSelectContainer = document.querySelector('[data-testid="mode-select"]') as HTMLElement;
              
              if (modeSelectContainer) {
                const selectInput = modeSelectContainer.querySelector('input') as HTMLInputElement;
                
                if (selectInput) {
                  // multiモードを選択
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value'
                  )?.set;
                  
                  if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(selectInput, 'multi');
                    const changeEvent = new Event('change', { bubbles: true });
                    selectInput.dispatchEvent(changeEvent);
                    
                    // multiモード選択後、accordionを展開
                    setTimeout(() => {
                      const accordionSummary = document.querySelector('[data-testid="settings-accordion-summary"]') as HTMLElement;
                      
                      if (accordionSummary && accordionSummary.getAttribute('aria-expanded') === 'false') {
                        // mousedownとmouseupも含めた完全なクリックシーケンス
                        accordionSummary.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                        accordionSummary.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
                        accordionSummary.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                      } else if (!accordionSummary) {
                        // AccordionSummaryが見つからない場合は再試行
                        retryCount++;
                        setTimeout(selectAll, 200);
                      }
                    }, 500);
                  }
                } else {
                  retryCount++;
                  setTimeout(selectAll, 200);
                }
              } else {
                retryCount++;
                setTimeout(selectAll, 200);
              }
            }, 500);
          }
        } else {
          retryCount++;
          setTimeout(selectAll, 200);
        }
      };

      // 少し待ってから開始
      const timer = setTimeout(selectAll, 500);

      return () => {
        clearTimeout(timer);
        retryCount = maxRetries;
      };
    }, []);

    return <TargetDirDialog dialogOpen={open} setDialogOpen={setOpen} />;
  },
};
