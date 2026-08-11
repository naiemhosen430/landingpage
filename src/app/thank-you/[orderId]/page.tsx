"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useTrackAnalyticsEventMutation } from "@/store/publicApi";

export default function Page() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [trackAnalyticsEvent] = useTrackAnalyticsEventMutation();

  useEffect(() => {
    if (orderId) {
      trackAnalyticsEvent({
        eventType: "purchase",
        eventName: "purchase_completed",
        payload: { orderId },
      });
    }
  }, [orderId, trackAnalyticsEvent]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-secondary)",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "var(--bg-primary)",
          borderRadius: "var(--radius-lg)",
          padding: "48px 32px",
          textAlign: "center",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: "var(--success-light)",
            color: "var(--success)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Order Placed!
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: 24,
            fontSize: 15,
          }}
        >
          Thank you for your order. We will contact you shortly to confirm the
          delivery details.
        </p>

        {orderId && (
          <div
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius)",
              padding: "16px 20px",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "var(--text-muted)",
                marginBottom: 4,
              }}
            >
              Order ID
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--primary)",
                fontFamily: "monospace",
              }}
            >
              #{orderId.slice(-8).toUpperCase()}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
