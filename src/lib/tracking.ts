import type { PublicAnalyticsEvent } from "@/store/publicApi";

const DEDUPE_WINDOW_MS = 60_000;
const STORAGE_PREFIX = "zane-tracking:";

type DataLayer = Array<Record<string, unknown>>;

function getDataLayer(): DataLayer {
  if (typeof window === "undefined") return [];
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer as DataLayer;
}

function hasRecentlyFired(key: string) {
  if (typeof window === "undefined") return false;
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const timestamp = Number(window.sessionStorage.getItem(storageKey));
  if (!timestamp || Date.now() - timestamp >= DEDUPE_WINDOW_MS) {
    window.sessionStorage.removeItem(storageKey);
    return false;
  }
  return true;
}

function markFired(key: string) {
  if (typeof window === "undefined") return;
  const storageKey = `${STORAGE_PREFIX}${key}`;
  window.sessionStorage.setItem(storageKey, String(Date.now()));
  window.setTimeout(() => {
    const timestamp = Number(window.sessionStorage.getItem(storageKey));
    if (timestamp && Date.now() - timestamp >= DEDUPE_WINDOW_MS) {
      window.sessionStorage.removeItem(storageKey);
    }
  }, DEDUPE_WINDOW_MS + 100);
}

export function trackStorefrontEvent(
  event: PublicAnalyticsEvent,
  dedupeKey: string,
  send: (event: PublicAnalyticsEvent) => void,
) {
  if (hasRecentlyFired(dedupeKey)) return false;
  markFired(dedupeKey);
  getDataLayer().push({
    event: event.eventName,
    eventType: event.eventType,
    ...event.payload,
  });
  send(event);
  return true;
}

declare global {
  interface Window {
    dataLayer?: DataLayer;
  }
}
