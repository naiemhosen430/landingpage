"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ImagePlus,
  Layout,
  Loader2,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { Input, TextArea } from "@/components/ui/FormControls";
import { useAppSelector } from "@/store/hooks";
import "@/styles/home-page-admin.css";
import { useUploadMediaMutation } from "@/store/mediaApi";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import { useGetPublicProductsQuery } from "@/store/publicApi";
import {
  useGetHomePageQuery,
  useUpdateHomePageMutation,
} from "@/store/homePageApi";
import type {
  HomePageBanner,
  HomePageEditorContent,
  HomePageSlide,
} from "@/store/homePageApi";

type TabType =
  | "hero"
  | "visibility"
  | "promotions"
  | "categories"
  | "products"
  | "footer";

const DEFAULT_HERO = {
  eyebrow: "New Collection",
  title: "Discover products you'll love",
  emphasis: "Shop smarter. Live better.",
  description:
    "Explore our latest products, special offers and popular collections.",
  buttonLabel: "Shop Now",
  buttonHref: "/products",
};

const DEFAULT_PROMOTION = {
  eyebrow: "Special Offer",
  title: "Great products. Better prices.",
  buttonLabel: "Explore Now",
  buttonHref: "/products",
};

const DEFAULT_FOOTER = {
  promiseEyebrow: "Why Shop With Us",
  promiseTitle: "Everything you need in one place",
  promiseEmphasis: "Simple, trusted and convenient.",
  supportEmail: "",
  footerDescription:
    "We make online shopping simple with quality products and helpful service.",
  topAnnouncement: "Free delivery on selected orders",
};

function makeSlide(sortOrder: number): HomePageSlide {
  return {
    id: `slide-${Date.now()}-${sortOrder}`,
    eyebrow: DEFAULT_HERO.eyebrow,
    title: DEFAULT_HERO.title,
    emphasis: DEFAULT_HERO.emphasis,
    description: DEFAULT_HERO.description,
    buttonLabel: DEFAULT_HERO.buttonLabel,
    buttonHref: DEFAULT_HERO.buttonHref,
    imageUrl: "",
    imageAlt: "Homepage banner",
    accentColor: "#6366f1",
    isActive: true,
    sortOrder,
  };
}

function makeBanner(sortOrder: number): HomePageBanner {
  return {
    id: `banner-${Date.now()}-${sortOrder}`,
    imageUrl: "",
    imageAlt: "Promotional banner",
    eyebrow: "",
    title: "",
    href: "/products",
    isActive: true,
    sortOrder,
  };
}

