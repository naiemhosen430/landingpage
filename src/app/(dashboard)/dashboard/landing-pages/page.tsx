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

export default function LandingPagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    pageName: "",
    slug: "",
    status: "ACTIVE",
    landingContent: "",
    seo: { title: "", description: "", keywords: [] as string[] },
  });

  const { data, isLoading } = useGetLandingPagesQuery({
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

  const handleSave = async () => {
    try {
      if (editing) {
        await updateLandingPage({ id: editing, ...form }).unwrap();
      } else {
        await createLandingPage(form).unwrap();
      }
      setEditing(null);
      setFormVisible(false);
      setForm({
        pageName: "",
        slug: "",
        status: "ACTIVE",
        landingContent: "",
        seo: { title: "", description: "", keywords: [] },
      });
    } catch (err) {
      alert("Failed to save landing page");
    }
  };

  const handleEdit = (page: any) => {
    setEditing(page.id);
    setFormVisible(true);
    setForm({
      pageName: page.pageName || "",
      slug: page.slug || "",
      status: page.status || "ACTIVE",
      landingContent: page.landingContent || "",
      seo: {
        title: page.seo?.title || "",
        description: page.seo?.description || "",
        keywords: page.seo?.keywords || [],
      },
    });
  };

  const handleNew = () => {
    setEditing(null);
    setFormVisible(true);
    setForm({
      pageName: "",
      slug: "",
      status: "ACTIVE",
      landingContent: "",
      seo: { title: "", description: "", keywords: [] },
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this landing page?")) return;
    try {
      await deleteLandingPage(id).unwrap();
    } catch (err) {
      alert("Failed to delete landing page");
    }
  };

  const pages = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Landing Pages</h1>
          <p className="page-subtitle">Manage website landing pages</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNew}>
          Add Landing Page
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div
            style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}
          >
            <div style={{ position: "relative", width: 280 }}>
              <input
                type="text"
                placeholder="Search landing pages..."
                onChange={(e) => handleSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 12 }}
              />
            </div>
          </div>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {meta?.total ? `${meta.total} pages` : ""}
          </span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {isLoading ? (
            <div
              style={{ padding: 40, display: "flex", justifyContent: "center" }}
            >
              <div className="spinner" />
            </div>
          ) : (
            <div style={{ display: "grid", gap: 1 }}>
              {pages.map((pageItem: any) => (
                <div key={pageItem.id} className="card-row">
                  <div>
                    <div style={{ fontWeight: 600 }}>{pageItem.pageName}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {pageItem.slug} · {pageItem.status}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(pageItem)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(pageItem.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {formVisible && (
            <div className="card" style={{ marginTop: 24 }}>
              <div className="card-header">
                <h3 className="card-title">
                  {editing ? "Edit Landing Page" : "Create Landing Page"}
                </h3>
              </div>
              <div className="card-body">
                <div className="form-group">
                  <label className="form-label">Page Name</label>
                  <input
                    className="form-input"
                    value={form.pageName}
                    onChange={(e) =>
                      setForm({ ...form, pageName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Slug</label>
                  <input
                    className="form-input"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="home"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Landing Content</label>
                  <textarea
                    className="form-input"
                    rows={8}
                    value={form.landingContent}
                    onChange={(e) =>
                      setForm({ ...form, landingContent: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Title</label>
                  <input
                    className="form-input"
                    value={form.seo.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        seo: { ...form.seo, title: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={form.seo.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        seo: { ...form.seo, description: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    SEO Keywords (comma separated)
                  </label>
                  <input
                    className="form-input"
                    value={form.seo.keywords.join(", ")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        seo: {
                          ...form.seo,
                          keywords: e.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                  />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Landing Page
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setFormVisible(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
