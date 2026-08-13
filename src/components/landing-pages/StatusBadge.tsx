"use client";

type Props = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={`lp-badge lp-badge-${status.toLowerCase()} ${className || ""}`}
    >
      <style>{`
        [data-theme="light"] .lp-badge {
          --lp-badge-active-bg: rgba(16, 185, 129, 0.1);
          --lp-badge-active-text: #059669;
          --lp-badge-active-border: rgba(16, 185, 129, 0.2);
          --lp-badge-inactive-bg: rgba(245, 158, 11, 0.1);
          --lp-badge-inactive-text: #d97706;
          --lp-badge-inactive-border: rgba(245, 158, 11, 0.2);
          --lp-badge-draft-bg: rgba(100, 116, 139, 0.1);
          --lp-badge-draft-text: #64748b;
          --lp-badge-draft-border: rgba(100, 116, 139, 0.2);
        }
        [data-theme="dark"] .lp-badge {
          --lp-badge-active-bg: rgba(16, 185, 129, 0.15);
          --lp-badge-active-text: #34d399;
          --lp-badge-active-border: rgba(16, 185, 129, 0.25);
          --lp-badge-inactive-bg: rgba(245, 158, 11, 0.15);
          --lp-badge-inactive-text: #fbbf24;
          --lp-badge-inactive-border: rgba(245, 158, 11, 0.25);
          --lp-badge-draft-bg: rgba(148, 163, 184, 0.15);
          --lp-badge-draft-text: #94a3b8;
          --lp-badge-draft-border: rgba(148, 163, 184, 0.25);
        }

        .lp-badge {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          border: 1px solid transparent;
          padding: 2px 10px;
          font-size: 11px;
          font-weight: 500;
          text-transform: lowercase;
          letter-spacing: 0.01em;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .lp-badge-active {
          background: var(--lp-badge-active-bg);
          color: var(--lp-badge-active-text);
          border-color: var(--lp-badge-active-border);
        }
        .lp-badge-inactive {
          background: var(--lp-badge-inactive-bg);
          color: var(--lp-badge-inactive-text);
          border-color: var(--lp-badge-inactive-border);
        }
        .lp-badge-draft {
          background: var(--lp-badge-draft-bg);
          color: var(--lp-badge-draft-text);
          border-color: var(--lp-badge-draft-border);
        }
      `}</style>
      {status?.toLowerCase()}
    </span>
  );
}
