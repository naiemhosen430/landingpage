export type ToastType = "success" | "error" | "info";

export type ToastMessage = {
  id: number;
  message: string;
  type: ToastType;
};

const TOAST_EVENT = "app:toast";
let nextToastId = 0;

export function notifyToast(message: string, type: ToastType = "info") {
  if (typeof window === "undefined" || !message.trim()) return;
  const detail: ToastMessage = {
    id: ++nextToastId,
    message: message.trim(),
    type,
  };
  window.dispatchEvent(new CustomEvent<ToastMessage>(TOAST_EVENT, { detail }));
}

export function subscribeToToasts(
  callback: (toast: ToastMessage) => void,
) {
  if (typeof window === "undefined") return () => {};
  const listener = (event: Event) => {
    const toast = (event as CustomEvent<ToastMessage>).detail;
    if (toast) callback(toast);
  };
  window.addEventListener(TOAST_EVENT, listener);
  return () => window.removeEventListener(TOAST_EVENT, listener);
}
