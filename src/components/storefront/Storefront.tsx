"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "@/lib/utils";
import { initializeBrowserPixels, trackStorefrontEvent } from "@/lib/tracking";
import {
  useGetPublicDeliveryPriceQuery,
  usePlaceOrderMutation,
  useTrackAnalyticsEventMutation,
} from "@/store/publicApi";
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateCartQuantity,
  type CartProduct,
} from "@/store/cartSlice";
import type { RootState } from "@/store";
import type { HomePageContent } from "@/store/homePageApi";
import type { PublicSettings } from "@/store/publicApi";
import type { Category } from "@/store/categoryApi";
import "./storefront.css";

type Product = CartProduct & {
  description?: string;
  shortDescription?: string;
  images?: Array<{ url?: string; secureUrl?: string }> | string[];
  categories?: string[];
  tags?: string[];
  isFeatured?: boolean;
  salesCount?: number;
  createdAt?: string;
  isActive?: boolean;
};

const imageOf = (product?: Product | null) =>
  product?.thumbnailImage?.secureUrl ||
  product?.thumbnailImage?.url ||
  (typeof product?.images?.[0] === "string"
    ? product.images[0]
    : product?.images?.[0]?.secureUrl || product?.images?.[0]?.url) ||
  "";
const priceOf = (item: { product: Product; variantId?: string }) =>
  Number(
    item.product.variants?.find((variant) => variant.id === item.variantId)
      ?.price ?? item.product.price,
  ) || 0;
const productsFrom = (data: unknown): Product[] => {
  if (Array.isArray(data)) return data as Product[];
  if (data && typeof data === "object") {
    const value = data as { products?: unknown[]; items?: unknown[] };
    return (value.products ?? value.items ?? []) as Product[];
  }
  return [];
};

function useStorefrontTracking(settings?: PublicSettings) {
  const [send] = useTrackAnalyticsEventMutation();
  useEffect(() => {
    initializeBrowserPixels({
      facebookPixelId: settings?.store?.socialTracking?.facebook?.enabled
        ? settings.store.socialTracking.facebook.pixelId
        : undefined,
      tiktokPixelId: settings?.store?.socialTracking?.tiktok?.enabled
        ? settings.store.socialTracking.tiktok.pixelId
        : undefined,
    });
  }, [settings]);
  return (
    eventType:
      | "page_view"
      | "product_view"
      | "add_to_cart"
      | "checkout_started",
    payload: Record<string, unknown>,
    key: string,
  ) => {
    trackStorefrontEvent(
      {
        eventType,
        eventName: eventType === "product_view" ? "view_content" : eventType,
        payload: { ...payload, currency: settings?.store?.currency || "BDT" },
      },
      key,
      send,
    );
  };
}

