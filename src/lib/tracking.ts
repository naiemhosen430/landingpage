import type { PublicAnalyticsEvent } from "@/store/publicApi";

const DEDUPE_WINDOW_MS = 60_000;
const STORAGE_PREFIX = "zane-tracking:";
const VISITOR_KEY = `${STORAGE_PREFIX}visitor-id`;
const SESSION_KEY = `${STORAGE_PREFIX}session-id`;

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

function getClientId(key: string) {
  if (typeof window === "undefined") return undefined;
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
}

function getSessionId() {
  if (typeof window === "undefined") return undefined;
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const value = crypto.randomUUID();
  window.sessionStorage.setItem(SESSION_KEY, value);
  return value;
}

export function initializeBrowserPixels(options: {
  facebookPixelId?: string;
  tiktokPixelId?: string;
}) {
  if (typeof window === "undefined") return;

  const pixelState = (window.__zanePixelState ??= {
    facebookInitialized: false,
    tiktokInitialized: false,
  });

  if (
    options.facebookPixelId &&
    !pixelState.facebookInitialized &&
    !window.fbq &&
    !document.getElementById("zane-facebook-pixel-sdk")
  ) {
    const fbq = Object.assign(
      (...args: unknown[]) => {
        fbq.q.push(args);
      },
      { q: [] as unknown[][] },
    );
    window.fbq = fbq;
    const script = document.createElement("script");
    script.id = "zane-facebook-pixel-sdk";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    window.fbq("init", options.facebookPixelId);
    window.fbq("track", "PageView");
    pixelState.facebookInitialized = true;
  }

  if (
    options.tiktokPixelId &&
    !pixelState.tiktokInitialized &&
    !window.ttq &&
    !document.getElementById("zane-tiktok-pixel-sdk")
  ) {
    const ttq: NonNullable<Window["ttq"]> = {
      track: (...args: unknown[]) => {
        ttq.q?.push(args);
      },
      load: (...args: unknown[]) => {
        ttq.q?.push(["load", ...args]);
      },
      page: (...args: unknown[]) => {
        ttq.q?.push(["page", ...args]);
      },
      q: [],
    };
    window.ttq = ttq;
    const script = document.createElement("script");
    script.id = "zane-tiktok-pixel-sdk";
    script.async = true;
    script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(options.tiktokPixelId)}&lib=ttq`;
    document.head.appendChild(script);
    ttq.load?.(options.tiktokPixelId);
    ttq.page?.();
    ttq.track?.("PageView");
    pixelState.tiktokInitialized = true;
  }
}

function dispatchBrowserPixels(event: PublicAnalyticsEvent) {
  if (typeof window === "undefined") return;
  const payload = Object.fromEntries(
    Object.entries(event.payload ?? {}).filter(
      ([key]) => !["phone", "email", "name", "address"].includes(key),
    ),
  );
  const eventId = String(payload.event_id ?? event.eventName);
  const pixelEventName =
    event.eventType === "product_view"
      ? "ViewContent"
      : event.eventType === "add_to_cart"
        ? "AddToCart"
        : event.eventType === "checkout_started"
          ? "InitiateCheckout"
          : event.eventType === "purchase"
            ? "Purchase"
            : event.eventName;

  if (typeof window.fbq === "function") {
    window.fbq("track", pixelEventName, payload, { eventID: eventId });
  }
  if (typeof window.ttq?.track === "function") {
    window.ttq.track(pixelEventName, payload, { event_id: eventId });
  }
}

function standardizePayload(payload: Record<string, unknown> = {}) {
  const contentIds = payload.content_ids ?? payload.contentIds;
  const contentType = payload.content_type ?? payload.contentType ?? "product";
  const value = payload.value;
  const currency = payload.currency ?? "BDT";
  const contents =
    payload.contents ??
    (Array.isArray(contentIds)
      ? contentIds.map((id) => ({ id, quantity: 1 }))
      : undefined);
  const numItems =
    payload.num_items ??
    (Array.isArray(contents)
      ? contents.reduce(
          (total, item) => total + Number((item as any).quantity ?? 1),
          0,
        )
      : undefined);

  return {
    ...payload,
    ...(contentIds ? { content_ids: contentIds } : {}),
    ...(contentType ? { content_type: contentType } : {}),
    ...(contents ? { contents } : {}),
    ...(numItems !== undefined ? { num_items: numItems } : {}),
    ...(value !== undefined ? { value: Number(value) || 0 } : {}),
    currency,
  };
}

export function trackStorefrontEvent(
  event: PublicAnalyticsEvent,
  dedupeKey: string,
  send: (event: PublicAnalyticsEvent) => void,
) {
  if (hasRecentlyFired(dedupeKey)) return false;
  markFired(dedupeKey);
  const eventId = `${event.eventName}-${dedupeKey}`;
  const standardPayload = {
    ...standardizePayload(event.payload),
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url:
      event.url ??
      (typeof window === "undefined" ? undefined : window.location.href),
    visitor_id: event.visitorId ?? getClientId(VISITOR_KEY),
    session_id: event.sessionId ?? getSessionId(),
  };
  const enrichedEvent = {
    ...event,
    payload: standardPayload,
    visitorId: event.visitorId ?? getClientId(VISITOR_KEY),
    sessionId: event.sessionId ?? getSessionId(),
    referrer:
      event.referrer ??
      (typeof document === "undefined" ? undefined : document.referrer),
  };
  getDataLayer().push({
    event: event.eventName,
    eventType: event.eventType,
    ...standardPayload,
  });
  dispatchBrowserPixels(enrichedEvent);
  send(enrichedEvent);
  return true;
}

declare global {
  interface Window {
    dataLayer?: DataLayer;
    __zanePixelState?: {
      facebookInitialized: boolean;
      tiktokInitialized: boolean;
    };
    fbq?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    ttq?: {
      track?: (...args: unknown[]) => void;
      load?: (...args: unknown[]) => void;
      page?: (...args: unknown[]) => void;
      q?: unknown[][];
    };
  }
}
