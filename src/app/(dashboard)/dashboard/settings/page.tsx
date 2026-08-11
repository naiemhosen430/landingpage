"use client";

import { useState, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  useGetSettingsQuery,
  useUpdateStoreInfoMutation,
} from "@/store/settingsApi";
import { useUploadMediaMutation } from "@/store/mediaApi";

function fileToDataUri(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function SettingsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const projectId =
    user?.projectId ?? user?.project?.id ?? process.env.NEXT_PUBLIC_PROJECT_ID;
  const { data: settingsData, isLoading } = useGetSettingsQuery(undefined);
  const [updateStoreInfo] = useUpdateStoreInfoMutation();
  const [uploadMedia] = useUploadMediaMutation();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const settings = settingsData?.data ?? {};

  const [form, setForm] = useState({
    storeName: settings.storeName ?? "",
    logo: settings.logo ?? "",
    contactEmail: settings.contactEmail ?? "",
    contactPhone: settings.contactPhone ?? "",
    address: settings.address ?? "",
    deliveryCharge: settings.deliveryCharge ?? 0,
    taxRate: settings.taxRate ?? 0,
    supportText: settings.supportText ?? "",
    additionalInfo: settings.additionalInfo ?? "",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await updateStoreInfo(form).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  const handleLogoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const dataUris = await Promise.all(files.map(fileToDataUri));
      const res = await uploadMedia({
        projectId,
        folder: "general",
        images: dataUris,
      }).unwrap();
      const first = Array.isArray(res) ? res[0] : res;
      if (first?.secureUrl || first?.url) {
        setForm((prev) => ({ ...prev, logo: first.secureUrl ?? first.url }));
      }
    } catch (err: any) {
      alert(err?.data?.message ?? "Logo upload failed");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
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
          <h1 className="page-title">Store Settings</h1>
          <p className="page-subtitle">
            Configure store details, logo, and defaults
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

      <div style={{ maxWidth: 980 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">General</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Store name</label>
              <input
                className="form-input"
                value={form.storeName}
                onChange={(e) =>
                  setForm({ ...form, storeName: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Logo</label>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 96,
                    height: 64,
                    background: "var(--bg-secondary)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  {form.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.logo}
                      alt="logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        padding: 8,
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
                      No logo
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoPick}
                    hidden
                  />
                  <input
                    className="form-input"
                    placeholder="Logo URL"
                    value={form.logo}
                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  className="form-input"
                  value={form.contactEmail}
                  onChange={(e) =>
                    setForm({ ...form, contactEmail: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  className="form-input"
                  value={form.contactPhone}
                  onChange={(e) =>
                    setForm({ ...form, contactPhone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                className="form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div className="form-group">
                <label className="form-label">Delivery Charge (default)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.deliveryCharge}
                  onChange={(e) =>
                    setForm({ ...form, deliveryCharge: Number(e.target.value) })
                  }
                  min={0}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tax Rate (%)</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.taxRate}
                  onChange={(e) =>
                    setForm({ ...form, taxRate: Number(e.target.value) })
                  }
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Support / Additional Info</label>
              <textarea
                className="form-input"
                rows={4}
                value={form.supportText}
                onChange={(e) =>
                  setForm({ ...form, supportText: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Settings JSON</label>
              <textarea
                className="form-input"
                rows={4}
                value={form.additionalInfo}
                onChange={(e) =>
                  setForm({ ...form, additionalInfo: e.target.value })
                }
              />
              <div className="form-hint">
                Free-form JSON or notes for custom backend settings.
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleSave} className="btn btn-primary">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
