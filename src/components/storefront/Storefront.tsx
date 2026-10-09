"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { CartDrawer } from "@/components/shared/CartDrawer";
import { Header } from "@/components/shared/Header";
import { HeroBanner } from "@/components/shared/HeroBanner";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductGrid } from "@/components/shared/ProductGrid";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import type {
  PublicDeliveryArea,
  PublicLandingPageData,
  PublicPaymentMethod,
} from "@/lib/landingPage";
import type { PublicSettings } from "@/store/publicApi";
import { useTrackAnalyticsEventMutation } from "@/store/publicApi";
import { trackStorefrontEvent } from "@/lib/tracking";
import type { Category as ApiCategory } from "@/store/categoryApi";
import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartTotalPrice,
  updateQuantity,
} from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useStorefront } from "@/hooks/useStorefront";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatWhatsAppPhoneNumber } from "@/lib/whatsapp";
import type { HomePageContent } from "@/store/homePageApi";
import type { Product } from "./types";

interface SharedStorefrontProps {
  settings?: PublicSettings;
  categories?: ApiCategory[];
  currency?: string;
}

function getEnabledPixelIds(settings?: PublicSettings) {
  return {
    facebookPixelId: settings?.store?.socialTracking?.facebook?.enabled
      ? settings.store.socialTracking.facebook.pixelId
      : undefined,
    tiktokPixelId: settings?.store?.socialTracking?.tiktok?.enabled
      ? settings.store.socialTracking.tiktok.pixelId
      : undefined,
  };
}

export interface StorefrontProps extends SharedStorefrontProps {
  initialProducts?: Product[];
  initialHomePage?: HomePageContent;
}

function StorefrontFooter({
  settings,
  categories = [],
}: SharedStorefrontProps) {
  const storeName =
    settings?.branding?.storeName ||
    settings?.store?.storeName ||
    settings?.store?.name ||
    "Store";
  const email = settings?.contact?.email;
  const phone = settings?.contact?.phone;
  const logo =
    settings?.branding?.logoUrl ||
    settings?.branding?.logo ||
    settings?.store?.logoUrl ||
    settings?.store?.logo;

  return (
    <footer className="store-footer">
      <div className="store-footer-main">
        <div className="store-footer-brand">
          <Link
            href="/"
            className="store-footer-logo"
            aria-label={`${storeName} home`}
          >
            {logo ? <img src={logo} alt={storeName} /> : storeName}
          </Link>
          <p>
            {settings?.store?.description ||
              "Thoughtfully selected products, made to bring something special to your everyday."}
          </p>
          <div className="store-social-links" aria-label="Social links">
            {Object.entries(settings?.contact?.socialLinks ?? {})
              .filter(([, url]) => Boolean(url))
              .slice(0, 3)
              .map(([network, url]) => (
                <a
                  key={network}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={network}
                >
                  {network.slice(0, 1).toUpperCase()}
                </a>
              ))}
          </div>
        </div>
        <div className="store-footer-column">
          <h2>Quick Pages</h2>
          <Link href="/products">Shop all products</Link>
          <Link href="/cart">Shopping cart</Link>
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.slug)}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="store-footer-column">
          <h2>Store information</h2>
          <p>{settings?.store?.announcement || "Shop with confidence."}</p>
          <p>Secure checkout and customer support for every order.</p>
        </div>
        <div className="store-footer-column store-footer-contact">
          <h2>Customer Care</h2>
          <p>Questions? We are happy to help.</p>
          {phone && <a href={`tel:${phone}`}>{phone}</a>}
          {email && <a href={`mailto:${email}`}>{email}</a>}
          <div className="store-footer-support">
            <span aria-hidden="true">✓</span>
            <p>
              Secure checkout
              <br />
              Your information is protected
            </p>
          </div>
        </div>
      </div>
      <div className="store-footer-bottom">
        <span>
          © {new Date().getFullYear()} {storeName}. All rights reserved.
        </span>
        <span>Powered by Zane</span>
      </div>
    </footer>
  );
}

export { StorefrontFooter };