export function StorefrontHeader({
  announcement,
  settings,
  categories = [],
}: {
  announcement?: string;
  settings?: PublicSettings;
  categories?: Category[];
} = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const [search, setSearch] = useState("");
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const logoUrl =
    settings?.branding?.logoUrl ||
    settings?.branding?.logo ||
    settings?.store?.logoUrl ||
    settings?.store?.logo;
  const storeName =
    settings?.branding?.storeName ||
    settings?.store?.storeName ||
    settings?.store?.name ||
    "";
  const announcementText = announcement || settings?.store?.announcement;
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (search.trim())
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
  };
  return (
    <>
      <header className="storefront-header">
        <div className="storefront-container storefront-header-inner">
          <Link href="/" className="storefront-logo">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} />
            ) : (
              <>
                <span className="storefront-mark">
                  <ShoppingBag size={16} />
                </span>
                {storeName && (
                  <span className="storefront-brand-name">{storeName}</span>
                )}
              </>
            )}
          </Link>
          <form className="storefront-search" onSubmit={submitSearch}>
            <Search size={17} />
            <input
              aria-label="Search products"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" aria-label="Submit search">
              <ArrowRight size={15} />
            </button>
          </form>
          <div className="storefront-utility-links">
            {settings?.contact?.address && (
              <span>
                <MapPin size={15} />
                {Object.values(settings.contact.address)
                  .filter(Boolean)
                  .join(", ")}
              </span>
            )}
            <Link className="storefront-account-link" href="/login">
              <UserRound size={15} /> Sign in
            </Link>
          </div>
        </div>
        <div className="storefront-category-bar">
          <nav
            className="storefront-container storefront-nav"
            aria-label="Shop departments"
          >
            {announcementText && (
              <span className="storefront-location">
                <MapPin size={13} /> {announcementText}
              </span>
            )}
            <Link className={pathname === "/" ? "active" : ""} href="/">
              All departments
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
              >
                {category.name}
              </Link>
            ))}
            <Link
              className="storefront-cart-link"
              href="/cart"
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag size={20} />
              <span>
                {count} ·{" "}
                {formatCurrency(
                  items.reduce(
                    (sum, item) => sum + priceOf(item) * item.quantity,
                    0,
                  ),
                  settings?.store?.currency,
                )}
              </span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export function StorefrontFooter({
  content,
  settings,
  categories = [],
}: {
  content?: HomePageContent["footer"];
  settings?: PublicSettings;
  categories?: Category[];
} = {}) {
  const logoUrl =
    settings?.branding?.logoUrl ||
    settings?.branding?.logo ||
    settings?.store?.logoUrl ||
    settings?.store?.logo;
  const storeName =
    settings?.branding?.storeName ||
    settings?.store?.storeName ||
    settings?.store?.name ||
    "";
  const contact = settings?.contact;
  const address = contact?.address
    ? Object.values(contact.address).filter(Boolean).join(", ")
    : "";
  return (
    <footer className="storefront-footer">
      <div className="storefront-container footer-grid">
        <div>
          <Link href="/" className="storefront-logo light">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} />
            ) : (
              <span>{storeName}</span>
            )}
          </Link>
          {content?.description && <p>{content.description}</p>}
        </div>
        <div>
          <strong>Shop by department</strong>
          <Link href="/products">All products</Link>
          {categories.map((category) => (
            <Link
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              key={category.id}
            >
              {category.name}
            </Link>
          ))}
          <Link href="/cart">Your cart</Link>
        </div>
        <div>
          <strong>{content?.supportLabel || "Need help?"}</strong>
          {contact?.phone && <span>{contact.phone}</span>}
          {(content?.supportEmail || contact?.email) && (
            <span>{content?.supportEmail || contact?.email}</span>
          )}
          {address && <span>{address}</span>}
        </div>
      </div>
      <div className="storefront-container footer-bottom">
        <span>
          © {new Date().getFullYear()} {storeName}
        </span>
      </div>
    </footer>
  );
}

export function StorefrontFrame({
  children,
  homePage,
  settings,
  categories = [],
}: {
  children: React.ReactNode;
  homePage?: HomePageContent;
  settings?: PublicSettings;
  categories?: Category[];
}) {
  const pathname = usePathname();
  const [send] = useTrackAnalyticsEventMutation();
  useStorefrontTracking(settings);
  useEffect(() => {
    trackStorefrontEvent(
      {
        eventType: "page_view",
        eventName: "page_view",
        payload: { page: pathname },
        url: window.location.href,
      },
      `storefront-page-view-${pathname}`,
      send,
    );
  }, [pathname, send]);
  return (
    <>
      <StorefrontHeader
        announcement={homePage?.footer.announcement}
        settings={settings}
        categories={categories}
      />
      {children}
      <StorefrontFooter
        content={homePage?.footer}
        settings={settings}
        categories={categories}
      />
    </>
  );
}

