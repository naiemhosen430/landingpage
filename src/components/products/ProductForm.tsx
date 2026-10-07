"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Trash2, UploadCloud } from "lucide-react";
import {
  type ImageAsset,
  type Product,
  type ProductVariant,
  useCreateProductMutation,
  useDeleteImagesMutation,
  useUpdateProductMutation,
  useUploadImagesMutation,
} from "@/store/productApi";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import { slugify } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import {
  Input,
  MultiSelect,
  Select,
  Textarea,
} from "@/components/ui/FormControls";

interface ProductFormProps {
  initialData?: Product;
  productId?: string;
}

interface ProductEditorState {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  costPrice: string;
  stock: string;
  lowStockThreshold: string;
  trackInventory: boolean;
  categories: string[];
  tags: string;
  images: ImageAsset[];
  thumbnailImage: ImageAsset | null;
  weight: string;
  length: string;
  width: string;
  height: string;
  attributesText: string;
  seoTitle: string;
  seoDescription: string;
  attributes: Record<string, string>;
  variants: ProductVariant[];
  isActive: boolean;
  isFeatured: boolean;
}

function toStringValue(value: unknown): string {
  return value === undefined || value === null ? "" : String(value);
}

function toImageAsset(value: unknown): ImageAsset | null {
  if (typeof value !== "object" || value === null) return null;
  const image = value as Partial<ImageAsset>;
  if (
    typeof image.publicId !== "string" ||
    typeof image.url !== "string" ||
    typeof image.secureUrl !== "string"
  ) {
    return null;
  }
  return image as ImageAsset;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }
  return fallback;
}

function createInitialForm(product?: Product): ProductEditorState {
  const images = Array.isArray(product?.images)
    ? product.images
        .map(toImageAsset)
        .filter((image): image is ImageAsset => image !== null)
    : [];
  const thumbnailImage =
    toImageAsset(product?.thumbnailImage) ?? images[0] ?? null;
  const rawAttributes = product?.attributes;
  const attributes =
    rawAttributes && typeof rawAttributes === "object"
      ? Object.fromEntries(
          Object.entries(rawAttributes).map(([key, value]) => [
            key,
            toStringValue(value),
          ]),
        )
      : {};

  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    shortDescription: product?.shortDescription ?? "",
    sku: product?.sku ?? "",
    price: toStringValue(product?.price),
    compareAtPrice: toStringValue(product?.compareAtPrice),
    costPrice: toStringValue(product?.costPrice),
    stock: toStringValue(product?.stock ?? 0),
    lowStockThreshold: toStringValue(product?.lowStockThreshold ?? 10),
    trackInventory: product?.trackInventory ?? true,
    categories: Array.isArray(product?.categories)
      ? product.categories.map((category) =>
          typeof category === "string"
            ? category
            : String(
                (category as { id?: string; _id?: string }).id ??
                  (category as { _id?: string })._id ??
                  "",
              ),
        )
      : [],
    tags: product?.tags?.join(", ") ?? "",
    images,
    thumbnailImage,
    weight: toStringValue(product?.weight),
    length: toStringValue(product?.dimensions?.length),
    width: toStringValue(product?.dimensions?.width),
    height: toStringValue(product?.dimensions?.height),
    attributesText: JSON.stringify(attributes, null, 2),
    seoTitle: product?.seoTitle ?? "",
    seoDescription: product?.seoDescription ?? "",
    attributes,
    variants: Array.isArray(product?.variants) ? product.variants : [],
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  };
}

