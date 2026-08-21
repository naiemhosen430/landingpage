"use client";

import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  useGetSettingsQuery,
  useUpdateStoreInfoMutation,
  useUpdateSocialMutation,
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
  const [updateSocial] = useUpdateSocialMutation();
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
  const [socialTracking, setSocialTracking] = useState(() => ({
    facebook: {
      enabled: settings.socialTracking?.facebook?.enabled ?? false,
      pixelId: settings.socialTracking?.facebook?.pixelId ?? "",
      accessToken: "",
      testEventCode: settings.socialTracking?.facebook?.testEventCode ?? "",
    },
    tiktok: {
      enabled: settings.socialTracking?.tiktok?.enabled ?? false,
      pixelId: settings.socialTracking?.tiktok?.pixelId ?? "",
      accessToken: "",
      testEventCode: settings.socialTracking?.tiktok?.testEventCode ?? "",
    },
  }));
  const [socialSaved, setSocialSaved] = useState(false);

  useEffect(() => {
    if (!settingsData?.data?.socialTracking) return;
    setSocialTracking((current) => ({
      facebook: {
        ...current.facebook,
        ...settingsData.data.socialTracking.facebook,
        accessToken: "",
      },
      tiktok: {
        ...current.tiktok,
        ...settingsData.data.socialTracking.tiktok,
        accessToken: "",
      },
    }));
  }, [settingsData]);

  const handleSave = async () => {
    try {
      await updateStoreInfo(form).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save settings");
    }
  };

  const handleSaveSocialTracking = async () => {
    try {
      const payload = {
        facebook: {
          enabled: socialTracking.facebook.enabled,
          pixelId: socialTracking.facebook.pixelId,
          testEventCode: socialTracking.facebook.testEventCode,
          ...(socialTracking.facebook.accessToken
            ? { accessToken: socialTracking.facebook.accessToken }
            : {}),
        },
        tiktok: {
          enabled: socialTracking.tiktok.enabled,
          pixelId: socialTracking.tiktok.pixelId,
          testEventCode: socialTracking.tiktok.testEventCode,
          ...(socialTracking.tiktok.accessToken
            ? { accessToken: socialTracking.tiktok.accessToken }
            : {}),
        },
      };
      await updateSocial({ settings: { socialTracking: payload } }).unwrap();
      setSocialSaved(true);
      setTimeout(() => setSocialSaved(false), 3000);
    } catch (error) {
      alert("Failed to save social tracking settings");
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

        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Social tracking</h3>
            {socialSaved && (
              <span style={{ color: "var(--success)", fontSize: 13 }}>
                Saved
              </span>
            )}
          </div>
          <div className="card-body">
            <p className="form-hint" style={{ marginBottom: 20 }}>
              Configure server-side Facebook Conversions API and TikTok Events
              API delivery. Access tokens are stored by the backend and are not
              returned after saving.
            </p>
            {(["facebook", "tiktok"] as const).map((provider) => {
              const providerForm = socialTracking[provider];
              const label =
                provider === "facebook"
                  ? "Facebook Conversions API"
                  : "TikTok Events API";
              return (
                <div
                  key={provider}
                  style={{
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: 16,
                    marginTop: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <strong>{label}</strong>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={providerForm.enabled}
                        onChange={(event) =>
                          setSocialTracking({
                            ...socialTracking,
                            [provider]: {
                              ...providerForm,
                              enabled: event.target.checked,
                            },
                          })
                        }
                      />
                      Enabled
                    </label>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">Pixel ID / code</label>
                      <input
                        className="form-input"
                        value={providerForm.pixelId}
                        onChange={(event) =>
                          setSocialTracking({
                            ...socialTracking,
                            [provider]: {
                              ...providerForm,
                              pixelId: event.target.value,
                            },
                          })
                        }
                        placeholder={
                          provider === "facebook"
                            ? "Facebook pixel ID"
                            : "TikTok pixel code"
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Access token</label>
                      <input
                        type="password"
                        className="form-input"
                        value={providerForm.accessToken}
                        onChange={(event) =>
                          setSocialTracking({
                            ...socialTracking,
                            [provider]: {
                              ...providerForm,
                              accessToken: event.target.value,
                            },
                          })
                        }
                        placeholder="Enter token to update"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Test event code{" "}
                      <span
                        style={{ color: "var(--text-muted)", fontWeight: 400 }}
                      >
                        (optional)
                      </span>
                    </label>
                    <input
                      className="form-input"
                      value={providerForm.testEventCode}
                      onChange={(event) =>
                        setSocialTracking({
                          ...socialTracking,
                          [provider]: {
                            ...providerForm,
                            testEventCode: event.target.value,
                          },
                        })
                      }
                      placeholder="Only for provider testing"
                    />
                  </div>
                </div>
              );
            })}
            <button
              onClick={handleSaveSocialTracking}
              className="btn btn-primary"
              style={{ marginTop: 8 }}
            >
              Save social tracking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
