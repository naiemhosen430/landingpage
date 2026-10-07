"use client";

import { notifyToast } from "@/lib/toast";
import { useState } from "react";
import {
  type Courier,
  type CourierInput,
  useCreateCourierMutation,
  useDeleteCourierMutation,
  useGetCouriersQuery,
  useSetDefaultCourierMutation,
  useUpdateCourierMutation,
} from "@/store/courierApi";

const COURIER_PROVIDERS = [
  {
    code: "STEADFAST",
    name: "Steadfast",
    website: "https://steadfast.com.bd",
    fields: [
      { key: "api_key", label: "API key / token", required: true },
      { key: "secret_key", label: "API secret", required: false },
    ],
  },
  {
    code: "PATHAO",
    name: "Pathao",
    website: "https://pathao.com",
    fields: [
      { key: "client_id", label: "Client ID", required: true },
      { key: "client_secret", label: "Client secret", required: true },
      { key: "username", label: "Merchant username", required: false },
      { key: "password", label: "Merchant password", required: false },
      { key: "store_id", label: "Store ID", required: false },
    ],
  },
  {
    code: "REDX",
    name: "RedX",
    website: "https://redx.com.bd",
    fields: [
      { key: "api_token", label: "API access token", required: true },
      { key: "pickup_store_id", label: "Pickup store ID", required: false },
      { key: "weight_unit", label: "Product weight unit", required: true },
      { key: "environment", label: "RedX environment", required: true },
    ],
  },
  {
    code: "CARRYBEE",
    name: "CarryBee",
    website: "https://carrybee.com",
    fields: [
      { key: "api_key", label: "API key / token", required: true },
      { key: "api_secret", label: "API secret", required: false },
    ],
  },
] as const;

function courierConfiguredField(
  courierId: string | null,
  couriers: Courier[],
  field: string,
) {
  return Boolean(
    courierId &&
      couriers
        .find((courier) => courier.id === courierId)
        ?.configuredFields?.includes(field),
  );
}

const emptyForm: CourierInput = {
  name: "",
  code: "",
  description: "",
  phone: "",
  email: "",
  website: "",
  trackingUrlTemplate: "",
  config: {},
  isActive: true,
  isDefault: false,
};

