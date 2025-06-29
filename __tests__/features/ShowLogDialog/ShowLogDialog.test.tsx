import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShowLogDialog } from "../../../src/features/ShowLogDialog/ShowLogDialog";
import { LOG } from "../../../src/lib/Logging";

describe("ShowLogDialog", () => {
  const mockSetMenuAnchor = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    LOG.clear(); // LOG をクリア
  });

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    setMenuAnchor: mockSetMenuAnchor,
  };

  it("ダイアログが表示される", () => {
    render(<ShowLogDialog {...defaultProps} />);

    // ダイアログが表示されていることを確認
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("menu.logAttention")).toBeInTheDocument();
  });

  it("ダウンロードボタンをクリックするとログが記録される", () => {
    render(<ShowLogDialog {...defaultProps} />);

    // ダウンロードボタンをクリック
    const downloadButton = screen.getByText("error.download");
    fireEvent.click(downloadButton);

    // LOG.datas に "Log ダウンロード" を含むログが記録されていることを確認
    const logEntries = LOG.datas.filter((entry) =>
      entry.includes("Log ダウンロード")
    );
    expect(logEntries.length).toBeGreaterThan(0);
  });

  it("ダウンロードボタンをクリックすると setMenuAnchor と onClose が呼び出される", () => {
    render(<ShowLogDialog {...defaultProps} />);

    // ダウンロードボタンをクリック
    const downloadButton = screen.getByText("error.download");
    fireEvent.click(downloadButton);

    // setMenuAnchor と onClose が呼び出されることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("閉じるボタンをクリックすると onClose が呼び出される", () => {
    render(<ShowLogDialog {...defaultProps} />);

    // 閉じるボタンをクリック
    const closeButton = screen.getByTestId("closeButton");
    fireEvent.click(closeButton);

    // onClose が呼び出されることを確認
    expect(mockOnClose).toHaveBeenCalled();
  });
});