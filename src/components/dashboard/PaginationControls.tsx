type PaginationControlsProps = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isFetching?: boolean;
  itemLabel: string;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({
  page,
  limit,
  total,
  totalPages,
  isFetching = false,
  itemLabel,
  onPageChange,
}: PaginationControlsProps) {
  if (total === 0) return null;

  const firstItem = (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);

  return (
    <div
      className="pagination"
      aria-label={`${itemLabel} pagination`}
      style={{ justifyContent: "space-between", flexWrap: "wrap" }}
    >
      <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
        Showing {firstItem}-{lastItem} of {total} {itemLabel}
      </span>
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || isFetching}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span aria-live="polite" style={{ fontSize: 13 }}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || isFetching}
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
