import type { PublicAnalyticsEvent } from "@/store/publicApi";

const DEDUPE_WINDOW_MS = 60_000;
const STORAGE_PREFIX = "zane-tracking:";
const VISITOR_KEY = `${STORAGE_PREFIX}visitor-id`;
const SESSION_KEY = `${STORAGE_PREFIX}session-id`;

type DataLayer = Array<Record<string, unknown>>;
type FacebookPixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: (...args: unknown[]) => void;
  loaded?: boolean;
  version?: string;
};
type TikTokPixel = {
  [key: string]: unknown;
  q: unknown[][];
  methods: string[];
  _i: Record<string, unknown[]>;
  _t: Record<string, number>;
  _o: Record<string, unknown>;
  load: (pixelId: string) => void;
  page: (...args: unknown[]) => void;
  track: (...args: unknown[]) => void;
};

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
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue?.push(args);
      },
      { queue: [] as unknown[][], loaded: true, version: "2.0" },
    ) as FacebookPixel;
    fbq.push = fbq;
    window.fbq = fbq;
    const script = document.createElement("script");
    script.id = "zane-facebook-pixel-sdk";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    window.fbq("init", options.facebookPixelId);
    pixelState.facebookInitialized = true;
  }

  if (
    options.tiktokPixelId &&
    !pixelState.tiktokInitialized &&
    !window.ttq &&
    !document.getElementById("zane-tiktok-pixel-sdk")
  ) {
    const ttq = [] as unknown as TikTokPixel;
    ttq.q = [];
    ttq.methods = [
      "page",
      "track",
      "identify",
      "instances",
      "debug",
      "on",
      "off",
      "once",
      "ready",
      "alias",
      "group",
      "enableCookie",
      "disableCookie",
    ];
    ttq._i = { [options.tiktokPixelId]: [] };
    ttq._t = { [options.tiktokPixelId]: Date.now() };
    ttq._o = {};
    ttq.methods.forEach((method) => {
      ttq[method] = (...args: unknown[]) => {
        const call = [method, ...args];
        ttq.q.push(call);
        Array.prototype.push.call(ttq, call);
      };
    });
    ttq.load = (pixelId: string) => {
      const script = document.createElement("script");
      script.id = "zane-tiktok-pixel-sdk";
      script.async = true;
      script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`;
      document.head.appendChild(script);
    };
    window.TiktokAnalyticsObject = "ttq";
    window.ttq = ttq;
    ttq.load?.(options.tiktokPixelId);
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
  const facebookEventNames: Record<string, string> = {
    page_view: "PageView",
    product_view: "ViewContent",
    add_to_cart: "AddToCart",
    checkout_started: "InitiateCheckout",
    purchase: "Purchase",
  };
  const tiktokEventNames: Record<string, string> = {
    page_view: "Pageview",
    product_view: "ViewContent",
    add_to_cart: "AddToCart",
    checkout_started: "InitiateCheckout",
    purchase: "CompletePayment",
  };
  const facebookEventName =
    facebookEventNames[event.eventType] ?? event.eventName;
  const tiktokEventName = tiktokEventNames[event.eventType] ?? event.eventName;
  const tiktokPayload = {
    ...getPixelProperties(payload),
    ...(Array.isArray(payload.contents)
      ? {
          contents: payload.contents.map((item) => {
            const content = item as Record<string, unknown>;
            return {
              ...(content.id || content.content_id
                ? { content_id: content.content_id ?? content.id }
                : {}),
              ...(content.content_name
                ? { content_name: content.content_name }
                : {}),
              ...(content.quantity != null
                ? { quantity: Number(content.quantity) || 1 }
                : {}),
              ...(content.item_price != null || content.price != null
                ? { price: Number(content.item_price ?? content.price) || 0 }
                : {}),
            };
          }),
        }
      : {}),
    event_id: eventId,
  };
  const facebookPayload = getPixelProperties(payload);
  if (Array.isArray(payload.contents)) {
    facebookPayload.contents = payload.contents.map((item) => {
      const content = item as Record<string, unknown>;
      return {
        ...(content.id || content.content_id
          ? { id: content.id ?? content.content_id }
          : {}),
        ...(content.quantity != null
          ? { quantity: Number(content.quantity) || 1 }
          : {}),
        ...(content.item_price != null
          ? { item_price: Number(content.item_price) || 0 }
          : {}),
      };
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", facebookEventName, facebookPayload, {
      eventID: eventId,
    });
  }
  if (typeof window.ttq?.track === "function") {
    window.ttq.track(tiktokEventName, tiktokPayload);
  }
}

function getPixelProperties(payload: Record<string, unknown>) {
  const allowed = [
    "value",
    "currency",
    "content_ids",
    "content_type",
    "contents",
    "num_items",
    "content_name",
    "order_id",
  ];
  return Object.fromEntries(
    allowed
      .filter((key) => payload[key] !== undefined)
      .map((key) => [key, payload[key]]),
  );
}

function standardizePayload(payload: Record<string, unknown> = {}) {
  const contentIds = payload.content_ids ?? payload.contentIds;
  const contentType = payload.content_type ?? payload.contentType ?? "product";
  const value = payload.value;
  const currency = payload.currency ?? "BDT";
  const contents =
    payload.contents ??
    (Array.isArray(contentIds)
      ? contentIds.map((id) => ({
          id,
          content_id: id,
          ...(payload.contentName ? { content_name: payload.contentName } : {}),
          quantity: Number(payload.quantity) || 1,
          ...(payload.price != null || payload.value != null
            ? { item_price: Number(payload.price ?? payload.value) || 0 }
            : {}),
        }))
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
  const eventKey =
    event.eventType === "add_to_cart"
      ? `${dedupeKey}-${crypto.randomUUID()}`
      : dedupeKey;
  if (hasRecentlyFired(eventKey)) return false;
  markFired(eventKey);
  const eventId = String(
    event.payload?.event_id ?? `${event.eventName}-${eventKey}`,
  );
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
    fbp: typeof document === "undefined" ? undefined : getCookie("_fbp"),
    fbc: typeof document === "undefined" ? undefined : getCookie("_fbc"),
    ttclid:
      typeof window === "undefined"
        ? undefined
        : (new URLSearchParams(window.location.search).get("ttclid") ??
          undefined),
    client_user_agent:
      typeof navigator === "undefined" ? undefined : navigator.userAgent,
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

function getCookie(name: string) {
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix))
    ?.slice(prefix.length);
}

declare global {
  interface Window {
    dataLayer?: DataLayer;
    __zanePixelState?: {
      facebookInitialized: boolean;
      tiktokInitialized: boolean;
    };
    fbq?: FacebookPixel;
    ttq?: TikTokPixel;
    TiktokAnalyticsObject?: string;
  }
}
