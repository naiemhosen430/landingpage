"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  onClose?: () => void;
}

export default function Toast({
  message,
  type = "info",
  visible,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`} role="status">
      {message}
    </div>
  );
}
