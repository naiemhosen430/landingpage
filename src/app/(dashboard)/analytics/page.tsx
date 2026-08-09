"use client";

import { useState } from "react";
import {
  useGetAnalyticsOverviewQuery,
  useGetRevenueChartQuery,
  useGetOrderChartQuery,
  useGetVisitorChartQuery,
  useGetTopProductsQuery,
  useGetTopPagesQuery,
  useGetTrafficSourcesQuery,
} from "@/store/analyticsApi";
import StatCard from "@/components/dashboard/StatCard";

const ranges = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "90 Days", value: "90d" },
  { label: "1 Year", value: "1y" },
];

function SimpleBarChart({ data, color }: { data: number[]; color: string }) {
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
          key={i}
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
            {i + 1}
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
  const [range, setRange] = useState("30d");

  const { data: overview } = useGetAnalyticsOverviewQuery(range);
  const { data: revenueChart } = useGetRevenueChartQuery(range);
  const { data: orderChart } = useGetOrderChartQuery(range);
  const { data: visitorChart } = useGetVisitorChartQuery(range);
  const { data: topProducts } = useGetTopProductsQuery(range);
  const { data: topPages } = useGetTopPagesQuery(range);
  const { data: trafficSources } = useGetTrafficSourcesQuery(range);

  const o = overview?.data;

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
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className="btn btn-sm"
              style={{
                background:
                  range === r.value ? "var(--bg-primary)" : "transparent",
                color:
                  range === r.value
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                boxShadow: range === r.value ? "var(--shadow-sm)" : "none",
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Revenue"
          value={`৳${(o?.revenue || 0).toLocaleString()}`}
          change={12}
          icon="revenue"
          color="green"
        />
        <StatCard
          label="Orders"
          value={o?.orders || 0}
          change={8}
          icon="orders"
          color="blue"
        />
        <StatCard
          label="Visitors"
          value={o?.visitors || 0}
          change={15}
          icon="visitors"
          color="blue"
        />
        <StatCard
          label="Conversion"
          value={`${o?.conversionRate || 0}%`}
          change={-2}
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
              data={revenueChart?.data?.data || Array(7).fill(0)}
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
              data={orderChart?.data?.data || Array(7).fill(0)}
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
              data={visitorChart?.data?.data || Array(7).fill(0)}
              color="var(--info)"
            />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Top Products</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Sold</th>
                    <th style={{ textAlign: "right" }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(topProducts?.data || []).map((p: any, i: number) => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                      </td>
                      <td>{p.sold}</td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>
                        ৳{p.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!topProducts?.data || topProducts.data.length === 0) && (
                    <tr>
                      <td colSpan={3}>
                        <div className="empty-state" style={{ padding: 24 }}>
                          <div className="empty-state-desc">
                            No data available
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Traffic Sources</h3>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(trafficSources?.data || []).map((s: any, i: number) => (
                <div key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontWeight: 500, fontSize: 14 }}>
                      {s.source}
                    </span>
                    <span
                      style={{ fontSize: 14, color: "var(--text-secondary)" }}
                    >
                      {s.visitors.toLocaleString()} ({s.percentage}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 8,
                      background: "var(--bg-tertiary)",
                      borderRadius: "var(--radius-full)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${s.percentage}%`,
                        height: "100%",
                        background: "var(--primary)",
                        borderRadius: "var(--radius-full)",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
              {(!trafficSources?.data || trafficSources.data.length === 0) && (
                <div className="empty-state" style={{ padding: 24 }}>
                  <div className="empty-state-desc">No data available</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
