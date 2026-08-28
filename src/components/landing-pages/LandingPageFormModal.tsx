"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  X,
  Save,
  FileText,
  Globe,
  Tag,
  Code2,
  Eye,
  Pencil,
} from "lucide-react";
import { useGetProductsQuery } from "@/store/productApi";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  { ssr: false },
);

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editingId: string | null;
  initialData?: any;
};

export function LandingPageFormModal({
  open,
  onClose,
  onSave,
  editingId,
  initialData,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "seo">("general");
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [htmlDraft, setHtmlDraft] = useState("");
  const [form, setForm] = useState({
    pageName: "",
    slug: "",
    status: "ACTIVE",
    landingContent: "",
    productIds: [] as string[],
    seo: { title: "", description: "", keywords: [] as string[] },
  });
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery({ limit: 100 });
  const [productToAdd, setProductToAdd] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          pageName: initialData.pageName || "",
          slug: initialData.slug || "",
          status: initialData.status || "ACTIVE",
          landingContent: initialData.landingContent || "",
          productIds: Array.isArray(initialData.productIds)
            ? initialData.productIds
            : [],
          seo: {
            title: initialData.seo?.title || "",
            description: initialData.seo?.description || "",
            keywords: initialData.seo?.keywords || [],
          },
        });
      } else {
        setForm({
          pageName: "",
          slug: "",
          status: "ACTIVE",
          landingContent: "",
          productIds: [],
          seo: { title: "", description: "", keywords: [] },
        });
      }
      setActiveTab("general");
      setCodeEditorOpen(false);
      setPreviewOpen(false);
      setProductToAdd("");
    }
  }, [open, initialData]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (codeEditorOpen) {
          setCodeEditorOpen(false);
          setPreviewOpen(false);
        } else {
          onClose();
        }
      }
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose, codeEditorOpen]);

  if (!open) return null;

  const handleSave = () => {
    if (!form.pageName.trim() || !form.slug.trim()) {
      alert("Page Name and Slug are required");
      return;
    }
    onSave(form);
  };

  const products = productsData?.data ?? [];
  const selectedProducts = form.productIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  return (
    <>
      <div
        className="lp-modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <style>{`
        [data-theme="light"] .lp-modal-overlay {
          --lp-bg: #ffffff;
          --lp-surface: #f8fafc;
          --lp-text: #0f172a;
          --lp-text-secondary: #64748b;
          --lp-border: #e2e8f0;
          --lp-primary: #2563eb;
          --lp-primary-hover: #1d4ed8;
          --lp-primary-text: #ffffff;
          --lp-accent: #f1f5f9;
          --lp-danger: #dc2626;
          --lp-muted: #f1f5f9;
          --lp-ring: rgba(37,99,235,0.25);
          --lp-overlay: rgba(0,0,0,0.45);
          --lp-input-bg: #ffffff;
        }
        [data-theme="dark"] .lp-modal-overlay {
          --lp-bg: #0f172a;
          --lp-surface: #1e293b;
          --lp-text: #f1f5f9;
          --lp-text-secondary: #94a3b8;
          --lp-border: #334155;
          --lp-primary: #3b82f6;
          --lp-primary-hover: #2563eb;
          --lp-primary-text: #ffffff;
          --lp-accent: #1e293b;
          --lp-danger: #ef4444;
          --lp-muted: #1e293b;
          --lp-ring: rgba(59,130,246,0.3);
          --lp-overlay: rgba(0,0,0,0.65);
          --lp-input-bg: #0f172a;
        }

        .lp-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: var(--lp-overlay);
          backdrop-filter: blur(4px);
          padding: 16px;
          padding-top: 10vh;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .lp-modal {
          width: 100%;
          max-width: 640px;
          background: var(--lp-bg);
          border: 1px solid var(--lp-border);
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          max-height: 80vh;
          overflow: hidden;
          color: var(--lp-text);
        }

        .lp-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid var(--lp-border);
        }
        .lp-modal-header h2 {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          color: var(--lp-text);
        }
        .lp-modal-header p {
          margin: 4px 0 0;
          font-size: 12px;
          color: var(--lp-text-secondary);
        }
        .lp-modal-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--lp-text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .lp-modal-close:hover {
          background: var(--lp-accent);
          color: var(--lp-text);
        }
        .lp-modal-close:focus-visible {
          box-shadow: 0 0 0 3px var(--lp-ring);
          outline: none;
        }

        .lp-modal-tabs {
          display: flex;
          border-bottom: 1px solid var(--lp-border);
          background: var(--lp-surface);
        }
        .lp-modal-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 20px;
          font-size: 13px;
          font-weight: 500;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: var(--lp-text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .lp-modal-tab:hover {
          color: var(--lp-text);
          background: var(--lp-accent);
        }
        .lp-modal-tab.active {
          color: var(--lp-primary);
          border-bottom-color: var(--lp-primary);
          background: transparent;
        }
        .lp-modal-tab:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px var(--lp-ring);
        }

        .lp-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .lp-form-group {
          margin-bottom: 16px;
        }
        .lp-form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--lp-text);
          margin-bottom: 6px;
        }
        .lp-form-label .required {
          color: var(--lp-danger);
          margin-left: 2px;
        }
        .lp-form-input,
        .lp-form-select,
        .lp-form-textarea {
          width: 100%;
          border: 1px solid var(--lp-border);
          border-radius: 6px;
          background: var(--lp-input-bg);
          color: var(--lp-text);
          font-size: 13px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .lp-form-input:focus,
        .lp-form-select:focus,
        .lp-form-textarea:focus {
          border-color: var(--lp-primary);
          box-shadow: 0 0 0 3px var(--lp-ring);
        }
        .lp-form-input {
          height: 36px;
          padding: 0 12px;
        }
        .lp-form-input::placeholder {
          color: var(--lp-text-secondary);
        }
        .lp-form-select {
          height: 36px;
          padding: 0 12px;
          cursor: pointer;
        }
        .lp-form-textarea {
          padding: 10px 12px;
          resize: vertical;
          min-height: 80px;
        }
        .lp-html-preview {
          min-height: 320px;
          width: 100%;
          border: 1px solid var(--lp-border);
          border-radius: 6px;
          background: #fff;
        }
        .lp-html-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px;
          border: 1px solid var(--lp-border) !important;
          border-radius: 6px !important;
          background: var(--lp-surface);
        }
        .lp-html-summary span {
          color: var(--lp-text-secondary);
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lp-code-modal-overlay {
          z-index: 60;
          padding: 16px;
          align-items: center;
        }
        .lp-code-modal {
          width: 100%;
          max-width: 1100px;
          height: min(800px, 90vh);
          background: var(--lp-bg);
          border: 1px solid var(--lp-border);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .lp-code-modal-body {
          flex: 1;
          min-height: 0;
          padding: 12px;
          background: #1e1e1e;
        }
        .lp-code-modal-body > div {
          height: 100%;
          border-radius: 6px;
          overflow: hidden;
        }
        .lp-code-modal-body.preview {
          background: var(--lp-surface);
        }
        .lp-form-hint {
          font-size: 11px;
          color: var(--lp-text-secondary);
          margin-top: 4px;
        }
        .lp-selected-products {
          display: grid;
          gap: 6px;
          margin-top: 10px;
        }
        .lp-selected-product {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          padding: 5px 8px;
          border: 1px solid var(--lp-border);
          border-radius: 6px;
          background: var(--lp-surface);
        }
        .lp-product-order {
          width: 18px;
          color: var(--lp-text-secondary);
          font-size: 11px;
          text-align: center;
        }
        .lp-product-thumb {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          border-radius: 4px;
          object-fit: cover;
          background: var(--lp-muted);
        }
        .lp-product-thumb-empty {
          border: 1px solid var(--lp-border);
        }
        .lp-product-name {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          color: var(--lp-text);
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lp-product-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border: 0;
          border-radius: 4px;
          background: transparent;
          color: var(--lp-text-secondary);
          cursor: pointer;
        }
        .lp-product-remove:hover {
          background: var(--lp-accent);
          color: var(--lp-danger);
        }

        .lp-input-prefix {
          display: flex;
          gap: 8px;
        }
        .lp-input-prefix span {
          display: inline-flex;
          align-items: center;
          padding: 0 12px;
          border: 1px solid var(--lp-border);
          border-right: none;
          border-radius: 6px 0 0 6px;
          background: var(--lp-surface);
          color: var(--lp-text-secondary);
          font-size: 13px;
        }
        .lp-input-prefix input {
          border-radius: 0 6px 6px 0;
          flex: 1;
        }

        .lp-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 20px;
          border-top: 1px solid var(--lp-border);
          background: var(--lp-surface);
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
          transition: all 0.15s;
          outline: none;
          font-family: inherit;
          background: transparent;
        }
        .lp-btn:focus-visible {
          box-shadow: 0 0 0 3px var(--lp-ring);
        }
        .lp-btn-ghost {
          background: transparent;
          border-color: var(--lp-border);
          color: var(--lp-text);
        }
        .lp-btn-ghost:hover {
          background: var(--lp-accent);
        }
        .lp-btn-primary {
          background: var(--lp-primary);
          color: var(--lp-primary-text);
        }
        .lp-btn-primary:hover {
          background: var(--lp-primary-hover);
        }
      `}</style>

        <div
          className="lp-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lp-modal-title"
        >
          <div className="lp-modal-header">
            <div>
              <h2 id="lp-modal-title">
                {editingId ? "Edit Landing Page" : "Create Landing Page"}
              </h2>
              <p>
                {editingId
                  ? "Update your landing page details"
                  : "Create a new landing page"}
              </p>
            </div>
            <button
              className="lp-modal-close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>

          <div className="lp-modal-tabs">
            <button
              className={`lp-modal-tab ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              <FileText size={14} />
              General
            </button>
            <button
              className={`lp-modal-tab ${activeTab === "seo" ? "active" : ""}`}
              onClick={() => setActiveTab("seo")}
            >
              <Globe size={14} />
              SEO
            </button>
          </div>

          <div className="lp-modal-body">
            {activeTab === "general" && (
              <>
                <div className="lp-form-group">
                  <label className="lp-form-label">
                    Page Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="lp-form-input"
                    value={form.pageName}
                    onChange={(e) =>
                      setForm({ ...form, pageName: e.target.value })
                    }
                    placeholder="e.g. Summer Sale"
                  />
                </div>

                <div className="lp-form-group">
                  <label className="lp-form-label">Assigned Products</label>
                  <select
                    className="lp-form-select"
                    value={productToAdd}
                    disabled={productsLoading}
                    onChange={(event) => {
                      const id = event.target.value;
                      if (!id || form.productIds.includes(id)) return;
                      setForm((current) => ({
                        ...current,
                        productIds: [...current.productIds, id],
                      }));
                      setProductToAdd("");
                    }}
                  >
                    <option value="">
                      {productsLoading
                        ? "Loading products..."
                        : "Add a product..."}
                    </option>
                    {products
                      .filter(
                        (product) => !form.productIds.includes(product.id),
                      )
                      .map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                  </select>
                  <p className="lp-form-hint">
                    Products are shown publicly in the order selected here.
                  </p>
                  <div className="lp-selected-products">
                    {selectedProducts.length === 0 ? (
                      <span className="lp-form-hint">
                        No products assigned.
                      </span>
                    ) : (
                      selectedProducts.map((product, index) => {
                        if (!product) return null;
                        const image =
                          product.thumbnailImage?.secureUrl ??
                          product.thumbnailImage?.url;
                        return (
                          <div className="lp-selected-product" key={product.id}>
                            <span className="lp-product-order">
                              {index + 1}
                            </span>
                            {image ? (
                              <img
                                src={image}
                                alt=""
                                className="lp-product-thumb"
                              />
                            ) : (
                              <span className="lp-product-thumb lp-product-thumb-empty" />
                            )}
                            <span className="lp-product-name">
                              {product.name}
                            </span>
                            <button
                              type="button"
                              className="lp-product-remove"
                              aria-label={`Remove ${product.name}`}
                              onClick={() =>
                                setForm((current) => ({
                                  ...current,
                                  productIds: current.productIds.filter(
                                    (id) => id !== product.id,
                                  ),
                                }))
                              }
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="lp-form-group">
                  <label className="lp-form-label">
                    Slug <span className="required">*</span>
                  </label>
                  <div className="lp-input-prefix">
                    <span>/</span>
                    <input
                      type="text"
                      className="lp-form-input"
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      placeholder="summer-sale"
                    />
                  </div>
                  <p className="lp-form-hint">
                    The URL-friendly identifier for this page.
                  </p>
                </div>

                <div className="lp-form-group">
                  <label className="lp-form-label">Status</label>
                  <select
                    className="lp-form-select"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                <div className="lp-form-group lp-html-editor">
                  <label className="lp-form-label">Landing Content</label>
                  <div className="lp-html-summary">
                    <span>
                      {form.landingContent.trim()
                        ? "HTML content is ready to edit"
                        : "No HTML content added yet"}
                    </span>
                    <button
                      type="button"
                      className="lp-btn lp-btn-primary"
                      onClick={() => {
                        setHtmlDraft(form.landingContent);
                        setPreviewOpen(false);
                        setCodeEditorOpen(true);
                      }}
                    >
                      <Code2 size={14} />
                      Edit HTML
                    </button>
                  </div>
                  <p className="lp-form-hint">
                    Open the code editor to add or edit the landing page
                    content.
                  </p>
                </div>
              </>
            )}

            {activeTab === "seo" && (
              <>
                <div className="lp-form-group">
                  <label className="lp-form-label">SEO Title</label>
                  <input
                    type="text"
                    className="lp-form-input"
                    value={form.seo.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        seo: { ...form.seo, title: e.target.value },
                      })
                    }
                    placeholder="Page title for search engines"
                  />
                </div>

                <div className="lp-form-group">
                  <label className="lp-form-label">SEO Description</label>
                  <textarea
                    className="lp-form-textarea"
                    rows={3}
                    value={form.seo.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        seo: { ...form.seo, description: e.target.value },
                      })
                    }
                    placeholder="Brief description for search engines"
                  />
                </div>

                <div className="lp-form-group">
                  <label
                    className="lp-form-label flex"
                    style={{ alignItems: "center", gap: 6 }}
                  >
                    <Tag size={13} />
                    Keywords
                  </label>
                  <input
                    type="text"
                    className="lp-form-input"
                    value={form.seo.keywords.join(", ")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        seo: {
                          ...form.seo,
                          keywords: e.target.value
                            .split(",")
                            .map((k) => k.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    placeholder="marketing, sale, summer"
                  />
                  <p className="lp-form-hint">
                    Comma-separated keywords for SEO.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="lp-modal-footer">
            <button className="lp-btn lp-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="lp-btn lp-btn-primary" onClick={handleSave}>
              <Save size={14} />
              {editingId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>

      {codeEditorOpen && (
        <div
          className="lp-modal-overlay lp-code-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setCodeEditorOpen(false);
              setPreviewOpen(false);
            }
          }}
        >
          <div
            className="lp-code-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lp-code-modal-title"
          >
            <div className="lp-modal-header">
              <div>
                <h2 id="lp-code-modal-title">HTML Code Editor</h2>
                <p>
                  Edit the landing page markup and preview it before saving.
                </p>
              </div>
              <button
                className="lp-modal-close"
                onClick={() => {
                  setCodeEditorOpen(false);
                  setPreviewOpen(false);
                }}
                aria-label="Close HTML editor"
              >
                <X size={16} />
              </button>
            </div>

            <div
              className={`lp-code-modal-body ${previewOpen ? "preview" : ""}`}
            >
              {previewOpen ? (
                <iframe
                  className="lp-html-preview"
                  title="Landing page preview"
                  sandbox="allow-scripts"
                  srcDoc={htmlDraft}
                />
              ) : (
                <div>
                  <MonacoEditor
                    height="100%"
                    language="html"
                    theme="vs-dark"
                    value={htmlDraft}
                    onChange={(value) => setHtmlDraft(value || "")}
                    options={{
                      minimap: { enabled: false },
                      automaticLayout: true,
                      fontSize: 14,
                      wordWrap: "on",
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="lp-modal-footer">
              <button
                className="lp-btn lp-btn-ghost"
                onClick={() => setPreviewOpen(!previewOpen)}
              >
                {previewOpen ? <Pencil size={14} /> : <Eye size={14} />}
                {previewOpen ? "Edit code" : "Preview"}
              </button>
              <button
                className="lp-btn lp-btn-ghost"
                onClick={() => {
                  setCodeEditorOpen(false);
                  setPreviewOpen(false);
                }}
              >
                Close
              </button>
              <button
                className="lp-btn lp-btn-primary"
                onClick={() => {
                  setForm((current) => ({
                    ...current,
                    landingContent: htmlDraft,
                  }));
                  setCodeEditorOpen(false);
                  setPreviewOpen(false);
                }}
              >
                <Save size={14} />
                Save HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
