"use client";

import { useEffect, useState } from "react";
import { Input, Select, TextArea } from "@/components/ui/FormControls";
import {
  SettingsData,
  useGetSettingsQuery,
  useUpdateBrandingMutation,
  useUpdateContactMutation,
  useUpdateStoreInfoMutation,
} from "@/store/settingsApi";

const emptySettings: SettingsData = {
  store: {
    currency: "USD",
    timezone: "UTC",
    language: "en",
    taxRate: 0,
    shippingEnabled: true,
    guestCheckout: true,
    inventoryTracking: true,
    lowStockThreshold: 10,
    socialTracking: {
      facebook: { enabled: false },
      tiktok: { enabled: false },
    },
  },
  branding: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    fontFamily: "Inter",
    customCss: "",
  },
  contact: { email: "", phone: "", address: {}, socialLinks: {} },
};

type DraftSocial = {
  enabled: boolean;
  pixelId: string;
  testEventCode: string;
  accessToken: string;
};

function errorMessage(error: any, fallback: string) {
  return error?.data?.message ?? error?.data?.errors?.[0] ?? fallback;
}

export default function SettingsPage() {
  const { data: response, isLoading } = useGetSettingsQuery(undefined);
  const [updateStore, { isLoading: savingStore }] =
    useUpdateStoreInfoMutation();
  const [updateBranding, { isLoading: savingBranding }] =
    useUpdateBrandingMutation();
  const [updateContact, { isLoading: savingContact }] =
    useUpdateContactMutation();
  const settings = response?.data ?? emptySettings;

  const [store, setStore] = useState(settings.store);
  const [branding, setBranding] = useState(settings.branding);
  const [contact, setContact] = useState(settings.contact);
  const [social, setSocial] = useState<
    Record<"facebook" | "tiktok", DraftSocial>
  >({
    facebook: {
      enabled: settings.store.socialTracking?.facebook?.enabled ?? false,
      pixelId: settings.store.socialTracking?.facebook?.pixelId ?? "",
      testEventCode:
        settings.store.socialTracking?.facebook?.testEventCode ?? "",
      accessToken: settings.store.socialTracking?.facebook?.accessToken ?? "",
    },
    tiktok: {
      enabled: settings.store.socialTracking?.tiktok?.enabled ?? false,
      pixelId: settings.store.socialTracking?.tiktok?.pixelId ?? "",
      testEventCode: settings.store.socialTracking?.tiktok?.testEventCode ?? "",
      accessToken: settings.store.socialTracking?.tiktok?.accessToken ?? "",
    },
  });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setStore(settings.store);
    setBranding(settings.branding);
    setContact(settings.contact);
    setSocial({
      facebook: {
        enabled: settings.store.socialTracking?.facebook?.enabled ?? false,
        pixelId: settings.store.socialTracking?.facebook?.pixelId ?? "",
        testEventCode:
          settings.store.socialTracking?.facebook?.testEventCode ?? "",
        accessToken: settings.store.socialTracking?.facebook?.accessToken ?? "",
      },
      tiktok: {
        enabled: settings.store.socialTracking?.tiktok?.enabled ?? false,
        pixelId: settings.store.socialTracking?.tiktok?.pixelId ?? "",
        testEventCode:
          settings.store.socialTracking?.tiktok?.testEventCode ?? "",
        accessToken: settings.store.socialTracking?.tiktok?.accessToken ?? "",
      },
    });
  }, [response]);

  const save = async (
    operation: () => Promise<unknown>,
    success: string,
    failure: string,
  ) => {
    try {
      await operation();
      setNotice(success);
      window.setTimeout(() => setNotice(""), 3000);
    } catch (error) {
      alert(errorMessage(error, failure));
    }
  };

  const saveStore = () =>
    save(
      () =>
        updateStore({
          ...store,
          socialTracking: {
            facebook: {
              enabled: social.facebook.enabled,
              pixelId: social.facebook.pixelId,
              testEventCode: social.facebook.testEventCode,
              ...(social.facebook.accessToken
                ? { accessToken: social.facebook.accessToken }
                : {}),
            },
            tiktok: {
              enabled: social.tiktok.enabled,
              pixelId: social.tiktok.pixelId,
              testEventCode: social.tiktok.testEventCode,
              ...(social.tiktok.accessToken
                ? { accessToken: social.tiktok.accessToken }
                : {}),
            },
          },
        }).unwrap(),
      "Store settings saved",
      "Failed to save store settings",
    );

  const saveBranding = () => {
    if (
      !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(branding.primaryColor) ||
      !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(branding.secondaryColor)
    ) {
      alert("Brand colors must be valid 3 or 6 digit hex colors.");
      return;
    }
    return save(
      () => updateBranding(branding).unwrap(),
      "Branding settings saved",
      "Failed to save branding settings",
    );
  };

  const saveContact = () =>
    save(
      () => updateContact(contact).unwrap(),
      "Contact settings saved",
      "Failed to save contact settings",
    );
  const updateAddress = (field: string, value: string) =>
    setContact((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  const updateSocialLink = (field: string, value: string) =>
    setContact((current) => ({
      ...current,
      socialLinks: { ...current.socialLinks, [field]: value },
    }));

  if (isLoading)
    return (
      <div className="settings-loading">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="settings-page">
      <div className="settings-hero page-header">
        <div>
          <p className="settings-kicker">Store workspace</p>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Manage store behavior, branding, and customer contact details.
          </p>
        </div>
        {notice && <div className="settings-save-status">{notice}</div>}
      </div>

      <div className="settings-layout">
        <section className="card settings-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Store settings</h2>
              <p className="settings-card-description">
                Defaults used by your storefront and checkout.
              </p>
            </div>
            <span className="settings-section-number">01</span>
          </div>
          <div className="card-body">
            {/* <div className="settings-form-grid">
              <Select
                label="Currency"
                value={store.currency}
                onChange={(event) =>
                  setStore({ ...store, currency: event.target.value })
                }
              >
                <option>USD</option>
                <option>BDT</option>
                <option>EUR</option>
                <option>GBP</option>
              </Select>
              <Input
                label="Language"
                value={store.language}
                onChange={(event) =>
                  setStore({ ...store, language: event.target.value })
                }
              />
              <Input
                label="Timezone"
                value={store.timezone}
                onChange={(event) =>
                  setStore({ ...store, timezone: event.target.value })
                }
                placeholder="UTC"
              />
              <Input
                label="Tax rate (%)"
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={store.taxRate}
                onChange={(event) =>
                  setStore({ ...store, taxRate: Number(event.target.value) })
                }
              />
              <Input
                label="Low stock threshold"
                type="number"
                min={0}
                value={store.lowStockThreshold}
                onChange={(event) =>
                  setStore({
                    ...store,
                    lowStockThreshold: Number(event.target.value),
                  })
                }
              />
            </div>
            <div className="settings-switches">
              {(
                [
                  ["shippingEnabled", "Shipping enabled"],
                  ["guestCheckout", "Guest checkout"],
                  ["inventoryTracking", "Inventory tracking"],
                ] as const
              ).map(([field, label]) => (
                <label className="settings-toggle" key={field}>
                  <Input
                    type="checkbox"
                    checked={store[field]}
                    onChange={(event) =>
                      setStore({ ...store, [field]: event.target.checked })
                    }
                  />
                  {label}
                </label>
              ))}
            </div> */}
            <div className="tracking-provider-grid">
              {(["facebook", "tiktok"] as const).map((provider) => (
                <section
                  className={`tracking-provider tracking-provider-${provider}`}
                  key={provider}
                  aria-labelledby={`${provider}-tracking-title`}
                >
                  <div className="tracking-provider-heading">
                    <div>
                      <h3 id={`${provider}-tracking-title`}>
                        {provider === "facebook"
                          ? "Facebook tracking"
                          : "TikTok tracking"}
                      </h3>
                      <p>
                        {provider === "facebook"
                          ? "Send conversion events to Facebook Conversions API."
                          : "Send conversion events to TikTok Events API."}
                      </p>
                    </div>
                    <label className="settings-toggle">
                      <Input
                        type="checkbox"
                        checked={social[provider].enabled}
                        onChange={(event) =>
                          setSocial({
                            ...social,
                            [provider]: {
                              ...social[provider],
                              enabled: event.target.checked,
                            },
                          })
                        }
                      />
                      Enabled
                    </label>
                  </div>
                  <div className="tracking-provider-fields">
                    <Input
                      label="Pixel ID / code"
                      value={social[provider].pixelId}
                      onChange={(event) =>
                        setSocial({
                          ...social,
                          [provider]: {
                            ...social[provider],
                            pixelId: event.target.value,
                          },
                        })
                      }
                    />
                    <Input
                      label="Access token"
                      type="password"
                      autoComplete="new-password"
                      value={social[provider].accessToken}
                      onChange={(event) =>
                        setSocial({
                          ...social,
                          [provider]: {
                            ...social[provider],
                            accessToken: event.target.value,
                          },
                        })
                      }
                      placeholder="Enter token to update"
                    />
                    <Input
                      label="Test event code"
                      value={social[provider].testEventCode}
                      onChange={(event) =>
                        setSocial({
                          ...social,
                          [provider]: {
                            ...social[provider],
                            testEventCode: event.target.value,
                          },
                        })
                      }
                      placeholder="Optional"
                    />
                  </div>
                </section>
              ))}
            </div>
          </div>
          <div className="card-footer settings-card-footer">
            <button
              className="btn btn-primary"
              onClick={saveStore}
              disabled={savingStore}
            >
              {savingStore ? "Saving..." : "Save store settings"}
            </button>
          </div>
        </section>

        <section className="card settings-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Branding</h2>
              <p className="settings-card-description">
                Set the visual identity used by your storefront.
              </p>
            </div>
            <span className="settings-section-number">02</span>
          </div>
          <div className="card-body">
            <div className="settings-form-grid">
              <Input
                label="Primary color"
                type="color"
                value={branding.primaryColor}
                onChange={(event) =>
                  setBranding({ ...branding, primaryColor: event.target.value })
                }
              />
              <Input
                label="Secondary color"
                type="color"
                value={branding.secondaryColor}
                onChange={(event) =>
                  setBranding({
                    ...branding,
                    secondaryColor: event.target.value,
                  })
                }
              />
              <Input
                label="Font family"
                value={branding.fontFamily}
                onChange={(event) =>
                  setBranding({ ...branding, fontFamily: event.target.value })
                }
                placeholder="Inter"
              />
            </div>
            <TextArea
              label="Custom CSS"
              value={branding.customCss ?? ""}
              onChange={(event) =>
                setBranding({ ...branding, customCss: event.target.value })
              }
              rows={7}
              placeholder=".store-header { ... }"
            />
          </div>
          <div className="card-footer settings-card-footer">
            <button
              className="btn btn-primary"
              onClick={saveBranding}
              disabled={savingBranding}
            >
              {savingBranding ? "Saving..." : "Save branding"}
            </button>
          </div>
        </section>

        <section className="card settings-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Contact details</h2>
              <p className="settings-card-description">
                Information customers can use to reach you.
              </p>
            </div>
            <span className="settings-section-number">03</span>
          </div>
          <div className="card-body">
            <div className="settings-form-grid">
              <Input
                label="Email"
                type="email"
                value={contact.email}
                onChange={(event) =>
                  setContact({ ...contact, email: event.target.value })
                }
              />
              <Input
                label="Phone"
                value={contact.phone ?? ""}
                onChange={(event) =>
                  setContact({ ...contact, phone: event.target.value })
                }
              />
            </div>
            <div className="settings-form-grid">
              <Input
                label="Street"
                value={contact.address?.street ?? ""}
                onChange={(event) =>
                  updateAddress("street", event.target.value)
                }
              />
              <Input
                label="City"
                value={contact.address?.city ?? ""}
                onChange={(event) => updateAddress("city", event.target.value)}
              />
              <Input
                label="State"
                value={contact.address?.state ?? ""}
                onChange={(event) => updateAddress("state", event.target.value)}
              />
              <Input
                label="ZIP code"
                value={contact.address?.zipCode ?? ""}
                onChange={(event) =>
                  updateAddress("zipCode", event.target.value)
                }
              />
              <Input
                label="Country"
                value={contact.address?.country ?? ""}
                onChange={(event) =>
                  updateAddress("country", event.target.value)
                }
              />
            </div>
            <div className="settings-form-grid">
              <Input
                label="Facebook URL"
                type="url"
                value={contact.socialLinks?.facebook ?? ""}
                onChange={(event) =>
                  updateSocialLink("facebook", event.target.value)
                }
              />
              <Input
                label="Instagram URL"
                type="url"
                value={contact.socialLinks?.instagram ?? ""}
                onChange={(event) =>
                  updateSocialLink("instagram", event.target.value)
                }
              />
              <Input
                label="YouTube URL"
                type="url"
                value={contact.socialLinks?.youtube ?? ""}
                onChange={(event) =>
                  updateSocialLink("youtube", event.target.value)
                }
              />
            </div>
          </div>
          <div className="card-footer settings-card-footer">
            <button
              className="btn btn-primary"
              onClick={saveContact}
              disabled={savingContact}
            >
              {savingContact ? "Saving..." : "Save contact details"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
