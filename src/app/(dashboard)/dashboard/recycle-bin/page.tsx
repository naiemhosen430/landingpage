"use client";

import { useEffect, useState } from "react";
import PaginationControls from "@/components/dashboard/PaginationControls";
import {
  TrashItem,
  useGetTrashItemsQuery,
  usePermanentlyDeleteTrashItemsMutation,
  useRestoreTrashItemsMutation,
} from "@/store/trashApi";

const PAGE_SIZE = 25;
const EMPTY_ITEMS: TrashItem[] = [];

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function itemId(item: TrashItem) {
  return item._id ?? item.id;
}

export default function RecycleBinPage() {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data, isLoading, isFetching, isError, refetch } =
    useGetTrashItemsQuery({ page, limit: PAGE_SIZE });
  const [restoreItems, { isLoading: restoring }] =
    useRestoreTrashItemsMutation();
  const [deleteItems, { isLoading: deleting }] =
    usePermanentlyDeleteTrashItemsMutation();
  const items = data?.data ?? EMPTY_ITEMS;
  const meta = data?.meta;

  useEffect(() => {
    if (meta?.totalPages && page > meta.totalPages) {
      setPage(meta.totalPages);
    }
    const visible = new Set(items.map(itemId));
    setSelectedIds((current) => current.filter((id) => visible.has(id)));
  }, [items, meta?.totalPages, page]);

  const toggleItem = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selected) => selected !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    const pageIds = items.map(itemId);
    setSelectedIds((current) =>
      pageIds.every((id) => current.includes(id))
        ? current.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...current, ...pageIds])),
    );
  };

  const restoreSelected = async (ids: string[]) => {
    await restoreItems(ids).unwrap();
    setSelectedIds([]);
  };

  const permanentlyDeleteSelected = async (ids: string[]) => {
    const count = ids.length;
    if (
      !window.confirm(
        `Permanently delete ${count} selected item${count === 1 ? "" : "s"}? This cannot be undone.`,
      )
    ) {
      return;
    }
    await deleteItems(ids).unwrap();
    setSelectedIds([]);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Recycle Bin</h1>
          <p className="page-subtitle">
            Deleted items are kept for 30 days, then permanently removed.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Refresh
        </button>
      </div>

      <div className="card">
        <div
          className="card-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {items.length > 0 && (
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={items.every((item) =>
                  selectedIds.includes(itemId(item)),
                )}
                onChange={toggleAll}
                aria-label="Select all items on this page"
              />
              Select page
            </label>
          )}
          <span style={{ color: "var(--text-muted)", marginLeft: "auto" }}>
            {meta?.total ?? 0} items
          </span>
          {selectedIds.length > 0 && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => restoreSelected(selectedIds)}
                disabled={restoring || deleting}
              >
                {restoring ? "Restoring..." : `Restore (${selectedIds.length})`}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => permanentlyDeleteSelected(selectedIds)}
                disabled={restoring || deleting}
              >
                {deleting
                  ? "Deleting..."
                  : `Delete permanently (${selectedIds.length})`}
              </button>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="card-body" role="status">
            Loading recycle bin...
          </div>
        ) : isError ? (
          <div className="card-body" role="alert">
            Could not load recycle bin items. Refresh to try again.
          </div>
        ) : items.length === 0 ? (
          <div className="card-body empty-state">
            <div className="empty-state-title">Recycle bin is empty</div>
            <div className="empty-state-desc">
              Items you delete from the store will appear here.
            </div>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th aria-label="Select item" />
                  <th>Item</th>
                  <th>Type</th>
                  <th>Deleted</th>
                  <th>Auto-delete date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const id = itemId(item);
                  return (
                    <tr key={id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(id)}
                          onChange={() => toggleItem(id)}
                          aria-label={`Select ${item.label}`}
                        />
                      </td>
                      <td>
                        <strong>{item.label}</strong>
                        <div
                          style={{
                            color: "var(--text-muted)",
                            fontSize: 12,
                          }}
                        >
                          Record ID: {item.recordId}
                        </div>
                      </td>
                      <td>{item.entityType}</td>
                      <td>{formatDate(item.deletedAt)}</td>
                      <td>{formatDate(item.expiresAt)}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => restoreSelected([id])}
                          disabled={restoring || deleting}
                        >
                          Restore
                        </button>{" "}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => permanentlyDeleteSelected([id])}
                          disabled={restoring || deleting}
                        >
                          Delete permanently
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {meta && (
          <PaginationControls
            page={meta.page}
            limit={meta.limit}
            total={meta.total}
            totalPages={meta.totalPages}
            isFetching={isFetching}
            itemLabel="items"
            onPageChange={(nextPage) => {
              setSelectedIds([]);
              setPage(nextPage);
            }}
          />
        )}
      </div>
    </div>
  );
}
