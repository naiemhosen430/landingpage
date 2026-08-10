"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetCategoriesQuery,
} from "@/store/productApi";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
  initialData?: any;
  productId?: string;
}

export default function ProductForm({
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery(undefined);

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price || "",
    comparePrice: initialData?.comparePrice || "",
    sku: initialData?.sku || "",
    stock: initialData?.stock ?? 0,
    trackInventory: initialData?.trackInventory ?? true,
    allowBackorders: initialData?.allowBackorders ?? false,
    status: initialData?.status || "draft",
    categories: initialData?.categories?.map((c: any) => c.id) || [],
    tags: initialData?.tags?.join(", ") || "",
    images: initialData?.images || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit && prev.slug ? prev.slug : slugify(name),
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.price || Number(form.price) <= 0)
      e.price = "Valid price is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      stock: Number(form.stock),
      tags: form.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await updateProduct({ id: productId, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      router.push("/dashboard/products");
    } catch (err: any) {
      alert(err?.data?.message || "Something went wrong");
    }
  };

  const isLoading = creating || updating;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="form-group">
          <label className="form-label">Product Name *</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Wireless Headphones"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Slug *</label>
          <input
            className="form-input"
            value={form.slug}
            onChange={(e) => handleChange("slug", e.target.value)}
            placeholder="product-url-slug"
          />
          {errors.slug && <div className="form-error">{errors.slug}</div>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Short Description</label>
        <input
          className="form-input"
          value={form.shortDescription}
          onChange={(e) => handleChange("shortDescription", e.target.value)}
          placeholder="Brief product summary"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Detailed product description"
          rows={5}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        <div className="form-group">
          <label className="form-label">Price *</label>
          <input
            type="number"
            className="form-input"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          {errors.price && <div className="form-error">{errors.price}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Compare at Price</label>
          <input
            type="number"
            className="form-input"
            value={form.comparePrice}
            onChange={(e) => handleChange("comparePrice", e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label className="form-label">SKU *</label>
          <input
            className="form-input"
            value={form.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="PROD-001"
          />
          {errors.sku && <div className="form-error">{errors.sku}</div>}
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        <div className="form-group">
          <label className="form-label">Stock Quantity</label>
          <input
            type="number"
            className="form-input"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            min="0"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            className="form-input"
            value={form.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Categories</label>
        <select
          multiple
          className="form-select"
          value={form.categories}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions).map(
              (o) => o.value,
            );
            handleChange("categories", values);
          }}
          style={{ minHeight: 100 }}
        >
          {categoriesData?.data?.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Create Product"}
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={() => router.push("/dashboard/products")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
