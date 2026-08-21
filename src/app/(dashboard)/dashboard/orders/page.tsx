"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  type OrderStatus,
} from "@/store/orderApi";
import { useBookOrderWithDefaultCourierMutation } from "@/store/courierApi";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusMap: Record<string, string> = {
  incomplete: "badge-default",
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
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [bookingOrderId, setBookingOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    status: "pending",
    paymentStatus: "pending",
    deliveryCharge: "0",
    items: [] as Array<{
      productId: string;
      name: string;
      quantity: number;
      unitPrice: number;
    }>,
  });
  const [bookOrder, { isLoading: booking }] =
    useBookOrderWithDefaultCourierMutation();
  const [updateOrder] = useUpdateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const { data, isLoading } = useGetOrdersQuery({
    page,
    limit: 20,
    status: status || undefined,
    search: search || undefined,
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  const handleBookOrder = async (orderId: string) => {
    if (!window.confirm("Book or rebook this order with the default courier?"))
      return;
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

  const openEditOrder = (order: any) => {
    setEditingOrder(order);
    setEditForm({
      name: order.customer?.name ?? "",
      phone: order.customer?.phone ?? "",
      address:
        typeof order.customer?.address === "string"
          ? order.customer.address
          : "",
      notes: order.notes ?? "",
      status: String(order.status ?? "pending").toLowerCase(),
      paymentStatus: String(order.paymentStatus ?? "pending").toLowerCase(),
      deliveryCharge: String(order.deliveryCharge ?? order.shippingAmount ?? 0),
      items: (order.items ?? []).map((item: any) => ({
        productId: item.productId ?? item.id ?? "",
        name: item.productName ?? item.name ?? "Product",
        quantity: Number(item.quantity) || 1,
        unitPrice: Number(item.unitPrice ?? item.price) || 0,
      })),
    });
  };

  const saveOrderEdit = async () => {
    if (!editingOrder) return;
    try {
      await updateOrder({
        id: editingOrder.id,
        data: {
          customer: {
            name: editForm.name,
            phone: editForm.phone,
            address: editForm.address,
          },
          notes: editForm.notes || undefined,
          paymentStatus: editForm.paymentStatus,
          deliveryCharge: Number(editForm.deliveryCharge) || 0,
          items: editForm.items.map(({ productId, quantity, unitPrice }) => ({
            productId,
            quantity,
            unitPrice,
          })),
        },
      }).unwrap();
      if (editForm.status !== String(editingOrder.status).toLowerCase())
        await updateOrderStatus({
          id: editingOrder.id,
          status: editForm.status as OrderStatus,
        }).unwrap();
      setEditingOrder(null);
    } catch (error: any) {
      window.alert(error?.data?.message ?? "Could not update this order.");
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
                setStatus(e.target.value as OrderStatus | "");
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="incomplete">Incomplete</option>
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
                          href={`/dashboard/orders/${order.id}`}
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
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditOrder(order)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleBookOrder(order.id)}
                            disabled={booking || bookingOrderId === order.id}
                            title={
                              order.courier
                                ? "Rebook with default courier"
                                : "Book with default courier"
                            }
                          >
                            {bookingOrderId === order.id
                              ? "Booking..."
                              : order.courier
                                ? "Rebook courier"
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

      {editingOrder && (
        <div
          className="modal-overlay"
          onClick={(event) =>
            event.target === event.currentTarget && setEditingOrder(null)
          }
        >
          <div className="modal" style={{ maxWidth: 720, width: "100%" }}>
            <div className="modal-header">
              <h2 className="modal-title">Update order</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setEditingOrder(null)}
              >
                Close
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={editForm.status}
                  onChange={(event) =>
                    setEditForm({ ...editForm, status: event.target.value })
                  }
                >
                  {[
                    "incomplete",
                    "pending",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                    "returned",
                  ].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div className="form-group">
                  <label className="form-label">Payment status</label>
                  <select
                    className="form-select"
                    value={editForm.paymentStatus}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        paymentStatus: event.target.value,
                      })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery charge</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    value={editForm.deliveryCharge}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        deliveryCharge: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Customer name</label>
                <input
                  className="form-input"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm({ ...editForm, name: event.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  value={editForm.phone}
                  onChange={(event) =>
                    setEditForm({ ...editForm, phone: event.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editForm.address}
                  onChange={(event) =>
                    setEditForm({ ...editForm, address: event.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Order note</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={editForm.notes}
                  onChange={(event) =>
                    setEditForm({ ...editForm, notes: event.target.value })
                  }
                />
              </div>
              {editForm.items.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Products and prices</label>
                  <div style={{ display: "grid", gap: 8 }}>
                    {editForm.items.map((item, index) => (
                      <div
                        key={`${item.productId}-${index}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) 90px 120px",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 500 }}>
                          {item.name}
                        </span>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className="form-input"
                          aria-label={`${item.name} quantity`}
                          value={item.quantity}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              items: editForm.items.map((current, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...current,
                                      quantity: Number(event.target.value) || 1,
                                    }
                                  : current,
                              ),
                            })
                          }
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-input"
                          aria-label={`${item.name} price`}
                          value={item.unitPrice}
                          onChange={(event) =>
                            setEditForm({
                              ...editForm,
                              items: editForm.items.map((current, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...current,
                                      unitPrice:
                                        Number(event.target.value) || 0,
                                    }
                                  : current,
                              ),
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setEditingOrder(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveOrderEdit}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