function storefrontStyle(settings?: PublicSettings): CSSProperties | undefined {
  const primaryColor = settings?.branding?.primaryColor;
  return primaryColor
    ? ({ "--store-teal": primaryColor } as CSSProperties)
    : undefined;
}

export function StorefrontHeader(props: SharedStorefrontProps) {
  return <Header settings={props.settings} categories={props.categories} />;
}

type CategorySection = {
  title: string;
  eyebrow?: string;
  category?: ApiCategory;
  productIds?: string[];
  limit?: number;
};

function matchCategory(product: Product, category: ApiCategory) {
  const categoryValues = new Set(
    [category.id, category.slug, category.name]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.toLowerCase()),
  );
  return (product.categories ?? []).some((value) =>
    categoryValues.has(value.toLowerCase()),
  );
}

function productsForSection(
  products: Product[],
  section: CategorySection,
): Product[] {
  const category = section.category;
  const filtered = section.productIds?.length
    ? products
    : category
      ? products.filter((product) => matchCategory(product, category))
      : products;

  if (section.productIds?.length) {
    const byId = new Map(
      filtered.map((product) => [product.id || product._id || "", product]),
    );
    return section.productIds
      .map((id) => byId.get(id))
      .filter((product): product is Product => Boolean(product))
      .slice(0, section.limit || 10);
  }

  return filtered.slice(0, section.limit || 10);
}

