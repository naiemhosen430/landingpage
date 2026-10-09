"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Eye, RefreshCw, ShoppingCart, Wallet } from "lucide-react";
import {
  useGetTrackingEventsQuery,
  type TrackingEvent,
} from "@/store/trackingApi";
import { useGetOrdersQuery } from "@/store/orderApi";

type Period = "all" | "today" | "7d" | "30d" | "90d" | "custom";

const periods: { label: string; value: Period }[] = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
  { label: "Custom", value: "custom" },
];

function dateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function periodDates(period: Period) {
  const to = new Date();
  const from = new Date(to);
  if (period === "all") {
    return { from: "", to: "" };
  }
  if (period === "today") {
    return { from: dateInputValue(to), to: dateInputValue(to) };
  }
  const days = period === "7d" ? 6 : period === "90d" ? 89 : 29;
  from.setDate(from.getDate() - days);
  return { from: dateInputValue(from), to: dateInputValue(to) };
}

function formatEventName(event: TrackingEvent) {
  return event.eventName
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString();
}

function formatTimeAgo(value: string | undefined, now: number) {
  if (!value) return "Unknown time";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Unknown time";

  const elapsedSeconds = (timestamp - now) / 1000;
  const elapsed = Math.abs(elapsedSeconds);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  const [unit, secondsPerUnit] =
    units.find(([, seconds]) => elapsed >= seconds) ?? units[units.length - 1];
  const amount = Math.round(elapsedSeconds / secondsPerUnit);

  return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
    amount,
    unit,
  );
}

