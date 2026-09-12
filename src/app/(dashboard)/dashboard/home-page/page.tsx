"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Layers,
  Layout,
  Tag,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { Input, TextArea } from "@/components/ui/FormControls";
import { useAppSelector } from "@/store/hooks";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import { useUploadMediaMutation } from "@/store/mediaApi";
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

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type TabType =
  | "hero"
  | "visibility"
  | "banners"
  | "categories"
  | "products"
  | "footer";

export default function HomePageEditor() {
  const { data, isLoading, isError, refetch } = useGetHomePageQuery();
  const [saveHomePage, { isLoading: saving }] = useUpdateHomePageMutation();
  const [uploadMedia, { isLoading: uploading }] = useUploadMediaMutation();
  const { data: categoryResponse } = useGetCategoriesQuery();
  const { data: productsResponse } = useGetPublicProductsQuery({ limit: 100 });

  const [activeTab, setActiveTab] = useState<TabType>("hero");

  const projectId = useAppSelector(
    (state) => state.auth.user?.projectId ?? state.auth.user?.project?.id,
  );

  const categories = categoryResponse?.data ?? [];
  const products = Array.isArray(productsResponse)
    ? productsResponse
    : ((productsResponse as any)?.products ??
      (productsResponse as any)?.items ??
      []);

  const [form, setForm] = useState<HomePageContent | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (data) {
      setForm({ ...demoHomePage, ...data });
    } else if (!isLoading && !isError) {
      setForm(demoHomePage);
    }
  }, [data, isLoading, isError]);

  const selectedCategoryIds = useMemo(
    () => new Set(form?.categories?.map((category) => category.id) ?? []),
    [form?.categories],
  );

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotice({ type, text });
    window.setTimeout(() => setNotice(null), 4000);
  };

  const updateHero = (changes: Partial<HomePageContent["hero"]>) =>
    setForm((current) =>
      current ? { ...current, hero: { ...current.hero, ...changes } } : current,
    );

  const updateSlide = (index: number, changes: Partial<HomePageSlide>) =>
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        hero: {
          ...current.hero,
          slides: (current.hero.slides ?? []).map((slide, slideIndex) =>
            slideIndex === index ? { ...slide, ...changes } : slide,
          ),
        },
      };
    });

  const moveSlide = (index: number, direction: -1 | 1) =>
    setForm((current) => {
      if (!current || !current.hero.slides) return current;
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
    setForm((current) => {
      if (!current) return current;
      const currentCategories = current.categories ?? [];
      const isSelected = selectedCategoryIds.has(category.id);

      return {
        ...current,
        categories: isSelected
          ? currentCategories.filter((item) => item.id !== category.id)
          : [
              ...currentCategories,
              {
                id: category.id,
                label: category.name,
                href: `/products?category=${category.slug}`,
                description: category.description,
                imageUrl: category.image?.secureUrl || category.image?.url,
              },
            ],
      };
    });

  const uploadSlideImage = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      showToast("Please use an image under 5 MB.", "error");
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
      showToast("Banner image uploaded successfully.");
    } catch (error: any) {
      showToast(error?.data?.message ?? "Banner upload failed", "error");
    } finally {
      event.target.value = "";
    }
  };

  const save = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    if (!form) return;
    try {
      await saveHomePage(form).unwrap();
      showToast("Homepage configuration published!");
    } catch (error: any) {
      showToast(error?.data?.message ?? "Failed to save homepage", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="home-editor-state-card">
        <RefreshCw className="animate-spin" size={32} />
        <p>Fetching storefront layout...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="home-editor-state-card error">
        <AlertCircle size={32} />
        <h3>Failed to load homepage data</h3>
        <p>
          An unexpected network or server error occurred while retrieving
          settings.
        </p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => refetch()}
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="home-editor-state-card empty">
        <Sparkles size={32} />
        <h3>No storefront content found</h3>
        <p>
          Start fresh by loading demo settings to initialize your storefront.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setForm(demoHomePage)}
        >
          Initialize storefront studio
        </button>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "hero", label: "Hero Slider", icon: Layers },
    { id: "visibility", label: "Section Visibility", icon: Layout },
    { id: "banners", label: "Promotions", icon: ImagePlus },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "products", label: "Bestsellers", icon: Star },
    { id: "footer", label: "Promise & Footer", icon: ShieldCheck },
  ];

  return (
    <form className="home-editor" onSubmit={save}>
      {/* STICKY TOP NAVIGATION BAR */}
      <div className="home-editor-sticky-header">
        <header className="home-editor-header page-header">
          <div>
            <span className="home-editor-kicker">
              <Sparkles size={14} /> Storefront Studio
            </span>
            <h1 className="page-title">Homepage Layout</h1>
          </div>
          <div className="home-editor-actions">
            {notice && (
              <div className={`home-editor-toast ${notice.type}`}>
                {notice.type === "success" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>{notice.text}</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              {saving ? "Publishing..." : "Publish homepage"}
            </button>
          </div>
        </header>

        {/* TOP TAB SYSTEM */}
        <nav className="home-editor-tabs-nav">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="tab-content">
        {/* TAB 1: HERO SLIDER */}
        {activeTab === "hero" && (
          <div className="tab-panel">
            <section className="home-editor-section home-editor-hero-section">
              <div className="home-editor-section-heading">
                <div className="heading-title-wrapper">
                  <span className="home-editor-number">01</span>
                  <div>
                    <h2>Hero Slider</h2>
                    <p>
                      Promote high-converting hero messages and visual media.
                    </p>
                  </div>
                </div>
                <label className="home-editor-toggle">
                  <input
                    type="checkbox"
                    checked={form.hero?.autoplay ?? false}
                    onChange={(event) =>
                      updateHero({ autoplay: event.target.checked })
                    }
                  />
                  Auto-rotate slides
                </label>
              </div>

              <div className="home-editor-slider-settings">
                <Input
                  label="Rotation interval (ms)"
                  type="number"
                  min={3000}
                  max={15000}
                  value={form.hero?.intervalMs ?? 5500}
                  onChange={(event) =>
                    updateHero({ intervalMs: Number(event.target.value) })
                  }
                />
                <small className="field-hint">Recommended timing: 5500ms</small>
              </div>

              <div className="home-slide-list">
                {form.hero?.slides?.map((slide, index) => (
                  <article className="home-slide-editor" key={slide.id}>
                    <div
                      className="home-slide-preview"
                      style={
                        slide.imageUrl
                          ? { backgroundImage: `url(${slide.imageUrl})` }
                          : undefined
                      }
                    >
                      <span className="slide-badge">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {!slide.imageUrl && (
                        <div className="home-image-size-hint">
                          <ImagePlus size={24} />
                          <strong>Banner image</strong>
                          <small>1440 × 640 px</small>
                        </div>
                      )}
                    </div>

                    <div className="home-slide-fields">
                      <div className="home-slide-title-row">
                        <strong>Slide {index + 1}</strong>
                        <div className="action-button-group">
                          <button
                            type="button"
                            className="icon-action"
                            disabled={index === 0}
                            onClick={() => moveSlide(index, -1)}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-action"
                            disabled={
                              index === (form.hero?.slides?.length ?? 0) - 1
                            }
                            onClick={() => moveSlide(index, 1)}
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            type="button"
                            className="icon-action danger"
                            disabled={(form.hero?.slides?.length ?? 0) <= 1}
                            onClick={() =>
                              updateHero({
                                slides: form.hero.slides
                                  .filter(
                                    (_, slideIndex) => slideIndex !== index,
                                  )
                                  .map((item, sortOrder) => ({
                                    ...item,
                                    sortOrder,
                                  })),
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
                          value={slide.eyebrow || ""}
                          onChange={(e) =>
                            updateSlide(index, { eyebrow: e.target.value })
                          }
                        />
                        <Input
                          label="Button label"
                          value={slide.buttonLabel || ""}
                          onChange={(e) =>
                            updateSlide(index, { buttonLabel: e.target.value })
                          }
                        />
                        <Input
                          label="Headline"
                          value={slide.title || ""}
                          onChange={(e) =>
                            updateSlide(index, { title: e.target.value })
                          }
                        />
                        <Input
                          label="Italic emphasis"
                          value={slide.emphasis || ""}
                          onChange={(e) =>
                            updateSlide(index, { emphasis: e.target.value })
                          }
                        />
                        <TextArea
                          className="wide-field"
                          label="Description"
                          value={slide.description || ""}
                          onChange={(e) =>
                            updateSlide(index, { description: e.target.value })
                          }
                        />
                        <Input
                          label="Button link"
                          value={slide.buttonHref || ""}
                          onChange={(e) =>
                            updateSlide(index, { buttonHref: e.target.value })
                          }
                        />
                        <Input
                          label="Image URL"
                          value={slide.imageUrl || ""}
                          onChange={(e) =>
                            updateSlide(index, { imageUrl: e.target.value })
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
                          onChange={(e) =>
                            updateSlide(index, { isActive: e.target.checked })
                          }
                        />
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
                    slides: [
                      ...(form.hero?.slides ?? []),
                      makeSlide(form.hero?.slides?.length ?? 0),
                    ],
                  })
                }
              >
                <Plus size={16} /> Add slide
              </button>
            </section>
          </div>
        )}

        {/* TAB 2: VISIBILITY */}
        {activeTab === "visibility" && (
          <div className="tab-panel">
            <section className="home-editor-section">
              <div className="home-editor-section-heading">
                <div className="heading-title-wrapper">
                  <span className="home-editor-number">02</span>
                  <div>
                    <h2>Section Visibility</h2>
                    <p>
                      Toggle display controls for active sections on the live
                      store.
                    </p>
                  </div>
                </div>
              </div>

              <div className="home-visibility-grid">
                {form.visibility &&
                  (
                    Object.keys(form.visibility) as Array<
                      keyof HomePageContent["visibility"]
                    >
                  ).map((section) => (
                    <label className="visibility-card" key={section}>
                      <input
                        type="checkbox"
                        checked={form.visibility[section]}
                        onChange={(event) =>
                          setForm((current) =>
                            current
                              ? {
                                  ...current,
                                  visibility: {
                                    ...current.visibility,
                                    [section]: event.target.checked,
                                  },
                                }
                              : current,
                          )
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
          </div>
        )}

        {/* TAB 3: PROMOTIONS */}
        {activeTab === "banners" && (
          <div className="tab-panel">
            <section className="home-editor-section">
              <div className="home-editor-section-heading">
                <div className="heading-title-wrapper">
                  <span className="home-editor-number">03</span>
                  <div>
                    <h2>Promotional Banners</h2>
                    <p>
                      Secondary banners for spotlighting campaigns or features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="home-editor-grid">
                <Input
                  label="Section eyebrow"
                  value={form.banners?.eyebrow || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            banners: {
                              ...current.banners,
                              eyebrow: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <Input
                  label="Section title"
                  value={form.banners?.title || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            banners: {
                              ...current.banners,
                              title: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
              </div>

              <div className="home-banner-editor-list">
                {form.banners?.items?.slice(0, 2)?.map((banner, index) => (
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
                        label={`Banner ${index + 1} Image URL`}
                        value={banner.imageUrl || ""}
                        onChange={(e) =>
                          setForm((current) =>
                            current
                              ? {
                                  ...current,
                                  banners: {
                                    ...current.banners,
                                    items: current.banners.items?.map((item) =>
                                      item.id === banner.id
                                        ? { ...item, imageUrl: e.target.value }
                                        : item,
                                    ),
                                  },
                                }
                              : current,
                          )
                        }
                      />
                      <Input
                        label="Eyebrow"
                        value={banner.eyebrow || ""}
                        onChange={(e) =>
                          setForm((current) =>
                            current
                              ? {
                                  ...current,
                                  banners: {
                                    ...current.banners,
                                    items: current.banners.items?.map((item) =>
                                      item.id === banner.id
                                        ? { ...item, eyebrow: e.target.value }
                                        : item,
                                    ),
                                  },
                                }
                              : current,
                          )
                        }
                      />
                      <Input
                        label="Title"
                        value={banner.title || ""}
                        onChange={(e) =>
                          setForm((current) =>
                            current
                              ? {
                                  ...current,
                                  banners: {
                                    ...current.banners,
                                    items: current.banners.items?.map((item) =>
                                      item.id === banner.id
                                        ? { ...item, title: e.target.value }
                                        : item,
                                    ),
                                  },
                                }
                              : current,
                          )
                        }
                      />
                      <Input
                        label="Link"
                        value={banner.href || ""}
                        onChange={(e) =>
                          setForm((current) =>
                            current
                              ? {
                                  ...current,
                                  banners: {
                                    ...current.banners,
                                    items: current.banners.items?.map((item) =>
                                      item.id === banner.id
                                        ? { ...item, href: e.target.value }
                                        : item,
                                    ),
                                  },
                                }
                              : current,
                          )
                        }
                      />
                      <label className="home-editor-toggle">
                        <input
                          type="checkbox"
                          checked={banner.isActive}
                          onChange={(e) =>
                            setForm((current) =>
                              current
                                ? {
                                    ...current,
                                    banners: {
                                      ...current.banners,
                                      items: current.banners.items?.map(
                                        (item) =>
                                          item.id === banner.id
                                            ? {
                                                ...item,
                                                isActive: e.target.checked,
                                              }
                                            : item,
                                      ),
                                    },
                                  }
                                : current,
                            )
                          }
                        />
                        Visible
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="tab-panel">
            <section className="home-editor-section">
              <div className="home-editor-section-heading">
                <div className="heading-title-wrapper">
                  <span className="home-editor-number">04</span>
                  <div>
                    <h2>Shop By Category</h2>
                    <p>
                      Select store categories to spotlight directly on the
                      homepage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="home-editor-grid home-editor-section-fields">
                <Input
                  label="Section eyebrow"
                  value={form.categorySection?.eyebrow || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            categorySection: {
                              ...current.categorySection,
                              eyebrow: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <Input
                  label="Section title"
                  value={form.categorySection?.title || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            categorySection: {
                              ...current.categorySection,
                              title: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
              </div>

              <div className="home-category-picker">
                {categories.map((category) => (
                  <label
                    className={`picker-chip ${selectedCategoryIds.has(category.id) ? "selected" : ""}`}
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
                {categories.length === 0 && (
                  <p className="home-muted">No active categories found.</p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 5: BESTSELLERS */}
        {activeTab === "products" && (
          <div className="tab-panel">
            <section className="home-editor-section">
              <div className="home-editor-section-heading">
                <div className="heading-title-wrapper">
                  <span className="home-editor-number">05</span>
                  <div>
                    <h2>Bestseller Showcase</h2>
                    <p>
                      Curate custom top-performing items for homepage
                      engagement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="home-editor-grid">
                <Input
                  label="Eyebrow"
                  value={form.bestsellers?.eyebrow || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            bestsellers: {
                              ...current.bestsellers,
                              eyebrow: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <Input
                  label="Title"
                  value={form.bestsellers?.title || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            bestsellers: {
                              ...current.bestsellers,
                              title: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <Input
                  label="Product limit"
                  type="number"
                  min={1}
                  max={12}
                  value={form.bestsellers?.limit ?? 4}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            bestsellers: {
                              ...current.bestsellers,
                              limit: Number(e.target.value),
                            },
                          }
                        : current,
                    )
                  }
                />
                <Input
                  label="View all label"
                  value={form.bestsellers?.viewAllLabel || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            bestsellers: {
                              ...current.bestsellers,
                              viewAllLabel: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
              </div>

              <div className="home-product-picker">
                {products
                  .filter((product: any) => product.isActive !== false)
                  .map((product: any) => {
                    const isSelected = form.bestsellers?.productIds?.includes(
                      product.id,
                    );
                    return (
                      <label
                        className={`picker-chip ${isSelected ? "selected" : ""}`}
                        key={product.id}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected ?? false}
                          onChange={() =>
                            setForm((current) => {
                              if (!current) return current;
                              const currentIds =
                                current.bestsellers?.productIds ?? [];
                              return {
                                ...current,
                                bestsellers: {
                                  ...current.bestsellers,
                                  productIds: currentIds.includes(product.id)
                                    ? currentIds.filter(
                                        (id) => id !== product.id,
                                      )
                                    : [...currentIds, product.id],
                                },
                              };
                            })
                          }
                        />
                        <span>{product.name}</span>
                      </label>
                    );
                  })}
                {products.length === 0 && (
                  <p className="home-muted">
                    No published products available to feature.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 6: PROMISE & FOOTER */}
        {activeTab === "footer" && (
          <div className="tab-panel">
            <section className="home-editor-section">
              <div className="home-editor-section-heading">
                <div className="heading-title-wrapper">
                  <span className="home-editor-number">06</span>
                  <div>
                    <h2>Promise & Footer Settings</h2>
                    <p>Configure trust signals and global support text.</p>
                  </div>
                </div>
              </div>

              <div className="home-editor-grid">
                <Input
                  label="Promise eyebrow"
                  value={form.promise?.eyebrow || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            promise: {
                              ...current.promise,
                              eyebrow: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <Input
                  label="Promise title"
                  value={form.promise?.title || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            promise: {
                              ...current.promise,
                              title: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <Input
                  label="Promise emphasis"
                  value={form.promise?.emphasis || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            promise: {
                              ...current.promise,
                              emphasis: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <Input
                  label="Support email"
                  type="email"
                  value={form.footer?.supportEmail || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            footer: {
                              ...current.footer,
                              supportEmail: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <TextArea
                  className="wide-field"
                  label="Footer description"
                  value={form.footer?.description || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            footer: {
                              ...current.footer,
                              description: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
                <TextArea
                  className="wide-field"
                  label="Top announcement"
                  value={form.footer?.announcement || ""}
                  onChange={(e) =>
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            footer: {
                              ...current.footer,
                              announcement: e.target.value,
                            },
                          }
                        : current,
                    )
                  }
                />
              </div>

              <div className="home-promise-editor">
                {form.promise?.items?.map((item, index) => (
                  <div
                    className="home-promise-row"
                    key={`${item.number}-${index}`}
                  >
                    <Input
                      label={`Promise item ${index + 1}`}
                      value={item.text}
                      onChange={(e) =>
                        setForm((current) =>
                          current
                            ? {
                                ...current,
                                promise: {
                                  ...current.promise,
                                  items: current.promise.items?.map(
                                    (entry, itemIndex) =>
                                      itemIndex === index
                                        ? { ...entry, text: e.target.value }
                                        : entry,
                                  ),
                                },
                              }
                            : current,
                        )
                      }
                    />
                    <button
                      type="button"
                      className="icon-action danger"
                      onClick={() =>
                        setForm((current) =>
                          current
                            ? {
                                ...current,
                                promise: {
                                  ...current.promise,
                                  items: current.promise.items.filter(
                                    (_, itemIndex) => itemIndex !== index,
                                  ),
                                },
                              }
                            : current,
                        )
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
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            promise: {
                              ...current.promise,
                              items: [
                                ...(current.promise.items ?? []),
                                {
                                  number: String(
                                    (current.promise.items?.length ?? 0) + 1,
                                  ).padStart(2, "0"),
                                  text: "A promise worth making.",
                                },
                              ],
                            },
                          }
                        : current,
                    )
                  }
                >
                  <Plus size={16} /> Add promise
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* FLOATING BOTTOM SAVE BAR */}
      <div className="home-editor-save-bar">
        <div className="save-bar-info">
          <Sliders size={18} />
          <span>
            Editing section:{" "}
            <strong>{tabs.find((t) => t.id === activeTab)?.label}</strong>
          </span>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => save()}
          disabled={saving}
        >
          <Save size={16} />
          {saving ? "Publishing..." : "Save & Publish"}
        </button>
      </div>
    </form>
  );
}
