"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { primaryButton, secondaryButton } from "@/components/app-ui";

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = "confirm-dialog-title";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onCancel();
      }}
      className="fixed inset-0 z-50 m-0 max-h-none max-w-none border-0 bg-transparent p-4 backdrop:bg-black/40 open:flex open:items-center open:justify-center"
    >
      <div
        role="document"
        className="w-full max-w-sm rounded-3xl bg-card px-6 py-6 text-center ring-1 ring-line"
      >
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        <div className="mt-3 text-base text-muted-foreground">{children}</div>
        <div className="mt-6 grid gap-3">
          <button type="button" onClick={onConfirm} className={primaryButton}>
            {confirmLabel}
          </button>
          <button type="button" onClick={onCancel} className={secondaryButton}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
