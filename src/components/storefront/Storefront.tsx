"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "@/lib/utils";
import { initializeBrowserPixels, trackStorefrontEvent } from "@/lib/tracking";
import {
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
import "./storefront.css";

type Product = CartProduct & {
  description?: string;
  images?: Array<{ url?: string; secureUrl?: string }> | string[];
  categories?: string[];
  tags?: string[];
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
        payload: { ...payload, currency: "BDT" },
        url: typeof window === "undefined" ? undefined : window.location.href,
      },
      key,
      send,
    );
  };
}

export function StorefrontHeader({
  announcement,
  settings,
}: { announcement?: string; settings?: PublicSettings } = {}) {
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
    "zane";
  const announcementText =
    announcement ||
    settings?.store?.announcement ||
    `Complimentary delivery on orders over ${formatCurrency(3000)}`;
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (search.trim())
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
  };
  return (
    <>
      <div className="storefront-announce">
        {announcementText} <span>•</span> Secure cash on delivery
      </div>
      <header className="storefront-header">
        <div className="storefront-container storefront-header-inner">
          <Link href="/" className="storefront-logo">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} />
            ) : (
              <>
                <span>{storeName}</span>
                <em>commerce</em>
              </>
            )}
          </Link>
          <nav className="storefront-nav" aria-label="Main navigation">
            <Link className={pathname === "/" ? "active" : ""} href="/">
              Home
            </Link>
            <Link
              className={pathname.startsWith("/products") ? "active" : ""}
              href="/products"
            >
              Shop
            </Link>
            <Link href="/products?category=new">New arrivals</Link>
          </nav>
          <div className="storefront-actions">
            <form className="storefront-search" onSubmit={submitSearch}>
              <Search size={17} />
              <input
                aria-label="Search products"
                placeholder="Search products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </form>
            <Link
              className="storefront-cart-link"
              href="/cart"
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag size={20} />
              <span>{count}</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export function StorefrontFooter({
  content,
  settings,
}: {
  content?: HomePageContent["footer"];
  settings?: PublicSettings;
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
    "zane";
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
              <>
                <span>{storeName}</span>
                <em>commerce</em>
              </>
            )}
          </Link>
          <p>
            {content?.description ||
              "Thoughtful products for everyday living, delivered to your door."}
          </p>
        </div>
        <div>
          <strong>Explore</strong>
          <Link href="/products">All products</Link>
          <Link href="/products?category=new">New arrivals</Link>
          <Link href="/cart">Your cart</Link>
        </div>
        <div>
          <strong>{content?.supportLabel || "Need help?"}</strong>
          <span>We are here Monday to Saturday.</span>
          {contact?.phone && <span>{contact.phone}</span>}
          <span>
            {content?.supportEmail ||
              contact?.email ||
              "support@zanecommerce.com"}
          </span>
          {address && <span>{address}</span>}
        </div>
      </div>
      <div className="storefront-container footer-bottom">
        <span>
          © {new Date().getFullYear()} {storeName}
        </span>
        <span>Built for better everyday shopping.</span>
      </div>
    </footer>
  );
}

