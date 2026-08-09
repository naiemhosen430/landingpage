"use client";

import {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
  useGetRecentActivitiesQuery,
} from "@/store/dashboardApi";
import StatCard from "@/components/dashboard/StatCard";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import Link from "next/link";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery(
    undefined,
    {
      pollingInterval: 30000,
    },
  );
  const { data: recentOrders } = useGetRecentOrdersQuery(undefined);
  const { data: activities } = useGetRecentActivitiesQuery(undefined);

  if (statsLoading) {
    return (
      <div>
        <div className="stats-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="stat-card">
              <div
                className="skeleton"
                style={{ height: 20, width: "60%", marginBottom: 16 }}
              />
              <div className="skeleton" style={{ height: 36, width: "40%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const s = stats?.data;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Orders"
          value={s?.totalOrders || 0}
          change={12}
          icon="orders"
          color="blue"
        />
        <StatCard
          label="Today's Orders"
          value={s?.todayOrders || 0}
          icon="orders"
          color="blue"
        />
        <StatCard
          label="Pending Orders"
          value={s?.pendingOrders || 0}
          icon="pending"
          color="yellow"
        />
        <StatCard
          label="Delivered"
          value={s?.deliveredOrders || 0}
          icon="delivered"
          color="green"
        />
        <StatCard
          label="Cancelled"
          value={s?.cancelledOrders || 0}
          icon="cancelled"
          color="red"
        />
        <StatCard
          label="Visitors"
          value={s?.visitors || 0}
          change={8}
          icon="visitors"
          color="blue"
        />
        <StatCard
          label="Revenue"
          value={`৳${(s?.revenue || 0).toLocaleString()}`}
          change={15}
          icon="revenue"
          color="green"
        />
        <StatCard
          label="Storage Used"
          value={`${s?.storageUsed || 0} MB`}
          icon="storage"
          color="blue"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <Link href="/orders" className="btn btn-ghost btn-sm">
              View All
            </Link>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <RecentOrdersTable orders={recentOrders?.data || []} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Latest Activity</h3>
          </div>
          <div className="card-body">
            {activities?.data?.length ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {activities.data.map((activity: any) => (
                  <div
                    key={activity.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "var(--radius-full)",
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {activity.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          marginTop: 2,
                        }}
                      >
                        {activity.description}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 4,
                        }}
                      >
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 24 }}>
                <div className="empty-state-desc">No recent activity</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