export function ProductCard({
  product,
  index = 0,
  settings,
}: {
  product: Product;
  index?: number;
  settings?: PublicSettings;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const track = useStorefrontTracking(settings);
  const [added, setAdded] = useState(false);
  const href = `/products/${product.slug || product.id}`;
  const defaultVariantId = product.variants?.[0]?.id;
  const productPrice =
    Number(product.variants?.[0]?.price ?? product.price) || 0;
  const add = () => {
    dispatch(addToCart({ product, quantity: 1, variantId: defaultVariantId }));
    track(
      "add_to_cart",
      {
        contentIds: [product.id],
        contentName: product.name,
        value: product.price,
        quantity: 1,
      },
      `product-card-add-${product.id}`,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };
  const orderNow = () => {
    dispatch(addToCart({ product, quantity: 1, variantId: defaultVariantId }));
    track(
      "add_to_cart",
      {
        contentIds: [product.id],
        contentName: product.name,
        value: product.price,
        quantity: 1,
      },
      `product-card-order-${product.id}`,
    );
    router.push("/checkout");
  };
  return (
    <article
      className="product-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link href={href} className="product-image">
        {product.isFeatured && (
          <span className="product-badge">Best seller</span>
        )}
        {imageOf(product) ? (
          <img src={imageOf(product)} alt={product.name} />
        ) : (
          <span className="image-placeholder">
            <ShoppingBag size={28} aria-hidden="true" />
          </span>
        )}
      </Link>
      <div className="product-card-body">
        <div>
          <Link href={href} className="product-name">
            {product.name}
          </Link>
        </div>
        <strong className="product-price">
          {formatCurrency(productPrice, settings?.store?.currency)}
        </strong>
      </div>
      <div className="product-card-actions">
        <button
          className={`product-add ${added ? "is-added" : ""}`}
          onClick={add}
        >
          {added ? (
            <>
              <Check size={15} /> Added
            </>
          ) : (
            <>
              <Plus size={15} /> Add to cart
            </>
          )}
        </button>
        <button className="product-order-now" onClick={orderNow}>
          Buy now <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

export function HomeStorefront({
  initialProducts,
  initialHomePage,
  settings,
  categories = [],
}: {
  initialProducts?: unknown;
  initialHomePage?: HomePageContent;
  settings?: PublicSettings;
  categories?: Category[];
}) {
  const homePage = initialHomePage;
  const slides =
    homePage?.hero?.slides
      .filter((slide) => slide.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder) ?? [];
  const [slideIndex, setSlideIndex] = useState(0);
  const activeSlide =
    slides[Math.min(slideIndex, Math.max(slides.length - 1, 0))];
  const products = productsFrom(initialProducts).filter((product) => product);
  const configuredProducts = homePage?.bestsellers?.productIds.length
    ? (homePage.bestsellers.productIds
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean) as Product[])
    : products;
  const homepageCategories = (homePage?.categories ?? []).flatMap(
    (selection) => {
      const category = categories.find(
        (candidate) => candidate.id === selection.id,
      );
      return category ? [{ category, selection }] : [];
    },
  );
  const hasHomepageSections = Boolean(
    slides.length ||
    homepageCategories.length ||
    homePage?.banners.items.some((banner) => banner.isActive) ||
    homePage?.bestsellers.title.trim() ||
    homePage?.categoryProducts.some((section) => section.title.trim()) ||
    homePage?.promise.items.length,
  );
  useStorefrontTracking(settings);
  useEffect(() => {
    if (!homePage?.hero.autoplay || slides.length < 2) return;
    const timer = window.setInterval(
      () => setSlideIndex((current) => (current + 1) % slides.length),
      homePage.hero.intervalMs,
    );
    return () => window.clearInterval(timer);
  }, [homePage?.hero.autoplay, homePage?.hero.intervalMs, slides.length]);
  useEffect(() => {
    setSlideIndex(0);
  }, [slides.length]);

  if (!homePage || !hasHomepageSections) {
    return (
      <StorefrontFrame settings={settings} categories={categories}>
        <main className="storefront-main storefront-api-home">
          <section className="storefront-container storefront-api-hero">
            <div className="storefront-api-hero-copy">
              <span className="eyebrow">
                {settings?.store?.name || settings?.branding?.storeName}
              </span>
              <h1>{settings?.store?.name || settings?.branding?.storeName}</h1>
              {settings?.store?.description && (
                <p>{settings.store.description}</p>
              )}
              <Link href="/products" className="button button-dark">
                Shop all products <ArrowRight size={17} />
              </Link>
            </div>
            {(settings?.branding?.logoUrl || settings?.branding?.logo) && (
              <div className="storefront-api-hero-logo">
                <img
                  src={settings.branding.logoUrl || settings.branding.logo}
                  alt={settings?.store?.name || "Store logo"}
                />
              </div>
            )}
          </section>
          <section className="storefront-container storefront-api-category-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Shop</span>
                <h2>Browse categories</h2>
              </div>
              <Link href="/products" className="text-link">
                All products <ArrowRight size={16} />
              </Link>
            </div>
            {categories.length ? (
              <div className="category-links">
                {categories.map((category) => (
                  <Link
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    key={category.id}
                  >
                    <span>
                      {(category.image?.secureUrl || category.image?.url) && (
                        <img
                          className="category-image"
                          src={category.image.secureUrl || category.image.url}
                          alt=""
                        />
                      )}
                      <strong>{category.name}</strong>
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="storefront-api-empty-note">
                No categories have been published yet.
              </p>
            )}
          </section>
          <section className="storefront-container product-section storefront-api-products">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Catalog</span>
                <h2>Products</h2>
              </div>
              {products.length > 0 && (
                <span className="catalog-count">
                  {products.length} products
                </span>
              )}
            </div>
            {products.length ? (
              <div className="product-grid">
                {products.map((product, index) => (
                  <ProductCard
                    product={product}
                    index={index}
                    settings={settings}
                    key={product.id}
                  />
                ))}
              </div>
            ) : (
              <EmptyProducts />
            )}
          </section>
        </main>
      </StorefrontFrame>
    );
  }

  return (
    <StorefrontFrame
      homePage={homePage}
      settings={settings}
      categories={categories}
    >
      <main className="storefront-main">
        {homePage.visibility?.hero !== false && activeSlide && (
          <section
            className="storefront-hero"
            style={{
              backgroundImage: activeSlide.imageUrl
                ? `url(${activeSlide.imageUrl})`
                : undefined,
            }}
            aria-label="Featured collection"
          >
            <div className="hero-overlay" />
            <div className="storefront-container hero-content">
              <div className="hero-copy">
                <span className="eyebrow">{activeSlide.eyebrow}</span>
                <h1>
                  {activeSlide.title}
                  <br />
                  <i>{activeSlide.emphasis}</i>
                </h1>
                <p>{activeSlide.description}</p>
                <Link
                  href={activeSlide.buttonHref || "/products"}
                  className="button button-dark"
                >
                  {activeSlide.buttonLabel} <ArrowRight size={17} />
                </Link>
              </div>
              <div className="hero-slider-controls">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() =>
                    setSlideIndex((current) =>
                      current === 0 ? slides.length - 1 : current - 1,
                    )
                  }
                  disabled={slides.length < 2}
                >
                  ←
                </button>
                <div className="hero-slide-count">
                  <strong>{String(slideIndex + 1).padStart(2, "0")}</strong>
                  <span>/ {String(slides.length).padStart(2, "0")}</span>
                </div>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() =>
                    setSlideIndex((current) => (current + 1) % slides.length)
                  }
                  disabled={slides.length < 2}
                >
                  →
                </button>
              </div>
              <div className="hero-slide-dots" aria-label="Choose slide">
                {slides.map((slide, index) => (
                  <button
                    type="button"
                    key={slide.id}
                    className={index === slideIndex ? "active" : ""}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === slideIndex ? "true" : undefined}
                    onClick={() => setSlideIndex(index)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        {homePage.visibility?.categories !== false &&
          homepageCategories.length > 0 && (
            <section className="storefront-container category-strip">
              <div>
                <span className="eyebrow">
                  {homePage.categorySection.eyebrow}
                </span>
                <h2>{homePage.categorySection.title}</h2>
              </div>
              <div className="category-links">
                {homepageCategories.map(({ category, selection }) => (
                  <Link
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    key={category.id}
                  >
                    <span>
                      {category.image?.secureUrl ||
                      category.image?.url ||
                      selection.imageUrl ? (
                        <img
                          className="category-image"
                          src={
                            category.image?.secureUrl ||
                            category.image?.url ||
                            selection.imageUrl
                          }
                          alt=""
                        />
                      ) : null}
                      <strong>{category.name}</strong>
                      {(selection.description || category.description) && (
                        <small>
                          {selection.description || category.description}
                        </small>
                      )}
                    </span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            </section>
          )}
        {homePage.visibility?.bestsellers !== false && (
          <section className="storefront-container product-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">{homePage.bestsellers.eyebrow}</span>
                <h2>{homePage.bestsellers.title}</h2>
              </div>
              <Link href="/products" className="text-link">
                {homePage.bestsellers.viewAllLabel} <ArrowRight size={16} />
              </Link>
            </div>
            {products.length ? (
              <div className="product-grid">
                {configuredProducts
                  .slice(0, homePage.bestsellers.limit || 8)
                  .map((product, index) => (
                    <ProductCard
                      product={product}
                      index={index}
                      settings={settings}
                      key={product.id}
                    />
                  ))}
              </div>
            ) : (
              <EmptyProducts />
            )}
          </section>
        )}
        {homePage.visibility?.banners !== false &&
          homePage.banners.items.length > 0 && (
            <HomeBanners banners={homePage.banners} />
          )}
        {homePage.visibility?.categoryProducts !== false &&
          homePage.categoryProducts?.map((section) => {
            const sectionProducts = section.productIds.length
              ? (section.productIds
                  .map((id) => products.find((product) => product.id === id))
                  .filter(Boolean) as Product[])
              : products.filter((product) =>
                  product.categories?.includes(section.categoryId),
                );
            if (!sectionProducts.length) return null;
            return (
              <section
                className="storefront-container product-section category-product-section"
                key={section.categoryId}
              >
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">{section.eyebrow}</span>
                    <h2>{section.title}</h2>
                  </div>
                  <Link
                    href={`/products?category=${section.categoryId}`}
                    className="text-link"
                  >
                    {homePage.bestsellers.viewAllLabel} <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="product-grid">
                  {sectionProducts
                    .slice(0, Math.min(section.limit || 10, 10))
                    .map((product, index) => (
                      <ProductCard
                        product={product}
                        index={index}
                        settings={settings}
                        key={product.id}
                      />
                    ))}
                </div>
              </section>
            );
          })}
        {homePage.visibility?.promise !== false &&
          homePage.promise.items.length > 0 && (
            <section className="storefront-container promise-band">
              <div>
                <span className="eyebrow">{homePage.promise.eyebrow}</span>
                <h2>
                  {homePage.promise.title}
                  <br />
                  <i>{homePage.promise.emphasis}</i>
                </h2>
              </div>
              <div className="promise-items">
                {homePage.promise.items.map((item) => (
                  <div key={item.number}>
                    <strong>{item.number}</strong>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
      </main>
    </StorefrontFrame>
  );
}

function HomeBanners({ banners }: { banners: HomePageContent["banners"] }) {
  const items = banners.items
    .filter((item) => item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 2);
  if (!items.length) return null;
  return (
    <section className="storefront-container home-banners">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{banners.eyebrow}</span>
          <h2>{banners.title}</h2>
        </div>
      </div>
      <div className="home-banner-grid">
        {items.map((banner) => (
          <Link
            href={banner.href || "/products"}
            className="home-banner-card"
            key={banner.id}
            style={{
              backgroundImage: banner.imageUrl
                ? `url(${banner.imageUrl})`
                : undefined,
            }}
          >
            <span className="home-banner-overlay">
              <small>{banner.eyebrow}</small>
              <strong>{banner.title}</strong>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CatalogStorefront({
  initialProducts,
  settings,
  initialCategory = "all",
  initialSearch = "",
  categories = [],
}: {
  initialProducts?: unknown;
  settings?: PublicSettings;
  initialCategory?: string;
  initialSearch?: string;
  categories?: Category[];
}) {
  const products = productsFrom(initialProducts).filter(
    (product) => product.isActive !== false,
  );
  const [filter, setFilter] = useState(initialCategory);
  const [query, setQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("featured");
  const filtered = products
    .filter(
      (product) =>
        filter === "all" ||
        product.categories?.some((category) => category === filter),
    )
    .filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((first, second) => {
      if (sortBy === "price-low")
        return Number(first.price) - Number(second.price);
      if (sortBy === "price-high")
        return Number(second.price) - Number(first.price);
      if (sortBy === "newest")
        return (
          Date.parse(second.createdAt ?? "") - Date.parse(first.createdAt ?? "")
        );
      if (sortBy === "popular")
        return (second.salesCount ?? 0) - (first.salesCount ?? 0);
      return (
        Number(Boolean(second.isFeatured)) - Number(Boolean(first.isFeatured))
      );
    });
  const categoryLabel = categories.find(
    (category) => category.id === filter,
  )?.name;
  return (
    <StorefrontFrame settings={settings} categories={categories}>
      <main className="storefront-container catalog-page">
        <div className="catalog-breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{categoryLabel ?? "Shop"}</span>
        </div>
        <div className="catalog-heading">
          <div>
            {settings?.store?.name && (
              <span className="eyebrow">{settings.store.name}</span>
            )}
            <h1>{categoryLabel ?? "Shop all products"}</h1>
            {settings?.store?.description && (
              <p>{settings.store.description}</p>
            )}
          </div>
          <div className="catalog-count">{filtered.length} products</div>
        </div>
        <div className="catalog-toolbar">
          <div className="filter-pills">
            {[{ id: "all", name: "All products" }, ...categories].map(
              ({ id, name }) => (
                <button
                  className={filter === id ? "active" : ""}
                  key={id}
                  onClick={() => setFilter(id)}
                >
                  {name}
                </button>
              ),
            )}
          </div>
          <label className="catalog-search">
            <Search size={16} />
            <input
              placeholder="Filter products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className="catalog-sort">
            Sort by
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="popular">Best selling</option>
              <option value="newest">Newest arrivals</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </label>
        </div>
        {filtered.length ? (
          <div className="product-grid">
            {filtered.map((product, index) => (
              <ProductCard
                product={product}
                index={index}
                settings={settings}
                key={product.id}
              />
            ))}
          </div>
        ) : (
          <EmptyProducts
            title={
              query || filter !== "all"
                ? "No matching products"
                : "No products are available right now"
            }
            description={
              query || filter !== "all"
                ? "Try another search term or category."
                : "Please check back later."
            }
          />
        )}
      </main>
    </StorefrontFrame>
  );
}

function EmptyProducts({
  title = "No products are available right now",
  description = "Please check back later.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="empty-products">
      <ShoppingBag size={24} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function ProductDetailStorefront({
  slug,
  initialProduct,
  settings,
  categories = [],
}: {
  slug: string;
  initialProduct?: unknown;
  settings?: PublicSettings;
  categories?: Category[];
}) {
  const product = ((initialProduct as { product?: Product } | null)?.product ??
    initialProduct) as Product | undefined;
  const dispatch = useDispatch();
  const router = useRouter();
  const track = useStorefrontTracking(settings);
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState(product?.variants?.[0]?.id);
  useEffect(() => {
    if (product) {
      setVariantId(product.variants?.[0]?.id);
      track(
        "product_view",
        {
          contentIds: [product.id],
          contentName: product.name,
          value: product.price,
        },
        `product-view-${product.id}`,
      );
    }
  }, [product]);
  if (!product)
    return (
      <StorefrontFrame settings={settings} categories={categories}>
        <main className="storefront-container state-page">
          <h1>Product not found</h1>
          <Link href="/products" className="button button-dark">
            Back to shop
          </Link>
        </main>
      </StorefrontFrame>
    );
  const variant = product.variants?.find((item) => item.id === variantId);
  const price = Number(variant?.price ?? product.price) || 0;
  const add = () => {
    dispatch(addToCart({ product, quantity, variantId }));
    track(
      "add_to_cart",
      {
        contentIds: [product.id],
        contentName: product.name,
        value: price * quantity,
        quantity,
      },
      `detail-add-${product.id}-${variantId ?? "base"}`,
    );
    router.push("/cart");
  };
  const orderNow = () => {
    dispatch(addToCart({ product, quantity, variantId }));
    track(
      "add_to_cart",
      {
        contentIds: [product.id],
        contentName: product.name,
        value: price * quantity,
        quantity,
      },
      `detail-order-${product.id}-${variantId ?? "base"}`,
    );
    router.push("/checkout");
  };
  return (
    <StorefrontFrame settings={settings} categories={categories}>
      <main className="storefront-container product-detail">
        <div className="detail-image">
          {imageOf(product) ? (
            <img src={imageOf(product)} alt={product.name} />
          ) : (
            <span className="detail-letter">{product.name.slice(0, 1)}</span>
          )}
        </div>
        <div className="detail-copy">
          {categories.find(
            (category) => category.id === product.categories?.[0],
          )?.name && (
            <span className="eyebrow">
              {
                categories.find(
                  (category) => category.id === product.categories?.[0],
                )?.name
              }
            </span>
          )}
          <h1>{product.name}</h1>
          <strong className="detail-price">
            {formatCurrency(price, settings?.store?.currency)}
          </strong>
          {(product.description || product.shortDescription) &&
            product.description !== "none" && (
              <p className="detail-description">
                {product.description || product.shortDescription}
              </p>
            )}
          {product.variants?.length ? (
            <div className="variant-picker">
              <span>Choose an option</span>
              <div>
                {product.variants.map((item) => (
                  <button
                    className={variantId === item.id ? "active" : ""}
                    key={item.id}
                    onClick={() => setVariantId(item.id)}
                  >
                    {item.name || "Option"}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="detail-buy">
            <div className="quantity-control">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={15} />
              </button>
              <span>{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={15} />
              </button>
            </div>
            <div className="detail-actions">
              <button className="button button-dark" onClick={add}>
                Add to cart <ArrowRight size={17} />
              </button>
              <button className="button button-order" onClick={orderNow}>
                Order now <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </StorefrontFrame>
  );
}

export function CartStorefront({
  settings,
  categories = [],
}: {
  settings?: PublicSettings;
  categories?: Category[];
}) {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const subtotal = items.reduce(
    (total, item) => total + priceOf(item) * item.quantity,
    0,
  );
  return (
    <StorefrontFrame settings={settings} categories={categories}>
      <main className="storefront-container cart-page">
        <div className="page-kicker">
          <span className="eyebrow">Your selection</span>
          <h1>Shopping bag</h1>
        </div>
        {items.length ? (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div
                  className="cart-item"
                  key={`${item.product.id}-${item.variantId}`}
                >
                  <div className="cart-item-image">
                    {imageOf(item.product) ? (
                      <img src={imageOf(item.product)} alt="" />
                    ) : (
                      item.product.name.slice(0, 1)
                    )}
                  </div>
                  <div className="cart-item-main">
                    <Link
                      href={`/products/${item.product.slug || item.product.id}`}
                    >
                      {item.product.name}
                    </Link>
                    <span>
                      {item.variantId
                        ? item.product.variants?.find(
                            (variant) => variant.id === item.variantId,
                          )?.name
                        : "Standard"}
                    </span>
                    <div className="quantity-control">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() =>
                          dispatch(
                            updateCartQuantity({
                              productId: item.product.id,
                              variantId: item.variantId,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() =>
                          dispatch(
                            updateCartQuantity({
                              productId: item.product.id,
                              variantId: item.variantId,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <strong>
                    {formatCurrency(
                      priceOf(item) * item.quantity,
                      settings?.store?.currency,
                    )}
                  </strong>
                  <button
                    className="icon-button"
                    aria-label={`Remove ${item.product.name}`}
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: item.product.id,
                          variantId: item.variantId,
                        }),
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
            <aside className="cart-summary">
              <span className="eyebrow">Order summary</span>
              <div>
                <span>Subtotal</span>
                <strong>
                  {formatCurrency(subtotal, settings?.store?.currency)}
                </strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>Calculated at checkout</strong>
              </div>
              <hr />
              <div className="cart-total">
                <span>Total</span>
                <strong>
                  {formatCurrency(subtotal, settings?.store?.currency)}
                </strong>
              </div>
              <Link className="button button-dark full-width" href="/checkout">
                Continue to checkout <ArrowRight size={17} />
              </Link>
              <button
                className="text-link clear-cart"
                onClick={() => dispatch(clearCart())}
              >
                Clear bag
              </button>
            </aside>
          </div>
        ) : (
          <div className="empty-cart">
            <ShoppingBag size={30} />
            <h2>Your bag is waiting.</h2>
            <p>Add something useful, beautiful, or both.</p>
            <Link href="/products" className="button button-dark">
              Explore the collection
            </Link>
          </div>
        )}
      </main>
    </StorefrontFrame>
  );
}

export function CheckoutStorefront({
  initialPaymentMethods,
  settings,
  categories = [],
}: {
  initialPaymentMethods?: any[];
  settings?: PublicSettings;
  categories?: Category[];
}) {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const track = useStorefrontTracking(settings);
  const methods = initialPaymentMethods ?? [];
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    zone: "",
    payment: "cod",
    notes: "",
  });
  const { data: deliveryArea } = useGetPublicDeliveryPriceQuery();
  const { data: selectedDelivery, isFetching: isLoadingDelivery } =
    useGetPublicDeliveryPriceQuery(form.zone, { skip: !form.zone });
  const [error, setError] = useState("");
  const subtotal = items.reduce(
    (total, item) => total + priceOf(item) * item.quantity,
    0,
  );
  const deliveryFee = form.zone
    ? Number(selectedDelivery?.price ?? 0)
    : Number(deliveryArea?.deliveryCharge ?? deliveryArea?.price ?? 0);
  const total = subtotal + deliveryFee;
  const deliveryZones = deliveryArea?.zones ?? [];
  useEffect(() => {
    if (!form.zone && deliveryZones.length) {
      setForm((current) => ({ ...current, zone: deliveryZones[0].zone }));
    }
  }, [deliveryZones, form.zone]);
  useEffect(() => {
    track(
      "checkout_started",
      { value: total, contentIds: items.map((item) => item.product.id) },
      "storefront-checkout-started",
    );
  }, []);
  if (!items.length)
    return (
      <StorefrontFrame settings={settings} categories={categories}>
        <main className="storefront-container state-page">
          <h1>Your cart is empty</h1>
          <Link href="/products" className="button button-dark">
            Return to shop
          </Link>
        </main>
      </StorefrontFrame>
    );
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setError("Please fill in your name, phone number, and delivery address.");
      return;
    }
    if (
      !/^(?:\+?88)?01[3-9]\d{8}$/.test(form.phone.trim().replace(/[\s-]/g, ""))
    ) {
      setError(
        "Enter a valid Bangladesh mobile number, for example 01712345678.",
      );
      return;
    }
    setError("");
    try {
      const result = await placeOrder({
        items: items.map((item) => ({
          productId: item.product.id,
          ...(item.variantId ? { variantId: item.variantId } : {}),
          quantity: item.quantity,
        })),
        customer: { name: form.name, phone: form.phone, address: form.address },
        notes: form.notes || undefined,
        paymentMethod: form.payment,
        shippingMethod: "standard",
        deliveryZone: form.zone || undefined,
      }).unwrap();
      dispatch(clearCart());
      router.push(`/thank-you/${result.data?.id || result.id || ""}`);
    } catch {
      setError(
        "We could not place the order. Please check your details and try again.",
      );
    }
  };
  return (
    <StorefrontFrame settings={settings} categories={categories}>
      <main className="storefront-container checkout-page">
        <div className="page-kicker">
          <span className="eyebrow">Almost yours</span>
          <h1>Complete your order</h1>
        </div>
        <form className="checkout-storefront-layout" onSubmit={submit}>
          <div className="checkout-fields-panel">
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Your name"
              />
            </label>
            <label>
              Phone number
              <input
                required
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="01712345678"
              />
            </label>
            <label className="wide">
              Delivery address
              <textarea
                required
                value={form.address}
                onChange={(event) =>
                  setForm({ ...form, address: event.target.value })
                }
                placeholder="House, street, area"
              />
            </label>
            <label>
              Delivery area
              {deliveryZones.length ? (
                <select
                  value={form.zone}
                  onChange={(event) =>
                    setForm({ ...form, zone: event.target.value })
                  }
                >
                  {deliveryZones.map((zone) => (
                    <option value={zone.zone} key={zone.zone}>
                      {zone.zone}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={form.zone}
                  onChange={(event) =>
                    setForm({ ...form, zone: event.target.value })
                  }
                  placeholder="Dhaka, Chattogram, Sylhet..."
                />
              )}
            </label>
            <label>
              Order note <span>(optional)</span>
              <input
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
                placeholder="Anything we should know?"
              />
            </label>
            <fieldset className="payment-options">
              <legend>Payment method</legend>
              {(methods.length
                ? methods
                : [{ code: "cod", name: "Cash on Delivery" }]
              )
                .filter((method: any) => method.isActive !== false)
                .map((method: any) => (
                  <label
                    className={form.payment === method.code ? "selected" : ""}
                    key={method.code}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.payment === method.code}
                      onChange={() =>
                        setForm({ ...form, payment: method.code })
                      }
                    />
                    <span>
                      <strong>{method.name}</strong>
                      <small>
                        {method.description || "Pay when your order arrives."}
                      </small>
                    </span>
                  </label>
                ))}
            </fieldset>
            {error ? <p className="form-error">{error}</p> : null}
          </div>
          <aside className="checkout-order-summary">
            <span className="eyebrow">Your order</span>
            {items.map((item) => (
              <div
                className="checkout-line"
                key={`${item.product.id}-${item.variantId}`}
              >
                <span>
                  {item.product.name} <small>× {item.quantity}</small>
                </span>
                <strong>
                  {formatCurrency(
                    priceOf(item) * item.quantity,
                    settings?.store?.currency,
                  )}
                </strong>
              </div>
            ))}
            <hr />
            <div className="checkout-line">
              <span>Subtotal</span>
              <strong>
                {formatCurrency(subtotal, settings?.store?.currency)}
              </strong>
            </div>
            <div className="checkout-line">
              <span>Delivery</span>
              <strong>
                {isLoadingDelivery
                  ? "Checking..."
                  : formatCurrency(deliveryFee, settings?.store?.currency)}
              </strong>
            </div>
            <div className="checkout-total">
              <span>Total</span>
              <strong>
                {formatCurrency(total, settings?.store?.currency)}
              </strong>
            </div>
            <button
              disabled={isLoading}
              className="button button-dark full-width"
              type="submit"
            >
              {isLoading ? "Placing order..." : "Place order"}{" "}
              <ArrowRight size={17} />
            </button>
            <p className="checkout-assurance">
              <Check size={15} /> Your information is kept private.
            </p>
          </aside>
        </form>
      </main>
    </StorefrontFrame>
  );
}
