"use client";

import { useParams } from "next/navigation";
import {
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/store/orderApi";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const statusMap: Record<string, string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  shipped: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-danger",
  returned: "badge-danger",
};

const allStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderQuery(id as string);
  const [updateStatus, { isLoading: updating }] =
    useUpdateOrderStatusMutation();

  const order = data?.data;

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus({ id: id as string, status }).unwrap();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">Order not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Order #{order.orderNumber}</h1>
          <p className="page-subtitle">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`badge ${statusMap[order.status]}`}>
            {order.status}
          </span>
          <span
            className={`badge ${order.paymentStatus === "paid" ? "badge-success" : "badge-warning"}`}
          >
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3 className="card-title">Order Items</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th style={{ textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any) => (
                      <tr key={item.id}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{item.name}</div>
                          {item.variant && (
                            <div
                              style={{
                                fontSize: 12,
                                color: "var(--text-muted)",
                              }}
                            >
                              {item.variant}
                            </div>
                          )}
                          <div
                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                          >
                            SKU: {item.sku}
                          </div>
                        </td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3 className="card-title">Order Timeline</h3>
            </div>
            <div className="card-body">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {order.timeline?.map((event: any) => (
                  <div key={event.id} style={{ display: "flex", gap: 12 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "var(--primary)",
                        marginTop: 6,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 500 }}>{event.status}</div>
                      {event.note && (
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--text-secondary)",
                          }}
                        >
                          {event.note}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 2,
                        }}
                      >
                        {formatDateTime(event.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {order.courier && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Courier Information</h3>
              </div>
              <div className="card-body">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Courier
                    </div>
                    <div style={{ fontWeight: 500 }}>{order.courier.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Tracking
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      {order.courier.trackingNumber || "N/A"}
                    </div>
                  </div>
                  {order.courier.estimatedDelivery && (
                    <div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        Est. Delivery
                      </div>
                      <div style={{ fontWeight: 500 }}>
                        {order.courier.estimatedDelivery}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3 className="card-title">Update Status</h3>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={order.status === s || updating}
                    className={`btn ${order.status === s ? "btn-primary" : "btn-secondary"}`}
                    style={{
                      justifyContent: "flex-start",
                      textTransform: "capitalize",
                    }}
                  >
                    {s}
                    {order.status === s && (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginLeft: "auto" }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3 className="card-title">Customer</h3>
            </div>
            <div className="card-body">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Name
                  </div>
                  <div style={{ fontWeight: 500 }}>{order.customer.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Phone
                  </div>
                  <div style={{ fontWeight: 500 }}>{order.customer.phone}</div>
                </div>
                {order.customer.email && (
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Email
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      {order.customer.email}
                    </div>
                  </div>
                )}
                {order.customer.address && (
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Address
                    </div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>
                      {order.customer.address}
                    </div>
                    <div
                      style={{ fontSize: 13, color: "var(--text-secondary)" }}
                    >
                      {order.customer.city}
                      {order.customer.city && order.customer.district
                        ? ", "
                        : ""}
                      {order.customer.district}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Order Summary</h3>
            </div>
            <div className="card-body">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Subtotal
                  </span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "var(--success)",
                    }}
                  >
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Delivery
                  </span>
                  <span>{formatCurrency(order.deliveryCharge)}</span>
                </div>
                {order.codCharge > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>
                      COD Charge
                    </span>
                    <span>{formatCurrency(order.codCharge)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                )}
                <div
                  style={{
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: 10,
                    marginTop: 4,
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
