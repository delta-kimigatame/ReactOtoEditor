import * as React from "react";
import OtoRecord from "utauoto/dist/OtoRecord";
import { oto } from "../../config/setting";

import { PaletteMode } from "@mui/material";

import { lineColorPallet } from "../../config/colors";
import { GetColor } from "../../utils/Color";

import { Log } from "../../lib/Logging";
import { useThemeMode } from "../../hooks/useThemeMode";
import { useCookieStore } from "../../store/cookieStore";

/**
 * 原音設定パラメータを表示するキャンバス
 * @param props {@link OtoCanvasProps}
 * @returns 原音設定パラメータを表示するキャンバス
 */
export const OtoCanvas: React.FC<OtoCanvasProps> = (props) => {
  const mode=useThemeMode()
  const {overlapLock,touchMode}=useCookieStore()
  /** canvasへのref */
  const canvas = React.useRef(null);
  /** 区分線の色 */
  const [lineColor, setLineColor] = React.useState<string>(
    GetColor(lineColorPallet[mode])
  );
  /** 塗りつぶし部分の透過度 */
  const [alpha, setAlpha] = React.useState<number>(
    mode === "light" ? 0.1 : 0.3
  );
  /** タップに追随するパラメータ名 */
  const [targetParam, setTargetParam] = React.useState<string | null>(null);
  /** 現在のエイリアス */
  const [alias, setAlias] = React.useState<string | null>(null);
  /** ライトモード・ダークモードが変更となった際の処理 */
  React.useEffect(() => {
    setLineColor(GetColor(lineColorPallet[mode]));
    setAlpha(mode === "light" ? 0.1 : 0.3);
  }, [mode]);

  /** キーボードショートカット用にマウスの座標を保存する。 */
  const lastClickXRef = React.useRef<number | null>(null);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(e.target.tagName)
      ) {
        return;
      }
      console.log(e.key,lastClickXRef.current)
      if (e.key === "Q" || e.key === "q") {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        UpdateOto("offset", lastClickXRef.current ?? 0);
        RenderAll(ctx);
      } else if (e.key === "W" || e.key === "w") {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        UpdateOto("overlap", lastClickXRef.current ?? 0);
        RenderAll(ctx);
      } else if (e.key === "E" || e.key === "e") {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        UpdateOto("pre", lastClickXRef.current ?? 0);
        RenderAll(ctx);
      } else if (e.key === "R" || e.key === "r") {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        UpdateOto("velocity", lastClickXRef.current ?? 0);
        RenderAll(ctx);
      } else if (e.key === "T" || e.key === "t") {
        const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
        UpdateOto("blank", lastClickXRef.current ?? 0);
        RenderAll(ctx);
      }
    },
    [lastClickXRef]
  );
  /** キーボードショートカットの作成 */
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * キャンバスの初期化
   * @param ctx canvasのコンテクスト
   */
  const RenderBase = (ctx: CanvasRenderingContext2D) => {
    Log.log(`キャンバス初期化`, "OtoCanvas");
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
  };

  /**
   * オフセットの描画
   * @param ctx canvasのコンテクスト
   */
  const RenderOffset = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const point = props.record.offset / props.pixelPerMsec;
      ctx.fillStyle = "rgba(0,255,0," + alpha + ")";
      ctx.fillRect(0, 0, point, props.canvasHeight);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, 0);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
    }
  };

  /**
   * 右ブランクの描画
   * @param ctx canvasのコンテクスト
   */
  const RenderBlank = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      let point = 0;
      if (props.record.blank < 0) {
        point = (props.record.offset - props.record.blank) / props.pixelPerMsec;
      } else {
        point = props.canvasWidth - props.record.blank / props.pixelPerMsec;
      }
      ctx.fillStyle = "rgba(255,255,0," + alpha + ")";
      ctx.fillRect(point, 0, props.canvasWidth - point, props.canvasHeight);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, 0);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
    }
  };

  /**
   * オーバーラップの描画
   * @param ctx canvasのコンテクスト
   */
  const RenderOverlap = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const point =
        (props.record.offset + props.record.overlap) / props.pixelPerMsec;
      ctx.strokeStyle = "rgb(0,128,0)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, props.canvasHeight / 6);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
      ctx.font = Math.min(48, props.canvasHeight / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(0,128,0)";
      ctx.textAlign = "center";
      ctx.fillText("オ", point, props.canvasHeight / 12);
    }
  };
  /**
   * 先行発声の描画
   * @param ctx canvasのコンテクスト
   */
  const RenderPreutter = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const point =
        (props.record.offset + props.record.pre) / props.pixelPerMsec;
      ctx.strokeStyle = "rgb(255,0,0)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, props.canvasHeight / 3);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
      ctx.font = Math.min(48, props.canvasHeight / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(255,0,0)";
      ctx.textAlign = "center";
      ctx.fillText("先", point, props.canvasHeight / 6);
    }
  };
  /**
   * 子音速度の描画
   * @param ctx canvasのコンテクスト
   */
  const RenderVelocity = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const spoint = props.record.offset / props.pixelPerMsec;
      const point =
        (props.record.offset + props.record.velocity) / props.pixelPerMsec;
      ctx.fillStyle = "rgba(0,0,255," + alpha + ")";
      ctx.fillRect(
        spoint,
        props.canvasHeight / 4,
        point - spoint,
        props.canvasHeight
      );
      ctx.strokeStyle = "rgb(0,0,255)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, props.canvasHeight / 4);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
      ctx.font = Math.min(48, props.canvasHeight / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(0,0,255)";
      ctx.textAlign = "center";
      ctx.fillText("固", point, (props.canvasHeight / 16) * 3);
    }
  };

  /**
   * 全パラメータの再描画
   * @param ctx canvasのコンテクスト
   */
  const RenderAll = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      RenderBase(ctx);
      Log.log(`oto.ini描画`, "OtoCanvas");
      RenderOffset(ctx);
      RenderOverlap(ctx);
      RenderPreutter(ctx);
      RenderVelocity(ctx);
      RenderBlank(ctx);
    }
  };

  /**
   * recordが変更となった際の処理
   */
  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderAll(ctx);
      if (props.record !== null) {
        if (alias !== props.record.alias) {
          props.SetSclolled(props.record.offset / props.pixelPerMsec - 100);
          setAlias(props.record.alias);
        }
      } else {
        setAlias(null);
      }
    }
  }, [props.record, props.updateSignal]);

  /**
   * キャンバスの大きさが変更となった際の処理
   */
  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderAll(ctx);
      if (props.record !== null) {
        props.SetSclolled(props.record.offset / props.pixelPerMsec - 100);
        setAlias(props.record.alias);
      }
    }
  }, [props.canvasWidth, props.canvasHeight]);

  /**
   * 描画色が変更した際の処理
   */
  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderAll(ctx);
    }
  }, [lineColor]);

  /**
   * 操作に応じてパラメータを変更する処理
   * @param target タップに追随するパラメータ名
   * @param clickX タップされたX座標
   */
  const UpdateOto = (target: string, clickX: number) => {
    Log.log(
      `編集対象:${target}、clickX:${clickX}、オーバーラップロック:${overlapLock}`,
      "OtoCanvas"
    );
    if (target === "offset") {
      /**
       * オフセットが対象の場合 \
       * 基本的には他のパラメータの位置は変更しない。\
       * オーバーラップ以外の各パラメータは最小値を下回る場合変更する。\
       * オーバーラップはオーバーラップロックモードの場合変更する。
       * */
      /** 移動距離 */
      const moveValue = props.record.offset - clickX * props.pixelPerMsec;
      props.record.offset -= moveValue;
      /** 先行発声の最小値は0 */
      props.record.pre = Math.max(props.record.pre + moveValue, 0);
      if (overlapLock) {
        /** オーバーラップロックの場合、先行発声の1/3 */
        props.record.overlap = props.record.pre / 3;
      } else {
        /** オーバーラップロックでない、元位置を維持 */
        props.record.overlap += moveValue;
      }
      /** 子音速度の最小値は設定値 */
      props.record.velocity = Math.max(
        props.record.velocity + moveValue,
        oto.minParams
      );
      /** 右ブランクの最小値は設定値 */
      if (props.record.blank < 0) {
        props.record.blank = Math.min(
          props.record.blank - moveValue,
          -2 * oto.minParams
        );
      }
    } else if (target === "overlap") {
      /**
       * オーバーラップが対象の場合
       * */
      /** 移動距離 */
      const moveValue =
        props.record.offset +
        props.record.overlap -
        clickX * props.pixelPerMsec;
      props.record.overlap -= moveValue;
    } else if (target === "pre") {
      /**
       * 先行発声が対象の場合 \
       * 先行発声が指定した位置となるよう、offsetを変更
       * */
      /** 移動距離 */
      const moveValue =
        props.record.offset + props.record.pre - clickX * props.pixelPerMsec;
      props.record.offset = props.record.offset - moveValue;
    } else if (target === "velocity") {
      /**
       * 子音速度が対象の場合
       * */
      /** 移動距離 */
      const moveValue =
        props.record.offset +
        props.record.velocity -
        clickX * props.pixelPerMsec;
      props.record.velocity = Math.max(
        props.record.velocity - moveValue,
        oto.minParams
      );
      /** 伸縮範囲が設定値以下とならないようにする */
      props.record.blank = Math.min(
        props.record.blank,
        -oto.minParams - props.record.velocity
      );
    } else if (target === "blank") {
      /**
       * 右ブランクが対象の場合 \
       * 再設定にあわせて数値を正から負に変換する。
       * */
      const newBlankPos = props.record.offset - clickX * props.pixelPerMsec;
      props.record.blank = Math.min(
        newBlankPos,
        -oto.minParams - props.record.velocity
      );
    }
  };

  /**
   * キャンバスをクリックした際の処理 \
   * タップ位置に追随するパラメータを特定し、初回更新をする。
   * @param e
   */
  const OnMouseDown = (e) => {
    /** タップ位置に追随するパラメータ */
    let t: string | null = null;
    /**
     * クリックした位置X座標
     */
    const clickX: number =
      props.boxRef.current.scrollLeft +
      (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
    /**
     * クリックした位置Y座標
     */
    const clickY: number =
      e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

    Log.log(`編集対象特定。touchMode:${touchMode}`, "OtoCanvas");
    if (touchMode) {
      /** touchModeがtrueの場合、問答無用でpreが対象 */
      t = "pre";
    } else {
      /** 各パラメータの座標位置取得 */
      const offsetPos = props.record.offset / props.pixelPerMsec;
      const overlapPos =
        (props.record.offset + props.record.overlap) / props.pixelPerMsec;
      const preutterPos =
        (props.record.offset + props.record.pre) / props.pixelPerMsec;
      const velocityPos =
        (props.record.offset + props.record.velocity) / props.pixelPerMsec;
      /** 右ブランクが負の場合 */
      let blankPos =
        (props.record.offset - props.record.blank) / props.pixelPerMsec;
      if (props.record.blank >= 0) {
        /** 右ブランクが正の場合値を更新する */
        blankPos = props.canvasWidth - props.record.blank / props.pixelPerMsec;
      }
      Log.log(
        `clickX:${clickX}、clickY:${clickY}、offset:${offsetPos}、overlapPos:${overlapPos}、preutterPos:${preutterPos}、velocityPos:${velocityPos}、blankPos:${blankPos}`,
        "OtoCanvas"
      );

      /** 最も近い値を特定するための変数 */
      let minRange = oto.defaultRange;
      if (Math.abs(offsetPos - clickX) < minRange) {
        minRange = Math.abs(offsetPos - clickX);
        t = "offset";
      }
      if (Math.abs(overlapPos - clickX) < minRange && !overlapLock) {
        minRange = Math.abs(overlapPos - clickX);
        t = "overlap";
      }
      if (
        Math.abs(preutterPos - clickX) < minRange ||
        (Math.abs(preutterPos - clickX) < oto.defaultRange &&
          clickY >= props.canvasHeight / 4 &&
          clickY > props.canvasHeight / 2)
      ) {
        /** 先行発声と左ブランクがほぼ同じ位置にある場合、Y座標でどちらを選択したか判断 */
        minRange = Math.abs(preutterPos - clickX);
        t = "pre";
      }
      if (
        Math.abs(velocityPos - clickX) < minRange ||
        (Math.abs(velocityPos - clickX) < oto.defaultRange &&
          clickY >= props.canvasHeight / 2 &&
          clickY > (props.canvasHeight / 4) * 3)
      ) {
        /** 先行発声と子音速度がほぼ同じ位置にある場合、Y座標でどちらを選択したか判断 */
        minRange = Math.abs(velocityPos - clickX);
        t = "velocity";
      }
      if (Math.abs(blankPos - clickX) < minRange) {
        minRange = Math.abs(blankPos - clickX);
        t = "blank";
      }
    }
    /** タップに追随するパラメータを設定 */
    setTargetParam(t);
    /** タップに追随するパラメータがnullでなければ初回更新 */
    if (t !== null) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      UpdateOto(t, clickX);
      RenderAll(ctx);
    }
  };

  /**
   * ドラッグ・スワイプした際の処理
   * @param e
   */
  const OnMouseMove = (e) => {
    /**
     * 現在のX座標
     */
    const clickX =
      props.boxRef.current.scrollLeft +
      (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
    if (targetParam !== null) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      UpdateOto(targetParam, clickX);
      RenderAll(ctx);
    } else {
      lastClickXRef.current = clickX;
    }
  };

  /**
   * ドラッグ・スワイプが終了した際の処理
   * @param e
   */
  const OnMouseUp = (e) => {
    if (targetParam !== null) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      props.setUpdateSignal(Math.random());
      RenderAll(ctx);
      setTargetParam(null);
    }
  };
  return (
    <>
      <canvas
        id="otoCanvas"
        width={props.canvasWidth}
        height={props.canvasHeight}
        ref={canvas}
        style={{
          position: "relative",
          top: -1 * props.canvasHeight,
          zIndex: 2,
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
        }}
        onMouseDown={OnMouseDown}
        onTouchStart={OnMouseDown}
        onMouseUp={OnMouseUp}
        onTouchEnd={OnMouseUp}
        onMouseMove={OnMouseMove}
        onTouchMove={OnMouseMove}
      />
    </>
  );
};

export interface OtoCanvasProps {
  /** canvasの横幅 */
  canvasWidth: number;
  /** canvasの縦幅 */
  canvasHeight: number;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord;
  /** キャンバスを格納するBoxへのref */
  boxRef: React.MutableRefObject<any>;
  /** 横方向1pixelあたりが何msを表すか */
  pixelPerMsec: number;
  /** canvasを含むBoxを指定の位置までスクロールする */
  SetSclolled: (number) => void;
  /** recordの更新をtableに通知するための処理 */
  setUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  /** キャンバスのスクロール可否 */
  setScrollable: React.Dispatch<React.SetStateAction<boolean>>;
  /** recordの更新通知 */
  updateSignal: number;
}
