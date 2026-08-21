"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";
import {
  useDeleteStorageRecordsMutation,
  useListStorageModuleQuery,
  type StorageModule,
} from "@/store/storageApi";

const supportedModules: StorageModule[] = [
  "activityLogs",
  "analytics",
  "couriers",
  "customers",
  "deliveryAreas",
  "landingPages",
  "orders",
  "packagePurchaseRequests",
  "paymentMethods",
  "products",
  "projects",
  "refreshTokens",
  "subscriptions",
  "trackingEvents",
  "uploads",
  "users",
];

const pageSize = 20;

const titleize = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());

const formatValue = (value: unknown, key?: string): string => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString();
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "string") {
    if (
      key?.toLowerCase().includes("date") ||
      key?.toLowerCase().endsWith("at")
    ) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return date.toLocaleString();
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.length
      ? value.map((item) => formatValue(item)).join(", ")
      : "None";
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(
        ([nestedKey, nestedValue]) =>
          `${titleize(nestedKey)}: ${formatValue(nestedValue)}`,
      )
      .join(" · ");
  }
  return String(value);
};

const getRecordKey = (record: Record<string, unknown>, index: number) => {
  const id = record.id;
  return typeof id === "string" ? id : `record-${index}`;
};

export default function StorageModulePage() {
  const params = useParams<{ module: string }>();
  const moduleName = params.module;
  const module = supportedModules.includes(moduleName as StorageModule)
    ? (moduleName as StorageModule)
    : undefined;
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<"selected" | "all" | null>(
    null,
  );
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });
  const { data, isLoading, isError, refetch } = useListStorageModuleQuery(
    { module: module as StorageModule, page, limit: pageSize },
    { skip: !module },
  );
  const [deleteRecords, { isLoading: deleting }] =
    useDeleteStorageRecordsMutation();

  if (!module) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Storage module not found</div>
        <Link href="/dashboard/storage" className="btn btn-ghost btn-sm">
          Back to storage
        </Link>
      </div>
    );
  }

  const records = data?.data ?? [];
  const meta = data?.meta;
  const recordIds = records
    .map((record) => record.id)
    .filter((id): id is string => typeof id === "string");

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds((current) =>
      recordIds.every((id) => current.includes(id)) ? [] : recordIds,
    );
  };

  const handleDelete = async () => {
    if (!confirmAction) return;
    try {
      const payload =
        confirmAction === "all" ? { all: true as const } : { ids: selectedIds };
      const result = await deleteRecords({ module, payload }).unwrap();
      setSelectedIds([]);
      setConfirmAction(null);
      setToast({
        visible: true,
        message: `${result.deletedCount} record${result.deletedCount === 1 ? "" : "s"} deleted.`,
        type: "success",
      });
      await refetch();
    } catch (error: any) {
      setConfirmAction(null);
      setToast({
        visible: true,
        message: error?.data?.message ?? "Unable to delete records.",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{titleize(module)}</h1>
          <p className="page-subtitle">
            Browse and manage records in this storage module.
          </p>
        </div>
        <Link href="/dashboard/storage" className="btn btn-ghost btn-sm">
          Back to storage
        </Link>
      </div>

      {isError ? (
        <div className="alert alert-danger">
          <strong>Unable to load records.</strong>
          <button className="btn btn-ghost btn-sm" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="card-header storage-manager-toolbar">
            <span className="storage-table-subtitle">
              {meta?.total?.toLocaleString() ?? 0} total records
            </span>
            <div className="storage-manager-actions">
              <button
                className="btn btn-danger btn-sm"
                disabled={!selectedIds.length || deleting}
                onClick={() => setConfirmAction("selected")}
              >
                Delete selected ({selectedIds.length})
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={!meta?.total || deleting}
                onClick={() => setConfirmAction("all")}
              >
                Clear module
              </button>
            </div>
          </div>
          <div className="table-wrapper">
            {records.length ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Select all visible records"
                        checked={
                          recordIds.length > 0 &&
                          recordIds.every((id) => selectedIds.includes(id))
                        }
                        onChange={toggleAll}
                      />
                    </th>
                    <th>Record ID</th>
                    <th>Details</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => {
                    const id = record.id;
                    return (
                      <tr key={getRecordKey(record, index)}>
                        <td>
                          {typeof id === "string" && (
                            <input
                              type="checkbox"
                              aria-label={`Select ${id}`}
                              checked={selectedIds.includes(id)}
                              onChange={() => toggleSelected(id)}
                            />
                          )}
                        </td>
                        <td className="storage-record-id">{formatValue(id)}</td>
                        <td>
                          <details className="storage-record-details">
                            <summary>View details</summary>
                            <div className="storage-details-card">
                              <table className="storage-details-table">
                                <tbody>
                                  {Object.entries(record).map(
                                    ([key, value]) => (
                                      <tr key={key}>
                                        <th>{titleize(key)}</th>
                                        <td>{formatValue(value, key)}</td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </details>
                        </td>
                        <td>
                          {formatValue(
                            record.createdAt ?? record.created_at,
                            "createdAt",
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-state-title">No records found</div>
                <div className="empty-state-desc">This module is empty.</div>
              </div>
            )}
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={!meta.hasPrevPage}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Prev
              </button>
              <span className="storage-table-subtitle">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                className="pagination-btn"
                disabled={!meta.hasNextPage}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={confirmAction !== null}
        title={
          confirmAction === "all"
            ? "Clear this module?"
            : "Delete selected records?"
        }
        description={
          confirmAction === "all"
            ? "This permanently deletes every scoped record in this module."
            : `This permanently deletes ${selectedIds.length} selected record${selectedIds.length === 1 ? "" : "s"}.`
        }
        confirmLabel={deleting ? "Deleting..." : "Delete"}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleDelete}
      />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((current) => ({ ...current, visible: false }))}
      />
    </div>
  );
}
