"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ImageAsset,
  ProductVariant,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteImagesMutation,
  useUploadImagesMutation,
  useGetCategoriesQuery,
} from "@/store/productApi";
import { slugify } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

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
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();
  const [deleteImages] = useDeleteImagesMutation();
  const { data: categoriesData } = useGetCategoriesQuery(undefined);
  const user = useAppSelector((state) => state.auth.user);
  const projectId = user?.projectId ?? user?.project?.id;

  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    price: initialData?.price || "",
    comparePrice:
      initialData?.comparePrice ?? initialData?.compareAtPrice ?? "",
    sku: initialData?.sku || "",
    stock: initialData?.stock ?? 0,
    trackInventory: initialData?.trackInventory ?? true,
    allowBackorders: initialData?.allowBackorders ?? false,
    status:
      initialData?.status ?? (initialData?.isActive ? "active" : "archived"),
    categories:
      initialData?.categories?.map(
        (category: any) => category.id ?? category,
      ) || [],
    tags: initialData?.tags?.join(", ") || "",
    images: (initialData?.images || []) as ImageAsset[],
    thumbnailImage: initialData?.thumbnailImage ?? initialData?.images?.[0],
    costPrice: initialData?.costPrice ?? "",
    lowStockThreshold: initialData?.lowStockThreshold ?? 10,
    isFeatured: initialData?.isFeatured ?? false,
    weight: initialData?.weight ?? "",
    dimensions: initialData?.dimensions ?? {
      length: "",
      width: "",
      height: "",
    },
    seoTitle: initialData?.seoTitle ?? "",
    seoDescription: initialData?.seoDescription ?? "",
    attributes: initialData?.attributes ?? {},
    variants: initialData?.variants ?? [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const initialVariants = (initialData?.variants ?? []) as ProductVariant[];
  const initialSizeValues = Array.from(
    new Set(
      initialVariants
        .map((variant) => variant.attributes?.size)
        .filter(Boolean),
    ),
  );
  const initialColorValues = Array.from(
    new Set(
      initialVariants
        .map((variant) => variant.attributes?.color)
        .filter(Boolean),
    ),
  );
  const [hasSize, setHasSize] = useState(initialSizeValues.length > 0);
  const [hasColor, setHasColor] = useState(initialColorValues.length > 0);
  const [sizeOptions, setSizeOptions] = useState(initialSizeValues.join(", "));
  const [colorOptions, setColorOptions] = useState(
    initialColorValues.join(", "),
  );

  const parseOptions = (value: string) =>
    Array.from(
      new Set(
        value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );

  const variantKey = (variant: ProductVariant) =>
    `${variant.attributes?.size ?? ""}|${variant.attributes?.color ?? ""}`;

  const generateVariants = () => {
    const sizes = hasSize ? parseOptions(sizeOptions) : [undefined];
    const colors = hasColor ? parseOptions(colorOptions) : [undefined];

    if ((hasSize && sizes.length === 0) || (hasColor && colors.length === 0)) {
      setErrors((previous) => ({
        ...previous,
        variants: "Add at least one size or color option.",
      }));
      return;
    }

    const existing = new Map(
      (form.variants as ProductVariant[]).map((variant) => [
        variantKey(variant),
        variant,
      ]),
    );
    const variants = sizes.flatMap((size) =>
      colors.map((color) => {
        const attributes: Record<string, string> = {};
        if (size) attributes.size = size;
        if (color) attributes.color = color;
        const previous = existing.get(
          variantKey({ attributes } as ProductVariant),
        );
        return (
          previous ?? {
            sku: `${form.sku}${size || color ? `-${[size, color].filter(Boolean).join("-").toUpperCase()}` : ""}`,
            name: [size, color].filter(Boolean).join(" / "),
            price: Number(form.price) || 0,
            stock: 0,
            lowStockThreshold: Number(form.lowStockThreshold) || 0,
            attributes,
            isActive: true,
          }
        );
      }),
    );

    handleChange("variants", variants);
    setErrors((previous) => {
      const next = { ...previous };
      delete next.variants;
      return next;
    });
  };

  const updateVariant = (index: number, changes: Partial<ProductVariant>) => {
    const variants = [...(form.variants as ProductVariant[])];
    variants[index] = { ...variants[index], ...changes };
    handleChange("variants", variants);
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
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (files.length + form.images.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }
    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ) || file.size > 5 * 1024 * 1024,
    );
    if (invalidFile) {
      alert("Use JPG, PNG, or WEBP images up to 5 MB each.");
      return;
    }
    try {
      const result = await uploadImages({
        projectId,
        folder: "products",
        images: await Promise.all(files.map(fileToDataUri)),
      }).unwrap();
      const uploaded = Array.isArray(result) ? result : [result];
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
        thumbnailImage: prev.thumbnailImage ?? uploaded[0],
      }));
    } catch (err: any) {
      alert(err?.data?.message ?? "Image upload failed");
    } finally {
      event.target.value = "";
    }
  };

  const removeImage = (image: ImageAsset) => {
    if (image.publicId) {
      deleteImages({ projectId, publicId: image.publicId }).catch(
        () => undefined,
      );
    }
    setForm((prev) => {
      const images = prev.images.filter(
        (item) => item.publicId !== image.publicId,
      );
      return {
        ...prev,
        images,
        thumbnailImage:
          prev.thumbnailImage?.publicId === image.publicId
            ? images[0]
            : prev.thumbnailImage,
      };
    });
  };

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
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price || Number(form.price) <= 0)
      e.price = "Valid price is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const {
      comparePrice,
      status,
      tags,
      attributes,
      dimensions,
      variants,
      ...productFields
    } = form;
    const normalizedVariants = (variants as ProductVariant[]).map(
      (variant) => ({
        ...variant,
        price: Number(variant.price),
        compareAtPrice: variant.compareAtPrice
          ? Number(variant.compareAtPrice)
          : undefined,
        stock: Number(variant.stock),
        lowStockThreshold: Number(variant.lowStockThreshold),
        attributes: Object.fromEntries(
          Object.entries(variant.attributes ?? {}).filter(([, value]) => value),
        ),
      }),
    );
    const payload = {
      ...productFields,
      variants: normalizedVariants,
      categories: form.categories,
      thumbnailImage: form.thumbnailImage,
      images: form.images,
      price: Number(form.price),
      compareAtPrice: comparePrice ? Number(comparePrice) : undefined,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold),
      weight: form.weight ? Number(form.weight) : undefined,
      dimensions:
        dimensions.length || dimensions.width || dimensions.height
          ? {
              length: Number(dimensions.length),
              width: Number(dimensions.width),
              height: Number(dimensions.height),
            }
          : undefined,
      attributes,
      seoTitle: form.seoTitle || undefined,
      seoDescription: form.seoDescription || undefined,
      isActive: status === "active",
      isFeatured: form.isFeatured,
      tags: tags
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

  const isLoading = creating || updating || uploading;

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
        {errors.description && (
          <div className="form-error">{errors.description}</div>
        )}
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

      <div className="form-group">
        <label className="form-label">Product Images</label>
        <input
          className="form-input"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleImageUpload}
          disabled={isLoading}
        />
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
          Up to 10 JPG, PNG, or WEBP images, 5 MB each.
        </div>
        {form.images.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 12,
              marginTop: 12,
            }}
          >
            {form.images.map((image: ImageAsset) => (
              <div key={image.publicId} style={{ position: "relative" }}>
                <img
                  src={image.secureUrl || image.url}
                  alt="Product"
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    objectFit: "cover",
                    borderRadius: "var(--radius)",
                    border:
                      form.thumbnailImage?.publicId === image.publicId
                        ? "2px solid var(--primary)"
                        : "1px solid var(--border-color)",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleChange("thumbnailImage", image)}
                  style={{ width: "100%", marginTop: 4 }}
                >
                  {form.thumbnailImage?.publicId === image.publicId
                    ? "Thumbnail"
                    : "Use thumbnail"}
                </button>
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => removeImage(image)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    border: 0,
                    borderRadius: "50%",
                    background: "var(--danger)",
                    color: "white",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                  }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}
      >
        <div className="form-group">
          <label className="form-label">Cost Price</label>
          <input
            type="number"
            className="form-input"
            value={form.costPrice}
            onChange={(e) => handleChange("costPrice", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Low Stock Threshold</label>
          <input
            type="number"
            className="form-input"
            value={form.lowStockThreshold}
            onChange={(e) => handleChange("lowStockThreshold", e.target.value)}
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Weight</label>
          <input
            type="number"
            className="form-input"
            value={form.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Dimensions</label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {(["length", "width", "height"] as const).map((dimension) => (
            <input
              key={dimension}
              type="number"
              className="form-input"
              placeholder={dimension}
              value={form.dimensions[dimension]}
              onChange={(e) =>
                handleChange("dimensions", {
                  ...form.dimensions,
                  [dimension]: e.target.value,
                })
              }
              min="0"
              step="0.01"
            />
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Attributes (JSON)</label>
        <textarea
          className="form-textarea"
          value={JSON.stringify(form.attributes, null, 2)}
          onChange={(e) => {
            try {
              handleChange("attributes", JSON.parse(e.target.value || "{}"));
            } catch {
              return;
            }
          }}
          rows={3}
          placeholder='{"material":"canvas"}'
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Product options and variant pricing
        </label>
        <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={hasSize}
              onChange={(event) => {
                const checked = event.target.checked;
                setHasSize(checked);
                if (!checked && !hasColor) handleChange("variants", []);
              }}
            />{" "}
            This product has sizes
          </label>
          <label>
            <input
              type="checkbox"
              checked={hasColor}
              onChange={(event) => {
                const checked = event.target.checked;
                setHasColor(checked);
                if (!checked && !hasSize) handleChange("variants", []);
              }}
            />{" "}
            This product has colors
          </label>
        </div>

        {(hasSize || hasColor) && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {hasSize && (
              <div>
                <label className="form-label">Sizes</label>
                <input
                  className="form-input"
                  value={sizeOptions}
                  onChange={(event) => setSizeOptions(event.target.value)}
                  placeholder="S, M, L, XL"
                />
              </div>
            )}
            {hasColor && (
              <div>
                <label className="form-label">Colors</label>
                <input
                  className="form-input"
                  value={colorOptions}
                  onChange={(event) => setColorOptions(event.target.value)}
                  placeholder="Black, White, Red"
                />
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={generateVariants}
          style={{ marginTop: 12 }}
        >
          Generate variants
        </button>
        {errors.variants && <div className="form-error">{errors.variants}</div>}

        {(form.variants as ProductVariant[]).length > 0 && (
          <div style={{ overflowX: "auto", marginTop: 16 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Variant</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {(form.variants as ProductVariant[]).map((variant, index) => (
                  <tr key={`${variantKey(variant)}-${index}`}>
                    <td>
                      {variant.name ||
                        Object.values(variant.attributes).join(" / ")}
                    </td>
                    <td>
                      <input
                        className="form-input"
                        value={variant.sku}
                        onChange={(event) =>
                          updateVariant(index, { sku: event.target.value })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(event) =>
                          updateVariant(index, {
                            price: Number(event.target.value),
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(event) =>
                          updateVariant(index, {
                            stock: Number(event.target.value),
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={variant.isActive}
                        onChange={(event) =>
                          updateVariant(index, {
                            isActive: event.target.checked,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="form-group">
          <label className="form-label">SEO Title</label>
          <input
            className="form-input"
            value={form.seoTitle}
            onChange={(e) => handleChange("seoTitle", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">SEO Description</label>
          <input
            className="form-input"
            value={form.seoDescription}
            onChange={(e) => handleChange("seoDescription", e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={form.trackInventory}
            onChange={(e) => handleChange("trackInventory", e.target.checked)}
          />{" "}
          Track inventory
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => handleChange("isFeatured", e.target.checked)}
          />{" "}
          Featured product
        </label>
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