function createEmptyHomePage(): HomePageEditorContent {
  return {
    visibility: {
      hero: true,
      banners: true,
      categories: true,
      bestsellers: true,
      categoryProducts: true,
      promise: true,
      footer: true,
    },

    hero: {
      autoplay: true,
      intervalMs: 5500,
      slides: [makeSlide(0)],
    },

    banners: {
      eyebrow: DEFAULT_PROMOTION.eyebrow,
      title: DEFAULT_PROMOTION.title,
      items: [],
    },

    categories: {
      eyebrow: "Shop by Category",
      title: "Explore our categories",
      categoryIds: [],
    },

    categorySection: {
      eyebrow: "Featured Categories",
      title: "Find what you need",
      categoryIds: [],
    },

    bestsellers: {
      eyebrow: "Bestsellers",
      title: "Popular products",
      limit: 8,
      viewAllLabel: "View All Products",
      productIds: [],
    },

    categoryProducts: {
      enabled: true,
      items: [],
    },

    promise: {
      eyebrow: DEFAULT_FOOTER.promiseEyebrow,
      title: DEFAULT_FOOTER.promiseTitle,
      emphasis: DEFAULT_FOOTER.promiseEmphasis,
      items: [],
    },

    footer: {
      supportEmail: "",
      description: DEFAULT_FOOTER.footerDescription,
      topAnnouncement: DEFAULT_FOOTER.topAnnouncement,
    },
  };
}

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function HomePageEditor() {
  const projectId = useAppSelector((state) => state.auth?.user?.projectId);

  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [form, setForm] = useState<HomePageEditorContent>(
    createEmptyHomePage(),
  );

  const [notice, setNotice] = useState("");
  const [uploadingSlide, setUploadingSlide] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState<string | null>(null);

  const {
    data: homepageResponse,
    isLoading: homepageLoading,
    isError: homepageError,
    refetch: refetchHomepage,
  } = useGetHomePageQuery();

  const { data: categoriesResponse } = useGetCategoriesQuery();

  const { data: productsResponse } = useGetPublicProductsQuery();

  const [updateHomePage, { isLoading: saving }] = useUpdateHomePageMutation();

  const [uploadMedia] = useUploadMediaMutation();

  const categories = categoriesResponse?.data ?? [];

  const products = productsResponse?.data || productsResponse?.products || [];

  const homepage = homepageResponse;

  useEffect(() => {
    if (!homepage) return;

    setForm({
      ...createEmptyHomePage(),
      ...homepage,

      visibility: {
        ...createEmptyHomePage().visibility,
        ...(homepage.visibility || {}),
      },

      hero: {
        ...createEmptyHomePage().hero,
        ...(homepage.hero || {}),
        slides: homepage.hero?.slides || [makeSlide(0)],
      },

      banners: {
        ...createEmptyHomePage().banners,
        ...(homepage.banners || {}),
      },

      categories: {
        ...createEmptyHomePage().categories,
        ...(homepage.categories || {}),
      },

      categorySection: {
        ...createEmptyHomePage().categorySection,
        ...(homepage.categorySection || {}),
      },

      bestsellers: {
        ...createEmptyHomePage().bestsellers,
        ...(homepage.bestsellers || {}),
      },

      categoryProducts: {
        ...createEmptyHomePage().categoryProducts,
        ...(homepage.categoryProducts || {}),
      },

      promise: {
        ...createEmptyHomePage().promise,
        ...(homepage.promise || {}),
      },

      footer: {
        ...createEmptyHomePage().footer,
        ...(homepage.footer || {}),
      },
    });
  }, [homepage]);

  const selectedCategoryIds = useMemo(() => {
    return (
      form.categories?.categoryIds || form.categorySection?.categoryIds || []
    );
  }, [form.categories?.categoryIds, form.categorySection?.categoryIds]);

  const showNotice = (message: string) => {
    setNotice(message);

    window.setTimeout(() => {
      setNotice("");
    }, 3000);
  };

  const updateHero = (field: string, value: unknown) => {
    setForm((current) => ({
      ...current,
      hero: {
        ...current.hero,
        [field]: value,
      },
    }));
  };

  const updateSlide = (
    index: number,
    field: keyof HomePageSlide,
    value: unknown,
  ) => {
    setForm((current) => ({
      ...current,
      hero: {
        ...current.hero,
        slides: current.hero.slides.map((slide, slideIndex) =>
          slideIndex === index
            ? {
                ...slide,
                [field]: value,
              }
            : slide,
        ),
      },
    }));
  };

  const addSlide = () => {
    setForm((current) => ({
      ...current,
      hero: {
        ...current.hero,
        slides: [...current.hero.slides, makeSlide(current.hero.slides.length)],
      },
    }));
  };

  const updateBanner = (
    index: number,
    field: keyof HomePageBanner,
    value: unknown,
  ) => {
    setForm((current) => ({
      ...current,
      banners: {
        ...current.banners,
        items: current.banners.items.map((banner, bannerIndex) =>
          bannerIndex === index ? { ...banner, [field]: value } : banner,
        ),
      },
    }));
  };

  const addBanner = () => {
    setForm((current) => ({
      ...current,
      banners: {
        ...current.banners,
        items: [
          ...current.banners.items,
          makeBanner(current.banners.items.length),
        ],
      },
    }));
  };

  const deleteBanner = (index: number) => {
    setForm((current) => ({
      ...current,
      banners: {
        ...current.banners,
        items: current.banners.items
          .filter((_, bannerIndex) => bannerIndex !== index)
          .map((banner, bannerIndex) => ({
            ...banner,
            sortOrder: bannerIndex,
          })),
      },
    }));
  };

  const deleteSlide = (index: number) => {
    setForm((current) => ({
      ...current,
      hero: {
        ...current.hero,
        slides: current.hero.slides
          .filter((_, slideIndex) => slideIndex !== index)
          .map((slide, slideIndex) => ({
            ...slide,
            sortOrder: slideIndex,
          })),
      },
    }));
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    setForm((current) => {
      const slides = [...current.hero.slides];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= slides.length) {
        return current;
      }

      [slides[index], slides[targetIndex]] = [
        slides[targetIndex],
        slides[index],
      ];

      return {
        ...current,
        hero: {
          ...current.hero,
          slides: slides.map((slide, slideIndex) => ({
            ...slide,
            sortOrder: slideIndex,
          })),
        },
      };
    });
  };

  const toggleCategory = (categoryId: string) => {
    setForm((current) => {
      const currentIds = current.categories?.categoryIds || [];

      const exists = currentIds.includes(categoryId);

      const nextIds = exists
        ? currentIds.filter((id) => id !== categoryId)
        : [...currentIds, categoryId];

      return {
        ...current,
        categories: {
          ...current.categories,
          categoryIds: nextIds,
        },
        categorySection: {
          ...current.categorySection,
          categoryIds: nextIds,
        },
      };
    });
  };

  const toggleProduct = (productId: string) => {
    setForm((current) => {
      const currentIds = current.bestsellers?.productIds || [];

      const exists = currentIds.includes(productId);

      return {
        ...current,
        bestsellers: {
          ...current.bestsellers,
          productIds: exists
            ? currentIds.filter((id) => id !== productId)
            : [...currentIds, productId],
        },
      };
    });
  };

  const uploadSlideImage = async (index: number, file: File) => {
    if (!file) return;

    try {
      setUploadingSlide(String(index));

      const dataUri = await fileToDataUri(file);

      const response = await uploadMedia({
        images: [dataUri],
        folder: "homepage",
      }).unwrap();

      const asset = Array.isArray(response) ? response[0] : response;
      const imageUrl = asset?.url || dataUri;

      updateSlide(index, "imageUrl", imageUrl);

      showNotice("Banner image updated");
    } catch (error) {
      console.error(error);
      showNotice("Could not upload image");
    } finally {
      setUploadingSlide(null);
    }
  };

  const uploadBannerImage = async (index: number, file: File) => {
    if (!file) return;

    try {
      setUploadingBanner(String(index));

      const dataUri = await fileToDataUri(file);
      const response = await uploadMedia({
        images: [dataUri],
        folder: "homepage",
      }).unwrap();
      const asset = Array.isArray(response) ? response[0] : response;

      updateBanner(index, "imageUrl", asset?.url || dataUri);
      showNotice("Promotion image updated");
    } catch (error) {
      console.error(error);
      showNotice("Could not upload promotion image");
    } finally {
      setUploadingBanner(null);
    }
  };

  const save = async () => {
    try {
      const categoryRefs = form.categories.categoryIds.map((id) => {
        const category = categories.find(
          (item: any) => String(item._id || item.id || item.categoryId) === id,
        );
        const imageUrl = category?.image?.secureUrl || category?.image?.url;

        return {
          id,
          label: category?.name || id,
          ...(category?.description
            ? { description: category.description }
            : {}),
          ...(category?.slug
            ? {
                href: `/products?category=${encodeURIComponent(category.slug)}`,
              }
            : {}),
          ...(imageUrl ? { imageUrl } : {}),
        };
      });

      await updateHomePage({
        data: {
          ...form,
          categories: categoryRefs,
          categoryProducts: form.categoryProducts.items,
        },
      }).unwrap();

      showNotice("Homepage saved successfully");
    } catch (error) {
      console.error(error);
      showNotice("Could not save homepage");
    }
  };

  const updateVisibility = (
    key: keyof HomePageEditorContent["visibility"],
    value: boolean,
  ) => {
    setForm((current) => ({
      ...current,
      visibility: {
        ...current.visibility,
        [key]: value,
      },
    }));
  };

  const updatePromotion = (field: string, value: unknown) => {
    setForm((current) => ({
      ...current,
      banners: {
        ...current.banners,
        [field]: value,
      },
    }));
  };

  const updateFooter = (field: string, value: unknown) => {
    setForm((current) => ({
      ...current,
      footer: {
        ...current.footer,
        [field]: value,
      },
    }));
  };

  const updatePromise = (field: string, value: unknown) => {
    setForm((current) => ({
      ...current,
      promise: {
        ...current.promise,
        [field]: value,
      },
    }));
  };

  if (homepageLoading) {
    return (
      <div className="home-editor-loading">
        <Loader2 className="spin" size={28} />
        <span>Loading homepage...</span>
      </div>
    );
  }

  if (homepageError) {
    return (
      <div className="home-editor-empty">
        <X size={22} />
        <h3>Could not load homepage</h3>
        <p>Please try again.</p>

        <button
          type="button"
          className="home-primary-btn"
          onClick={() => refetchHomepage()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const tabs: {
    id: TabType;
    label: string;
    icon: typeof Layout;
  }[] = [
    {
      id: "hero",
      label: "Hero",
      icon: Sparkles,
    },
    {
      id: "visibility",
      label: "Sections",
      icon: Layout,
    },
    {
      id: "promotions",
      label: "Promotions",
      icon: ImagePlus,
    },

    {
      id: "footer",
      label: "Footer",
      icon: Layout,
    },
  ];

  return (
    <div className="home-editor">
      <div className="home-editor-top">
        <div>
          <h1>Homepage</h1>
        </div>

        <div className="home-editor-actions">
          {notice && (
            <div className="home-editor-notice">
              <Check size={15} />
              {notice}
            </div>
          )}

          <button
            type="button"
            className="home-primary-btn"
            onClick={save}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="spin" size={16} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="home-editor-tabs">
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
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "hero" && (
        <section className="home-editor-section">
          <div className="home-section-header">
            <div>
              <span className="home-section-icon">
                <Sparkles size={17} />
              </span>

              <div>
                <h2>Hero Section</h2>
                <p>The first thing customers see on your store.</p>
              </div>
            </div>

            <label className="simple-switch">
              <input
                type="checkbox"
                checked={Boolean(form.visibility?.hero)}
                onChange={(event) =>
                  updateVisibility("hero", event.target.checked)
                }
              />
              <span />
              <b>{form.visibility?.hero ? "Visible" : "Hidden"}</b>
            </label>
          </div>

          <div className="hero-settings">
            <label className="simple-switch">
              <input
                type="checkbox"
                checked={Boolean(form.hero?.autoplay)}
                onChange={(event) =>
                  updateHero("autoplay", event.target.checked)
                }
              />
              <span />
              <b>Auto change banners</b>
            </label>
          </div>

          <div className="home-slide-list">
            {form.hero?.slides?.map((slide, index) => (
              <div className="home-slide-card" key={slide.id || index}>
                <div className="home-slide-preview">
                  {slide.imageUrl ? (
                    <div
                      className="home-slide-image"
                      style={{
                        backgroundImage: `url("${slide.imageUrl}")`,
                      }}
                    />
                  ) : (
                    <div className="home-slide-placeholder">
                      <ImagePlus size={26} />
                      <span>Add banner image</span>
                      <small>Recommended: 1600 × 700</small>
                    </div>
                  )}

                  <div className="slide-number">{index + 1}</div>

                  <label className="home-image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          uploadSlideImage(index, file);
                        }

                        event.currentTarget.value = "";
                      }}
                    />

                    {uploadingSlide === String(index) ? (
                      <>
                        <Loader2 size={15} className="spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImagePlus size={15} />
                        {slide.imageUrl ? "Change Image" : "Upload Image"}
                      </>
                    )}
                  </label>
                </div>

                <div className="home-slide-content">
                  <div className="home-slide-heading">
                    <div>
                      <span>Banner {index + 1}</span>

                      <strong>{slide.title || DEFAULT_HERO.title}</strong>
                    </div>

                    <div className="slide-actions">
                      <button
                        type="button"
                        className="icon-action"
                        disabled={index === 0}
                        onClick={() => moveSlide(index, "up")}
                        title="Move up"
                      >
                        <ArrowUp size={15} />
                      </button>

                      <button
                        type="button"
                        className="icon-action"
                        disabled={index === form.hero.slides.length - 1}
                        onClick={() => moveSlide(index, "down")}
                        title="Move down"
                      >
                        <ArrowDown size={15} />
                      </button>

                      <button
                        type="button"
                        className="icon-action danger"
                        onClick={() => deleteSlide(index)}
                        disabled={form.hero.slides.length <= 1}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="simple-form-grid">
                    <Input
                      label="Small label"
                      value={slide.eyebrow || DEFAULT_HERO.eyebrow}
                      onChange={(event) =>
                        updateSlide(index, "eyebrow", event.target.value)
                      }
                    />

                    <Input
                      label="Button text"
                      value={slide.buttonLabel || DEFAULT_HERO.buttonLabel}
                      onChange={(event) =>
                        updateSlide(index, "buttonLabel", event.target.value)
                      }
                    />

                    <div className="wide-field">
                      <Input
                        label="Main title"
                        value={slide.title || DEFAULT_HERO.title}
                        onChange={(event) =>
                          updateSlide(index, "title", event.target.value)
                        }
                      />
                    </div>

                    <div className="wide-field">
                      <TextArea
                        label="Description"
                        value={slide.description || DEFAULT_HERO.description}
                        onChange={(event) =>
                          updateSlide(index, "description", event.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="slide-footer">
                    <label className="simple-check">
                      <input
                        type="checkbox"
                        checked={Boolean(slide.isActive)}
                        onChange={(event) =>
                          updateSlide(index, "isActive", event.target.checked)
                        }
                      />
                      <span>Show this banner</span>
                    </label>

                    <span className="default-note">
                      Button link defaults to <b>/products</b>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="home-add-btn" onClick={addSlide}>
            <Plus size={16} />
            Add Another Banner
          </button>
        </section>
      )}

      {activeTab === "visibility" && (
        <section className="home-editor-section">
          <div className="home-section-header">
            <div>
              <span className="home-section-icon">
                <Layout size={17} />
              </span>

              <div>
                <h2>Homepage Sections</h2>
                <p>Choose which parts of your homepage customers can see.</p>
              </div>
            </div>
          </div>

          <div className="visibility-list">
            {[
              ["hero", "Hero banner", "Main homepage banner"],
              ["banners", "Promotions", "Special offers and campaigns"],
              ["categories", "Categories", "Your main product categories"],
              ["bestsellers", "Bestsellers", "Popular products"],
              [
                "categoryProducts",
                "Category products",
                "Products grouped by category",
              ],
              [
                "promise",
                "Trust section",
                "Delivery, support and store benefits",
              ],
              ["footer", "Footer", "Contact and store information"],
            ].map(([key, title, description]) => {
              const visibilityKey =
                key as keyof HomePageEditorContent["visibility"];

              return (
                <label className="visibility-item" key={key}>
                  <div>
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </div>

                  <span className="switch">
                    <input
                      type="checkbox"
                      checked={Boolean(form.visibility?.[visibilityKey])}
                      onChange={(event) =>
                        updateVisibility(visibilityKey, event.target.checked)
                      }
                    />
                    <i />
                  </span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "promotions" && (
        <section className="home-editor-section">
          <div className="home-section-header">
            <div>
              <span className="home-section-icon">
                <ImagePlus size={17} />
              </span>

              <div>
                <h2>Promotions</h2>
                <p>Add up to two promotional banners below your hero.</p>
              </div>
            </div>

            <label className="simple-switch">
              <input
                type="checkbox"
                checked={Boolean(form.visibility?.banners)}
                onChange={(event) =>
                  updateVisibility("banners", event.target.checked)
                }
              />
              <span />
              <b>{form.visibility?.banners ? "Visible" : "Hidden"}</b>
            </label>
          </div>

          <div className="simple-settings">
            <Input
              label="Small label"
              value={form.banners?.eyebrow || DEFAULT_PROMOTION.eyebrow}
              onChange={(event) =>
                updatePromotion("eyebrow", event.target.value)
              }
            />

            <Input
              label="Section title"
              value={form.banners?.title || DEFAULT_PROMOTION.title}
              onChange={(event) => updatePromotion("title", event.target.value)}
            />
          </div>

          <div className="home-banner-editor-list">
            {form.banners.items.map((banner, index) => (
              <article className="home-banner-editor" key={banner.id}>
                <div
                  className="home-banner-editor-preview"
                  style={
                    banner.imageUrl
                      ? { backgroundImage: `url("${banner.imageUrl}")` }
                      : undefined
                  }
                >
                  {!banner.imageUrl && <span>Upload a promotion image</span>}
                  <label className="home-banner-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) uploadBannerImage(index, file);
                        event.currentTarget.value = "";
                      }}
                    />
                    {uploadingBanner === String(index) ? (
                      <>
                        <Loader2 size={15} className="spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImagePlus size={15} />
                        {banner.imageUrl ? "Change image" : "Upload image"}
                      </>
                    )}
                  </label>
                </div>

                <div className="home-banner-editor-fields">
                  <div className="home-section-header">
                    <div>
                      <h3>Promotion banner {index + 1}</h3>
                    </div>
                    <button
                      type="button"
                      className="icon-action danger"
                      onClick={() => deleteBanner(index)}
                      aria-label={`Remove promotion banner ${index + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="simple-form-grid">
                    <Input
                      label="Small label"
                      value={banner.eyebrow || ""}
                      onChange={(event) =>
                        updateBanner(index, "eyebrow", event.target.value)
                      }
                    />
                    <Input
                      label="Title"
                      value={banner.title || ""}
                      onChange={(event) =>
                        updateBanner(index, "title", event.target.value)
                      }
                    />
                    <Input
                      label="Image description"
                      value={banner.imageAlt || ""}
                      onChange={(event) =>
                        updateBanner(index, "imageAlt", event.target.value)
                      }
                    />
                    <Input
                      label="Link"
                      value={banner.href || ""}
                      onChange={(event) =>
                        updateBanner(index, "href", event.target.value)
                      }
                    />
                  </div>
                  <label className="simple-check">
                    <input
                      type="checkbox"
                      checked={Boolean(banner.isActive)}
                      onChange={(event) =>
                        updateBanner(index, "isActive", event.target.checked)
                      }
                    />
                    <span>Show this promotion</span>
                  </label>
                </div>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="home-banner-add"
            onClick={addBanner}
            disabled={form.banners.items.length >= 2}
          >
            <Plus size={16} />
            Add promotion banner
          </button>
        </section>
      )}

      {activeTab === "categories" && (
        <section className="home-editor-section">
          <div className="home-section-header">
            <div>
              <span className="home-section-icon">
                <Settings2 size={17} />
              </span>

              <div>
                <h2>Categories</h2>
                <p>Select the categories you want to show on your homepage.</p>
              </div>
            </div>

            <label className="simple-switch">
              <input
                type="checkbox"
                checked={Boolean(form.visibility?.categories)}
                onChange={(event) =>
                  updateVisibility("categories", event.target.checked)
                }
              />
              <span />
              <b>{form.visibility?.categories ? "Visible" : "Hidden"}</b>
            </label>
          </div>

          <div className="simple-settings">
            <Input
              label="Small label"
              value={form.categories?.eyebrow || "Shop by Category"}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  categories: {
                    ...current.categories,
                    eyebrow: event.target.value,
                  },
                }))
              }
            />

            <Input
              label="Section title"
              value={form.categories?.title || "Explore our categories"}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  categories: {
                    ...current.categories,
                    title: event.target.value,
                  },
                }))
              }
            />
          </div>

          <div className="selection-header">
            <div>
              <strong>Select categories</strong>
              <span>{selectedCategoryIds.length} selected</span>
            </div>
          </div>

          <div className="selection-grid">
            {categories.length === 0 ? (
              <div className="selection-empty">No categories available.</div>
            ) : (
              categories.map((category: any) => {
                const id = String(
                  category._id || category.id || category.categoryId,
                );

                const selected = selectedCategoryIds.includes(id);

                return (
                  <label
                    key={id}
                    className={`selection-card ${selected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCategory(id)}
                    />

                    <span className="selection-check">
                      {selected && <Check size={13} />}
                    </span>

                    <span>
                      <strong>
                        {category.name || category.title || "Category"}
                      </strong>

                      {category.description && (
                        <small>{category.description}</small>
                      )}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </section>
      )}

      {activeTab === "products" && (
        <section className="home-editor-section">
          <div className="home-section-header">
            <div>
              <span className="home-section-icon">
                <Sparkles size={17} />
              </span>

              <div>
                <h2>Bestsellers</h2>
                <p>Choose a few products to highlight.</p>
              </div>
            </div>

            <label className="simple-switch">
              <input
                type="checkbox"
                checked={Boolean(form.visibility?.bestsellers)}
                onChange={(event) =>
                  updateVisibility("bestsellers", event.target.checked)
                }
              />
              <span />
              <b>{form.visibility?.bestsellers ? "Visible" : "Hidden"}</b>
            </label>
          </div>

          <div className="simple-settings">
            <Input
              label="Small label"
              value={form.bestsellers?.eyebrow || "Bestsellers"}
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
              label="Section title"
              value={form.bestsellers?.title || "Popular products"}
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
              label="Products to show"
              type="number"
              value={String(form.bestsellers?.limit || 8)}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  bestsellers: {
                    ...current.bestsellers,
                    limit: Number(event.target.value || 8),
                  },
                }))
              }
            />
          </div>

          <div className="selection-header">
            <div>
              <strong>Select products</strong>
              <span>{form.bestsellers?.productIds?.length || 0} selected</span>
            </div>
          </div>

          <div className="selection-grid products">
            {products.length === 0 ? (
              <div className="selection-empty">No products available.</div>
            ) : (
              products.map((product: any) => {
                const id = String(
                  product._id || product.id || product.productId,
                );

                const selected = form.bestsellers?.productIds?.includes(id);

                return (
                  <label
                    key={id}
                    className={`selection-card ${selected ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(selected)}
                      onChange={() => toggleProduct(id)}
                    />

                    <span className="selection-check">
                      {selected && <Check size={13} />}
                    </span>

                    <span>
                      <strong>
                        {product.name || product.title || "Product"}
                      </strong>

                      {product.price !== undefined && (
                        <small>{product.price}</small>
                      )}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </section>
      )}

      {activeTab === "footer" && (
        <section className="home-editor-section">
          <div className="home-section-header">
            <div>
              <span className="home-section-icon">
                <Layout size={17} />
              </span>

              <div>
                <h2>Trust & Footer</h2>
                <p>Add the basic information customers need.</p>
              </div>
            </div>
          </div>

          <div className="simple-settings">
            <Input
              label="Trust section label"
              value={form.promise?.eyebrow || DEFAULT_FOOTER.promiseEyebrow}
              onChange={(event) => updatePromise("eyebrow", event.target.value)}
            />

            <Input
              label="Trust section title"
              value={form.promise?.title || DEFAULT_FOOTER.promiseTitle}
              onChange={(event) => updatePromise("title", event.target.value)}
            />

            <div className="wide-field">
              <Input
                label="Support email"
                type="email"
                placeholder="support@example.com"
                value={form.footer?.supportEmail || ""}
                onChange={(event) =>
                  updateFooter("supportEmail", event.target.value)
                }
              />
            </div>

            <div className="wide-field">
              <TextArea
                label="Footer description"
                value={
                  form.footer?.description || DEFAULT_FOOTER.footerDescription
                }
                onChange={(event) =>
                  updateFooter("description", event.target.value)
                }
              />
            </div>

            <div className="wide-field">
              <Input
                label="Top announcement"
                value={
                  form.footer?.topAnnouncement || DEFAULT_FOOTER.topAnnouncement
                }
                onChange={(event) =>
                  updateFooter("topAnnouncement", event.target.value)
                }
              />
            </div>
          </div>

          <div className="footer-preview">
            <div>
              <Sparkles size={17} />
              <span>{form.promise?.title || DEFAULT_FOOTER.promiseTitle}</span>
            </div>

            <small>
              {form.footer?.topAnnouncement || DEFAULT_FOOTER.topAnnouncement}
            </small>
          </div>
        </section>
      )}

      <div className="home-editor-bottom">
        <span>Changes are not published until you save.</span>

        <button
          type="button"
          className="home-primary-btn"
          onClick={save}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="spin" size={16} />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
