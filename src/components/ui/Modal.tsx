"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose?: () => void;
  size?: "sm" | "md" | "lg";
};

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className={`modal modal-${size}`}>
        {(title || onClose) && (
          <div className="modal-header">
            {title && <h3>{title}</h3>}
            {onClose && (
              <button
                type="button"
                className="modal-close"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-actions">{footer}</div>}
      </div>
    </div>
  );
}
