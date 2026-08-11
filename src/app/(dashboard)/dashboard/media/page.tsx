"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  type MediaAsset,
  useDeleteMediaMutation,
  useGetMediaDetailQuery,
  useGetMediaQuery,
  useUploadMediaMutation,
} from "@/store/mediaApi";

const folders = ["general", "products", "categories", "pages"];
const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024;

function fileToDataUri(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

export default function MediaPage() {
  const user = useAppSelector((state) => state.auth.user);
  const projectId =
    user?.projectId ?? user?.project?.id ?? process.env.NEXT_PUBLIC_PROJECT_ID;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState("general");
  const [cursor, setCursor] = useState<string | undefined>();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [detailPublicId, setDetailPublicId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const { data, isLoading, isFetching, refetch } = useGetMediaQuery({
    projectId,
    folder,
    limit: 30,
    nextCursor: cursor,
  });
  const [uploadMedia, { isLoading: uploading }] = useUploadMediaMutation();
  const [deleteMedia, { isLoading: deleting }] = useDeleteMediaMutation();
  const detailQuery = useGetMediaDetailQuery(
    { publicId: detailPublicId ?? "", projectId },
    { skip: !detailPublicId },
  );

  useEffect(() => {
    console.log({ data });
    if (cursor && data?.resources?.length) {
      setAssets((previous) => {
        const existing = new Set(previous.map((asset) => asset.publicId));
        return [
          ...previous,
          ...data.resources.filter((asset) => !existing.has(asset.publicId)),
        ];
      });
    }
  }, [cursor, data?.resources]);

  const changeFolder = (value: string) => {
    setFolder(value);
    setCursor(undefined);
    setAssets([]);
    setSelected([]);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploadError("");
    if (files.length > 10) {
      setUploadError("You can upload a maximum of 10 images at a time.");
      return;
    }
    const invalid = files.find(
      (file) => !allowedTypes.includes(file.type) || file.size > maxFileSize,
    );
    if (invalid) {
      setUploadError("Use JPG, PNG, or WEBP images up to 5 MB each.");
      return;
    }
    try {
      await uploadMedia({
        projectId,
        folder,
        images: await Promise.all(files.map(fileToDataUri)),
      }).unwrap();
      setCursor(undefined);
      setAssets([]);
      await refetch();
    } catch (error: any) {
      setUploadError(error?.data?.message ?? "Upload failed.");
    } finally {
      event.target.value = "";
    }
  };

  const removeAssets = async (publicIds: string[]) => {
    if (
      !publicIds.length ||
      !window.confirm(
        `Delete ${publicIds.length} selected file${publicIds.length === 1 ? "" : "s"}?`,
      )
    )
      return;
    try {
      await deleteMedia({ projectId, publicIds }).unwrap();
      setSelected([]);
      setCursor(undefined);
      setAssets([]);
      await refetch();
    } catch (error: any) {
      window.alert(error?.data?.message ?? "Delete failed.");
    }
  };

  const toggleSelect = (publicId: string) => {
    setSelected((previous) =>
      previous.includes(publicId)
        ? previous.filter((id) => id !== publicId)
        : [...previous, publicId],
    );
  };

  const visibleAssets = cursor ? assets : (data?.resources ?? []);
  const hasMore = Boolean(data?.nextCursor);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Media Library</h1>
          <p className="page-subtitle">
            Manage project-scoped Cloudinary image assets
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            className="form-select"
            value={folder}
            onChange={(event) => changeFolder(event.target.value)}
          >
            {folders.map((item) => (
              <option key={item} value={item}>
                {item[0].toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
          {selected.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={() => removeAssets(selected)}
              disabled={deleting}
            >
              Delete ({selected.length})
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload images"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleUpload}
            hidden
          />
        </div>
      </div>

      {uploadError && (
        <div className="alert alert-error" style={{ marginBottom: 24 }}>
          {uploadError}
        </div>
      )}
      {isLoading && !assets.length ? (
        <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
          <div className="spinner" />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            {visibleAssets.map((asset) => (
              <div
                key={asset.publicId}
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  border: selected.includes(asset.publicId)
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                  background: "var(--bg-primary)",
                  boxShadow: "var(--shadow)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setDetailPublicId(asset.publicId)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 0,
                    border: 0,
                    cursor: "pointer",
                    background: "var(--bg-tertiary)",
                  }}
                >
                  <img
                    src={asset.secureUrl || asset.url}
                    alt={asset.publicId}
                    style={{
                      display: "block",
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                    }}
                  />
                </button>
                <div style={{ padding: 12 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={asset.publicId}
                  >
                    {asset.publicId.split("/").pop()}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 6,
                    }}
                  >
                    {asset.width} x {asset.height} · {formatBytes(asset.bytes)}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleSelect(asset.publicId)}
                    >
                      {selected.includes(asset.publicId)
                        ? "Selected"
                        : "Select"}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeAssets([asset.publicId])}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!visibleAssets.length && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="empty-state">
                  <div className="empty-state-title">No media files</div>
                  <div className="empty-state-desc">
                    Upload images to the {folder} folder.
                  </div>
                </div>
              </div>
            )}
          </div>
          {hasMore && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 24,
              }}
            >
              <button
                className="btn btn-secondary"
                disabled={isFetching}
                onClick={() => {
                  setAssets(visibleAssets);
                  setCursor(data?.nextCursor);
                }}
              >
                {isFetching ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}

      {detailPublicId && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-detail-title"
        >
          <div
            className="modal"
            style={{ width: "min(560px, calc(100vw - 32px))" }}
          >
            <div
              className="modal-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 id="media-detail-title">Media details</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setDetailPublicId(null)}
              >
                Close
              </button>
            </div>
            <div className="modal-body">
              {detailQuery.isLoading ? (
                <div className="spinner" />
              ) : detailQuery.data ? (
                <>
                  <img
                    src={detailQuery.data.secureUrl || detailQuery.data.url}
                    alt={detailQuery.data.publicId}
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "contain",
                      background: "var(--bg-tertiary)",
                    }}
                  />
                  <dl
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: 8,
                      marginTop: 16,
                    }}
                  >
                    <dt>Public ID</dt>
                    <dd style={{ overflowWrap: "anywhere" }}>
                      {detailQuery.data.publicId}
                    </dd>
                    <dt>Folder</dt>
                    <dd>{detailQuery.data.folder}</dd>
                    <dt>Format</dt>
                    <dd>{detailQuery.data.format}</dd>
                    <dt>Dimensions</dt>
                    <dd>
                      {detailQuery.data.width} x {detailQuery.data.height}
                    </dd>
                    <dt>Size</dt>
                    <dd>{formatBytes(detailQuery.data.bytes)}</dd>
                  </dl>
                </>
              ) : (
                <div className="form-error">Unable to load media details.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