export function StorefrontFrame({
  children,
  homePage,
  settings,
}: {
  children: React.ReactNode;
  homePage?: HomePageContent;
  settings?: PublicSettings;
}) {
  return (
    <>
      <StorefrontHeader
        announcement={homePage?.footer.announcement}
        settings={settings}
      />
      {children}
      <StorefrontFooter content={homePage?.footer} settings={settings} />
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
  const add = () => {
    dispatch(
      addToCart({ product, quantity: 1, variantId: product.variants?.[0]?.id }),
    );
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
    dispatch(
      addToCart({ product, quantity: 1, variantId: product.variants?.[0]?.id }),
    );
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
        <span className="product-badge">
          {index < 2 ? "Featured" : "Available"}
        </span>
        {imageOf(product) ? (
          <img src={imageOf(product)} alt={product.name} />
        ) : (
          <span className="image-placeholder">
            <strong>Product image</strong>
            <small>800 × 800 px</small>
          </span>
        )}
      </Link>
      <div className="product-card-body">
        <div>
          <Link href={href} className="product-name">
            {product.name}
          </Link>
          <p className="product-category">
            {product.categories?.[0] || "Everyday essentials"}
          </p>
        </div>
        <strong className="product-price">
          {formatCurrency(Number(product.price) || 0)}
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
          Order now <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}

export function HomeStorefront({
  initialProducts,
  initialHomePage,
  settings,
}: {
  initialProducts?: unknown;
  initialHomePage?: HomePageContent;
  settings?: PublicSettings;
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
  const track = useStorefrontTracking(settings);
  useEffect(() => {
    track("page_view", { page: "home" }, "storefront-home-view");
  }, []);
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

  if (!homePage) {
    return (
      <StorefrontFrame settings={settings}>
        <HomePageSkeleton />
      </StorefrontFrame>
    );
  }

  return (
    <StorefrontFrame homePage={homePage} settings={settings}>
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
          homePage.categories.length > 0 && (
            <section className="storefront-container category-strip">
              <div>
                <span className="eyebrow">
                  {homePage.categorySection.eyebrow}
                </span>
                <h2>{homePage.categorySection.title}</h2>
              </div>
              <div className="category-links">
                {homePage.categories.map((category) => (
                  <Link
                    href={category.href || `/products?category=${category.id}`}
                    key={category.id}
                  >
                    <span>
                      {category.imageUrl ? (
                        <img
                          className="category-image"
                          src={category.imageUrl}
                          alt=""
                        />
                      ) : (
                        <span className="category-image category-image-placeholder">
                          <strong>Category image</strong>
                          <small>640 × 480 px</small>
                        </span>
                      )}
                      <strong>{category.label}</strong>
                      {category.description && (
                        <small>{category.description}</small>
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
              {!banner.imageUrl && (
                <em>
                  Banner image
                  <br />
                  900 × 560 px
                </em>
              )}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomePageSkeleton() {
  return (
    <main
      className="storefront-main storefront-skeleton"
      aria-busy="true"
      aria-label="Loading homepage"
    >
      <section className="storefront-hero">
        <div className="storefront-container hero-grid">
          <div className="hero-copy">
            <span className="skeleton-block skeleton-eyebrow" />
            <span className="skeleton-block skeleton-title" />
            <span className="skeleton-block skeleton-title skeleton-title-short" />
            <span className="skeleton-block skeleton-description" />
            <span className="skeleton-block skeleton-button" />
          </div>
          <div className="hero-art skeleton-block" />
        </div>
      </section>
      <section className="storefront-container category-strip">
        <div>
          <span className="skeleton-block skeleton-eyebrow" />
          <span className="skeleton-block skeleton-section-title" />
        </div>
        <div className="category-links skeleton-category-links">
          {[1, 2, 3].map((item) => (
            <span className="skeleton-block" key={item} />
          ))}
        </div>
      </section>
      <section className="storefront-container product-section">
        <div className="section-heading">
          <span className="skeleton-block skeleton-section-title" />
          <span className="skeleton-block skeleton-link" />
        </div>
        <div className="product-grid">
          {[1, 2, 3, 4].map((item) => (
            <div className="skeleton-product" key={item}>
              <span className="skeleton-block" />
              <span className="skeleton-block skeleton-product-line" />
              <span className="skeleton-block skeleton-product-small" />
            </div>
          ))}
        </div>
      </section>
      <section className="storefront-container promise-band skeleton-promise">
        <span className="skeleton-block skeleton-section-title" />
        <div className="promise-items">
          {[1, 2, 3].map((item) => (
            <span className="skeleton-block" key={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

export function CatalogStorefront({
  initialProducts,
  settings,
}: {
  initialProducts?: unknown;
  settings?: PublicSettings;
}) {
  const products = productsFrom(initialProducts).filter(
    (product) => product.isActive !== false,
  );
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const filtered = products.filter(
    (product) =>
      (filter === "all" ||
        product.categories?.some((category) =>
          category.toLowerCase().includes(filter),
        )) &&
      product.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <StorefrontFrame settings={settings}>
      <main className="storefront-container catalog-page">
        <div className="catalog-heading">
          <div>
            <span className="eyebrow">The full collection</span>
            <h1>Shop everything</h1>
            <p>Objects for a more intentional everyday.</p>
          </div>
          <div className="catalog-count">{filtered.length} products</div>
        </div>
        <div className="catalog-toolbar">
          <div className="filter-pills">
            {["all", "home", "personal", "new"].map((value) => (
              <button
                className={filter === value ? "active" : ""}
                key={value}
                onClick={() => setFilter(value)}
              >
                {value === "all"
                  ? "All products"
                  : value[0].toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
          <label className="catalog-search">
            <Search size={16} />
            <input
              placeholder="Filter products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
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
          <EmptyProducts />
        )}
      </main>
    </StorefrontFrame>
  );
}

function EmptyProducts() {
  return (
    <div className="empty-products">
      <ShoppingBag size={24} />
      <h3>Nothing here yet</h3>
      <p>Check back soon for new additions.</p>
    </div>
  );
}

export function ProductDetailStorefront({
  slug,
  initialProduct,
  settings,
}: {
  slug: string;
  initialProduct?: unknown;
  settings?: PublicSettings;
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
      <StorefrontFrame settings={settings}>
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
    <StorefrontFrame settings={settings}>
      <main className="storefront-container product-detail">
        <div className="detail-image">
          {imageOf(product) ? (
            <img src={imageOf(product)} alt={product.name} />
          ) : (
            <span className="detail-letter">{product.name.slice(0, 1)}</span>
          )}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {product.categories?.[0] || "Everyday essentials"}
          </span>
          <h1>{product.name}</h1>
          <strong className="detail-price">{formatCurrency(price)}</strong>
          <p className="detail-description">
            {product.description && product.description !== "none"
              ? product.description
              : "A thoughtfully selected piece for everyday rituals. Made to be useful, beautiful, and easy to live with."}
          </p>
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
          <div className="detail-notes">
            <span>
              <Check size={16} /> Available to order
            </span>
            <span>
              <Check size={16} /> Cash on delivery available
            </span>
          </div>
        </div>
      </main>
    </StorefrontFrame>
  );
}

export function CartStorefront({ settings }: { settings?: PublicSettings }) {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const subtotal = items.reduce(
    (total, item) => total + priceOf(item) * item.quantity,
    0,
  );
  return (
    <StorefrontFrame settings={settings}>
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
                    {formatCurrency(priceOf(item) * item.quantity)}
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
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div>
                <span>Delivery</span>
                <strong>Calculated at checkout</strong>
              </div>
              <hr />
              <div className="cart-total">
                <span>Total</span>
                <strong>{formatCurrency(subtotal)}</strong>
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
}: {
  initialPaymentMethods?: any[];
  settings?: PublicSettings;
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
  const [error, setError] = useState("");
  const subtotal = items.reduce(
    (total, item) => total + priceOf(item) * item.quantity,
    0,
  );
  useEffect(() => {
    track(
      "checkout_started",
      { value: subtotal, contentIds: items.map((item) => item.product.id) },
      "storefront-checkout-started",
    );
  }, []);
  if (!items.length)
    return (
      <StorefrontFrame settings={settings}>
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
    <StorefrontFrame settings={settings}>
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
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="01XXXXXXXXX"
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
              <input
                value={form.zone}
                onChange={(event) =>
                  setForm({ ...form, zone: event.target.value })
                }
                placeholder="Your area"
              />
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
                <strong>{formatCurrency(priceOf(item) * item.quantity)}</strong>
              </div>
            ))}
            <hr />
            <div className="checkout-line">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="checkout-line">
              <span>Delivery</span>
              <strong>To be confirmed</strong>
            </div>
            <div className="checkout-total">
              <span>Total</span>
              <strong>{formatCurrency(subtotal)}</strong>
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
