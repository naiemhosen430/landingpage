"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetOrdersQuery } from "@/store/orderApi";
import { useBookOrderWithDefaultCourierMutation } from "@/store/courierApi";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusMap: Record<string, string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  shipped: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-danger",
  returned: "badge-danger",
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [bookingOrderId, setBookingOrderId] = useState<string | null>(null);
  const [bookOrder, { isLoading: booking }] =
    useBookOrderWithDefaultCourierMutation();

  const { data, isLoading } = useGetOrdersQuery({
    page,
    limit: 20,
    status: status || undefined,
    search: search || undefined,
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  const handleBookOrder = async (orderId: string) => {
    setBookingOrderId(orderId);
    try {
      await bookOrder(orderId).unwrap();
    } catch (error: any) {
      window.alert(
        error?.data?.message ??
          "Could not book this order with the default courier.",
      );
    } finally {
      setBookingOrderId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">Manage and track customer orders</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div
            style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}
          >
            <div style={{ position: "relative", width: 280 }}>
              <svg
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  width: 16,
                  height: 16,
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search orders..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="form-input"
                style={{ paddingLeft: 36 }}
              />
            </div>
            <select
              className="form-select"
              style={{ width: 160 }}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {isLoading ? (
            <div
              style={{ padding: 40, display: "flex", justifyContent: "center" }}
            >
              <div className="spinner" />
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <div className="empty-state">
                          <div className="empty-state-title">
                            No orders found
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {orders.map((order: any) => (
                    <tr key={order.id}>
                      <td>
                        <Link
                          href={`/orders/${order.id}`}
                          style={{ color: "var(--primary)", fontWeight: 600 }}
                        >
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>
                          {order.customer.name}
                        </div>
                        <div
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          {order.customer.phone}
                        </div>
                      </td>
                      <td>{order.items.length} items</td>
                      <td style={{ fontWeight: 600 }}>
                        {formatCurrency(order.total)}
                      </td>
                      <td>
                        <span
                          className={`badge ${order.paymentStatus === "paid" ? "badge-success" : order.paymentStatus === "failed" ? "badge-danger" : "badge-warning"}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${statusMap[order.status] || "badge-default"}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td
                        style={{ fontSize: 13, color: "var(--text-secondary)" }}
                      >
                        {formatDate(order.createdAt)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "flex-end",
                          }}
                        >
                          <Link
                            href={`/dashboard/orders/${order.id}`}
                            className="btn btn-ghost btn-sm"
                          >
                            View
                          </Link>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleBookOrder(order.id)}
                            disabled={
                              booking ||
                              Boolean(order.courier) ||
                              bookingOrderId === order.id
                            }
                            title={
                              order.courier
                                ? "Courier already booked"
                                : "Book with default courier"
                            }
                          >
                            {bookingOrderId === order.id
                              ? "Booking..."
                              : order.courier
                                ? "Booked"
                                : "Book courier"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  className={`pagination-btn ${p === page ? "active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ),
            )}
            <button
              className="pagination-btn"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
