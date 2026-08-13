"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
};

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
}: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lp-delete-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        [data-theme="light"] .lp-delete-overlay {
          --lp-bg: #ffffff;
          --lp-surface: #f8fafc;
          --lp-text: #0f172a;
          --lp-text-secondary: #64748b;
          --lp-border: #e2e8f0;
          --lp-primary: #2563eb;
          --lp-primary-hover: #1d4ed8;
          --lp-primary-text: #ffffff;
          --lp-accent: #f1f5f9;
          --lp-danger: #dc2626;
          --lp-danger-hover: #b91c1c;
          --lp-danger-text: #ffffff;
          --lp-danger-bg: rgba(220,38,38,0.08);
          --lp-muted: #f1f5f9;
          --lp-ring: rgba(37,99,235,0.25);
          --lp-overlay: rgba(0,0,0,0.45);
        }
        [data-theme="dark"] .lp-delete-overlay {
          --lp-bg: #0f172a;
          --lp-surface: #1e293b;
          --lp-text: #f1f5f9;
          --lp-text-secondary: #94a3b8;
          --lp-border: #334155;
          --lp-primary: #3b82f6;
          --lp-primary-hover: #2563eb;
          --lp-primary-text: #ffffff;
          --lp-accent: #1e293b;
          --lp-danger: #ef4444;
          --lp-danger-hover: #dc2626;
          --lp-danger-text: #ffffff;
          --lp-danger-bg: rgba(239,68,68,0.1);
          --lp-muted: #1e293b;
          --lp-ring: rgba(59,130,246,0.3);
          --lp-overlay: rgba(0,0,0,0.65);
        }

        .lp-delete-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--lp-overlay);
          backdrop-filter: blur(4px);
          padding: 16px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .lp-delete-dialog {
          width: 100%;
          max-width: 420px;
          background: var(--lp-bg);
          border: 1px solid var(--lp-border);
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1);
          overflow: hidden;
          color: var(--lp-text);
        }

        .lp-delete-content {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
        }
        .lp-delete-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--lp-danger-bg);
          color: var(--lp-danger);
        }
        .lp-delete-body {
          flex: 1;
          min-width: 0;
        }
        .lp-delete-body h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          color: var(--lp-text);
        }
        .lp-delete-body p {
          margin: 6px 0 0;
          font-size: 13px;
          line-height: 1.6;
          color: var(--lp-text-secondary);
        }
        .lp-delete-close {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--lp-text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .lp-delete-close:hover {
          background: var(--lp-accent);
          color: var(--lp-text);
        }
        .lp-delete-close:focus-visible {
          box-shadow: 0 0 0 3px var(--lp-ring);
          outline: none;
        }

        .lp-delete-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 24px;
          border-top: 1px solid var(--lp-border);
          background: var(--lp-surface);
        }
        .lp-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid transparent;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          outline: none;
          font-family: inherit;
          background: transparent;
        }
        .lp-btn:focus-visible {
          box-shadow: 0 0 0 3px var(--lp-ring);
        }
        .lp-btn-ghost {
          background: transparent;
          border-color: var(--lp-border);
          color: var(--lp-text);
        }
        .lp-btn-ghost:hover {
          background: var(--lp-accent);
        }
        .lp-btn-danger {
          background: var(--lp-danger);
          color: var(--lp-danger-text);
        }
        .lp-btn-danger:hover {
          background: var(--lp-danger-hover);
        }
      `}</style>

      <div
        className="lp-delete-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-desc"
      >
        <div className="lp-delete-content">
          <div className="lp-delete-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="lp-delete-body">
            <h3 id="delete-title">{title}</h3>
            <p id="delete-desc">{description}</p>
          </div>
          <button
            className="lp-delete-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div className="lp-delete-footer">
          <button className="lp-btn lp-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="lp-btn lp-btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
