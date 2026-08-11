"use client";

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
  const [configText, setConfigText] = useState("");
  const [formError, setFormError] = useState("");
  const { data, isLoading } = useGetCouriersQuery({
    page: 1,
    limit: 50,
    search: search || undefined,
  });
  const [createCourier, { isLoading: creating }] = useCreateCourierMutation();
  const [updateCourier, { isLoading: updating }] = useUpdateCourierMutation();
  const [setDefaultCourier] = useSetDefaultCourierMutation();
  const [deleteCourier] = useDeleteCourierMutation();

  const couriers = data?.data ?? [];
  const saving = creating || updating;

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
    setConfigText("");
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
      config: courier.config ?? {},
      isActive: courier.isActive,
      isDefault: courier.isDefault,
    });
    setConfigText(JSON.stringify(courier.config ?? {}, null, 2));
    setFormError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    let config: Record<string, string> = {};
    try {
      const parsed = configText.trim() ? JSON.parse(configText) : {};
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
        throw new Error("Config must be a JSON object");
      }
      config = Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => [key, String(value)]),
      );
    } catch {
      setFormError("Config must be a valid JSON object with string values.");
      return;
    }

    try {
      const payload = { ...form, config, code: form.code.toUpperCase() };
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
      window.alert(error?.data?.message ?? "Could not delete courier.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Couriers</h1>
          <p className="page-subtitle">
            Manage delivery providers for this project
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setForm({ ...emptyForm });
            setConfigText("");
            setFormError("");
            setEditingId(null);
            setFormOpen(true);
          }}
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
                  {couriers.length === 0 && (
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
                  {couriers.map((courier) => (
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
              {(
                [
                  "name",
                  "code",
                  "phone",
                  "email",
                  "website",
                  "trackingUrlTemplate",
                ] as const
              ).map((field) => (
                <label key={field} className="form-group">
                  <span className="form-label">
                    {field === "trackingUrlTemplate"
                      ? "Tracking URL template"
                      : field[0].toUpperCase() + field.slice(1)}
                    {["name", "code"].includes(field) ? " *" : ""}
                  </span>
                  <input
                    className="form-input"
                    required={["name", "code"].includes(field)}
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
              <label className="form-group">
                <span className="form-label">Config JSON</span>
                <textarea
                  className="form-textarea"
                  rows={4}
                  value={configText}
                  onChange={(event) => setConfigText(event.target.value)}
                  placeholder='{"apiKey":"server-side-secret"}'
                />
              </label>
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
