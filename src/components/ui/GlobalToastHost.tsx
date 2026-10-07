"use client";

import { useEffect, useState } from "react";
import {
  subscribeToToasts,
  type ToastMessage,
} from "@/lib/toast";

export default function GlobalToastHost() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(
    () =>
      subscribeToToasts((toast) => {
        setToasts([toast]);
        window.setTimeout(() => {
          setToasts((current) => current.filter((item) => item.id !== toast.id));
        }, 4000);
      }),
    [],
  );

  if (!toasts.length) return null;

  return (
    <div className="global-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          className={`global-toast global-toast-${toast.type}`}
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() =>
              setToasts((current) =>
                current.filter((item) => item.id !== toast.id),
              )
            }
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