export default function CourierPage() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<CourierInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const { data, isLoading } = useGetCouriersQuery({
    page: 1,
    limit: 50,
  });
  const [createCourier, { isLoading: creating }] = useCreateCourierMutation();
  const [updateCourier, { isLoading: updating }] = useUpdateCourierMutation();
  const [setDefaultCourier] = useSetDefaultCourierMutation();
  const [deleteCourier] = useDeleteCourierMutation();

  const couriers = data?.data ?? [];
  const visibleCouriers = couriers.filter((courier) =>
    `${courier.name} ${courier.code} ${courier.description ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const saving = creating || updating;
  const availableProviders = COURIER_PROVIDERS.filter(
    (provider) =>
      !couriers.some((courier) => courier.code === provider.code) ||
      (editingId &&
        couriers.some(
          (courier) =>
            courier.id === editingId && courier.code === provider.code,
        )),
  );
  const selectedProvider = COURIER_PROVIDERS.find(
    (provider) => provider.code === form.code,
  );

  const updateField = <K extends keyof CourierInput>(
    field: K,
    value: CourierInput[K],
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setCredentials({});
    setFormError("");
  };

  const editCourier = (courier: Courier) => {
    setFormOpen(true);
    setEditingId(courier.id);
    setForm({
      name: courier.name,
      code: courier.code,
      description: courier.description ?? "",
      phone: courier.phone ?? "",
      email: courier.email ?? "",
      website: courier.website ?? "",
      trackingUrlTemplate: courier.trackingUrlTemplate ?? "",
      config: {},
      isActive: courier.isActive,
      isDefault: courier.isDefault,
    });
    setCredentials({
      ...(courier.code === "REDX" && {
        weight_unit: courier.weightUnit ?? "kg",
        environment: courier.environment ?? "sandbox",
      }),
    });
    setFormError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!selectedProvider) {
      setFormError("Choose a supported courier.");
      return;
    }
    const existingCourier = couriers.find(
      (courier) => courier.id === editingId,
    );
    const existingProvider = COURIER_PROVIDERS.find(
      (provider) => provider.code === existingCourier?.code,
    );
    const unchangedCredentialFields = new Set(
      existingProvider?.code === selectedProvider.code
        ? existingProvider.fields
            .filter((field) =>
              courierConfiguredField(editingId, couriers, field.key),
            )
            .map((field) => field.key)
        : [],
    );
    if (
      selectedProvider.fields.some(
        (field) =>
          field.required &&
          !credentials[field.key]?.trim() &&
          !unchangedCredentialFields.has(field.key),
      )
    ) {
      setFormError("Enter all required courier credentials.");
      return;
    }

    try {
      const config = Object.fromEntries(
        Object.entries(credentials).filter(([, value]) => value.trim()),
      );
      const payload: CourierInput = {
        ...form,
        config,
        name: selectedProvider.name,
        code: selectedProvider.code,
        website: selectedProvider.website,
      };
      if (existingCourier && existingCourier.code !== selectedProvider.code) {
        payload.config = config;
      }
      if (!payload.phone?.trim()) delete payload.phone;
      if (!payload.email?.trim()) delete payload.email;
      if (!payload.description?.trim()) delete payload.description;
      if (!payload.trackingUrlTemplate?.trim())
        delete payload.trackingUrlTemplate;
      if (editingId) {
        await updateCourier({ id: editingId, data: payload }).unwrap();
      } else {
        await createCourier(payload).unwrap();
      }
      resetForm();
    } catch (error: any) {
      setFormError(error?.data?.message ?? "Could not save courier.");
    }
  };

  const handleDelete = async (courier: Courier) => {
    if (!window.confirm(`Delete ${courier.name}?`)) return;
    try {
      await deleteCourier(courier.id).unwrap();
      if (editingId === courier.id) resetForm();
    } catch (error: any) {
      notifyToast(error?.data?.message ?? "Could not delete courier.", "error");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Couriers</h1>
          <p className="page-subtitle">
            RedX booking is ready; other couriers will be enabled when their
            official API specifications are verified.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            const firstAvailable = availableProviders[0];
            setForm({
              ...emptyForm,
              ...(firstAvailable && {
                name: firstAvailable.name,
                code: firstAvailable.code,
                website: firstAvailable.website,
              }),
            });
            setCredentials(
              firstAvailable?.code === "REDX"
                ? { weight_unit: "kg", environment: "sandbox" }
                : {},
            );
            setFormError("");
            setEditingId(null);
            setFormOpen(true);
          }}
          disabled={!availableProviders.length}
          title={
            availableProviders.length
              ? undefined
              : "All supported couriers are already configured"
          }
        >
          Add courier
        </button>
      </div>

      <div className="card">
        <div
          className="card-header"
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <h3 className="card-title" style={{ flex: 1 }}>
            Courier list
          </h3>
          <input
            className="form-input"
            style={{ maxWidth: 240 }}
            placeholder="Search couriers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {isLoading ? (
            <div
              style={{ padding: 40, display: "flex", justifyContent: "center" }}
            >
              <div className="spinner" />
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Status</th>
                    <th>Default</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCouriers.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        <div className="empty-state">
                          <div className="empty-state-title">
                            No couriers found
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {visibleCouriers.map((courier) => (
                    <tr key={courier.id}>
                      <td>
                        <strong>{courier.name}</strong>
                        <div
                          style={{ fontSize: 12, color: "var(--text-muted)" }}
                        >
                          {courier.email || courier.phone || "No contact"}
                        </div>
                      </td>
                      <td>{courier.code}</td>
                      <td>
                        <span
                          className={`badge ${courier.isActive ? "badge-success" : "badge-default"}`}
                        >
                          {courier.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {courier.isDefault ? (
                          <span className="badge badge-info">Default</span>
                        ) : (
                          <button
                            className="btn btn-ghost btn-sm"
                            disabled={!courier.isActive}
                            onClick={() => setDefaultCourier(courier.id)}
                          >
                            Make default
                          </button>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => editCourier(courier)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(courier)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="courier-modal-title"
        >
          <form
            className="modal"
            onSubmit={handleSubmit}
            style={{
              width: "min(620px, calc(100vw - 32px))",
              maxHeight: "calc(100vh - 32px)",
              overflowY: "auto",
            }}
          >
            <div
              className="modal-header"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3 id="courier-modal-title">
                {editingId ? "Edit courier" : "Add courier"}
              </h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={resetForm}
                aria-label="Close courier modal"
              >
                Close
              </button>
            </div>
            <div className="modal-body" style={{ display: "grid", gap: 12 }}>
              <label className="form-group">
                <span className="form-label">Courier provider *</span>
                <select
                  className="form-input"
                  value={form.code}
                  required
                  onChange={(event) => {
                    const provider = COURIER_PROVIDERS.find(
                      (item) => item.code === event.target.value,
                    );
                    if (!provider) return;
                    setForm((previous) => ({
                      ...previous,
                      name: provider.name,
                      code: provider.code,
                      website: provider.website,
                    }));
                    setCredentials(
                      provider.code === "REDX"
                        ? { weight_unit: "kg", environment: "sandbox" }
                        : {},
                    );
                  }}
                >
                  <option value="" disabled>
                    Select a courier
                  </option>
                  {COURIER_PROVIDERS.map((provider) => {
                    const configuredByAnother = couriers.some(
                      (courier) =>
                        courier.code === provider.code &&
                        courier.id !== editingId,
                    );
                    return (
                      <option
                        key={provider.code}
                        value={provider.code}
                        disabled={configuredByAnother}
                      >
                        {provider.name}
                        {configuredByAnother ? " (already added)" : ""}
                      </option>
                    );
                  })}
                </select>
              </label>
              {(
                ["phone", "email"] as const
              ).map((field) => (
                <label key={field} className="form-group">
                  <span className="form-label">
                    {field[0].toUpperCase() + field.slice(1)}
                  </span>
                  <input
                    className="form-input"
                    value={form[field] ?? ""}
                    onChange={(event) => updateField(field, event.target.value)}
                  />
                </label>
              ))}
              <label className="form-group">
                <span className="form-label">Description</span>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />
              </label>
              {selectedProvider?.fields.map((field) => {
                const alreadyConfigured =
                  selectedProvider.code ===
                    couriers.find((courier) => courier.id === editingId)
                      ?.code &&
                  courierConfiguredField(editingId, couriers, field.key);
                return (
                  <label key={field.key} className="form-group">
                    <span className="form-label">
                      {field.label}
                      {field.required ? " *" : " (optional)"}
                    </span>
                    {field.key === "weight_unit" ? (
                      <select
                        className="form-input"
                        required
                        value={credentials[field.key] ?? "kg"}
                        onChange={(event) =>
                          setCredentials((previous) => ({
                            ...previous,
                            [field.key]: event.target.value,
                          }))
                        }
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                      </select>
                    ) : field.key === "environment" ? (
                      <select
                        className="form-input"
                        required
                        value={credentials[field.key] ?? "sandbox"}
                        onChange={(event) =>
                          setCredentials((previous) => ({
                            ...previous,
                            [field.key]: event.target.value,
                          }))
                        }
                      >
                        <option value="sandbox">Sandbox (test shipments)</option>
                        <option value="production">
                          Production (live shipments)
                        </option>
                      </select>
                    ) : (
                      <input
                        className="form-input"
                        type={
                          ["password", "secret", "token", "key"].some((part) =>
                            field.key.includes(part),
                          )
                            ? "password"
                            : "text"
                        }
                        autoComplete="new-password"
                        required={
                          field.required && (!editingId || !alreadyConfigured)
                        }
                        value={credentials[field.key] ?? ""}
                        placeholder={
                          alreadyConfigured
                            ? "Saved securely; leave blank to keep current value"
                            : field.required
                              ? `Enter ${field.label.toLowerCase()}`
                              : "Optional"
                        }
                        onChange={(event) =>
                          setCredentials((previous) => ({
                            ...previous,
                            [field.key]: event.target.value,
                          }))
                        }
                      />
                    )}
                  </label>
                );
              })}
              {selectedProvider?.code === "REDX" && (
                <p className="page-subtitle">
                  New configurations start in sandbox mode. Choose production
                  only when you are ready to create live shipments. Product
                  weights are sent using the unit selected above.
                </p>
              )}
              {selectedProvider && selectedProvider.code !== "REDX" && (
                <p className="page-subtitle">
                  Enter the credentials issued in your courier merchant
                  account. Shipment booking for this provider will be enabled
                  when its official API integration is available.
                </p>
              )}
              <label>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    updateField("isActive", event.target.checked)
                  }
                />{" "}
                Active
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) =>
                    updateField("isDefault", event.target.checked)
                  }
                />{" "}
                Default courier
              </label>
              {formError && <div className="form-error">{formError}</div>}
              <div className="modal-actions">
                <button className="btn btn-primary" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update courier"
                      : "Add courier"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
