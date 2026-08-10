"use client";

import Link from "next/link";
import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Toast from "@/components/ui/Toast";

interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; phone: string };
  total: number;
  status: string;
  createdAt: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
  onView?: (orderId: string) => void;
  onRefund?: (orderId: string) => Promise<void> | void;
  showActions?: boolean;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
}

const statusMap: Record<string, string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  shipped: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-danger",
  returned: "badge-danger",
};

export default function RecentOrdersTable({
  orders,
  onView,
  onRefund,
  showActions = true,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  showPagination = true,
}: RecentOrdersTableProps) {
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ visible: false, message: "", type: "info" });
  if (!orders?.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <div className="empty-state-title">No orders yet</div>
        <div className="empty-state-desc">
          Orders will appear here once customers start buying.
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  style={{ color: "var(--primary)", fontWeight: 500 }}
                  aria-label={`View order ${order.orderNumber}`}
                  onClick={(e) => {
                    if (typeof onView === "function") {
                      e.preventDefault();
                      onView(order.id);
                    }
                  }}
                >
                  #{order.orderNumber ?? order.id}
                </Link>
              </td>
              <td>
                <div>{order.customer?.name ?? "—"}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {order.customer?.phone ?? "—"}
                </div>
              </td>
              <td style={{ fontWeight: 600 }}>{formatCurrency(order.total)}</td>
              <td>
                <span
                  className={`badge ${statusMap[order.status] || "badge-default"}`}
                >
                  {order.status
                    ? String(order.status)
                        .replace(/[_-]/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : "Unknown"}
                </span>
              </td>
              <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                {formatDate(order.createdAt)}
              </td>
              <td>
                {showActions && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        if (typeof onView === "function") {
                          e.preventDefault();
                          onView(order.id);
                        }
                      }}
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmOrderId(order.id)}
                    >
                      Refund
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmModal
        open={!!confirmOrderId}
        title="Confirm refund"
        description="This will mark the order as refunded and update records. Proceed?"
        confirmLabel="Refund"
        cancelLabel="Cancel"
        onCancel={() => setConfirmOrderId(null)}
        onConfirm={async () => {
          if (!confirmOrderId) return;
          try {
            if (typeof onRefund === "function") {
              await onRefund(confirmOrderId);
            }
            setToast({
              visible: true,
              message: "Order refunded",
              type: "success",
            });
          } catch (e) {
            setToast({
              visible: true,
              message: "Refund failed",
              type: "error",
            });
          } finally {
            setConfirmOrderId(null);
          }
        }}
      />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type as any}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      {showPagination && (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}
        >
          {(() => {
            const totalItems = total ?? orders.length;
            const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
            return (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange?.(Math.max(1, page - 1))}
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  Page {page} of {totalPages}
                </div>
                <button
                  className="pagination-btn"
                  onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
