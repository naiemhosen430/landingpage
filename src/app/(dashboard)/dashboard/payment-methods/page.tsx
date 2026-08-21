"use client";

import { useEffect, useState } from "react";
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
  const [detailsText, setDetailsText] = useState("{}");
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
      setDetailsText(JSON.stringify(method.details ?? {}, null, 2));
    }
  }, [editingId, methods]);

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm, details: {} });
    setDetailsText("{}");
    setError("");
  };

  const openNewForm = () => {
    setFormOpen(true);
    setEditingId(null);
    setForm({ ...emptyForm, details: {} });
    setDetailsText("{}");
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    let details: Record<string, string> = {};
    try {
      const parsed = JSON.parse(detailsText || "{}");
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
        throw new Error("Details must be a JSON object.");
      }
      details = parsed;
    } catch {
      setError("Details must be valid JSON in key/value object format.");
      return;
    }

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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="payment-code">
                    Code *
                  </label>
                  <input
                    id="payment-code"
                    className="form-input"
                    value={form.code}
                    disabled={Boolean(editingId)}
                    onChange={(event) =>
                      updateField("code", event.target.value)
                    }
                    placeholder="bkash"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="payment-name">
                    Name *
                  </label>
                  <input
                    id="payment-name"
                    className="form-input"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="bKash"
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
              <div className="form-group">
                <label className="form-label" htmlFor="payment-details">
                  Details (JSON key/value)
                </label>
                <textarea
                  id="payment-details"
                  className="form-textarea"
                  rows={5}
                  value={detailsText}
                  onChange={(event) => setDetailsText(event.target.value)}
                  placeholder={'{"accountNumber":"01700000000"}'}
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
                <div className="form-group">
                  <label className="form-label" htmlFor="payment-sort">
                    Sort order
                  </label>
                  <input
                    id="payment-sort"
                    className="form-input"
                    type="number"
                    min="0"
                    value={form.sortOrder}
                    onChange={(event) =>
                      updateField("sortOrder", Number(event.target.value))
                    }
                  />
                </div>
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
