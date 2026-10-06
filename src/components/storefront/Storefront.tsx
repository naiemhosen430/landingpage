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
import type { HomePageContent } from "@/store/homePageApi";
import type { Product } from "./types";

interface SharedStorefrontProps {
  settings?: PublicSettings;
  categories?: ApiCategory[];
  currency?: string;
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
          <Link href="/" className="store-footer-logo" aria-label={`${storeName} home`}>
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
            <p>Secure checkout<br />Your information is protected</p>
          </div>
        </div>
      </div>
      <div className="store-footer-bottom">
        <span>© {new Date().getFullYear()} {storeName}. All rights reserved.</span>
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

function StoreBanners({
  banners,
}: {
  banners: HomePageContent["banners"];
}) {
  const visibleBanners = banners.items
    .filter((banner) => banner.isActive && banner.imageUrl)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!visibleBanners.length) return null;

  return (
    <section className="store-promo-section" aria-label={banners.title || "Featured promotions"}>
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
  const storefrontCategories =
    categories.length > 0
      ? categories
      : (initialHomePage?.categories ?? []).map((category) => ({
          id: category.id,
          name: category.label,
          slug: category.id,
          sortOrder: 0,
          isActive: true,
        }));
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
    categories: storefrontCategories,
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
  }, [heroSlides.length, initialHomePage?.hero?.autoplay, initialHomePage?.hero?.intervalMs]);
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
        limit: section.limit,
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
        }))
      : (initialHomePage?.categories ?? []).map((category) => ({
          id: category.id,
          name: category.label,
        }));
  const showBestsellers =
    initialHomePage?.visibility?.bestsellers !== false;
  const showCategoryProducts =
    initialHomePage?.visibility?.categoryProducts !== false;
  const showHero = initialHomePage?.visibility?.hero !== false;
  const showBanners = initialHomePage?.visibility?.banners !== false;

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
          <div
            className="storefront-feature"
          >
            <aside className="store-category-sidebar">
              <h1>Categories</h1>
              <button
                type="button"
                className={selectedCategory === "all" ? "is-selected" : ""}
                onClick={() => setSelectedCategory("all")}
              >
                All categories <span aria-hidden="true">›</span>
              </button>
              {sidebarCategories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={
                    selectedCategory === category.id ||
                    selectedCategory === category.name
                      ? "is-selected"
                      : ""
                  }
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} <span aria-hidden="true">›</span>
                </button>
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
                  setSelectedCategory("all");
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
        </div>
      </main>

      <StorefrontFooter settings={settings} categories={categories} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        currency={currency}
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

interface ProductDetailStorefrontProps extends SharedStorefrontProps {
  slug: string;
  initialProduct?: Product | null;
}

export function ProductDetailStorefront({
  slug,
  initialProduct,
  settings,
  categories = [],
}: ProductDetailStorefrontProps) {
  const storefront = useStorefront({
    initialProducts: initialProduct ? [initialProduct] : [],
    categories,
  });
  const product = initialProduct;
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
  const isOutOfStock =
    (selectedVariant?.stock ?? product?.stock) !== undefined &&
    (selectedVariant?.stock ?? product?.stock ?? 0) <= 0;
  const image =
    product?.images && Array.isArray(product.images)
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0]?.secureUrl || product.images[0]?.url
      : typeof product?.images === "string"
        ? product.images
        : product?.thumbnailImage?.secureUrl || product?.thumbnailImage?.url;

  return (
    <div className="storefront-shell">
      <StorefrontHeader settings={settings} categories={categories} />
      <main className="storefront-main store-product-detail">
        {product ? (
          <>
            <div className="store-product-detail-image">
              <img src={image || "/placeholder-product.png"} alt={product.name} />
            </div>
            <div className="store-product-detail-copy">
              <p className="store-product-detail-category">
                {product.categories?.[0] || "Collection"}
              </p>
              <h1>{product.name}</h1>
              <p className="store-product-detail-price">
                {formatCurrency(
                  selectedVariant?.price ?? product.price,
                  settings?.store?.currency,
                )}
              </p>
              {product.description && <p>{product.description}</p>}
              {activeVariants.length > 0 && (
                <label className="store-product-variant">
                  <span>Choose an option</span>
                  <select
                    value={selectedVariantId}
                    onChange={(event) =>
                      setSelectedVariantId(event.target.value)
                    }
                  >
                    {activeVariants.map((variant, index) => {
                      const key = getVariantKey(variant, index);
                      return (
                      <option key={key} value={key}>
                        {variant.name || "Option"}
                        {typeof variant.price === "number"
                          ? ` — ${formatCurrency(variant.price, settings?.store?.currency)}`
                          : ""}
                      </option>
                      );
                    })}
                  </select>
                </label>
              )}
              {isOutOfStock && (
                <p className="store-stock-status">Out of stock</p>
              )}
              <button
                type="button"
                className="store-primary-link"
                disabled={isOutOfStock}
                onClick={() =>
                  storefront.handleAddToCart(
                    product,
                    selectedVariant?.id,
                  )
                }
              >
                {isOutOfStock
                  ? "Out of stock"
                  : "Add to cart"}
              </button>
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
        <span className="sr-only">{slug}</span>
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
