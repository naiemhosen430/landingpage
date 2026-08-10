"use client";

import { useState, useRef } from "react";
import {
  useGetMediaQuery,
  useUploadMediaMutation,
  useDeleteMediaMutation,
} from "@/store/mediaApi";
import Image from "next/image";

export default function MediaPage() {
  const { data, isLoading, refetch } = useGetMediaQuery({ page: 1, limit: 50 });
  const [uploadMedia, { isLoading: uploading }] = useUploadMediaMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      try {
        await uploadMedia(files[i]).unwrap();
      } catch (err) {
        alert(`Failed to upload ${files[i].name}`);
      }
    }
    refetch();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    try {
      await deleteMedia(id).unwrap();
      setSelected((prev) => prev.filter((s) => s !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const media = data?.data || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">Manage your store images and files</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {selected.length > 0 && (
            <button
              onClick={() => {
                if (confirm(`Delete ${selected.length} selected files?`)) {
                  selected.forEach((id) => deleteMedia(id));
                  setSelected([]);
                }
              }}
              className="btn btn-danger"
            >
              Delete ({selected.length})
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary"
            disabled={uploading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {uploading ? "Uploading..." : "Upload"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
          <div className="spinner" />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {media.map((file: any) => (
            <div
              key={file.id}
              onClick={() => toggleSelect(file.id)}
              style={{
                position: "relative",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: selected.includes(file.id)
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
                cursor: "pointer",
                background: "var(--bg-primary)",
                boxShadow: "var(--shadow)",
              }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  position: "relative",
                  background: "var(--bg-tertiary)",
                }}
              >
                {file.type === "image" ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                )}
                {selected.includes(file.id) && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      width: 24,
                      height: 24,
                      background: "var(--primary)",
                      borderRadius: "var(--radius-full)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div style={{ padding: 12 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {file.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.id);
                    }}
                    className="btn btn-ghost btn-sm"
                    style={{ color: "var(--danger)", padding: 4 }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {media.length === 0 && (
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state">
                <div className="empty-state-icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="empty-state-title">No media files</div>
                <div className="empty-state-desc">
                  Upload images to use in your products and pages.
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
