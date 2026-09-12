"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Input, TextArea } from "@/components/ui/FormControls";
import { useAppSelector } from "@/store/hooks";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import { useGetMediaQuery, useUploadMediaMutation } from "@/store/mediaApi";
import { useGetPublicProductsQuery } from "@/store/publicApi";
import {
  useGetHomePageQuery,
  useUpdateHomePageMutation,
  type HomePageContent,
  type HomePageSlide,
} from "@/store/homePageApi";
import "@/styles/home-page-admin.css";
import { demoHomePage } from "@/lib/homePageDemo";

const makeSlide = (sortOrder: number): HomePageSlide => ({
  id: `slide-${Date.now()}-${sortOrder}`,
  eyebrow: "The considered edit",
  title: "Good things,",
  emphasis: "made simply.",
  description:
    "A quieter way to shop for pieces that make daily life feel more yours.",
  buttonLabel: "Shop the collection",
  buttonHref: "/products",
  imageUrl: "",
  imageAlt: "Featured collection",
  accentColor: "#b36d4c",
  isActive: true,
  sortOrder,
});

function fileToDataUri(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function HomePageEditor() {
  const { data, isLoading } = useGetHomePageQuery();
  const [saveHomePage, { isLoading: saving }] = useUpdateHomePageMutation();
  const [uploadMedia, { isLoading: uploading }] = useUploadMediaMutation();
  const { data: categoryResponse } = useGetCategoriesQuery();
  const { data: productsResponse } = useGetPublicProductsQuery({ limit: 100 });
  const projectId = useAppSelector(
    (state) => state.auth.user?.projectId ?? state.auth.user?.project?.id,
  );
  const categories = categoryResponse?.data ?? [];
  const products = Array.isArray(productsResponse)
    ? productsResponse
    : ((productsResponse as any)?.products ??
      (productsResponse as any)?.items ??
      []);
  const [form, setForm] = useState<HomePageContent>({} as HomePageContent);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setForm(data ? { ...demoHomePage, ...data } : demoHomePage);
  }, [data]);

  const selectedCategoryIds = useMemo(
    () => new Set(form.categories.map((category) => category.id)),
    [form.categories],
  );
  const updateHero = (changes: Partial<HomePageContent["hero"]>) =>
    setForm((current) => ({
      ...current,
      hero: { ...current.hero, ...changes },
    }));
  const updateSlide = (index: number, changes: Partial<HomePageSlide>) =>
    setForm((current) => ({
      ...current,
      hero: {
        ...current.hero,
        slides: current.hero.slides.map((slide, slideIndex) =>
          slideIndex === index ? { ...slide, ...changes } : slide,
        ),
      },
    }));
  const moveSlide = (index: number, direction: -1 | 1) =>
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.hero.slides.length)
        return current;
      const slides = [...current.hero.slides];
      [slides[index], slides[nextIndex]] = [slides[nextIndex], slides[index]];
      return {
        ...current,
        hero: {
          ...current.hero,
          slides: slides.map((slide, sortOrder) => ({ ...slide, sortOrder })),
        },
      };
    });
  const toggleCategory = (category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: { url?: string; secureUrl?: string } | null;
  }) =>
    setForm((current) =>
      selectedCategoryIds.has(category.id)
        ? {
            ...current,
            categories: current.categories.filter(
              (item) => item.id !== category.id,
            ),
          }
        : {
            ...current,
            categories: [
              ...current.categories,
              {
                id: category.id,
                label: category.name,
                href: `/products?category=${category.slug}`,
                description: category.description,
                imageUrl: category.image?.secureUrl || category.image?.url,
              },
            ],
          },
    );
  const uploadSlideImage = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      alert("Use an image up to 5 MB.");
      return;
    }
    try {
      const result = await uploadMedia({
        projectId,
        folder: "home-page",
        images: [await fileToDataUri(file)],
      }).unwrap();
      const asset = Array.isArray(result) ? result[0] : result;
      if (asset) updateSlide(index, { imageUrl: asset.secureUrl || asset.url });
    } catch (error: any) {
      alert(error?.data?.message ?? "Banner upload failed");
    } finally {
      event.target.value = "";
    }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await saveHomePage(form).unwrap();
      setNotice("Homepage published");
      window.setTimeout(() => setNotice(""), 3000);
    } catch (error: any) {
      alert(error?.data?.message ?? "Failed to save homepage");
    }
  };

  if (isLoading)
    return (
      <div className="home-editor-loading">
        <div className="spinner" />
      </div>
    );
  return (
    <form className="home-editor" onSubmit={save}>
      <div className="home-editor-header page-header">
        <div>
          <p className="home-editor-kicker">Storefront studio</p>
          <h1 className="page-title">Homepage</h1>
          <p className="page-subtitle">
            Shape the first impression customers see on your store.
          </p>
          {!data && (
            <p className="home-editor-demo-note">
              Demo content is shown until the homepage API returns a saved
              document.
            </p>
          )}
        </div>
        <div className="home-editor-actions">
          {notice && <span className="home-editor-notice">{notice}</span>}
          <button className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            {saving ? "Publishing..." : "Publish homepage"}
          </button>
        </div>
      </div>

      <section className="home-editor-section home-editor-hero-section">
        <div className="home-editor-section-heading">
          <div>
            <span className="home-editor-number">01</span>
            <div>
              <h2>Hero slider</h2>
              <p>Lead with a strong image, message, and clear next step.</p>
            </div>
          </div>
          <label className="home-editor-toggle">
            <input
              type="checkbox"
              checked={form.hero.autoplay}
              onChange={(event) =>
                updateHero({ autoplay: event.target.checked })
              }
            />{" "}
            Auto-rotate
          </label>
        </div>
        <div className="home-editor-slider-settings">
          <Input
            label="Rotation interval (ms)"
            type="number"
            min={3000}
            max={15000}
            value={form.hero.intervalMs}
            onChange={(event) =>
              updateHero({ intervalMs: Number(event.target.value) })
            }
          />
          <span>Recommended: 5500ms</span>
        </div>
        <div className="home-slide-list">
          {form.hero.slides.map((slide, index) => (
            <article className="home-slide-editor" key={slide.id}>
              <div
                className="home-slide-preview"
                style={
                  slide.imageUrl
                    ? { backgroundImage: `url(${slide.imageUrl})` }
                    : undefined
                }
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {!slide.imageUrl && (
                  <span className="home-image-size-hint">
                    <ImagePlus size={24} />
                    <strong>Banner image</strong>
                    <small>1440 × 640 px</small>
                  </span>
                )}
              </div>
              <div className="home-slide-fields">
                <div className="home-slide-title-row">
                  <strong>Slide {index + 1}</strong>
                  <div>
                    <button
                      type="button"
                      className="icon-action"
                      aria-label="Move slide up"
                      disabled={index === 0}
                      onClick={() => moveSlide(index, -1)}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-action"
                      aria-label="Move slide down"
                      disabled={index === form.hero.slides.length - 1}
                      onClick={() => moveSlide(index, 1)}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-action danger"
                      aria-label="Delete slide"
                      disabled={form.hero.slides.length <= 1}
                      onClick={() =>
                        updateHero({
                          slides: form.hero.slides
                            .filter((_, slideIndex) => slideIndex !== index)
                            .map((item, sortOrder) => ({ ...item, sortOrder })),
                        })
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="home-editor-grid">
                  <Input
                    label="Eyebrow"
                    value={slide.eyebrow}
                    onChange={(event) =>
                      updateSlide(index, { eyebrow: event.target.value })
                    }
                  />
                  <Input
                    label="Button label"
                    value={slide.buttonLabel}
                    onChange={(event) =>
                      updateSlide(index, { buttonLabel: event.target.value })
                    }
                  />
                  <Input
                    label="Headline"
                    value={slide.title}
                    onChange={(event) =>
                      updateSlide(index, { title: event.target.value })
                    }
                  />
                  <Input
                    label="Italic emphasis"
                    value={slide.emphasis}
                    onChange={(event) =>
                      updateSlide(index, { emphasis: event.target.value })
                    }
                  />
                  <TextArea
                    className="wide-field"
                    label="Description"
                    value={slide.description}
                    onChange={(event) =>
                      updateSlide(index, { description: event.target.value })
                    }
                  />
                  <Input
                    label="Button link"
                    value={slide.buttonHref}
                    onChange={(event) =>
                      updateSlide(index, { buttonHref: event.target.value })
                    }
                  />
                  <Input
                    label="Image URL"
                    value={slide.imageUrl}
                    onChange={(event) =>
                      updateSlide(index, { imageUrl: event.target.value })
                    }
                  />
                  <label className="home-upload-button">
                    <ImagePlus size={15} />
                    {uploading ? "Uploading..." : "Upload banner"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => uploadSlideImage(index, event)}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <label className="home-editor-toggle slide-active">
                  <input
                    type="checkbox"
                    checked={slide.isActive}
                    onChange={(event) =>
                      updateSlide(index, { isActive: event.target.checked })
                    }
                  />{" "}
                  Visible on storefront
                </label>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-secondary home-add-slide"
          onClick={() =>
            updateHero({
              slides: [...form.hero.slides, makeSlide(form.hero.slides.length)],
            })
          }
        >
          <Plus size={16} /> Add slide
        </button>
      </section>

      <section className="home-editor-section">
        <div className="home-editor-section-heading">
          <div>
            <span className="home-editor-number">02</span>
            <div>
              <h2>Homepage sections</h2>
              <p>Choose which sections are visible on the public homepage.</p>
            </div>
          </div>
        </div>
        <div className="home-visibility-grid">
          {(
            Object.keys(form.visibility) as Array<
              keyof HomePageContent["visibility"]
            >
          ).map((section) => (
            <label key={section}>
              <input
                type="checkbox"
                checked={form.visibility[section]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    visibility: {
                      ...current.visibility,
                      [section]: event.target.checked,
                    },
                  }))
                }
              />
              <span>
                {section === "categoryProducts"
                  ? "Category product rows"
                  : section[0].toUpperCase() + section.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="home-editor-section">
        <div className="home-editor-section-heading">
          <div>
            <span className="home-editor-number">03</span>
            <div>
              <h2>Two image banners</h2>
              <p>
                Use two supporting promotions below the bestseller products.
              </p>
            </div>
          </div>
        </div>
        <div className="home-editor-grid">
          <Input
            label="Section eyebrow"
            value={form.banners.eyebrow}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                banners: { ...current.banners, eyebrow: event.target.value },
              }))
            }
          />
          <Input
            label="Section title"
            value={form.banners.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                banners: { ...current.banners, title: event.target.value },
              }))
            }
          />
        </div>
        <div className="home-banner-editor-list">
          {form.banners.items.slice(0, 2).map((banner, index) => (
            <div className="home-banner-editor" key={banner.id}>
              <div
                className="home-banner-editor-preview"
                style={
                  banner.imageUrl
                    ? { backgroundImage: `url(${banner.imageUrl})` }
                    : undefined
                }
              >
                {!banner.imageUrl && <span>900 × 560 px</span>}
              </div>
              <div className="home-editor-grid">
                <Input
                  label={`Banner ${index + 1} image URL`}
                  value={banner.imageUrl}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      banners: {
                        ...current.banners,
                        items: current.banners.items.map((item) =>
                          item.id === banner.id
                            ? { ...item, imageUrl: event.target.value }
                            : item,
                        ),
                      },
                    }))
                  }
                />
                <Input
                  label="Eyebrow"
                  value={banner.eyebrow || ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      banners: {
                        ...current.banners,
                        items: current.banners.items.map((item) =>
                          item.id === banner.id
                            ? { ...item, eyebrow: event.target.value }
                            : item,
                        ),
                      },
                    }))
                  }
                />
                <Input
                  label="Title"
                  value={banner.title || ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      banners: {
                        ...current.banners,
                        items: current.banners.items.map((item) =>
                          item.id === banner.id
                            ? { ...item, title: event.target.value }
                            : item,
                        ),
                      },
                    }))
                  }
                />
                <Input
                  label="Link"
                  value={banner.href || ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      banners: {
                        ...current.banners,
                        items: current.banners.items.map((item) =>
                          item.id === banner.id
                            ? { ...item, href: event.target.value }
                            : item,
                        ),
                      },
                    }))
                  }
                />
                <label className="home-editor-toggle">
                  <input
                    type="checkbox"
                    checked={banner.isActive}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        banners: {
                          ...current.banners,
                          items: current.banners.items.map((item) =>
                            item.id === banner.id
                              ? { ...item, isActive: event.target.checked }
                              : item,
                          ),
                        },
                      }))
                    }
                  />{" "}
                  Visible
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-editor-section">
        <div className="home-editor-section-heading">
          <div>
            <span className="home-editor-number">04</span>
            <div>
              <h2>Shop by category</h2>
              <p>Choose which active categories appear on the homepage.</p>
            </div>
          </div>
        </div>
        <div className="home-editor-grid home-editor-section-fields">
          <Input
            label="Section eyebrow"
            value={form.categorySection.eyebrow}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                categorySection: {
                  ...current.categorySection,
                  eyebrow: event.target.value,
                },
              }))
            }
          />
          <Input
            label="Section title"
            value={form.categorySection.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                categorySection: {
                  ...current.categorySection,
                  title: event.target.value,
                },
              }))
            }
          />
        </div>
        <div className="home-category-picker">
          {categories.map((category) => (
            <label
              className={selectedCategoryIds.has(category.id) ? "selected" : ""}
              key={category.id}
            >
              <input
                type="checkbox"
                checked={selectedCategoryIds.has(category.id)}
                onChange={() => toggleCategory(category)}
              />
              <span>{category.name}</span>
            </label>
          ))}
          {!categories.length && (
            <p className="home-muted">
              Create active categories first to feature them here.
            </p>
          )}
        </div>
      </section>

      <section className="home-editor-section">
        <div className="home-editor-section-heading">
          <div>
            <span className="home-editor-number">05</span>
            <div>
              <h2>Bestsellers</h2>
              <p>
                Control the section label and choose the products to feature.
              </p>
            </div>
          </div>
        </div>
        <div className="home-editor-grid">
          <Input
            label="Eyebrow"
            value={form.bestsellers.eyebrow}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                bestsellers: {
                  ...current.bestsellers,
                  eyebrow: event.target.value,
                },
              }))
            }
          />
          <Input
            label="Title"
            value={form.bestsellers.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                bestsellers: {
                  ...current.bestsellers,
                  title: event.target.value,
                },
              }))
            }
          />
          <Input
            label="Product limit"
            type="number"
            min={1}
            max={12}
            value={form.bestsellers.limit}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                bestsellers: {
                  ...current.bestsellers,
                  limit: Number(event.target.value),
                },
              }))
            }
          />
          <Input
            label="View all label"
            value={form.bestsellers.viewAllLabel}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                bestsellers: {
                  ...current.bestsellers,
                  viewAllLabel: event.target.value,
                },
              }))
            }
          />
        </div>
        <div className="home-product-picker">
          {products
            .filter((product: any) => product.isActive !== false)
            .map((product: any) => (
              <label
                className={
                  form.bestsellers.productIds.includes(product.id)
                    ? "selected"
                    : ""
                }
                key={product.id}
              >
                <input
                  type="checkbox"
                  checked={form.bestsellers.productIds.includes(product.id)}
                  onChange={() =>
                    setForm((current) => ({
                      ...current,
                      bestsellers: {
                        ...current.bestsellers,
                        productIds: current.bestsellers.productIds.includes(
                          product.id,
                        )
                          ? current.bestsellers.productIds.filter(
                              (id) => id !== product.id,
                            )
                          : [...current.bestsellers.productIds, product.id],
                      },
                    }))
                  }
                />
                <span>{product.name}</span>
              </label>
            ))}
        </div>
      </section>

      <section className="home-editor-section">
        <div className="home-editor-section-heading">
          <div>
            <span className="home-editor-number">06</span>
            <div>
              <h2>Promise and footer</h2>
              <p>
                Keep the supporting story and store contact details current.
              </p>
            </div>
          </div>
        </div>
        <div className="home-editor-grid">
          <Input
            label="Promise eyebrow"
            value={form.promise.eyebrow}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                promise: { ...current.promise, eyebrow: event.target.value },
              }))
            }
          />
          <Input
            label="Promise title"
            value={form.promise.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                promise: { ...current.promise, title: event.target.value },
              }))
            }
          />
          <Input
            label="Promise emphasis"
            value={form.promise.emphasis}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                promise: { ...current.promise, emphasis: event.target.value },
              }))
            }
          />
          <Input
            label="Support email"
            type="email"
            value={form.footer.supportEmail}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                footer: { ...current.footer, supportEmail: event.target.value },
              }))
            }
          />
          <TextArea
            className="wide-field"
            label="Footer description"
            value={form.footer.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                footer: { ...current.footer, description: event.target.value },
              }))
            }
          />
          <TextArea
            className="wide-field"
            label="Top announcement"
            value={form.footer.announcement}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                footer: { ...current.footer, announcement: event.target.value },
              }))
            }
          />
        </div>
        <div className="home-promise-editor">
          {form.promise.items.map((item, index) => (
            <div className="home-promise-row" key={`${item.number}-${index}`}>
              <Input
                label={`Item ${index + 1}`}
                value={item.text}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    promise: {
                      ...current.promise,
                      items: current.promise.items.map((entry, itemIndex) =>
                        itemIndex === index
                          ? { ...entry, text: event.target.value }
                          : entry,
                      ),
                    },
                  }))
                }
              />
              <button
                type="button"
                className="icon-action danger"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    promise: {
                      ...current.promise,
                      items: current.promise.items.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    },
                  }))
                }
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              setForm((current) => ({
                ...current,
                promise: {
                  ...current.promise,
                  items: [
                    ...current.promise.items,
                    {
                      number: String(current.promise.items.length + 1).padStart(
                        2,
                        "0",
                      ),
                      text: "A promise worth making.",
                    },
                  ],
                },
              }))
            }
          >
            <Plus size={16} /> Add promise
          </button>
        </div>
      </section>
    </form>
  );
}
