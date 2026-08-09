"use client";

import { useState } from "react";
import {
  useGetCourierSettingsQuery,
  useUpdateCourierSettingsMutation,
  useGetCourierProvidersQuery,
} from "@/store/courierApi";

export default function CourierPage() {
  const { data: settingsData, isLoading } =
    useGetCourierSettingsQuery(undefined);
  const { data: providersData } = useGetCourierProvidersQuery(undefined);
  const [updateSettings] = useUpdateCourierSettingsMutation();

  const settings = settingsData?.data;
  const providers = providersData?.data || [];

  const [form, setForm] = useState({
    enabled: settings?.enabled ?? false,
    defaultCourier: settings?.defaultCourier || "",
    deliveryCharge: settings?.deliveryCharge || 0,
    codCharge: settings?.codCharge || 0,
    freeDeliveryThreshold: settings?.freeDeliveryThreshold || 0,
    providers: settings?.providers || [],
  });

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await updateSettings(form).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save courier settings");
    }
  };

  const toggleProvider = (providerId: string) => {
    setForm((prev) => ({
      ...prev,
      providers: prev.providers.map((p: any) =>
        p.id === providerId ? { ...p, enabled: !p.enabled } : p,
      ),
    }));
  };

  if (isLoading) {
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Courier Settings</h1>
          <p className="page-subtitle">
            Configure delivery and shipping options
          </p>
        </div>
        {saved && (
          <div
            style={{
              padding: "8px 16px",
              background: "var(--success-light)",
              color: "var(--success)",
              borderRadius: "var(--radius)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Settings saved successfully
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">General Settings</h3>
          </div>
          <div className="card-body">
            <div
              className="form-group"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <input
                type="checkbox"
                id="courier-enabled"
                checked={form.enabled}
                onChange={(e) =>
                  setForm({ ...form, enabled: e.target.checked })
                }
                style={{ width: 20, height: 20, cursor: "pointer" }}
              />
              <label
                htmlFor="courier-enabled"
                style={{ fontWeight: 500, cursor: "pointer" }}
              >
                Enable Courier Integration
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Default Courier</label>
              <select
                className="form-select"
                value={form.defaultCourier}
                onChange={(e) =>
                  setForm({ ...form, defaultCourier: e.target.value })
                }
              >
                <option value="">Select Default</option>
                {providers.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div className="form-group">
                <label className="form-label">Delivery Charge</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.deliveryCharge}
                  onChange={(e) =>
                    setForm({ ...form, deliveryCharge: Number(e.target.value) })
                  }
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">COD Charge</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.codCharge}
                  onChange={(e) =>
                    setForm({ ...form, codCharge: Number(e.target.value) })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Free Delivery Threshold</label>
              <input
                type="number"
                className="form-input"
                value={form.freeDeliveryThreshold}
                onChange={(e) =>
                  setForm({
                    ...form,
                    freeDeliveryThreshold: Number(e.target.value),
                  })
                }
                min="0"
                placeholder="0 = no free delivery"
              />
              <div className="form-hint">
                Orders above this amount get free delivery. Set 0 to disable.
              </div>
            </div>

            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{ marginTop: 8 }}
            >
              Save Settings
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Courier Providers</h3>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {providers.map((provider: any) => (
                <div
                  key={provider.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: 16,
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius)",
                    background: provider.enabled
                      ? "var(--success-light)"
                      : "var(--bg-secondary)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                      {provider.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        marginTop: 2,
                      }}
                    >
                      {provider.code.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleProvider(provider.id)}
                    className={`btn btn-sm ${provider.enabled ? "btn-primary" : "btn-secondary"}`}
                  >
                    {provider.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              ))}
              {providers.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-desc">
                    No courier providers configured
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
