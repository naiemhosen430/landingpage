"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PaymentMethod,
  PaymentMethodInput,
  useCreatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useGetPaymentMethodsAdminQuery,
  useUpdatePaymentMethodMutation,
} from "@/store/paymentMethodApi";

const emptyForm: PaymentMethodInput = {
  code: "",
  name: "",
  description: "",
  instructions: "",
  details: {},
  isActive: true,
  sortOrder: 0,
};

const PAYMENT_PRESETS = [
  { code: "cod", name: "Cash on Delivery", detailFields: [] },
  {
    code: "bkash",
    name: "bKash",
    detailFields: [
      { key: "accountNumber", label: "bKash account number" },
      { key: "accountName", label: "Account holder name" },
      { key: "accountType", label: "Account type (Personal/Merchant)" },
    ],
  },
  {
    code: "nagad",
    name: "Nagad",
    detailFields: [
      { key: "accountNumber", label: "Nagad account number" },
      { key: "accountName", label: "Account holder name" },
      { key: "accountType", label: "Account type (Personal/Merchant)" },
    ],
  },
  {
    code: "rocket",
    name: "Rocket",
    detailFields: [
      { key: "accountNumber", label: "Rocket account number" },
      { key: "accountName", label: "Account holder name" },
      { key: "accountType", label: "Account type (Personal/Agent)" },
    ],
  },
  {
    code: "bank_transfer",
    name: "Bank Transfer",
    detailFields: [
      { key: "bankName", label: "Bank name" },
      { key: "accountName", label: "Account holder name" },
      { key: "accountNumber", label: "Account number" },
      { key: "branch", label: "Branch" },
      { key: "routingNumber", label: "Routing number" },
    ],
  },
  { code: "custom", name: "Other payment method", detailFields: [] },
] as const;

type PaymentDetailField = { key: string; label: string; value: string };

function labelFromDetailKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function detailRowsFromMap(details?: Record<string, string>) {
  return Object.entries(details ?? {}).map(([key, value]) => ({
    key,
    label: labelFromDetailKey(key),
    value,
  }));
}

function getErrorMessage(error: any) {
  return error?.data?.message || "The payment method request failed.";
}

