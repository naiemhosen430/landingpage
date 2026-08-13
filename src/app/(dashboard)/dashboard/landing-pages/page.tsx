"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useGetLandingPagesQuery,
  useCreateLandingPageMutation,
  useUpdateLandingPageMutation,
  useDeleteLandingPageMutation,
} from "@/store/landingPageApi";
import { debounce } from "@/lib/utils";
import { LandingPageFormModal } from "@/components/landing-pages/LandingPageFormModal";
import { DeleteConfirmDialog } from "@/components/landing-pages/DeleteConfirmDialog";
import { StatusBadge } from "@/components/landing-pages/StatusBadge";
import { Search, Plus, Pencil, Trash2, Copy } from "lucide-react";

export default function LandingPagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetLandingPagesQuery({
    page,
    limit: 20,
    search: search || undefined,
    status: undefined,
  });

  const [createLandingPage] = useCreateLandingPageMutation();
  const [updateLandingPage] = useUpdateLandingPageMutation();
  const [deleteLandingPage] = useDeleteLandingPageMutation();

  const handleSearch = debounce((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSave = async (formData: any) => {
    try {
      if (editingId) {
        await updateLandingPage({ id: editingId, ...formData }).unwrap();
      } else {
        await createLandingPage(formData).unwrap();
      }
      setFormOpen(false);
      setEditingId(null);
    } catch {
      alert("Failed to save landing page");
    }
  };

  const handleEdit = (pageItem: any) => {
    setEditingId(pageItem.id);
    setFormOpen(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteLandingPage(deleteId).unwrap();
      setDeleteId(null);
    } catch {
      alert("Failed to delete landing page");
    }
  };

  const pages = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="lp-page">
      <style>{`
        [data-theme="light"] .lp-page {
          --lp-bg: #ffffff;
          --lp-surface: #f8fafc;
          --lp-card: #ffffff;
          --lp-text: #0f172a;
          --lp-text-secondary: #64748b;
          --lp-border: #e2e8f0;
          --lp-primary: #2563eb;
          --lp-primary-hover: #1d4ed8;
          --lp-primary-text: #ffffff;
          --lp-accent: #f1f5f9;
          --lp-danger: #dc2626;
          --lp-danger-hover: #b91c1c;
          --lp-danger-text: #ffffff;
          --lp-muted: #f1f5f9;
          --lp-ring: rgba(37,99,235,0.25);
          --lp-shadow: 0 1px 3px rgba(0,0,0,0.08);
          --lp-input-bg: #ffffff;
        }
        [data-theme="dark"] .lp-page {
          --lp-bg: #0b1120;
          --lp-surface: #0f172a;
          --lp-card: #1e293b;
          --lp-text: #f1f5f9;
          --lp-text-secondary: #94a3b8;
          --lp-border: #334155;
          --lp-primary: #3b82f6;
          --lp-primary-hover: #2563eb;
          --lp-primary-text: #ffffff;
          --lp-accent: #1e293b;
          --lp-danger: #ef4444;
          --lp-danger-hover: #dc2626;
          --lp-danger-text: #ffffff;
          --lp-muted: #1e293b;
          --lp-ring: rgba(59,130,246,0.3);
          --lp-shadow: 0 1px 3px rgba(0,0,0,0.35);
          --lp-input-bg: #0f172a;
        }

        .lp-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          background: var(--lp-bg);
          min-height: 100vh;
          color: var(--lp-text);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .lp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .lp-header h1 {
          font-size: 22px;
          font-weight: 600;
          margin: 0;
          color: var(--lp-text);
        }
        .lp-header p {
          margin: 4px 0 0;
          font-size: 13px;
          color: var(--lp-text-secondary);
        }

        .lp-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid transparent;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          outline: none;
          font-family: inherit;
          text-decoration: none;
          background: transparent;
          color: var(--lp-text);
        }
        .lp-btn:focus-visible {
          box-shadow: 0 0 0 3px var(--lp-ring);
        }
        .lp-btn-primary {
          background: var(--lp-primary);
          color: var(--lp-primary-text);
        }
        .lp-btn-primary:hover {
          background: var(--lp-primary-hover);
        }
        .lp-btn-ghost {
          background: transparent;
          border-color: var(--lp-border);
          color: var(--lp-text);
        }
        .lp-btn-ghost:hover {
          background: var(--lp-accent);
        }
        .lp-btn-danger {
          background: transparent;
          color: var(--lp-danger);
          border-color: rgba(220,38,38,0.3);
        }
        [data-theme="dark"] .lp-btn-danger {
          border-color: rgba(239,68,68,0.3);
        }
        .lp-btn-danger:hover {
          background: var(--lp-danger);
          color: var(--lp-danger-text);
          border-color: var(--lp-danger);
        }
        .lp-btn-sm {
          padding: 5px 10px;
          font-size: 12px;
        }
        .lp-btn-icon {
          padding: 0;
          width: 30px;
          height: 30px;
          justify-content: center;
        }

        .lp-card {
          background: var(--lp-card);
          border: 1px solid var(--lp-border);
          border-radius: 12px;
          box-shadow: var(--lp-shadow);
          overflow: hidden;
        }
        .lp-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid var(--lp-border);
          gap: 16px;
        }
        .lp-search-wrap {
          position: relative;
          width: 280px;
        }
        .lp-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--lp-text-secondary);
          pointer-events: none;
        }
        .lp-input {
          width: 100%;
          height: 36px;
          padding: 0 12px 0 34px;
          border: 1px solid var(--lp-border);
          border-radius: 6px;
          background: var(--lp-input-bg);
          color: var(--lp-text);
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .lp-input::placeholder {
          color: var(--lp-text-secondary);
        }
        .lp-input:focus {
          border-color: var(--lp-primary);
          box-shadow: 0 0 0 3px var(--lp-ring);
        }
        .lp-meta-text {
          font-size: 12px;
          color: var(--lp-text-secondary);
          white-space: nowrap;
        }

        .lp-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          gap: 16px;
          transition: background 0.12s;
          border-bottom: 1px solid var(--lp-border);
        }
        .lp-row:last-child {
          border-bottom: none;
        }
        .lp-row:hover {
          background: var(--lp-accent);
        }
        .lp-row-main {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .lp-thumb {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid var(--lp-border);
          flex-shrink: 0;
          background: var(--lp-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--lp-text-secondary);
        }
        .lp-row-title {
          font-weight: 600;
          font-size: 14px;
          color: var(--lp-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .lp-row-meta {
          font-size: 12px;
          color: var(--lp-text-secondary);
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lp-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .lp-row:hover .lp-actions {
          opacity: 1;
        }

        .lp-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 56px 20px;
          color: var(--lp-text-secondary);
          text-align: center;
        }
        .lp-empty p {
          margin: 0;
          font-size: 13px;
        }
        .lp-empty button {
          margin-top: 8px;
          font-size: 13px;
          color: var(--lp-primary);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }

        .lp-spinner-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px;
        }
        .lp-spinner {
          width: 28px;
          height: 28px;
          border: 2px solid var(--lp-border);
          border-top-color: var(--lp-primary);
          border-radius: 50%;
          animation: lp-spin 0.8s linear infinite;
        }
        @keyframes lp-spin {
          to { transform: rotate(360deg); }
        }

        .lp-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          border-top: 1px solid var(--lp-border);
        }
        .lp-page-info {
          font-size: 12px;
          color: var(--lp-text-secondary);
        }
      `}</style>

      <div className="lp-header">
        <div>
          <h1>Landing Pages</h1>
          <p>Manage website landing pages</p>
        </div>
        <button className="lp-btn lp-btn-primary" onClick={handleNew}>
          <Plus size={15} />
          Add Landing Page
        </button>
      </div>

      <div className="lp-card">
        <div className="lp-card-header">
          <div className="lp-search-wrap">
            <Search size={15} className="lp-search-icon" />
            <input
              type="text"
              placeholder="Search landing pages..."
              onChange={(e) => handleSearch(e.target.value)}
              className="lp-input"
            />
          </div>
          <span className="lp-meta-text">
            {meta?.total ? `${meta.total} pages` : "0 pages"}
          </span>
        </div>

        <div>
          {isLoading || isFetching ? (
            <div className="lp-spinner-wrap">
              <div className="lp-spinner" />
            </div>
          ) : pages.length === 0 ? (
            <div className="lp-empty">
              <p>No landing pages found</p>
              <button onClick={handleNew}>
                Create your first landing page
              </button>
            </div>
          ) : (
            pages.map((pageItem: any) => (
              <div key={pageItem.id} className="lp-row">
                <div className="lp-row-main">
                  {pageItem.thumbnail ? (
                    <img src={pageItem.thumbnail} alt="" className="lp-thumb" />
                  ) : (
                    <div className="lp-thumb">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div className="lp-row-title">{pageItem.pageName}</div>
                    <div className="lp-row-meta">
                      <span>/{pageItem.slug}</span>
                      <span>·</span>
                      <StatusBadge status={pageItem.status} />
                    </div>
                  </div>
                </div>

                <div className="lp-actions">
                  <Link
                    href={`/admin/landing-pages/${pageItem.id}`}
                    className="lp-btn lp-btn-ghost lp-btn-icon"
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </Link>
                  <button
                    className="lp-btn lp-btn-ghost lp-btn-icon"
                    title="Duplicate"
                    onClick={() => {}}
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    className="lp-btn lp-btn-danger lp-btn-icon"
                    title="Delete"
                    onClick={() => setDeleteId(pageItem.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="lp-pagination">
            <button
              className="lp-btn lp-btn-ghost lp-btn-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!meta.hasPrevPage}
            >
              Previous
            </button>
            <span className="lp-page-info">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              className="lp-btn lp-btn-ghost lp-btn-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!meta.hasNextPage}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <LandingPageFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingId(null);
        }}
        onSave={handleSave}
        editingId={editingId}
        initialData={
          editingId ? pages.find((p: any) => p.id === editingId) : undefined
        }
      />

      <DeleteConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Landing Page"
        description="Are you sure you want to delete this landing page? This action cannot be undone."
      />
    </div>
  );
}