export default function ProductForm({
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();
  const [deleteImages] = useDeleteImagesMutation();
  const { data: categoriesData } = useGetCategoriesQuery(undefined);
  const user = useAppSelector((state) => state.auth.user);
  const projectId = user?.projectId ?? user?.project?.id;

  const [form, setForm] = useState<ProductEditorState>(() =>
    createInitialForm(initialData),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");
  const [imageError, setImageError] = useState("");
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug));

  const isLoading = creating || updating || uploading;
  const categories = categoriesData?.data ?? [];

  const updateField = <K extends keyof ProductEditorState>(
    field: K,
    value: ProductEditorState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleNameChange = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: slugEdited ? current.slug : slugify(name),
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.name;
      return next;
    });
  };

  const fileToDataUri = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setImageError("");

    if (form.images.length + files.length > 10) {
      setImageError("You can upload a maximum of 10 images.");
      event.target.value = "";
      return;
    }
    const invalidFile = files.find(
      (file) =>
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ) || file.size > 5 * 1024 * 1024,
    );
    if (invalidFile) {
      setImageError("Choose JPG, PNG, or WEBP images up to 5 MB each.");
      event.target.value = "";
      return;
    }

    try {
      const result = await uploadImages({
        projectId,
        folder: "products",
        images: await Promise.all(files.map(fileToDataUri)),
      }).unwrap();
      const uploaded = (Array.isArray(result) ? result : [result]).filter(
        (image) => toImageAsset(image) !== null,
      );
      if (uploaded.length === 0) {
        throw new Error(
          "The upload response did not contain any valid images.",
        );
      }
      setForm((current) => ({
        ...current,
        images: [...current.images, ...uploaded],
        thumbnailImage: current.thumbnailImage ?? uploaded[0],
      }));
    } catch (error) {
      console.error("Product image upload failed:", error);
      setImageError(getErrorMessage(error, "Image upload failed. Try again."));
    } finally {
      event.target.value = "";
    }
  };

  const removeImage = async (image: ImageAsset) => {
    setImageError("");
    setForm((current) => {
      const images = current.images.filter(
        (item) => item.publicId !== image.publicId,
      );
      return {
        ...current,
        images,
        thumbnailImage:
          current.thumbnailImage?.publicId === image.publicId
            ? (images[0] ?? null)
            : current.thumbnailImage,
      };
    });

    if (!image.publicId) return;
    try {
      await deleteImages({ projectId, publicId: image.publicId }).unwrap();
    } catch (error) {
      console.error("Failed to delete product image:", error);
      setImageError(
        getErrorMessage(
          error,
          "The image was removed from this form but could not be deleted.",
        ),
      );
    }
  };

  const updateVariant = (index: number, changes: Partial<ProductVariant>) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...changes } : variant,
      ),
    }));
  };

  const addVariant = () => {
    const index = form.variants.length + 1;
    const sku = form.sku.trim()
      ? `${form.sku.trim()}-${index}`
      : `VARIANT-${index}`;
    updateField("variants", [
      ...form.variants,
      {
        sku,
        name: `Variant ${index}`,
        price: Number(form.price) || 0,
        stock: 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 0,
        attributes: {},
        isActive: true,
      },
    ]);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Product name is required.";
    if (!form.slug.trim()) nextErrors.slug = "Product URL is required.";
    if (!form.description.trim())
      nextErrors.description = "Product description is required.";
    if (!form.sku.trim()) nextErrors.sku = "SKU is required.";
    if (form.price === "" || !Number.isFinite(Number(form.price))) {
      nextErrors.price = "Enter a valid price.";
    } else if (Number(form.price) < 0) {
      nextErrors.price = "Price cannot be negative.";
    }
    if (errors.attributes) {
      nextErrors.attributes = errors.attributes;
    }
    if (!form.thumbnailImage)
      nextErrors.images = "Upload an image and choose a thumbnail.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError("");
    if (!validate()) return;

    const hasDimensions =
      form.length !== "" || form.width !== "" || form.height !== "";
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim() || undefined,
      sku: form.sku.trim(),
      price: Number(form.price),
      compareAtPrice:
        form.compareAtPrice === "" ? undefined : Number(form.compareAtPrice),
      costPrice: form.costPrice === "" ? undefined : Number(form.costPrice),
      stock: Number(form.stock) || 0,
      lowStockThreshold: Number(form.lowStockThreshold) || 0,
      trackInventory: form.trackInventory,
      thumbnailImage: form.thumbnailImage!,
      images: form.images,
      categories: form.categories,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      variants: form.variants.map((variant) => ({
        ...variant,
        sku: variant.sku.trim(),
        name: variant.name.trim(),
        price: Number(variant.price),
        compareAtPrice:
          variant.compareAtPrice === undefined ||
          variant.compareAtPrice === null
            ? undefined
            : Number(variant.compareAtPrice),
        stock: Number(variant.stock) || 0,
        lowStockThreshold: Number(variant.lowStockThreshold) || 0,
      })),
      attributes: form.attributes,
      weight: form.weight === "" ? undefined : Number(form.weight),
      dimensions: hasDimensions
        ? {
            length: Number(form.length) || 0,
            width: Number(form.width) || 0,
            height: Number(form.height) || 0,
          }
        : undefined,
      seoTitle: form.seoTitle.trim() || undefined,
      seoDescription: form.seoDescription.trim() || undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    try {
      if (isEdit && productId) {
        await updateProduct({ id: productId, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to save product:", error);
      setSaveError(
        getErrorMessage(error, "Could not save the product. Try again."),
      );
    }
  };

  return (
    <form className="product-editor-form" onSubmit={handleSubmit}>
      <div className="product-editor-layout">
        <div className="product-editor-sections">
          <details className="product-editor-section" open>
            <summary>
              <span className="product-editor-section-icon">01</span>
              <span className="product-editor-section-heading">
                <strong>Basic info</strong>
                <small>Product name, description, pricing, and inventory</small>
              </span>
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <div className="product-editor-section-body product-editor-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="product-name">
                  Product name *
                </label>
                <Input
                  id="product-name"
                  value={form.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  placeholder="e.g. Everyday cotton shirt"
                  required
                />
                {errors.name && (
                  <span className="form-error">{errors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-slug">
                  URL handle *
                </label>
                <Input
                  id="product-slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugEdited(true);
                    updateField("slug", slugify(event.target.value));
                  }}
                  placeholder="everyday-cotton-shirt"
                  required
                />
                {errors.slug && (
                  <span className="form-error">{errors.slug}</span>
                )}
              </div>
              <div className="form-group product-editor-full">
                <label
                  className="form-label"
                  htmlFor="product-short-description"
                >
                  Short description
                </label>
                <Textarea
                  id="product-short-description"
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateField("shortDescription", event.target.value)
                  }
                  placeholder="A concise summary shown in product previews"
                  rows={2}
                  maxLength={500}
                />
              </div>
              <div className="form-group product-editor-full">
                <label className="form-label" htmlFor="product-description">
                  Description *
                </label>
                <Textarea
                  id="product-description"
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe the product, its materials, benefits, and care."
                  rows={6}
                  required
                />
                {errors.description && (
                  <span className="form-error">{errors.description}</span>
                )}
              </div>
            </div>

            <div className="product-editor-section-body product-editor-grid product-editor-grid-three">
              <div className="form-group">
                <label className="form-label" htmlFor="product-price">
                  Price *
                </label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  placeholder="0.00"
                  required
                />
                {errors.price && (
                  <span className="form-error">{errors.price}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-compare-price">
                  Compare-at price
                </label>
                <Input
                  id="product-compare-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.compareAtPrice}
                  onChange={(event) =>
                    updateField("compareAtPrice", event.target.value)
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-cost-price">
                  Cost per item
                </label>
                <Input
                  id="product-cost-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costPrice}
                  onChange={(event) =>
                    updateField("costPrice", event.target.value)
                  }
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="product-editor-section-body product-editor-grid product-editor-grid-three">
              <div className="form-group">
                <label className="form-label" htmlFor="product-sku">
                  SKU *
                </label>
                <Input
                  id="product-sku"
                  value={form.sku}
                  onChange={(event) => updateField("sku", event.target.value)}
                  placeholder="e.g. SHIRT-001"
                  required
                />
                {errors.sku && <span className="form-error">{errors.sku}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-stock">
                  Stock quantity
                </label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-low-stock">
                  Low-stock threshold
                </label>
                <Input
                  id="product-low-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.lowStockThreshold}
                  onChange={(event) =>
                    updateField("lowStockThreshold", event.target.value)
                  }
                />
              </div>
              <label className="product-editor-toggle product-editor-full">
                <Input
                  type="checkbox"
                  checked={form.trackInventory}
                  onChange={(event) =>
                    updateField("trackInventory", event.target.checked)
                  }
                />
                <span>
                  <strong>Track inventory</strong>
                  <small>Monitor available stock and low-stock levels.</small>
                </span>
              </label>
            </div>
          </details>

          <details className="product-editor-section">
            <summary>
              <span className="product-editor-section-icon">02</span>
              <span className="product-editor-section-heading">
                <strong>Additional details</strong>
                <small>Categories, variants, shipping, and visibility</small>
              </span>
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <div className="product-editor-section-body product-editor-grid">
              <MultiSelect
                label="Categories"
                hint="Choose one or more categories for this product."
                value={form.categories}
                options={categories.map((category: any) => ({
                  value: category.id ?? category._id,
                  label: category.name,
                }))}
                onChange={(values) => updateField("categories", values)}
                placeholder="Select categories"
              />
              <div className="form-group">
                <label className="form-label" htmlFor="product-tags">
                  Tags
                </label>
                <Input
                  id="product-tags"
                  value={form.tags}
                  onChange={(event) => updateField("tags", event.target.value)}
                  placeholder="cotton, casual, summer"
                />
                <small className="form-hint">Separate tags with commas.</small>
              </div>

              <label className="product-editor-toggle">
                <Input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) =>
                    updateField("isFeatured", event.target.checked)
                  }
                />
                <span>
                  <strong>Featured product</strong>
                  <small>Highlight this product in your storefront.</small>
                </span>
              </label>
              <div className="form-group">
                <label className="form-label" htmlFor="product-status">
                  Status
                </label>
                <Select
                  id="product-status"
                  value={form.isActive ? "active" : "archived"}
                  onChange={(event) =>
                    updateField("isActive", event.target.value === "active")
                  }
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
            </div>

            <div className="product-editor-section-body">
              <div className="product-editor-subheading">
                <strong>Variants</strong>
                <span>
                  Optional product options with their own price and stock.
                </span>
              </div>
              <div className="product-editor-inline-heading">
                <p>Add options such as size or color with separate stock.</p>
                <button
                  className="btn btn-secondary btn-sm"
                  type="button"
                  onClick={addVariant}
                >
                  <Plus size={15} aria-hidden="true" /> Add variant
                </button>
              </div>
              {form.variants.length === 0 ? (
                <div className="product-editor-empty">
                  No variants added. This product will use the inventory above.
                </div>
              ) : (
                <div className="product-variant-list">
                  {form.variants.map((variant, index) => (
                    <div
                      className="product-variant-card"
                      key={variant.id ?? index}
                    >
                      <div className="product-variant-fields">
                        <label className="form-group">
                          <span className="form-label">Option name</span>
                          <Input
                            value={variant.name}
                            onChange={(event) =>
                              updateVariant(index, { name: event.target.value })
                            }
                            placeholder="e.g. Blue / Large"
                          />
                        </label>
                        <label className="form-group">
                          <span className="form-label">SKU</span>
                          <Input
                            value={variant.sku}
                            onChange={(event) =>
                              updateVariant(index, { sku: event.target.value })
                            }
                          />
                        </label>
                        <label className="form-group">
                          <span className="form-label">Price</span>
                          <Input
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
                        </label>
                        <label className="form-group">
                          <span className="form-label">Stock</span>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={variant.stock}
                            onChange={(event) =>
                              updateVariant(index, {
                                stock: Number(event.target.value),
                              })
                            }
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        className="product-variant-remove"
                        aria-label={`Remove ${variant.name || "variant"}`}
                        onClick={() =>
                          updateField(
                            "variants",
                            form.variants.filter(
                              (_, variantIndex) => variantIndex !== index,
                            ),
                          )
                        }
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Remove variant
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="product-editor-section-body product-editor-grid product-editor-grid-three">
              <div className="product-editor-subheading product-editor-full">
                <strong>Shipping</strong>
                <span>Package weight and dimensions.</span>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="product-weight">
                  Weight
                </label>
                <Input
                  id="product-weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.weight}
                  onChange={(event) =>
                    updateField("weight", event.target.value)
                  }
                  placeholder="0"
                />
                <small className="form-hint">
                  Weight unit follows your store settings.
                </small>
              </div>
              {(["length", "width", "height"] as const).map((dimension) => (
                <div className="form-group" key={dimension}>
                  <label
                    className="form-label"
                    htmlFor={`product-${dimension}`}
                  >
                    {dimension[0].toUpperCase() + dimension.slice(1)}
                  </label>
                  <Input
                    id={`product-${dimension}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={form[dimension]}
                    onChange={(event) =>
                      updateField(dimension, event.target.value)
                    }
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </details>

          <details className="product-editor-section">
            <summary>
              <span className="product-editor-section-icon">03</span>
              <span className="product-editor-section-heading">
                <strong>Media</strong>
                <small>Product photos and store thumbnail</small>
              </span>
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <div className="product-editor-section-body">
              <label className="product-image-dropzone">
                <UploadCloud size={24} aria-hidden="true" />
                <span>
                  <strong>
                    {uploading ? "Uploading images…" : "Add product images"}
                  </strong>
                  <small>
                    JPG, PNG, or WEBP · up to 5 MB each · max 10 images
                  </small>
                </span>
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleImageUpload}
                  disabled={isLoading || form.images.length >= 10}
                  aria-label="Upload product images"
                />
              </label>
              {imageError && <div className="form-error">{imageError}</div>}
              {errors.images && (
                <div className="form-error">{errors.images}</div>
              )}
              {form.images.length > 0 && (
                <div className="product-image-grid">
                  {form.images.map((image) => (
                    <div className="product-image-item" key={image.publicId}>
                      <img src={image.secureUrl || image.url} alt="Product" />
                      <button
                        type="button"
                        className={
                          form.thumbnailImage?.publicId === image.publicId
                            ? "product-image-thumbnail is-selected"
                            : "product-image-thumbnail"
                        }
                        onClick={() => updateField("thumbnailImage", image)}
                      >
                        {form.thumbnailImage?.publicId === image.publicId
                          ? "Store thumbnail"
                          : "Set as thumbnail"}
                      </button>
                      <button
                        type="button"
                        className="product-image-remove"
                        aria-label="Remove product image"
                        onClick={() => void removeImage(image)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </details>

          <details className="product-editor-section">
            <summary>
              <span className="product-editor-section-icon">04</span>
              <span className="product-editor-section-heading">
                <strong>Meta / SEO</strong>
                <small>Search listing title and description</small>
              </span>
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <div className="product-editor-section-body product-editor-grid">
              <div className="form-group product-editor-full">
                <label className="form-label" htmlFor="product-seo-title">
                  SEO title
                </label>
                <Input
                  id="product-seo-title"
                  value={form.seoTitle}
                  onChange={(event) =>
                    updateField("seoTitle", event.target.value)
                  }
                  maxLength={70}
                  placeholder="Product title shown in search results"
                />
                <small className="form-hint">
                  {form.seoTitle.length}/70 characters
                </small>
              </div>
              <div className="form-group product-editor-full">
                <label className="form-label" htmlFor="product-seo-description">
                  SEO description
                </label>
                <Textarea
                  id="product-seo-description"
                  value={form.seoDescription}
                  onChange={(event) =>
                    updateField("seoDescription", event.target.value)
                  }
                  rows={3}
                  maxLength={160}
                  placeholder="A brief summary for search engines"
                />
                <small className="form-hint">
                  {form.seoDescription.length}/160 characters
                </small>
              </div>
            </div>
          </details>
        </div>

        <aside className="product-editor-sidebar">
          <div className="product-editor-preview-card">
            <span className="product-editor-preview-label">
              Product preview
            </span>
            <div className="product-editor-preview-image">
              {form.thumbnailImage ? (
                <img
                  src={form.thumbnailImage.secureUrl || form.thumbnailImage.url}
                  alt=""
                />
              ) : (
                <UploadCloud size={25} aria-hidden="true" />
              )}
            </div>
            <strong>{form.name || "Your product name"}</strong>
            <span>{form.sku ? `SKU · ${form.sku}` : "Add a product SKU"}</span>
            <b>
              {form.price
                ? `৳${Number(form.price).toLocaleString()}`
                : "Set a price"}
            </b>
          </div>
          <div className="product-editor-sidebar-note">
            <strong>Helpful tip</strong>
            <p>
              Clear photos, a detailed description, and accurate stock help
              customers buy with confidence.
            </p>
          </div>
        </aside>
      </div>

      {saveError && (
        <div className="product-editor-error" role="alert">
          {saveError}
        </div>
      )}
      {errors.attributes && (
        <div className="product-editor-error" role="alert">
          Fix the product attribute JSON before saving.
        </div>
      )}
      <div className="product-editor-footer">
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => router.push("/dashboard/products")}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving product…"
            : isEdit
              ? "Save changes"
              : "Create product"}
        </button>
      </div>
    </form>
  );
}