function formatMoney(value: number) {
  return `৳${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function responseErrorMessage(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return "Unable to load tracking events.";
  }
  if ("data" in error) {
    const data = error.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }
  if ("error" in error && typeof error.error === "string") {
    return error.error;
  }
  return "Unable to load tracking events.";
}

function eventValue(event: TrackingEvent) {
  const value = Number(event.payload.value);
  return Number.isFinite(value) ? value : undefined;
}

function eventLocation(event: TrackingEvent) {
  const location = event.visitor?.location;
  return [location?.city, location?.region, location?.country]
    .filter(Boolean)
    .join(", ");
}

function eventDevice(event: TrackingEvent) {
  const visitor = event.visitor;
  return [
    visitor?.deviceModel ?? visitor?.deviceType,
    visitor?.browser,
    visitor?.operatingSystem,
  ]
    .filter(Boolean)
    .join(" · ");
}

function safePayloadEntries(payload: Record<string, unknown>) {
  const visibleKeys = new Set([
    "event_source_url",
    "url",
    "referrer",
    "page_title",
    "value",
    "currency",
    "order_id",
    "content_type",
    "content_ids",
    "contents",
    "num_items",
  ]);
  return Object.entries(payload).filter(([key]) => visibleKeys.has(key));
}

export default function TrackingPage() {
  const [now, setNow] = useState(() => Date.now());
  const [period, setPeriod] = useState<Period>("all");
  const [dates, setDates] = useState(() => periodDates("all"));
  const [eventType, setEventType] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<TrackingEvent | null>(
    null,
  );
  const customRangeIncomplete = period === "custom" && (!dates.from || !dates.to);
  const customRangeInvalid = Boolean(
    period === "custom" && dates.from && dates.to && dates.from > dates.to,
  );
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetTrackingEventsQuery(
    {
      page,
      limit: 25,
      from: period === "all" ? undefined : dates.from,
      to: period === "all" ? undefined : dates.to,
      eventType: eventType || undefined,
    },
    { skip: customRangeIncomplete || customRangeInvalid },
  );
  const {
    data: orders,
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useGetOrdersQuery({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  const summary = data?.summary;
  const events = data?.data ?? [];
  const breakdown = summary?.eventBreakdown ?? [];
  const locationBreakdown = summary?.locationBreakdown ?? [];
  const deviceBreakdown = summary?.deviceBreakdown ?? [];
  const maxEventCount = Math.max(...breakdown.map((event) => event.count), 1);
  const selectedPayload = useMemo(
    () => (selectedEvent ? safePayloadEntries(selectedEvent.payload) : []),
    [selectedEvent],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const changePeriod = (nextPeriod: Period) => {
    setPeriod(nextPeriod);
    if (nextPeriod !== "custom") setDates(periodDates(nextPeriod));
    setPage(1);
    setSelectedEvent(null);
  };

  const setDate = (key: "from" | "to", value: string) => {
    setDates((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Events Manager</h1>
          <p className="page-subtitle">
            Storefront activity, conversion events, and order tracking
          </p>
        </div>
        <button
          className="btn btn-sm"
          onClick={() => {
            void refetch();
          }}
          disabled={isFetching}
        >
          <RefreshCw size={15} style={{ marginRight: 6 }} />
          Refresh events
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        {periods.map((item) => (
          <button
            key={item.value}
            className="btn btn-sm"
            onClick={() => changePeriod(item.value)}
            style={{
              background:
                period === item.value ? "var(--bg-primary)" : "transparent",
              color:
                period === item.value
                  ? "var(--text-primary)"
                  : "var(--text-secondary)",
              boxShadow: period === item.value ? "var(--shadow-sm)" : "none",
            }}
          >
            {item.label}
          </button>
        ))}
        {period === "custom" && (
          <>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              From
              <input
                type="date"
                value={dates.from}
                onChange={(event) => setDate("from", event.target.value)}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              To
              <input
                type="date"
                value={dates.to}
                onChange={(event) => setDate("to", event.target.value)}
              />
            </label>
          </>
        )}
      </div>

      {customRangeIncomplete && (
        <div className="alert" style={{ marginBottom: 20 }}>
          Choose both dates to view tracking data.
        </div>
      )}
      {customRangeInvalid && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          The start date must be on or before the end date.
        </div>
      )}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          {responseErrorMessage(error)}
        </div>
      )}

      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))" }}
      >
        <div className="card">
          <div className="card-body" style={{ display: "flex", gap: 14 }}>
            <Activity color="var(--primary)" />
            <div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                Tracked events
              </div>
              <strong style={{ fontSize: 24 }}>
                {summary?.totalEvents.toLocaleString() ?? "—"}
              </strong>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ display: "flex", gap: 14 }}>
            <Eye color="var(--info)" />
            <div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                Event types
              </div>
              <strong style={{ fontSize: 24 }}>
                {breakdown.length.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ display: "flex", gap: 14 }}>
            <ShoppingCart color="var(--success)" />
            <div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                Purchase events
              </div>
              <strong style={{ fontSize: 24 }}>
                {summary?.purchases.toLocaleString() ?? "—"}
              </strong>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ display: "flex", gap: 14 }}>
            <ShoppingCart color="var(--primary)" />
            <div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                Orders in store
              </div>
              <strong style={{ fontSize: 24 }}>
                {orders?.meta?.total.toLocaleString() ?? "—"}
              </strong>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ display: "flex", gap: 14 }}>
            <Wallet color="var(--warning)" />
            <div>
              <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                Tracked purchase value
              </div>
              <strong style={{ fontSize: 24 }}>
                {summary ? formatMoney(summary.purchaseRevenue) : "—"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 0.8fr) minmax(0, 1.7fr)",
          gap: 20,
          marginTop: 20,
        }}
      >
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Event activity</h2>
          </div>
          <div className="card-body" style={{ display: "grid", gap: 16 }}>
            {isLoading ? (
              <div>Loading event activity...</div>
            ) : breakdown.length ? (
              breakdown.map((event) => (
                <button
                  key={event.eventType}
                  onClick={() => {
                    setEventType((current) =>
                      current === event.eventType ? "" : event.eventType,
                    );
                    setPage(1);
                  }}
                  style={{
                    display: "grid",
                    gap: 7,
                    textAlign: "left",
                    border: 0,
                    background: "transparent",
                    padding: 0,
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                    }}
                  >
                    <span>{event.eventType.replace(/[_-]+/g, " ")}</span>
                    <strong>{event.count.toLocaleString()}</strong>
                  </span>
                  <span
                    style={{
                      background: "var(--bg-tertiary)",
                      borderRadius: 8,
                      height: 7,
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        width: `${(event.count / maxEventCount) * 100}%`,
                        height: "100%",
                        background: "var(--primary)",
                        borderRadius: 8,
                      }}
                    />
                  </span>
                </button>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-desc">
                  No tracked events for this period.
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="card">
          <div
            className="card-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h2 className="card-title">Recent events</h2>
            <select
              value={eventType}
              onChange={(event) => {
                setEventType(event.target.value);
                setPage(1);
              }}
              aria-label="Filter events by type"
            >
              <option value="">All event types</option>
              {breakdown.map((event) => (
                <option key={event.eventType} value={event.eventType}>
                  {event.eventType.replace(/[_-]+/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {isLoading ? (
              <div style={{ padding: 24 }}>Loading tracking events...</div>
            ) : events.length ? (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Visitor IP</th>
                      <th>Approx. location</th>
                      <th>Device</th>
                      <th>Value</th>
                      <th>Page</th>
                      <th>Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => {
                      const value = eventValue(event);
                      const pageUrl =
                        event.payload.event_source_url ?? event.payload.url;
                      return (
                        <tr
                          key={event.id ?? event._id}
                          onClick={() => setSelectedEvent(event)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            <div style={{ fontWeight: 600 }}>
                              {formatEventName(event)}
                            </div>
                            <div
                              style={{
                                color: "var(--text-muted)",
                                fontSize: 12,
                              }}
                            >
                              {event.eventType}
                            </div>
                          </td>
                          <td>{event.visitor?.ipAddress ?? "Unavailable"}</td>
                          <td title="Approximate location from local GeoIP database">
                            {eventLocation(event) || "Unavailable"}
                          </td>
                          <td>{eventDevice(event) || "Unavailable"}</td>
                          <td>{value === undefined ? "—" : formatMoney(value)}</td>
                          <td
                            style={{
                              maxWidth: 220,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={typeof pageUrl === "string" ? pageUrl : ""}
                          >
                            {typeof pageUrl === "string" ? pageUrl : "—"}
                          </td>
                          <td title={formatDate(event.createdAt)}>
                            {formatTimeAgo(event.createdAt, now)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 32 }}>
                <div className="empty-state-desc">
                  {data
                    ? "No matching events found for this date range."
                    : "Tracking events could not be loaded."}
                </div>
              </div>
            )}
          </div>
          {data?.meta && data.meta.totalPages > 1 && (
            <div
              className="card-body"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                {data.meta.total.toLocaleString()} matching events
              </span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  className="btn btn-sm"
                  disabled={!data.meta.hasPrevPage || isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  Previous
                </button>
                <span>
                  {data.meta.page} / {data.meta.totalPages}
                </span>
                <button
                  className="btn btn-sm"
                  disabled={!data.meta.hasNextPage || isFetching}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {isFetching && (
            <div
              style={{
                color: "var(--text-muted)",
                padding: "0 16px 16px",
                fontSize: 13,
              }}
            >
              Updating events…
            </div>
          )}
        </section>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
          marginTop: 20,
        }}
      >
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Visitor locations</h2>
          </div>
          <div className="card-body" style={{ display: "grid", gap: 12 }}>
            {locationBreakdown.length ? (
              <>
                {locationBreakdown.map((location, index) => {
                  const name =
                    [location.city, location.region, location.country]
                      .filter(Boolean)
                      .join(", ") || "Unknown location";
                  const share =
                    summary && summary.totalEvents
                      ? (location.count / summary.totalEvents) * 100
                      : 0;
                  return (
                    <div key={`${name}-${index}`} style={{ display: "grid", gap: 6 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                        }}
                      >
                        <span>{name}</span>
                        <strong>{location.count.toLocaleString()}</strong>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "var(--bg-tertiary)",
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(share, 100)}%`,
                            height: "100%",
                            background: "var(--info)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                <small style={{ color: "var(--text-muted)" }}>
                  IP-based locations are approximate and depend on the local
                  GeoIP database.
                </small>
              </>
            ) : (
              <div className="empty-state-desc">
                Location data is unavailable. Configure a local MaxMind City
                database and collect events after configuration.
              </div>
            )}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Device and browser mix</h2>
          </div>
          <div className="card-body" style={{ display: "grid", gap: 10 }}>
            {deviceBreakdown.length ? (
              deviceBreakdown.map((device, index) => (
                <div
                  key={`${device.deviceType}-${device.browser}-${index}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span>
                    {[device.deviceType, device.browser, device.operatingSystem]
                      .filter(Boolean)
                      .join(" · ") || "Unidentified device"}
                  </span>
                  <strong>{device.count.toLocaleString()}</strong>
                </div>
              ))
            ) : (
              <div className="empty-state-desc">
                Device data will appear for events received after this update.
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedEvent && (
        <section className="card" style={{ marginTop: 20 }}>
          <div
            className="card-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h2 className="card-title">{formatEventName(selectedEvent)}</h2>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                <time
                  dateTime={selectedEvent.createdAt}
                  title={formatDate(selectedEvent.createdAt)}
                >
                  {formatTimeAgo(selectedEvent.createdAt, now)}
                </time>
              </div>
            </div>
            <button
              className="btn btn-sm"
              onClick={() => setSelectedEvent(null)}
            >
              Close details
            </button>
          </div>
          <div className="card-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <div>
                <h3 style={{ marginTop: 0 }}>Visitor and device</h3>
                <dl style={{ display: "grid", gap: 10, margin: 0 }}>
                  {[
                    ["IP address", selectedEvent.visitor?.ipAddress],
                    [
                      "Location",
                      eventLocation(selectedEvent) || "Unavailable",
                    ],
                    [
                      "Coordinates",
                      selectedEvent.visitor?.location?.latitude !== undefined &&
                      selectedEvent.visitor.location.longitude !== undefined
                        ? `${selectedEvent.visitor.location.latitude}, ${selectedEvent.visitor.location.longitude}`
                        : undefined,
                    ],
                    [
                      "Browser",
                      [
                        selectedEvent.visitor?.browser,
                        selectedEvent.visitor?.browserVersion,
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined,
                    ],
                    [
                      "Operating system",
                      [
                        selectedEvent.visitor?.operatingSystem,
                        selectedEvent.visitor?.operatingSystemVersion,
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined,
                    ],
                    [
                      "Device",
                      [
                        selectedEvent.visitor?.deviceVendor,
                        selectedEvent.visitor?.deviceModel,
                        selectedEvent.visitor?.deviceType,
                      ]
                        .filter(Boolean)
                        .join(" ") || undefined,
                    ],
                    ["User agent", selectedEvent.visitor?.userAgent],
                  ].map(([label, value]) => (
                    <div key={label} style={{ overflowWrap: "anywhere" }}>
                      <dt
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: 12,
                        }}
                      >
                        {label}
                      </dt>
                      <dd style={{ margin: 0 }}>{value || "Unavailable"}</dd>
                    </div>
                  ))}
                </dl>
                <small
                  style={{ color: "var(--text-muted)", display: "block", marginTop: 10 }}
                >
                  IP geolocation is an estimate, not a precise physical
                  location.
                </small>
              </div>

              <div>
                <h3 style={{ marginTop: 0 }}>URL parameters</h3>
                {Object.keys(selectedEvent.customParameters ?? {}).length ? (
                  <dl style={{ display: "grid", gap: 10, margin: 0 }}>
                    {Object.entries(selectedEvent.customParameters ?? {}).map(
                      ([key, value]) => (
                        <div key={key} style={{ overflowWrap: "anywhere" }}>
                          <dt
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: 12,
                            }}
                          >
                            {key}
                          </dt>
                          <dd style={{ margin: 0 }}>{value}</dd>
                        </div>
                      ),
                    )}
                  </dl>
                ) : (
                  <div className="empty-state-desc">
                    No campaign or custom URL parameters were attached.
                  </div>
                )}
              </div>
            </div>
            <h3>Event properties</h3>
            {selectedPayload.length ? (
              <dl style={{ display: "grid", gap: 12, margin: 0 }}>
                {selectedPayload.map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "160px minmax(0, 1fr)",
                      gap: 12,
                    }}
                  >
                    <dt style={{ color: "var(--text-secondary)" }}>{key}</dt>
                    <dd style={{ margin: 0, overflowWrap: "anywhere" }}>
                      {typeof value === "string" ||
                      typeof value === "number" ||
                      typeof value === "boolean"
                        ? String(value)
                        : JSON.stringify(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div className="empty-state-desc">
                No additional event details were recorded.
              </div>
            )}
          </div>
        </section>
      )}

      <section className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <h2 className="card-title">Recent orders</h2>
        </div>
        {ordersError && (
          <div className="alert alert-error" style={{ margin: 16 }}>
            Recent orders could not be loaded.
          </div>
        )}
        <div className="card-body" style={{ padding: 0 }}>
          {isOrdersLoading ? (
            <div style={{ padding: 24 }}>Loading recent orders...</div>
          ) : orders?.data.length ? (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.data.map((order) => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.customer.name}</td>
                      <td>{order.status}</td>
                      <td style={{ textAlign: "right" }}>
                        {formatMoney(Number(order.total) || 0)}
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 32 }}>
              <div className="empty-state-desc">No orders found.</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
