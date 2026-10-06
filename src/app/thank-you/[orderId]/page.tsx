"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { initializeBrowserPixels, trackStorefrontEvent } from "@/lib/tracking";
import {
  useGetPublicCategoriesQuery,
  useGetPublicOrderQuery,
  useGetPublicSettingsQuery,
  useTrackAnalyticsEventMutation,
} from "@/store/publicApi";
import {
  StorefrontFooter,
  StorefrontHeader,
} from "@/components/storefront/Storefront";

const displayAddress = (address: unknown) =>
  typeof address === "string"
    ? address
    : address
      ? Object.values(address as Record<string, unknown>)
          .filter(Boolean)
          .join(", ")
      : "-";

export default function Page() {
  const params = useParams();
  const orderId = typeof params.orderId === "string" ? params.orderId : "";
  const {
    data: order,
    isLoading,
    isError,
  } = useGetPublicOrderQuery(orderId, { skip: !orderId });
  const { data: settings } = useGetPublicSettingsQuery();
  const { data: categories = [] } = useGetPublicCategoriesQuery();
  const [trackAnalyticsEvent] = useTrackAnalyticsEventMutation();
  const money = (value: unknown) =>
    formatCurrency(Number(value) || 0, settings?.store?.currency);

  useEffect(() => {
    initializeBrowserPixels({
      facebookPixelId: settings?.store?.socialTracking?.facebook?.enabled
        ? settings.store.socialTracking.facebook.pixelId
        : undefined,
      tiktokPixelId: settings?.store?.socialTracking?.tiktok?.enabled
        ? settings.store.socialTracking.tiktok.pixelId
        : undefined,
    });
  }, [settings]);

  useEffect(() => {
    if (!orderId || !order) return;
    const customer = order.customer ?? {};
    const trackingPayload = {
      event_id: `purchase-${order.id || orderId}`,
      orderId,
      value: Number(order.total) || 0,
      currency: order.currency || settings?.store?.currency || "BDT",
      phone: customer?.phone || order.customerPhone,
      contentIds: (order.items ?? [])
        .map((item: any) => item.productId)
        .filter(Boolean),
      contents: (order.items ?? []).map((item: any) => ({
        id: item.productId,
        content_name: item.name || item.productName,
        quantity: Number(item.quantity) || 1,
        item_price: Number(item.unitPrice ?? item.price) || 0,
      })),
      num_items: (order.items ?? []).reduce(
        (total: number, item: any) => total + (Number(item.quantity) || 1),
        0,
      ),
      url: window.location.href,
    };
    trackStorefrontEvent(
      {
        eventType: "page_view",
        eventName: "page_view",
        payload: {
          ...trackingPayload,
          event_id: `thank-you-view-${order.id || orderId}`,
        },
        url: window.location.href,
      },
      `thank-you-page-view-${order.id || orderId}`,
      trackAnalyticsEvent,
    );
    trackStorefrontEvent(
      {
        eventType: "purchase",
        eventName: "purchase",
        payload: trackingPayload,
        url: window.location.href,
      },
      `purchase-${order.id || orderId}`,
      trackAnalyticsEvent,
    );
  }, [order, orderId, settings?.store?.currency, trackAnalyticsEvent]);

  if (isLoading) {
    return (
      <div
        className="storefront-shell"
        style={
          settings?.branding?.primaryColor
            ? ({
                "--store-teal": settings.branding.primaryColor,
              } as React.CSSProperties)
            : undefined
        }
      >
        <StorefrontHeader settings={settings} categories={categories} />
        <main className="storefront-main thank-you-page">
          <div className="invoice-state">Loading your order...</div>
        </main>
        <StorefrontFooter settings={settings} categories={categories} />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div
        className="storefront-shell"
        style={
          settings?.branding?.primaryColor
            ? ({
                "--store-teal": settings.branding.primaryColor,
              } as React.CSSProperties)
            : undefined
        }
      >
        <StorefrontHeader settings={settings} categories={categories} />
        <main className="storefront-main thank-you-page">
          <div className="invoice-state">
            <h1>Order not found</h1>
            <p>We could not load this order right now.</p>
            <Link href="/" className="btn btn-primary">
              Continue shopping
            </Link>
          </div>
        </main>
        <StorefrontFooter settings={settings} categories={categories} />
      </div>
    );
  }

  const subtotal = order.subtotal ?? 0;
  const delivery =
    order.deliveryCharge ?? order.shippingAmount ?? order.shipping ?? 0;
  const discount = order.discount ?? order.discountAmount ?? 0;
  const tax = order.tax ?? order.taxAmount ?? 0;
  const codCharge = order.codCharge ?? 0;

  return (
    <div
      className="storefront-shell"
      style={
        settings?.branding?.primaryColor
          ? ({
              "--store-teal": settings.branding.primaryColor,
            } as React.CSSProperties)
          : undefined
      }
    >
      <StorefrontHeader settings={settings} categories={categories} />
      <main className="thank-you-page">
        <div className="invoice-shell">
          <header className="invoice-header">
            <div>
              <div className="invoice-kicker">Order confirmed</div>
              <h1>Thank you for your order</h1>
              <p>We will contact you shortly to confirm delivery details.</p>
            </div>
            <div className="invoice-checkmark" aria-hidden="true">
              ✓
            </div>
          </header>

          <div className="invoice-meta-grid">
            <div>
              <span>Order number</span>
              <strong>
                {order.orderNumber || `#${orderId.slice(-8).toUpperCase()}`}
              </strong>
            </div>
            <div>
              <span>Order date</span>
              <strong>
                {order.createdAt ? formatDateTime(order.createdAt) : "-"}
              </strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>{order.paymentMethod || "-"}</strong>
            </div>
            <div>
              <span>Delivery area</span>
              <strong>{order.deliveryZone || "-"}</strong>
            </div>
          </div>

          <section className="invoice-section">
            <div className="invoice-section-title">
              <h2>Items</h2>
              <span>
                {order.items?.length ?? 0} item
                {order.items?.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="invoice-items">
              {(order.items ?? []).map((item: any, index: number) => {
                const quantity = Number(item.quantity) || 0;
                const price = Number(item.price) || 0;
                return (
                  <div
                    className="invoice-item"
                    key={item.id ?? `${item.productId}-${index}`}
                  >
                    <div>
                      <strong>
                        {item.name || item.productName || "Product"}
                      </strong>
                      {(item.variant || item.variantName) && (
                        <small>{item.variant || item.variantName}</small>
                      )}
                    </div>
                    <span>
                      {quantity} x {money(price)}
                    </span>
                    <strong>{money(item.total ?? price * quantity)}</strong>
                  </div>
                );
              })}
              {!order.items?.length && (
                <p className="invoice-empty">
                  No item details were returned for this order.
                </p>
              )}
            </div>
          </section>

          <div className="invoice-lower-grid">
            <section className="invoice-section invoice-customer">
              <div className="invoice-section-title">
                <h2>Customer details</h2>
              </div>
              <dl>
                <div>
                  <dt>Name</dt>
                  <dd>{order.customer?.name || order.customerName || "-"}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{order.customer?.phone || order.customerPhone || "-"}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{displayAddress(order.customer?.address)}</dd>
                </div>
              </dl>
              {order.notes && (
                <div className="invoice-note">
                  <span>Delivery note</span>
                  <p>{order.notes}</p>
                </div>
              )}
            </section>
            <section className="invoice-section invoice-totals">
              <div className="invoice-section-title">
                <h2>Summary</h2>
              </div>
              <div className="invoice-total-line">
                <span>Subtotal</span>
                <strong>{money(subtotal)}</strong>
              </div>
              {discount > 0 && (
                <div className="invoice-total-line invoice-discount">
                  <span>Discount</span>
                  <strong>-{money(discount)}</strong>
                </div>
              )}
              <div className="invoice-total-line">
                <span>Delivery</span>
                <strong>{money(delivery)}</strong>
              </div>
              {tax > 0 && (
                <div className="invoice-total-line">
                  <span>Tax</span>
                  <strong>{money(tax)}</strong>
                </div>
              )}
              {codCharge > 0 && (
                <div className="invoice-total-line">
                  <span>COD charge</span>
                  <strong>{money(codCharge)}</strong>
                </div>
              )}
              <div className="invoice-grand-total">
                <span>Total</span>
                <strong>{money(order.total)}</strong>
              </div>
            </section>
          </div>

          <footer className="invoice-footer">
            <span>
              Status: <strong>{order.status || "PENDING"}</strong>
            </span>
            <Link href="/" className="btn btn-primary">
              Continue shopping
            </Link>
          </footer>
        </div>
      </main>
      <StorefrontFooter settings={settings} categories={categories} />
    </div>
  );
}
