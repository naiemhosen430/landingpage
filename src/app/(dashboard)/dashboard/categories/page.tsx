"use client";

import { useState } from "react";
import {
  Category,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/store/categoryApi";
import { debounce } from "@/lib/utils";
import {
  ImageAsset,
  useDeleteImagesMutation,
  useUploadImagesMutation,
} from "@/store/productApi";
import { useAppSelector } from "@/store/hooks";
import ConfirmModal from "@/components/ui/ConfirmModal";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: null as ImageAsset | null,
  parentId: "",
  sortOrder: 0,
  isActive: true,
};

type CategoryForm = typeof emptyForm;

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const { data, isLoading } = useGetCategoriesQuery({
    search: search || undefined,
  });
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();
  const [deleteImages] = useDeleteImagesMutation();
  const projectId = useAppSelector(
    (state) => state.auth.user?.projectId ?? state.auth.user?.project?.id,
  );

  const categories = data?.data ?? [];
  const isSaving = creating || updating;
  const updateField = <K extends keyof CategoryForm>(
    field: K,
    value: CategoryForm[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  };

  const fileToDataUri = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      ) ||
      file.size > 5 * 1024 * 1024
    ) {
      alert("Use a JPG, PNG, or WEBP image up to 5 MB.");
      event.target.value = "";
      return;
    }
    try {
      const result = await uploadImages({
        projectId,
        folder: "categories",
        images: [await fileToDataUri(file)],
      }).unwrap();
      const uploaded = Array.isArray(result) ? result[0] : result;
      if (uploaded) {
        const previous = form.image;
        setForm((current) => ({ ...current, image: uploaded }));
        if (previous?.publicId) {
          deleteImages({ projectId, publicId: previous.publicId }).catch(
            () => undefined,
          );
        }
      }
    } catch (error: any) {
      alert(error?.data?.message ?? "Image upload failed");
    } finally {
      event.target.value = "";
    }
  };

  const removeImage = () => {
    if (form.image?.publicId) {
      deleteImages({ projectId, publicId: form.image.publicId }).catch(
        () => undefined,
      );
    }
    setForm((current) => ({ ...current, image: null }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      alert("Name and slug are required");
      return;
    }
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        image: editingId ? form.image : (form.image ?? undefined),
        parentId: form.parentId || undefined,
        sortOrder: Number(form.sortOrder) || 0,
      };
      if (editingId) {
        await updateCategory({ id: editingId, ...payload }).unwrap();
      } else {
        await createCategory(payload).unwrap();
      }
      resetForm();
    } catch {
      alert("Failed to save category");
    }
  };

  const edit = (category: Category) => {
    setEditingId(category.id);
    setFormOpen(true);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      image: category.image ?? null,
      parentId: category.parentId ?? "",
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive,
    });
  };

  const remove = async (category: Category) => {
    setDeleteTarget(category);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id).unwrap();
      if (deleteTarget.image?.publicId) {
        await deleteImages({
          projectId,
          publicId: deleteTarget.image.publicId,
        }).unwrap();
      }
      if (editingId === deleteTarget.id) resetForm();
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete category");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organize products for your store</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setFormOpen(true);
          }}
        >
          + New category
        </button>
      </div>

      <div
        style={{
          display: "block",
        }}
      >
        {formOpen && (
          <div
            className="modal-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) resetForm();
            }}
          >
            <form
              className="modal card"
              onSubmit={submit}
              style={{
                width: "min(100%, 520px)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <div className="card-header">
                <h2 style={{ margin: 0, fontSize: 16 }}>
                  {editingId ? "Edit category" : "New category"}
                </h2>
              </div>
              <div className="card-body">
                <label className="form-label">Name *</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Shoes"
                />
                <label className="form-label" style={{ marginTop: 14 }}>
                  Slug *
                </label>
                <input
                  className="form-input"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="shoes"
                />
                <label className="form-label" style={{ marginTop: 14 }}>
                  Description
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
                <label className="form-label" style={{ marginTop: 14 }}>
                  Category image
                </label>
                <input
                  className="form-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading || isSaving}
                />
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginTop: 6,
                  }}
                >
                  One JPG, PNG, or WEBP image, up to 5 MB.
                </div>
                {form.image && (
                  <div
                    style={{ position: "relative", marginTop: 10, width: 96 }}
                  >
                    <img
                      src={form.image.secureUrl || form.image.url}
                      alt="Category preview"
                      style={{
                        width: 96,
                        height: 96,
                        objectFit: "cover",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={removeImage}
                      style={{ width: "100%", marginTop: 4 }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginTop: 14,
                  }}
                >
                  <div>
                    <label className="form-label">Parent</label>
                    <select
                      className="form-select"
                      value={form.parentId}
                      onChange={(e) => updateField("parentId", e.target.value)}
                    >
                      <option value="">None</option>
                      {categories
                        .filter((category) => category.id !== editingId)
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Sort order</label>
                    <input
                      className="form-input"
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) =>
                        updateField("sortOrder", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 16,
                    fontSize: 13,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => updateField("isActive", e.target.checked)}
                  />{" "}
                  Active
                </label>
              </div>
              <div
                className="card-footer"
                style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
              >
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {uploading
                    ? "Uploading..."
                    : isSaving
                      ? "Saving..."
                      : editingId
                        ? "Update category"
                        : "Create category"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <div
            className="card-header"
            style={{ display: "flex", gap: 12, alignItems: "center" }}
          >
            <input
              className="form-input"
              style={{ maxWidth: 320 }}
              placeholder="Search categories..."
              onChange={(e) =>
                debounce(
                  (value: string) => setSearch(value),
                  300,
                )(e.target.value)
              }
            />
            <span
              style={{
                marginLeft: "auto",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              {data?.meta?.total ?? categories.length} categories
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {isLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div
                style={{
                  padding: 40,
                  textAlign: "center",
                  color: "var(--text-muted)",
                }}
              >
                No categories found.
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--border-color)",
                  }}
                >
                  {category.image?.secureUrl || category.image?.url ? (
                    <img
                      src={category.image.secureUrl || category.image.url}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        background: "var(--bg-secondary)",
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong>{category.name}</strong>
                    <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      /{category.slug} · Order {category.sortOrder}
                    </div>
                  </div>
                  <span
                    className={`status-badge ${category.isActive ? "status-active" : "status-inactive"}`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => edit(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => remove(category)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete category?"
        description={
          deleteTarget
            ? `This will permanently delete ${deleteTarget.name}.`
            : undefined
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
