import type { CartProduct } from "@/store/cartSlice";

// Image representation used in API responses and components
export type ImageType = {
  url?: string;
  secureUrl?: string;
};

// Core Product type extending your Redux CartProduct definition
export type Product = CartProduct & {
  description?: string;
  shortDescription?: string;
  images?: Array<ImageType | string>;
  categories?: string[];
  tags?: string[];
  isFeatured?: boolean;
  salesCount?: number;
  createdAt?: string;
  isActive?: boolean;
  compareAtPrice?: number;
  discountPercent?: number;
};

// Category model returned by fetchPublicCategories
export type Category = {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: ImageType | string | null;
};

// Home page banner and content configuration from fetchPublicHomePage
export type HomePageData = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaText?: string;
  heroImageUrl?: string;
  featuredCategoryIds?: string[];
};

// General storefront configuration from fetchPublicStoreSettings
export type StoreSettings = {
  storeName?: string;
  currency?: string;
  logoUrl?: string;
  contactEmail?: string;
  socialLinks?: Record<string, string>;
};

// Analytics event types for tracking user actions
export type TrackingEventType =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "checkout_started";
