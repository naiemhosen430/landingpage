"use client";

import { useState } from "react";
import {
  useGetTrackingEventsQuery,
  useDeleteTrackingEventMutation,
} from "@/store/trackingApi";

export default function TrackingPage() {
  const [page] = useState(1);
  const { data, isLoading, refetch } = useGetTrackingEventsQuery({
    page,
    limit: 50,
  });
  const [deleteEvent] = useDeleteTrackingEventMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id).unwrap();
      refetch();
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tracking Events</h1>
          <p className="page-subtitle">Recent server-side tracking events</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <div>Loading…</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {(data?.data || []).map((ev: any) => (
                <div key={ev.id} className="card-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {ev.eventName} · {ev.eventType}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {new Date(ev.createdAt).toLocaleString()}
                    </div>
                    <pre style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                      {JSON.stringify(ev.payload, null, 2)}
                    </pre>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(ev.id)}
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
    </div>
  );
}