function ProductSection({
  title,
  eyebrow,
  viewAllLabel,
  products,
  category,
  currency,
  onAddToCart,
}: {
  title: string;
  eyebrow?: string;
  viewAllLabel?: string;
  products: Product[];
  category?: ApiCategory;
  currency?: string;
  onAddToCart: (product: Product) => void;
}) {
  if (!products.length) return null;

  const href = category?.slug
    ? `/products?category=${encodeURIComponent(category.slug)}`
    : "/products";

  return (
    <section className="store-product-section">
      <div className="store-section-heading">
        <div>
          {eyebrow && <span className="store-section-eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
        </div>
        <Link href={href}>
          {viewAllLabel || "View more"} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="store-product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
            currency={currency}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

function AllProductsSection({
  products,
  currency,
  onAddToCart,
}: {
  products: Product[];
  currency?: string;
  onAddToCart: (product: Product) => void;
}) {
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(products.length / pageSize);
  const pageProducts = products.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [products.length]);

  if (!products.length) return null;

  return (
    <section className="store-product-section" aria-label="All products">
      <div className="store-section-heading">
        <div>
          <span className="store-section-eyebrow">Explore the collection</span>
          <h2>All products</h2>
        </div>
        <Link href="/products">
          Shop all <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="store-product-grid">
        {pageProducts.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
            currency={currency}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      {pageCount > 1 && (
        <nav
          className="store-product-pagination"
          aria-label="All products pages"
        >
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Previous products"
          >
            Previous
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
            disabled={page === pageCount}
            aria-label="Next products"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

function StoreBanners({ banners }: { banners: HomePageContent["banners"] }) {
  const visibleBanners = banners.items
    .filter((banner) => banner.isActive && banner.imageUrl)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!visibleBanners.length) return null;

  return (
    <section
      className="store-promo-section"
      aria-label={banners.title || "Featured promotions"}
    >
      {(banners.eyebrow || banners.title) && (
        <div className="store-section-heading">
          <h2>{banners.title || banners.eyebrow}</h2>
        </div>
      )}
      <div className="store-promo-grid">
        {visibleBanners.map((banner) => {
          const content = (
            <>
              <img src={banner.imageUrl} alt={banner.imageAlt} loading="lazy" />
              {(banner.eyebrow || banner.title) && (
                <span className="store-promo-caption">
                  {banner.eyebrow && <small>{banner.eyebrow}</small>}
                  {banner.title && <strong>{banner.title}</strong>}
                </span>
              )}
            </>
          );
          return banner.href ? (
            <Link
              className="store-promo-card"
              key={banner.id}
              href={banner.href}
            >
              {content}
            </Link>
          ) : (
            <div className="store-promo-card" key={banner.id}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Storefront({
  initialProducts = [],
  initialHomePage,
  settings,
  categories = [],
}: StorefrontProps) {
  const router = useRouter();
  const {
    products,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    handleCheckout,
  } = useStorefront({
    initialProducts,
    ...getEnabledPixelIds(settings),
    categories:
      categories.length > 0
        ? categories
        : (initialHomePage?.categories ?? []).map((category) => ({
            id: category.id,
            name: category.label,
            slug: category.id,
            sortOrder: 0,
            isActive: true,
          })),
  });

  const slides = initialHomePage?.hero?.slides ?? [];
  const activeSlides = slides.filter((slide) => slide.isActive);
  const heroSlides = activeSlides.length > 0 ? activeSlides : slides;
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = heroSlides[activeSlideIndex] ?? heroSlides[0];
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [heroSlides.length]);
  useEffect(() => {
    if (!initialHomePage?.hero?.autoplay || heroSlides.length < 2) return;
    const interval = Math.max(initialHomePage.hero.intervalMs, 1000);
    const timer = window.setInterval(() => {
      setActiveSlideIndex((current) => (current + 1) % heroSlides.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [
    heroSlides.length,
    initialHomePage?.hero?.autoplay,
    initialHomePage?.hero?.intervalMs,
  ]);

  const bestsellerIds = initialHomePage?.bestsellers?.productIds ?? [];
  const bestsellers = bestsellerIds.length
    ? productsForSection(products, {
        title: "",
        productIds: bestsellerIds,
        limit: initialHomePage?.bestsellers?.limit,
      })
    : [...products]
        .sort(
          (a, b) =>
            Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) ||
            (b.salesCount ?? 0) - (a.salesCount ?? 0),
        )
        .slice(0, initialHomePage?.bestsellers?.limit || 10);

  const configuredSections = (initialHomePage?.categoryProducts ?? []).map(
    (section) => ({
      section,
      category: categories.find(
        (category) =>
          category.id === section.categoryId ||
          category.slug === section.categoryId ||
          category.name === section.title,
      ),
    }),
  );
  const categorySections: CategorySection[] = configuredSections.length
    ? configuredSections.map(({ section, category }) => ({
        title: section.title,
        eyebrow: section.eyebrow,
        category,
        productIds: section.productIds,
        limit: Math.min(section.limit || 10, 10),
      }))
    : categories.map((category) => ({
        title: category.name,
        category,
        limit: 10,
      }));
  const currency = settings?.store?.currency;
  const sidebarCategories =
    categories.length > 0
      ? categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
        }))
      : (initialHomePage?.categories ?? []).map((category) => ({
          id: category.id,
          name: category.label,
          slug: category.id,
        }));
  const showBestsellers = initialHomePage?.visibility?.bestsellers !== false;
  const showCategoryProducts =
    initialHomePage?.visibility?.categoryProducts !== false;
  const showHero = initialHomePage?.visibility?.hero !== false;
  const showBanners = initialHomePage?.visibility?.banners !== false;
  const showAllProducts = initialHomePage?.visibility?.allProducts !== false;

  return (
    <div className="storefront-shell" style={storefrontStyle(settings)}>
      <Header
        settings={settings}
        categories={categories}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="storefront-main">
        {showHero && (
          <div className="storefront-feature">
            <aside className="store-category-sidebar">
              <h1>Categories</h1>
              <Link
                href="/products"
                className={selectedCategory === "all" ? "is-selected" : ""}
              >
                All categories <span aria-hidden="true">›</span>
              </Link>
              {sidebarCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.slug || category.id)}`}
                  className={
                    selectedCategory === category.id ||
                    selectedCategory === category.name
                      ? "is-selected"
                      : ""
                  }
                >
                  {category.name} <span aria-hidden="true">›</span>
                </Link>
              ))}
            </aside>
            <HeroBanner
              title={activeSlide?.title || ""}
              subtitle={activeSlide?.description || ""}
              ctaText={activeSlide?.buttonLabel || "Shop the Collection"}
              imageUrl={activeSlide?.imageUrl}
              paginationCount={heroSlides.length}
              activePage={activeSlideIndex}
              onSelectPage={setActiveSlideIndex}
              onCtaClick={() => {
                const target = activeSlide?.buttonHref?.trim();
                if (!target || target === "#") {
                  router.push("/products");
                } else if (target.startsWith("/")) {
                  router.push(target);
                } else {
                  window.location.assign(target);
                }
              }}
            />
          </div>
        )}

        <div className="storefront-sections">
          {showBanners && initialHomePage?.banners && (
            <StoreBanners banners={initialHomePage.banners} />
          )}
          {showBestsellers && (
            <ProductSection
              title={initialHomePage?.bestsellers?.title || "Best Selling"}
              products={bestsellers}
              currency={currency}
              viewAllLabel={initialHomePage?.bestsellers?.viewAllLabel}
              onAddToCart={handleAddToCart}
            />
          )}
          {showCategoryProducts &&
            categorySections.map((section, index) => {
              const sectionProducts = productsForSection(products, section);
              return (
                <ProductSection
                  key={`${section.category?.id || section.title}-${index}`}
                  title={section.title}
                  eyebrow={section.eyebrow}
                  products={sectionProducts}
                  category={section.category}
                  currency={currency}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          {showAllProducts && (
            <AllProductsSection
              products={products}
              currency={currency}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </main>

      <StorefrontFooter settings={settings} categories={categories} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        currency={settings?.store?.currency}
      />
    </div>
  );
}

interface CatalogStorefrontProps extends SharedStorefrontProps {
  initialProducts?: Product[] | null;
  initialCategory?: string;
  initialSearch?: string;
}

export function CatalogStorefront({
  initialProducts = [],
  initialCategory = "all",
  initialSearch = "",
  settings,
  categories = [],
}: CatalogStorefrontProps) {
  const storefront = useStorefront({
    initialProducts: initialProducts ?? [],
    ...getEnabledPixelIds(settings),
    categories,
    initialCategory,
    initialSearch,
  });

  return (
    <div className="storefront-shell" style={storefrontStyle(settings)}>
      <Header
        settings={settings}
        categories={categories}
        searchTerm={storefront.searchTerm}
        onSearchChange={storefront.setSearchTerm}
        onOpenCart={() => storefront.setIsCartOpen(true)}
      />
      <main className="storefront-main store-catalog-main">
        <h1 className="store-catalog-title">Shop all products</h1>
        <ProductGrid
          products={storefront.products}
          categories={storefront.categories}
          selectedCategory={storefront.selectedCategory}
          onSelectCategory={storefront.setSelectedCategory}
          isLoading={storefront.isLoading}
          currency={settings?.store?.currency}
          onAddToCart={storefront.handleAddToCart}
        />
      </main>
      <StorefrontFooter settings={settings} categories={categories} />
      <CartDrawer
        isOpen={storefront.isCartOpen}
        onClose={() => storefront.setIsCartOpen(false)}
        onCheckout={storefront.handleCheckout}
        currency={settings?.store?.currency}
      />
    </div>
  );
}

export function CartStorefront(props: SharedStorefrontProps) {
  const items = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotalPrice);
  const dispatch = useAppDispatch();

  return (
    <div className="storefront-shell" style={storefrontStyle(props.settings)}>
      <StorefrontHeader {...props} />
      <main className="storefront-main store-cart-main">
        <h1>Your shopping cart</h1>
        {items.length ? (
          <div className="store-cart-list">
            {items.map((item) => (
              <article
                key={`${item.product?.id || item.id}-${item.variantId || ""}`}
                className="store-cart-item"
              >
                <img
                  src={
                    item.product?.thumbnailImage?.secureUrl ||
                    item.product?.thumbnailImage?.url ||
                    item.image ||
                    "/placeholder-product.png"
                  }
                  alt={item.product?.name || item.name || "Product"}
                />
                <div>
                  <h2>{item.product?.name || item.name}</h2>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <strong>
                  {formatCurrency(
                    (item.product?.price ?? item.price ?? 0) * item.quantity,
                    props.settings?.store?.currency,
                  )}
                </strong>
                <div className="store-cart-item-actions">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.product?.name || item.name}`}
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.product?.id || item.id || "",
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
                    type="button"
                    aria-label={`Increase quantity of ${item.product?.name || item.name}`}
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.product?.id || item.id || "",
                          variantId: item.variantId,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    className="store-cart-remove"
                    aria-label={`Remove ${item.product?.name || item.name}`}
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: item.product?.id || item.id || "",
                          variantId: item.variantId,
                        }),
                      )
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
            <div className="store-cart-total">
              <span>Subtotal</span>
              <strong>
                {formatCurrency(cartTotal, props.settings?.store?.currency)}
              </strong>
            </div>
            <Link className="store-primary-link" href="/checkout">
              Continue to checkout
            </Link>
          </div>
        ) : (
          <div className="store-empty-cart">
            <p>Your cart is empty.</p>
            <Link className="store-primary-link" href="/products">
              Continue shopping
            </Link>
          </div>
        )}
      </main>
      <StorefrontFooter {...props} />
    </div>
  );
}

interface CheckoutStorefrontProps extends SharedStorefrontProps {
  initialPaymentMethods?: PublicPaymentMethod[];
  initialDeliveryArea?: PublicDeliveryArea;
}

export function CheckoutStorefront({
  initialPaymentMethods = [],
  initialDeliveryArea,
  settings,
  categories = [],
}: CheckoutStorefrontProps) {
  const items = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();
  const products: PublicLandingPageData["products"] = items.map(
    ({ product }) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      thumbnailImage: product.thumbnailImage,
      slug: product.slug,
      variants: product.variants,
      isActive: true,
    }),
  );

  return (
    <div className="storefront-shell" style={storefrontStyle(settings)}>
      <StorefrontHeader settings={settings} categories={categories} />
      <main className="storefront-main store-checkout-main">
        {items.length ? (
          <CheckoutForm
            products={products}
            paymentMethods={initialPaymentMethods}
            deliveryArea={initialDeliveryArea}
            currency={settings?.store?.currency}
            facebookPixelId={getEnabledPixelIds(settings).facebookPixelId}
            tiktokPixelId={getEnabledPixelIds(settings).tiktokPixelId}
            onClear={() => dispatch(clearCart())}
          />
        ) : (
          <div className="store-empty-cart">
            <h1>Your cart is empty.</h1>
            <Link className="store-primary-link" href="/products">
              Browse products
            </Link>
          </div>
        )}
      </main>
      <StorefrontFooter settings={settings} categories={categories} />
    </div>
  );
}

import {
  Star,
  CheckCircle2,
  ShoppingBag,
  ShoppingCart,
  Phone,
  Clock,
} from "lucide-react";

interface ProductDetailStorefrontProps extends SharedStorefrontProps {
  slug: string;
  initialProduct?: Product | null;
  relatedProducts?: Product[];
}

export function ProductDetailStorefront({
  slug,
  initialProduct,
  relatedProducts = [],
  settings,
  categories = [],
}: ProductDetailStorefrontProps) {
  const router = useRouter();
  const storefront = useStorefront({
    initialProducts: initialProduct ? [initialProduct] : [],
    categories,
    ...getEnabledPixelIds(settings),
  });
  const [trackAnalyticsEvent] = useTrackAnalyticsEventMutation();
  const product = initialProduct;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "delivery">(
    "description",
  );

  const activeVariants = (product?.variants ?? []).filter(
    (variant) => variant.isActive !== false,
  );
  const getVariantKey = (
    variant: NonNullable<Product["variants"]>[number],
    index: number,
  ) => variant.id || variant.name || String(index);

  const [selectedVariantId, setSelectedVariantId] = useState(
    activeVariants[0] ? getVariantKey(activeVariants[0], 0) : "",
  );
  const selectedVariant = activeVariants.find(
    (variant, index) => getVariantKey(variant, index) === selectedVariantId,
  );

  const currentPrice = selectedVariant?.price ?? product?.price ?? 0;
  const isOutOfStock =
    (selectedVariant?.stock ?? product?.stock) !== undefined &&
    (selectedVariant?.stock ?? product?.stock ?? 0) <= 0;

  const galleryImages = product
    ? [
        ...(Array.isArray(product.images)
          ? product.images.map((item) =>
              typeof item === "string" ? item : item.secureUrl || item.url,
            )
          : typeof product.images === "string"
            ? [product.images]
            : []),
        product.thumbnailImage?.secureUrl || product.thumbnailImage?.url,
      ].filter(
        (url, index, all): url is string =>
          Boolean(url) && all.indexOf(url) === index,
      )
    : [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const productId = product.id || product._id || slug;
    const imagePrice = Number(product.price) || 0;
    const url = window.location.href;
    trackStorefrontEvent(
      {
        eventType: "product_view",
        eventName: "view_content",
        url,
        payload: {
          contentIds: [productId],
          contentName: product.name,
          contentType: "product",
          contents: [
            {
              id: productId,
              content_name: product.name,
              quantity: 1,
              item_price: imagePrice,
            },
          ],
          value: imagePrice,
          currency: "BDT",
          event_source_url: url,
        },
      },
      `product-detail-view-${productId}`,
      (event) => {
        void trackAnalyticsEvent(event);
      },
    );
  }, [product, slug, trackAnalyticsEvent]);

  const mainImage =
    galleryImages[activeImageIndex] || "/placeholder-product.png";
  const whatsappPhone = formatWhatsAppPhoneNumber(settings?.contact?.phone);

  return (
    <div className="storefront-shell">
      <Header settings={settings} categories={categories} />
      <main className="storefront-main custom-product-detail-layout">
        {product ? (
          <>
            {/* Top Grid: Main Image & Details */}
            <div className="p-detail-top-grid">
              {/* Media Gallery */}
              <div className="p-detail-media">
                <div className="p-detail-main-img-box">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="p-detail-main-img"
                  />
                </div>
                {galleryImages.length > 1 && (
                  <div
                    className="p-detail-thumbs"
                    aria-label="Product thumbnails"
                  >
                    {galleryImages.map((galleryImage, index) => (
                      <button
                        type="button"
                        key={galleryImage}
                        className={`p-detail-thumb-btn ${
                          index === activeImageIndex ? "is-active" : ""
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={galleryImage} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Purchase Actions */}
              <div className="p-detail-info">
                {product.categories?.[0] && (
                  <div className="p-detail-sku">
                    <span>CATEGORY:</span>{" "}
                    <strong>{product.categories[0]}</strong>
                  </div>
                )}
                <h1 className="p-detail-title">{product.name}</h1>

                <div className="p-detail-rating">
                  <div className="p-stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span className="p-detail-in-stock">
                    <CheckCircle2 size={16} color="#10b981" />{" "}
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                  </span>
                </div>

                <div className="p-detail-price-box">
                  <span className="p-detail-price-label">Price:</span>
                  <div className="p-detail-prices">
                    <span className="p-detail-current-price">
                      {formatCurrency(currentPrice, settings?.store?.currency)}
                    </span>
                  </div>
                </div>

                {activeVariants.length > 0 && (
                  <fieldset className="p-detail-variant-box">
                    <legend>Choose Option:</legend>
                    <div className="p-detail-variant-options">
                      {activeVariants.map((variant, index) => {
                        const key = getVariantKey(variant, index);
                        return (
                          <label
                            className={`p-detail-variant-option ${
                              selectedVariantId === key ? "is-selected" : ""
                            }`}
                            key={key}
                          >
                            <input
                              type="radio"
                              name={`product-variant-${product.id || product._id || slug}`}
                              value={key}
                              checked={selectedVariantId === key}
                              onChange={() => setSelectedVariantId(key)}
                            />
                            <span className="p-detail-variant-option-copy">
                              <span>{variant.name || "Option"}</span>
                              {typeof variant.price === "number" && (
                                <strong>
                                  {formatCurrency(
                                    variant.price,
                                    settings?.store?.currency,
                                  )}
                                </strong>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <div className="p-detail-qty-box">
                  <label>QUANTITY:</label>
                  <div className="p-detail-qty-controls">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <Minus size={14} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-detail-actions-primary">
                  <button
                    type="button"
                    className="p-btn-order-now"
                    disabled={isOutOfStock}
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) {
                        storefront.handleAddToCart(
                          product,
                          selectedVariant?.id,
                        );
                      }
                      router.push("/checkout");
                    }}
                  >
                    <ShoppingBag size={18} /> Order Now
                  </button>
                  <button
                    type="button"
                    className="p-btn-add-cart"
                    disabled={isOutOfStock}
                    onClick={() => {
                      for (let i = 0; i < quantity; i++) {
                        storefront.handleAddToCart(
                          product,
                          selectedVariant?.id,
                        );
                      }
                    }}
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>

                {whatsappPhone && (
                  <button
                    type="button"
                    className="p-btn-whatsapp"
                    onClick={() => {
                      const message = [
                        `Hi, I'm interested in ${product.name}.`,
                        `Quantity: ${quantity}`,
                        selectedVariant?.name
                          ? `Variant: ${selectedVariant.name}`
                          : undefined,
                        `Product: ${window.location.href}`,
                      ]
                        .filter(Boolean)
                        .join("\n");
                      window.open(
                        `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                  >
                    <Phone size={18} /> Order via WhatsApp
                  </button>
                )}
              </div>
            </div>

            {/* Description & Details Tab Section */}
            <div className="p-detail-tabs-container">
              <div className="p-detail-tab-buttons">
                <button
                  type="button"
                  className={`p-tab-btn ${
                    activeTab === "description" ? "is-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  type="button"
                  className={`p-tab-btn ${
                    activeTab === "delivery" ? "is-active" : ""
                  }`}
                  onClick={() => setActiveTab("delivery")}
                >
                  Delivery & Return
                </button>
              </div>

              {activeTab === "description" && (
                <div className="p-detail-tab-content">
                  {product.shortDescription && (
                    <p className="p-short-desc">{product.shortDescription}</p>
                  )}

                  {product.description && (
                    <div className="p-full-desc">
                      <h3>Product Description</h3>
                      <p>{product.description}</p>
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div className="p-tags-container">
                      <strong>Tags:</strong>
                      <div className="p-tags-list">
                        {product.tags.map((tag) => (
                          <span key={tag} className="p-tag-item">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "delivery" && (
                <div className="p-detail-tab-content">
                  <div className="p-delivery-info">
                    <Clock size={20} className="text-teal-600" />
                    <div>
                      <h3>Delivery Information</h3>
                      <p>
                        Standard delivery within 2-4 business days. Safe and
                        secure packaging guaranteed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="store-empty-cart">
            <h1>Product not found</h1>
            <Link className="store-primary-link" href="/products">
              Continue shopping
            </Link>
          </div>
        )}
      </main>

      {/* Related Products Grid */}
      {product && relatedProducts.length > 0 && (
        <section className="store-related-products custom-related-wrapper">
          <div className="store-related-products-heading">
            <div>
              <span className="store-section-eyebrow">EXPLORE MORE</span>
              <h2>Related Products</h2>
            </div>
            <Link href="/products">View all</Link>
          </div>
          <div className="store-product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id || relatedProduct._id}
                product={relatedProduct}
                currency={settings?.store?.currency}
                onAddToCart={storefront.handleAddToCart}
              />
            ))}
          </div>
        </section>
      )}

      <StorefrontFooter settings={settings} categories={categories} />
      <CartDrawer
        isOpen={storefront.isCartOpen}
        onClose={() => storefront.setIsCartOpen(false)}
        onCheckout={storefront.handleCheckout}
        currency={settings?.store?.currency}
      />

      <style jsx>{`
        .custom-product-detail-layout {
          max-width: 1100px;
          margin: 0 auto;
          padding: 14px 2px;
        }
        .p-detail-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        @media (max-width: 768px) {
          .p-detail-top-grid {
            grid-template-columns: 1fr;
          }
        }
        .p-detail-media {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .p-detail-main-img-box {
          position: relative;
          background: #f9fafb;
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 1;
          border: 1px solid #f3f4f6;
        }
        .p-detail-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .p-detail-thumbs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }
        .p-detail-thumb-btn {
          width: 64px;
          height: 64px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
          background: none;
          cursor: pointer;
          padding: 0;
          flex-shrink: 0;
        }
        .p-detail-thumb-btn.is-active {
          border-color: #00a884;
          border-width: 2px;
        }
        .p-detail-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .p-detail-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .p-detail-sku {
          font-size: 12px;
          color: #6b7280;
        }
        .p-detail-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          line-height: 1.3;
        }
        .p-detail-rating {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .p-stars-row {
          display: flex;
          gap: 2px;
        }
        .p-detail-in-stock {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #10b981;
          font-size: 13px;
          font-weight: 600;
        }

        .p-detail-price-box {
          border: 1px solid #e5e7eb;
          padding: 12px 16px;
          border-radius: 6px;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .p-detail-price-label {
          font-size: 12px;
          color: #6b7280;
        }
        .p-detail-current-price {
          font-size: 26px;
          font-weight: 800;
          color: #00a884;
        }

        .p-detail-variant-box {
          border: 0;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .p-detail-variant-box legend {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          padding: 0;
        }
        .p-detail-variant-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .p-detail-variant-option {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
          padding: 9px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease;
        }
        .p-detail-variant-option.is-selected {
          border-color: #00a884;
          background: #ecfdf5;
        }
        .p-detail-variant-option input {
          accent-color: #00a884;
          margin: 0;
        }
        .p-detail-variant-option-copy {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 13px;
        }
        .p-detail-variant-option-copy strong {
          font-size: 12px;
          color: #00a884;
        }

        .p-detail-qty-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .p-detail-qty-box label {
          font-size: 12px;
          color: #374151;
          font-weight: 600;
        }
        .p-detail-qty-controls {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          width: fit-content;
          overflow: hidden;
        }
        .p-detail-qty-controls button {
          padding: 8px 16px;
          background: #f9fafb;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-detail-qty-controls span {
          padding: 8px 16px;
          font-weight: 600;
          font-size: 14px;
        }

        .p-detail-actions-primary {
          display: flex;
          gap: 12px;
        }
        .p-btn-order-now {
          flex: 1;
          background: #00a884;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .p-btn-add-cart {
          flex: 1;
          background: #f3f4f6;
          color: #1f2937;
          border: 1px solid #d1d5db;
          padding: 12px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .p-btn-whatsapp {
          background: #25d366;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Tab Details */
        .p-detail-tabs-container {
          margin-top: 32px;
          background: #fff;
          border-radius: 8px;
          padding: 24px;
          border: 1px solid #e5e7eb;
        }
        .p-detail-tab-buttons {
          display: flex;
          gap: 12px;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 20px;
        }
        .p-tab-btn {
          padding: 12px 16px;
          border: none;
          background: none;
          font-weight: 700;
          color: #6b7280;
          cursor: pointer;
          border-bottom: 3px solid transparent;
        }
        .p-tab-btn.is-active {
          color: #00a884;
          border-bottom-color: #00a884;
        }
        .p-short-desc {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .p-full-desc h3 {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }
        .p-full-desc p {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          white-space: pre-line;
        }
        .p-tags-container {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        .p-tags-list {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .p-tag-item {
          background: #f3f4f6;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #374151;
        }

        .p-delivery-info {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          background: #f9fafb;
          padding: 16px;
          border-radius: 6px;
        }
        .p-delivery-info h3 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .p-delivery-info p {
          font-size: 13px;
          color: #6b7280;
        }

        .custom-related-wrapper {
          max-width: 1100px;
          margin: 32px auto 0 auto;
        }
      `}</style>
    </div>
  );
}