export default function PaymentMethodsPage() {
  const {
    data: methods = [],
    isLoading,
    isFetching,
  } = useGetPaymentMethodsAdminQuery();
  const [createPaymentMethod, { isLoading: isCreating }] =
    useCreatePaymentMethodMutation();
  const [updatePaymentMethod, { isLoading: isUpdating }] =
    useUpdatePaymentMethodMutation();
  const [deletePaymentMethod, { isLoading: isDeleting }] =
    useDeletePaymentMethodMutation();
  const [form, setForm] = useState<PaymentMethodInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailFields, setDetailFields] = useState<PaymentDetailField[]>([]);
  const [error, setError] = useState("");

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (!editingId) return;
    const method = methods.find((item) => item.id === editingId);
    if (method) {
      setForm({
        code: method.code,
        name: method.name,
        description: method.description ?? "",
        instructions: method.instructions ?? "",
        details: method.details ?? {},
        isActive: method.isActive,
        sortOrder: method.sortOrder ?? 0,
      });
      const preset = PAYMENT_PRESETS.find((item) => item.code === method.code);
      const existingRows = detailRowsFromMap(method.details);
      if (preset && preset.detailFields.length) {
        const presetKeys = new Set<string>(
          preset.detailFields.map((field) => field.key),
        );
        setDetailFields([
          ...preset.detailFields.map((field) => ({
            ...field,
            value: method.details?.[field.key] ?? "",
          })),
          ...existingRows.filter((row) => !presetKeys.has(row.key)),
        ]);
      } else {
        setDetailFields(existingRows);
      }
    }
  }, [editingId, methods]);

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm, details: {} });
    setDetailFields([]);
    setError("");
  };

  const openNewForm = () => {
    setFormOpen(true);
    setEditingId(null);
    setForm({ ...emptyForm, details: {} });
    setDetailFields([]);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const presetKeys = new Set<string>(
      selectedPreset?.detailFields.map((field) => field.key) ?? [],
    );
    const detailsEntries = detailFields
      .map(({ key, label, value }) => ({
        key: presetKeys.has(key)
          ? key
          : label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        value: value.trim(),
      }))
      .filter((field) => field.key && field.value);
    if (
      new Set(detailsEntries.map((field) => field.key)).size !==
      detailsEntries.length
    ) {
      setError("Each payment detail must have a different label.");
      return;
    }
    const details: Record<string, string> = Object.fromEntries(
      detailsEntries.map(({ key, value }) => [key, value] as const),
    );

    const payload = { ...form, code: form.code.trim().toLowerCase(), details };
    try {
      if (editingId) {
        await updatePaymentMethod({ id: editingId, data: payload }).unwrap();
      } else {
        await createPaymentMethod(payload).unwrap();
      }
      resetForm();
    } catch (requestError: any) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setError("");
    setEditingId(method.id);
    setFormOpen(true);
  };

  const handleDelete = async (method: PaymentMethod) => {
    if (!window.confirm(`Delete ${method.name}?`)) return;
    setError("");
    try {
      await deletePaymentMethod(method.id).unwrap();
      if (editingId === method.id) resetForm();
    } catch (requestError: any) {
      setError(getErrorMessage(requestError));
    }
  };

  const updateField = <K extends keyof PaymentMethodInput>(
    field: K,
    value: PaymentMethodInput[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  const selectedPreset = useMemo(
    () => PAYMENT_PRESETS.find((preset) => preset.code === form.code),
    [form.code],
  );

  const selectPreset = (code: string) => {
    const preset = PAYMENT_PRESETS.find((item) => item.code === code);
    if (!preset) return;
    setForm((current) => ({
      ...current,
      code: preset.code === "custom" ? "" : preset.code,
      name: preset.code === "custom" ? "" : preset.name,
      details: {},
    }));
    setDetailFields(
      preset.detailFields.map((field) => ({ ...field, value: "" })),
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Methods</h1>
          <p className="page-subtitle">
            Configure the payment options shown on your public storefront.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNewForm} type="button">
          Add payment method
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      {formOpen ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal payment-method-modal">
            <div className="card-header">
              <h3 className="card-title">
                {editingId ? "Edit payment method" : "Add payment method"}
              </h3>
            </div>
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="payment-type">
                  Payment method type *
                </label>
                <select
                  id="payment-type"
                  className="form-select"
                  value={selectedPreset?.code ?? "custom"}
                  onChange={(event) => selectPreset(event.target.value)}
                  required
                >
                  {PAYMENT_PRESETS.map((preset) => {
                    const duplicate = methods.some(
                      (method) =>
                        method.code === preset.code &&
                        method.id !== editingId &&
                        preset.code !== "custom",
                    );
                    return (
                      <option
                        key={preset.code}
                        value={preset.code}
                        disabled={duplicate}
                      >
                        {preset.name}
                        {duplicate ? " (already added)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                {(selectedPreset?.code === "custom" || !selectedPreset) && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="payment-code">
                      Method code *
                    </label>
                    <input
                      id="payment-code"
                      className="form-input"
                      value={form.code}
                      onChange={(event) =>
                        updateField("code", event.target.value)
                      }
                      placeholder="e.g. cash_on_delivery"
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label" htmlFor="payment-name">
                    Display name *
                  </label>
                  <input
                    id="payment-name"
                    className="form-input"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="How customers will see it"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="payment-description">
                  Description
                </label>
                <input
                  id="payment-description"
                  className="form-input"
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="payment-instructions">
                  Instructions
                </label>
                <textarea
                  id="payment-instructions"
                  className="form-textarea"
                  rows={3}
                  value={form.instructions}
                  onChange={(event) =>
                    updateField("instructions", event.target.value)
                  }
                />
              </div>
              {selectedPreset?.code !== "cod" && (
                <div className="form-group">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <span className="form-label">Payment details</span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        setDetailFields((current) => [
                          ...current,
                          { key: "", label: "", value: "" },
                        ])
                      }
                    >
                      Add detail
                    </button>
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {detailFields.map((field, index) => (
                      <div
                        key={`${field.key}-${index}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) auto",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <input
                          className="form-input"
                          aria-label={`Detail ${index + 1} label`}
                          value={field.label}
                          onChange={(event) =>
                            setDetailFields((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? {
                                      ...item,
                                      label: event.target.value,
                                      key: item.key
                                        ? item.key
                                        : event.target.value
                                            .trim()
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, "_"),
                                    }
                                  : item,
                              ),
                            )
                          }
                          placeholder="Detail label (e.g. Account number)"
                        />
                        <input
                          className="form-input"
                          aria-label={`Detail ${index + 1} value`}
                          value={field.value}
                          onChange={(event) =>
                            setDetailFields((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, value: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          placeholder="Enter detail"
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          aria-label={`Remove detail ${index + 1}`}
                          onClick={() =>
                            setDetailFields((current) =>
                              current.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {detailFields.length === 0 && (
                      <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                        No extra details needed. Add account or transfer
                        instructions if customers need them.
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="payment-sort-order">
                  Display order
                </label>
                <input
                  id="payment-sort-order"
                  className="form-input"
                  type="number"
                  min="0"
                  step="1"
                  value={form.sortOrder}
                  onChange={(event) =>
                    updateField("sortOrder", Number(event.target.value) || 0)
                  }
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: 16,
                  alignItems: "end",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    paddingBottom: 12,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      updateField("isActive", event.target.checked)
                    }
                  />
                  Active on the public storefront
                </label>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Add method"}
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Configured methods</h3>
          {isFetching && (
            <span style={{ color: "var(--text-muted)" }}>Refreshing...</span>
          )}
        </div>
        {isLoading ? (
          <div className="card-body">Loading payment methods...</div>
        ) : methods.length === 0 ? (
          <div className="card-body" style={{ color: "var(--text-secondary)" }}>
            No payment methods configured yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {methods.map((method) => (
                  <tr key={method.id}>
                    <td>
                      <strong>{method.name}</strong>
                      {method.description && (
                        <div
                          style={{ color: "var(--text-muted)", fontSize: 13 }}
                        >
                          {method.description}
                        </div>
                      )}
                    </td>
                    <td>{method.code}</td>
                    <td>
                      <span
                        className={`status-badge ${method.isActive ? "status-active" : "status-inactive"}`}
                      >
                        {method.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{method.sortOrder}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        type="button"
                        onClick={() => handleEdit(method)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(method)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
