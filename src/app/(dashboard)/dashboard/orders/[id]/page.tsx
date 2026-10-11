"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Printer } from "lucide-react";
import { useGetOrderQuery } from "@/store/orderApi";
import { useGetSettingsQuery } from "@/store/settingsApi";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

const statusMap: Record<string, string> = {
  pending: "badge-warning",
  confirmed: "badge-info",
  processing: "badge-info",
  shipped: "badge-info",
  delivered: "badge-success",
  cancelled: "badge-danger",
  returned: "badge-danger",
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderQuery(id as string);
  const { data: settingsResponse, isLoading: settingsLoading } =
    useGetSettingsQuery(undefined);
  const autoPrintStarted = useRef(false);

  const order = data;
  const settings = settingsResponse?.data;

  useEffect(() => {
    if (
      !order ||
      isLoading ||
      settingsLoading ||
      autoPrintStarted.current ||
      new URLSearchParams(window.location.search).get("print") !== "1"
    ) {
      return;
    }
    autoPrintStarted.current = true;
    const timer = window.setTimeout(() => window.print(), 400);
    return () => window.clearTimeout(timer);
  }, [isLoading, order, settingsLoading]);

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
    <div className="admin-order-detail">
      <div className="page-header">
        <div>
          <h1 className="page-title">Order #{order.orderNumber}</h1>
          <p className="page-subtitle">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="admin-order-header-actions">
          <span className={`badge ${statusMap[order.status]}`}>
            {order.status}
          </span>
          <span
            className={`badge ${order.paymentStatus === "paid" ? "badge-success" : "badge-warning"}`}
          >
            {order.paymentStatus}
          </span>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => window.print()}
          >
            <Printer size={16} aria-hidden="true" />
            Print invoice
          </button>
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
                          <div style={{ fontWeight: 500 }}>
                            {item.name ?? item.productName}
                          </div>
                          {(item.variant || item.variantName) && (
                            <div
                              style={{
                                fontSize: 12,
                                color: "var(--text-muted)",
                              }}
                            >
                              {item.variant ?? item.variantName}
                            </div>
                          )}
                          <div
                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                          >
                            SKU: {item.sku ?? "-"}
                          </div>
                        </td>
                        <td>{formatCurrency(item.unitPrice ?? item.price)}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: "right", fontWeight: 600 }}>
                          {formatCurrency(item.totalPrice ?? item.total)}
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
                  <div style={{ fontWeight: 500 }}>{order.customer?.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Phone
                  </div>
                  <div style={{ fontWeight: 500 }}>{order.customer?.phone}</div>
                </div>
                {order.customer?.email && (
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Email
                    </div>
                    <div style={{ fontWeight: 500 }}>
                      {order.customer?.email}
                    </div>
                  </div>
                )}
                {order.customer?.address && (
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Address
                    </div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>
                      {typeof order.customer?.address === "string"
                        ? order.customer?.address
                        : Object.values(order.customer?.address).join(", ")}
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
                     Payment method
                   </span>
                   <span>
                     {order.paymentMethodName ||
                       order.paymentMethod
                         ?.replace(/[_-]/g, " ")
                         .replace(/\b\w/g, (letter: string) =>
                           letter.toUpperCase(),
                         ) ||
                       "Not selected"}
                   </span>
                 </div>
                 <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Subtotal
                  </span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {(order.discount ?? order.discountAmount ?? 0) > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "var(--success)",
                    }}
                  >
                    <span>Discount</span>
                    <span>
                      -{formatCurrency(order.discount ?? order.discountAmount)}
                    </span>
                  </div>
                )}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    Delivery
                  </span>
                  <span>
                    {formatCurrency(
                      order.deliveryCharge ??
                        order.shippingAmount ??
                        order.shipping ??
                        0,
                    )}
                  </span>
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
                {(order.tax ?? order.taxAmount ?? 0) > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>Tax</span>
                    <span>{formatCurrency(order.tax ?? order.taxAmount)}</span>
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

      <article className="admin-invoice" aria-label="Order invoice">
        <header className="admin-invoice-header">
          <div className="admin-invoice-logo">
            {settings?.branding.logo?.secureUrl || settings?.branding.logo?.url ? (
              <img
                src={
                  settings.branding.logo.secureUrl ||
                  settings.branding.logo.url ||
                  ""
                }
                alt={`${settings.store.name || "Store"} logo`}
              />
            ) : (
              <strong>{settings?.store.name || "Store"}</strong>
            )}
          </div>
          <div className="admin-invoice-number">
            NO. {order.orderNumber}
          </div>
          <h2>INVOICE</h2>
          <p>
            <strong>Date:</strong> {formatDate(order.createdAt)}
          </p>
        </header>

        <div className="admin-invoice-parties">
          <section>
            <h3>Billed to:</h3>
            <strong>{order.customer?.name || "Customer"}</strong>
            {order.customer?.phone && <span>{order.customer.phone}</span>}
            {order.customer?.email && <span>{order.customer.email}</span>}
            {order.customer?.address && (
              <span>
                {typeof order.customer.address === "string"
                  ? order.customer.address
                  : Object.values(order.customer.address).filter(Boolean).join(", ")}
              </span>
            )}
            {(order.customer?.city || order.customer?.district) && (
              <span>
                {[order.customer.city, order.customer.district]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            )}
          </section>
          <section>
            <h3>From:</h3>
            <strong>{settings?.store.name || "Store"}</strong>
            {settings?.contact.address &&
              Object.values(settings.contact.address)
                .filter(Boolean)
                .map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}
            {settings?.contact.email && <span>{settings.contact.email}</span>}
            {settings?.contact.phone && <span>{settings.contact.phone}</span>}
          </section>
        </div>

        <div className="admin-invoice-table-wrap">
          <table className="admin-invoice-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, index: number) => {
                const quantity = Number(item.quantity) || 0;
                const price = Number(item.unitPrice ?? item.price) || 0;
                const amount =
                  Number(item.totalPrice ?? item.total) || price * quantity;
                return (
                  <tr key={item.id ?? `${item.productId}-${index}`}>
                    <td>
                      {item.name ?? item.productName ?? "Product"}
                      {(item.variant ?? item.variantName) && (
                        <small>{item.variant ?? item.variantName}</small>
                      )}
                    </td>
                    <td>{quantity}</td>
                    <td>{formatCurrency(price, order.currency)}</td>
                    <td>{formatCurrency(amount, order.currency)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {(order.discount ?? order.discountAmount ?? 0) > 0 && (
                <tr>
                  <th colSpan={3}>Discount</th>
                  <td>
                    -{formatCurrency(
                      order.discount ?? order.discountAmount,
                      order.currency,
                    )}
                  </td>
                </tr>
              )}
              {(order.deliveryCharge ?? order.shippingAmount ?? order.shipping ?? 0) > 0 && (
                <tr>
                  <th colSpan={3}>Delivery</th>
                  <td>
                    {formatCurrency(
                      order.deliveryCharge ??
                        order.shippingAmount ??
                        order.shipping ??
                        0,
                      order.currency,
                    )}
                  </td>
                </tr>
              )}
              {(order.tax ?? order.taxAmount ?? 0) > 0 && (
                <tr>
                  <th colSpan={3}>Tax</th>
                  <td>
                    {formatCurrency(order.tax ?? order.taxAmount, order.currency)}
                  </td>
                </tr>
              )}
              {(order.codCharge ?? 0) > 0 && (
                <tr>
                  <th colSpan={3}>COD charge</th>
                  <td>{formatCurrency(order.codCharge, order.currency)}</td>
                </tr>
              )}
              <tr className="admin-invoice-total">
                <th colSpan={3}>Total</th>
                <td>{formatCurrency(order.total, order.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <footer className="admin-invoice-footer">
          <p>
            <strong>Payment method:</strong>{" "}
            {order.paymentMethodName ||
              order.paymentMethod
                ?.replace(/[_-]/g, " ")
                .replace(/\b\w/g, (letter: string) => letter.toUpperCase()) ||
              "Not selected"}
          </p>
          {order.notes && (
            <p>
              <strong>Note:</strong> {order.notes}
            </p>
          )}
          <span>{settings?.store.name || "Thank you for your business."}</span>
        </footer>
      </article>
    </div>
  );
}
