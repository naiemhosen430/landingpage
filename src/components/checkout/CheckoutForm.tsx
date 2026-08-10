"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlaceOrderMutation } from "@/store/publicApi";
import { formatCurrency } from "@/lib/utils";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutFormProps {
  items: CheckoutItem[];
  deliveryCharge?: number;
  codCharge?: number;
  onClear?: () => void;
}

export default function CheckoutForm({
  items,
  deliveryCharge = 60,
  codCharge = 0,
  onClear,
}: CheckoutFormProps) {
  const router = useRouter();
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    postcode: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "online",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total =
    subtotal + deliveryCharge + (form.paymentMethod === "cod" ? codCharge : 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || items.length === 0) return;

    try {
      const result = await placeOrder({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: {
            street: form.address,
            city: form.city,
            state: form.district || undefined,
            zipCode: form.postcode || undefined,
            country: "Bangladesh",
          },
        },
        notes: form.notes || undefined,
      }).unwrap();

      if (onClear) onClear();
      router.push(`/thank-you?order=${result.data.id}`);
    } catch (err: any) {
      alert(err?.data?.message || "Failed to place order");
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Your cart is empty
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Add products to continue
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your full name"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Phone *</label>
          <input
            className="form-input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="01XXXXXXXXX"
          />
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Delivery Address *</label>
        <textarea
          className="form-textarea"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="House, Road, Area"
          rows={2}
        />
        {errors.address && <div className="form-error">{errors.address}</div>}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        <div className="form-group">
          <label className="form-label">City *</label>
          <input
            className="form-input"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Dhaka"
          />
          {errors.city && <div className="form-error">{errors.city}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">District</label>
          <input
            className="form-input"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Postcode</label>
          <input
            className="form-input"
            value={form.postcode}
            onChange={(e) => setForm({ ...form, postcode: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Order Notes</label>
        <textarea
          className="form-textarea"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Any special instructions..."
          rows={2}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="form-label">Payment Method</label>
        <div style={{ display: "flex", gap: 12 }}>
          <label
            style={{
              flex: 1,
              padding: 16,
              border: `2px solid ${form.paymentMethod === "cod" ? "var(--primary)" : "var(--border-color)"}`,
              borderRadius: "var(--radius)",
              cursor: "pointer",
              background:
                form.paymentMethod === "cod"
                  ? "var(--primary-light)"
                  : "var(--bg-primary)",
            }}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={form.paymentMethod === "cod"}
              onChange={() => setForm({ ...form, paymentMethod: "cod" })}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Cash on Delivery</span>
          </label>
          <label
            style={{
              flex: 1,
              padding: 16,
              border: `2px solid ${form.paymentMethod === "online" ? "var(--primary)" : "var(--border-color)"}`,
              borderRadius: "var(--radius)",
              cursor: "pointer",
              background:
                form.paymentMethod === "online"
                  ? "var(--primary-light)"
                  : "var(--bg-primary)",
            }}
          >
            <input
              type="radio"
              name="payment"
              value="online"
              checked={form.paymentMethod === "online"}
              onChange={() => setForm({ ...form, paymentMethod: "online" })}
              style={{ marginRight: 8 }}
            />
            <span style={{ fontWeight: 600 }}>Online Payment</span>
          </label>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius)",
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h4 style={{ marginBottom: 12, fontSize: 16 }}>Order Summary</h4>
        {items.map((item) => (
          <div
            key={item.productId}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              fontSize: 14,
            }}
          >
            <span>
              {item.name} x{item.quantity}
            </span>
            <span style={{ fontWeight: 500 }}>
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            marginTop: 8,
            paddingTop: 8,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
          }}
        >
          <span style={{ color: "var(--text-secondary)" }}>Delivery</span>
          <span>{formatCurrency(deliveryCharge)}</span>
        </div>
        {form.paymentMethod === "cod" && codCharge > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              padding: "4px 0",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>COD Charge</span>
            <span>{formatCurrency(codCharge)}</span>
          </div>
        )}
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            marginTop: 8,
            paddingTop: 12,
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={isLoading}
        style={{ width: "100%" }}
      >
        {isLoading
          ? "Placing Order..."
          : `Place Order - ${formatCurrency(total)}`}
      </button>
    </form>
  );
}
