export type LandingPage = {
  id: string;
  projectId: string;
  pageName: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  landingContent: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
};

export type PublicLandingPageData = {
  project?: {
    id: string;
    name: string;
    status: string;
    subscriptionStatus: string;
  };
  landingPage: LandingPage;
  deliveryArea?: PublicDeliveryArea | null;
  paymentMethods?: PublicPaymentMethod[];
  products: Array<{
    id: string;
    name: string;
    price: number;
    stock?: number;
    isActive?: boolean;
    thumbnailImage?: { url?: string; secureUrl?: string };
    slug?: string;
    variants?: unknown[];
    images?: unknown[];
    categories?: string[];
    tags?: string[];
  }>;
};

export type PublicDeliveryArea = {
  id?: string;
  name?: string;
  deliveryCharge?: number;
  price?: number;
  zones?: Array<{ zone: string; price: number }>;
  isActive?: boolean;
};

export type PublicPaymentMethod = {
  id: string;
  code: string;
  name: string;
  description?: string;
  instructions?: string;
  details?: Record<string, string>;
  isActive?: boolean;
  sortOrder?: number;
};

export type CheckoutItemData = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export function getCheckoutItems(
  products: PublicLandingPageData["products"] = [],
): CheckoutItemData[] {
  return products
    .filter((product) => product.isActive !== false && (product.stock ?? 1) > 0)
    .map((product) => ({
      productId: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      quantity: 1,
      image: product.thumbnailImage?.secureUrl ?? product.thumbnailImage?.url,
    }));
}

const apiBase = process.env.NEXT_PUBLIC_API_URL;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectKey = process.env.NEXT_PUBLIC_PROJECT_KEY;

export async function fetchPublicLandingPage(
  slug: string,
): Promise<PublicLandingPageData | null> {
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_URL must be defined");
  }

  try {
    const res = await fetch(
      `${apiBase}/public/v1/landing-pages/${encodeURIComponent(slug)}`,
      {
        headers: {
          "x-project-id": projectId ?? "",
          "x-project-key": projectKey ?? "",
        },
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json?.data ?? null;
  } catch (error) {
    // Handle network errors gracefully (e.g., during build time when API is unavailable)
    console.error("Failed to fetch landing page:", error);
    return null;
  }
}
