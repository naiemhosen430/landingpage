"use client";

import Link from "next/link";
import { useGetStorageUsageQuery } from "@/store/storageApi";

const formatMB = (value: number) => `${value.toFixed(2)} MB`;

const nativeModuleRoutes: Record<string, string> = {
  analytics: "/dashboard/analytics",
  couriers: "/dashboard/courier",
  deliveryAreas: "/dashboard/delivery-areas",
  landingPages: "/dashboard/landing-pages",
  orders: "/dashboard/orders",
  paymentMethods: "/dashboard/payment-methods",
  products: "/dashboard/products",
  trackingEvents: "/dashboard/tracking",
  uploads: "/dashboard/media",
};

export default function StoragePage() {
  const {
    data: storage,
    isLoading,
    isError,
    refetch,
  } = useGetStorageUsageQuery();

  if (isLoading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (isError || !storage) {
    return (
      <div>
        <div className="page-header">
          <div>
            <h1 className="page-title">Storage usage</h1>
            <p className="page-subtitle">
              Review storage used by your project.
            </p>
          </div>
        </div>
        <div className="alert alert-danger">
          <strong>Unable to load storage usage.</strong>
          <button className="btn btn-ghost btn-sm" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  const modules = Object.entries(storage.modules ?? {}).sort(
    ([, first], [, second]) => second.sizeMB - first.sizeMB,
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Storage usage</h1>
          <p className="page-subtitle">
            A detailed breakdown of your project storage in {storage.unit}.
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-ghost btn-sm">
          Back to dashboard
        </Link>
      </div>

      <div className="storage-overview-grid">
        <div className="card storage-total-card">
          <div className="card-body">
            <div className="storage-eyebrow">Total storage used</div>
            <div className="storage-total-value">
              {formatMB(storage.totalMB)}
            </div>
            <div className="storage-total-meta">
              {modules.length} tracked modules
              {modules[0] ? ` · Largest: ${modules[0][0]}` : ""}
            </div>
          </div>
        </div>
        <div className="card storage-summary-card">
          <div className="card-body">
            <div className="storage-eyebrow">Media</div>
            <div className="storage-summary-value">
              {formatMB(storage.mediaMB)}
            </div>
            <div className="storage-summary-meta">
              Uploaded files and assets
            </div>
          </div>
        </div>
        <div className="card storage-summary-card">
          <div className="card-body">
            <div className="storage-eyebrow">Database</div>
            <div className="storage-summary-value">
              {formatMB(storage.databaseMB)}
            </div>
            <div className="storage-summary-meta">
              Project records and activity
            </div>
          </div>
        </div>
      </div>

      <div className="card storage-breakdown-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Module breakdown</h2>
            <p className="storage-table-subtitle">
              Sorted from largest to smallest.
            </p>
          </div>
          <span className="badge badge-info">{storage.unit}</span>
        </div>
        <div className="table-wrapper">
          {modules.length ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Records</th>
                  <th>Usage</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(([name, usage]) =>
                  (() => {
                    const nativeRoute = nativeModuleRoutes[name];

                    return (
                      <tr key={name}>
                        <td className="storage-module-name">{name}</td>
                        <td>{usage.records.toLocaleString()}</td>
                        <td className="storage-module-size">
                          {formatMB(usage.sizeMB)}
                        </td>
                        <td>
                          {usage.bytes !== undefined
                            ? `${usage.bytes.toLocaleString()} bytes`
                            : usage.estimatedMB !== undefined
                              ? `Estimated ${formatMB(usage.estimatedMB)}`
                              : "-"}
                        </td>
                        <td>
                          <Link
                            href={nativeRoute ?? `/dashboard/storage/${name}`}
                            className="btn btn-ghost btn-sm"
                          >
                            {nativeRoute ? "Open page" : "Manage"}
                          </Link>
                        </td>
                      </tr>
                    );
                  })(),
                )}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-title">No module usage available</div>
              <div className="empty-state-desc">
                Storage details will appear here when your project has data.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
