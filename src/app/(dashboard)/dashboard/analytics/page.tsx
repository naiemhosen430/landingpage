"use client";

import { useState } from "react";
import {
  useGetAnalyticsQuery,
  type AnalyticsRange,
} from "@/store/analyticsApi";
import StatCard from "@/components/dashboard/StatCard";

const ranges = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "12 Months", value: "12m" },
] satisfies { label: string; value: AnalyticsRange }[];

function formatDateLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: "numeric",
    day: "numeric",
  });
}

function getAnalyticsErrorMessage(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return "Unable to load analytics. Please try again.";
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

  return "Unable to load analytics. Please try again.";
}

function SimpleBarChart({
  data,
  labels,
  color,
}: {
  data: number[];
  labels: string[];
  color: string;
}) {
  const max = Math.max(...data, 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 4,
        height: 160,
        padding: "20px 0",
      }}
    >
      {data.map((val, i) => (
        <div
          key={labels[i] ?? i}
          title={`${labels[i] ?? i + 1}: ${val.toLocaleString()}`}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${(val / max) * 100}%`,
              background: color,
              borderRadius: "4px 4px 0 0",
              minHeight: 4,
              transition: "height 0.3s ease",
            }}
          />
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
            {labels[i] ?? i + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

function SimpleLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1 || 1)) * 100;
      const y = 100 - ((val - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: "100%", height: 160 }}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
      {data.map((val, i) => {
        const x = (i / (data.length - 1 || 1)) * 100;
        const y = 100 - ((val - min) / range) * 100;
        return <circle key={i} cx={x} cy={y} r="1.5" fill={color} />;
      })}
    </svg>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("30d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const isCustomRange = range === "custom";
  const {
    data: analytics,
    isLoading,
    isFetching,
    error,
  } = useGetAnalyticsQuery(isCustomRange ? { range, from, to } : { range }, {
    skip: isCustomRange && (!from || !to || from > to),
  });

  const customRangeIncomplete = isCustomRange && (!from || !to);
  const customRangeInvalid = isCustomRange && Boolean(from && to && from > to);
  const dashboardSummary = analytics?.data?.summary;
  const rangeSummary = analytics?.data?.detail?.summary;
  const daily =
    analytics?.data?.detail?.daily ??
    dashboardSummary?.chartData.map((point) => ({
      date: point.label,
      revenue: point.revenue,
      orders: point.orders,
      visitors: 0,
    })) ??
    [];
  const dateLabels = daily.map((point) => formatDateLabel(point.date));
  const revenueData = daily.map((point) => point.revenue);
  const orderData = daily.map((point) => point.orders);
  const visitorData = daily.map((point) => point.visitors);
  const formatMoney = (value: number) => `৳${value.toLocaleString()}`;
  const showChanges = range === "30d";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Track your store performance</p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 4,
            background: "var(--bg-tertiary)",
            padding: 4,
            borderRadius: "var(--radius)",
          }}
        >
          {ranges.map((item) => (
            <button
              key={item.value}
              onClick={() => setRange(item.value)}
              className="btn btn-sm"
              style={{
                background:
                  range === item.value ? "var(--bg-primary)" : "transparent",
                color:
                  range === item.value
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                boxShadow: range === item.value ? "var(--shadow-sm)" : "none",
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => setRange("custom")}
            className="btn btn-sm"
            style={{
              background: isCustomRange ? "var(--bg-primary)" : "transparent",
              color: isCustomRange
                ? "var(--text-primary)"
                : "var(--text-secondary)",
              boxShadow: isCustomRange ? "var(--shadow-sm)" : "none",
            }}
          >
            Custom
          </button>
        </div>
      </div>

      {isCustomRange && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div
            className="card-body"
            style={{
              display: "flex",
              gap: 16,
              alignItems: "end",
              flexWrap: "wrap",
            }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              From
              <input
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              To
              <input
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
              />
            </label>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 24 }}>
          {getAnalyticsErrorMessage(error)}
        </div>
      )}

      {customRangeIncomplete && (
        <div className="alert" style={{ marginBottom: 24 }}>
          Select both dates to load analytics for a custom range.
        </div>
      )}

      {customRangeInvalid && (
        <div className="alert alert-error" style={{ marginBottom: 24 }}>
          The start date must be on or before the end date.
        </div>
      )}

      {!isLoading &&
        !analytics &&
        !error &&
        !customRangeIncomplete &&
        !customRangeInvalid && (
          <div className="alert alert-error" style={{ marginBottom: 24 }}>
            The analytics API returned no data.
          </div>
        )}

      {isLoading && !customRangeIncomplete ? (
        <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
          <div className="spinner" />
        </div>
      ) : !customRangeIncomplete && !customRangeInvalid && analytics ? (
        <>
          {rangeSummary && daily.length === 0 && (
            <div className="alert" style={{ marginBottom: 24 }}>
              No analytics records were found for this date range.
            </div>
          )}
          <div className="stats-grid">
            <StatCard
              label="Revenue"
              value={formatMoney(
                rangeSummary?.totalRevenue ??
                  dashboardSummary?.totalRevenue ??
                  0,
              )}
              change={showChanges ? dashboardSummary?.revenueChange : undefined}
              icon="revenue"
              color="green"
            />
            <StatCard
              label="Orders"
              value={
                rangeSummary?.totalOrders ?? dashboardSummary?.totalOrders ?? 0
              }
              change={showChanges ? dashboardSummary?.ordersChange : undefined}
              icon="orders"
              color="blue"
            />
            <StatCard
              label="Visitors"
              value={(rangeSummary?.totalUniqueVisitors ?? 0).toLocaleString()}
              change={
                showChanges ? dashboardSummary?.customersChange : undefined
              }
              icon="visitors"
              color="blue"
            />
            <StatCard
              label="Conversion"
              value={`${rangeSummary?.avgConversionRate ?? dashboardSummary?.conversionRate ?? 0}%`}
              icon="conversion"
              color="yellow"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 24,
              marginBottom: 24,
            }}
          >
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Revenue</h3>
              </div>
              <div className="card-body">
                <SimpleBarChart
                  data={revenueData.length ? revenueData : [0]}
                  labels={dateLabels}
                  color="var(--success)"
                />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Orders</h3>
              </div>
              <div className="card-body">
                <SimpleBarChart
                  data={orderData.length ? orderData : [0]}
                  labels={dateLabels}
                  color="var(--primary)"
                />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Visitors</h3>
              </div>
              <div className="card-body">
                <SimpleLine
                  data={visitorData.length ? visitorData : [0]}
                  color="var(--info)"
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: analytics.data.platform
                ? "repeat(3, minmax(0, 1fr))"
                : "1fr 1fr",
              gap: 24,
            }}
          >
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Products & Customers</h3>
              </div>
              <div className="card-body">
                <div style={{ fontSize: 28, fontWeight: 600 }}>
                  {rangeSummary?.totalProductsSold?.toLocaleString() ?? "0"}
                </div>
                <div style={{ color: "var(--text-secondary)", marginTop: 4 }}>
                  Products sold in this range
                </div>
                <div
                  style={{
                    color: "var(--text-secondary)",
                    marginTop: 8,
                  }}
                >
                  Average order value:{" "}
                  {formatMoney(rangeSummary?.avgOrderValue ?? 0)}
                </div>
                {dashboardSummary && (
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      marginTop: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Catalog products</span>
                      <strong>
                        {dashboardSummary.totalProducts.toLocaleString()}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Total customers</span>
                      <strong>
                        {dashboardSummary.totalCustomers.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Traffic</h3>
              </div>
              <div className="card-body">
                <div style={{ display: "grid", gap: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Page views</span>
                    <strong>
                      {rangeSummary?.totalPageViews.toLocaleString() ?? "0"}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Unique visitors</span>
                    <strong>
                      {rangeSummary?.totalUniqueVisitors.toLocaleString() ??
                        "0"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {analytics.data.platform && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Platform</h3>
                </div>
                <div className="card-body" style={{ display: "grid", gap: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Total projects</span>
                    <strong>
                      {analytics.data.platform.totalProjects.toLocaleString()}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Active projects</span>
                    <strong>
                      {analytics.data.platform.activeProjects.toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
          {isFetching && (
            <div style={{ color: "var(--text-muted)", marginTop: 16 }}>
              Updating analytics...
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
