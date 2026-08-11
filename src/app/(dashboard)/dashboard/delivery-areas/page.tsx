"use client";

import { useState } from "react";
import {
  useGetDeliveryAreasQuery,
  useCreateDeliveryAreaMutation,
  useUpdateDeliveryAreaMutation,
  useDeleteDeliveryAreaMutation,
} from "@/store/deliveryApi";

export default function DeliveryAreasPage() {
  const [page] = useState(1);
  const { data, isLoading, refetch } = useGetDeliveryAreasQuery({
    page,
    limit: 50,
  });
  const [createDeliveryArea] = useCreateDeliveryAreaMutation();
  const [updateDeliveryArea] = useUpdateDeliveryAreaMutation();
  const [deleteDeliveryArea] = useDeleteDeliveryAreaMutation();

  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    name: "",
    zones: [{ zone: "", price: 0 }],
    isActive: false,
  });

  const handleNew = () => {
    setEditing(null);
    setForm({ name: "", zones: [{ zone: "", price: 0 }], isActive: false });
    setFormVisible(true);
  };

  const handleEdit = (area: any) => {
    setEditing(area.id);
    setForm({
      name: area.name || "",
      zones: area.zones || [],
      isActive: !!area.isActive,
    });
    setFormVisible(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateDeliveryArea({ id: editing, body: form }).unwrap();
      } else {
        await createDeliveryArea(form).unwrap();
      }
      setFormVisible(false);
      refetch();
    } catch (err) {
      alert("Failed to save delivery area");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this delivery area?")) return;
    try {
      await deleteDeliveryArea(id).unwrap();
      refetch();
    } catch (err) {
      alert("Failed to delete delivery area");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Delivery Areas</h1>
          <p className="page-subtitle">
            Manage delivery areas and zone pricing
          </p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleNew}>
            Add Area
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <div>Loading…</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {(data?.data || []).map((area: any) => (
                <div key={area.id} className="card-row">
                  <div>
                    <div style={{ fontWeight: 600 }}>{area.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {area.zones
                        ?.map((z: any) => `${z.zone}: ${z.price}`)
                        .join(" · ")}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(area)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(area.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {formVisible && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <h3 className="card-title">
              {editing ? "Edit Area" : "Create Area"}
            </h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Zones</label>
              {form.zones.map((z: any, idx: number) => (
                <div
                  key={idx}
                  style={{ display: "flex", gap: 8, marginBottom: 8 }}
                >
                  <input
                    className="form-input"
                    placeholder="Zone"
                    value={z.zone}
                    onChange={(e) => {
                      const zones = [...form.zones];
                      zones[idx].zone = e.target.value;
                      setForm({ ...form, zones });
                    }}
                  />
                  <input
                    className="form-input"
                    placeholder="Price"
                    type="number"
                    value={z.price}
                    onChange={(e) => {
                      const zones = [...form.zones];
                      zones[idx].price = Number(e.target.value);
                      setForm({ ...form, zones });
                    }}
                  />
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setForm({
                        ...form,
                        zones: form.zones.filter(
                          (_: any, i: number) => i !== idx,
                        ),
                      });
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn"
                onClick={() =>
                  setForm({
                    ...form,
                    zones: [...form.zones, { zone: "", price: 0 }],
                  })
                }
              >
                Add zone
              </button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn" onClick={() => setFormVisible(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
