"use client";

import { useState, type FormEvent } from "react";
import { PackageSearch, Truck } from "lucide-react";
import { StorefrontHeader, StorefrontFooter } from "@/components/storefront/Storefront";
import { useTrackPublicOrderMutation } from "@/store/orderApi";
import { useGetPublicSettingsQuery } from "@/store/publicApi";
import { formatCurrency } from "@/lib/utils";

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [trackOrder, { data: order, error, isLoading, isError }] =
    useTrackPublicOrderMutation();
  const { data: settings } = useGetPublicSettingsQuery();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await trackOrder({ orderNumber: orderNumber.trim(), phone: phone.trim() });
  };

  return (
    <div className="storefront-shell">
      <StorefrontHeader settings={settings} />
      <main className="storefront-main store-track-order">
        <section className="store-track-card">
          <div className="store-track-heading">
            <PackageSearch size={27} aria-hidden="true" />
            <div>
              <h1>Track your order</h1>
              <p>Enter your order number and the phone number used at checkout.</p>
            </div>
          </div>

          <form className="store-track-form" onSubmit={handleSubmit}>
            <label>
              Order number
              <input
                required
                autoComplete="off"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="e.g. ORD-12345"
              />
            </label>
            <label>
              Phone number
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number used at checkout"
              />
            </label>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Finding order..." : "Track order"}
            </button>
          </form>

          {isError && (
            <p className="store-track-error" role="alert">
              {"data" in error && error.data && typeof error.data === "object" &&
              "message" in error.data &&
              typeof error.data.message === "string"
                ? error.data.message
                : "Could not find an order with those details. Check the order number and phone number, then try again."}
            </p>
          )}

          {order && (
            <section className="store-track-result" aria-live="polite">
              <div className="store-track-result-heading">
                <div>
                  <span>Order</span>
                  <h2>#{order.orderNumber}</h2>
                </div>
                <span className="store-track-status">
                  {formatStatus(order.status)}
                </span>
              </div>
              <dl>
                <div>
                  <dt>Placed</dt>
                  <dd>{new Date(order.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>{formatStatus(order.paymentStatus)}</dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>{formatCurrency(order.total, settings?.store?.currency)}</dd>
                </div>
              </dl>
              {order.courier && (
                <div className="store-track-courier">
                  <Truck size={18} aria-hidden="true" />
                  <div>
                    <strong>{order.courier.name}</strong>
                    <span>{formatStatus(order.courier.status)}</span>
                    {order.courier.trackingNumber && (
                      <span>Tracking number: {order.courier.trackingNumber}</span>
                    )}
                  </div>
                </div>
              )}
              <h3>Items</h3>
              <ul>
                {order.items.map((item, index) => (
                  <li key={`${item.productName}-${index}`}>
                    <span>
                      {item.productName}
                      {item.variantName ? ` (${item.variantName})` : ""}
                    </span>
                    <span>× {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </main>
      <StorefrontFooter settings={settings} />
    </div>
  );
}
