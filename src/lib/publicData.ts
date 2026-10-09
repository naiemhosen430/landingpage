import type { HomePageContent } from "@/store/homePageApi";
import type { PublicDeliveryPrice, PublicSettings } from "@/store/publicApi";
import type { Category } from "@/store/categoryApi";
import type { ImageType, Product } from "@/components/storefront/types";
import type {
  PublicDeliveryArea,
  PublicPaymentMethod,
} from "@/lib/landingPage";
import { readPublicJsonResponse } from "@/lib/publicResponse";

const apiBase = process.env.NEXT_PUBLIC_API_URL;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectKey = process.env.NEXT_PUBLIC_PROJECT_KEY;

async function fetchPublic<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_URL must be defined");
  }

  try {
    const response = await fetch(`${apiBase}${path}`, {
      ...init,
      headers: {
        "x-project-id": projectId ?? "",
        "x-project-key": projectKey ?? "",
        ...init?.headers,
      },
      next: { revalidate: 60 },
    });

    const json = await readPublicJsonResponse(response, path);
    if (json === null) return null;
    const data = isRecord(json) ? json.data : undefined;
    const nestedData = isRecord(data) ? data.data : undefined;
    return (nestedData ?? data ?? json) as T;
  } catch (error) {
    console.error(`Failed to fetch public data from ${path}:`, error);
    throw error;
  }
}

export function fetchPublicProducts(
  params: Record<string, string | number> = {},
) {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  );
  return fetchPublic<unknown>(`/public/v1/products?${query.toString()}`).then(
    (response): Product[] | null => {
      if (response === null) return null;
      const values = Array.isArray(response)
        ? response
        : isRecord(response) && Array.isArray(response.data)
          ? response.data
          : null;

      if (!values) {
        console.error("Unexpected public products response shape");
        return null;
      }

      const products = values.flatMap((value) => {
        const product = normalizePublicProduct(value);
        return product ? [product] : [];
      });
      if (products.length !== values.length) {
        console.error(
          `Skipped ${values.length - products.length} public product record(s) with invalid data`,
        );
      }
      return products;
    },
  );
}

export function fetchPublicProduct(slug: string) {
  return fetchPublic<unknown>(
    `/public/v1/products/${encodeURIComponent(slug)}`,
  ).then(normalizePublicProduct);
}

export function fetchPublicHomePage() {
  return fetchPublic<HomePageContent>("/public/v1/home-page");
}

export function fetchPublicCategories() {
  return fetchPublic<Category[]>("/public/v1/categories");
}

export function fetchPublicPaymentMethods() {
  return fetchPublic<PublicPaymentMethod[]>("/public/v1/payment-methods");
}

export function fetchPublicDeliveryArea() {
  return fetchPublic<PublicDeliveryPrice>("/public/v1/delivery-prices").then(
    (response): PublicDeliveryArea | null => {
      if (response === null) return null;
      const basePrice = response.price ?? response.deliveryCharge;
      if (
        typeof response !== "object" ||
        typeof basePrice !== "number" ||
        !Number.isFinite(basePrice)
      ) {
        console.error("Unexpected public delivery prices response shape");
        return null;
      }

      return {
        price: basePrice,
        deliveryCharge:
          typeof response.deliveryCharge === "number"
            ? response.deliveryCharge
            : basePrice,
        ...(Array.isArray(response.zones)
          ? {
              zones: response.zones.filter(
                (zone): zone is { zone: string; price: number } =>
                  typeof zone?.zone === "string" &&
                  typeof zone.price === "number" &&
                  Number.isFinite(zone.price),
              ),
            }
          : {}),
      };
    },
  );
}

export function fetchPublicStoreSettings() {
  return fetchPublic<PublicSettings>("/public/v1/settings");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function normalizePublicProduct(value: unknown): Product | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.price !== "number" ||
    !Number.isFinite(value.price)
  ) {
    return null;
  }

  const categories = value.categories;
  const tags = value.tags;
  const images = value.images;
  const variants = value.variants;
  const thumbnailImage = value.thumbnailImage;

  if (
    (categories !== undefined &&
      (!Array.isArray(categories) ||
        !categories.every((category) => typeof category === "string"))) ||
    (tags !== undefined &&
      (!Array.isArray(tags) ||
        !tags.every((tag) => typeof tag === "string"))) ||
    (images !== undefined &&
      typeof images !== "string" &&
      (!Array.isArray(images) ||
        !images.every(
          (image) =>
            typeof image === "string" ||
            (isRecord(image) &&
              optionalString(image.url) &&
              optionalString(image.secureUrl)),
        ))) ||
    (variants !== undefined &&
      (!Array.isArray(variants) || !variants.every(isRecord))) ||
    (thumbnailImage !== undefined &&
      (!isRecord(thumbnailImage) ||
        !optionalString(thumbnailImage.url) ||
        !optionalString(thumbnailImage.secureUrl))) ||
    !optionalString(value.slug) ||
    !optionalString(value.title) ||
    !optionalString(value.shortDescription) ||
    !optionalString(value.description) ||
    !optionalString(value.image) ||
    (value.compareAtPrice !== undefined &&
      typeof value.compareAtPrice !== "number") ||
    (value.salesCount !== undefined && typeof value.salesCount !== "number") ||
    (value.isFeatured !== undefined && typeof value.isFeatured !== "boolean") ||
    (value.isActive !== undefined && typeof value.isActive !== "boolean")
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    price: value.price,
    ...(typeof value._id === "string" ? { _id: value._id } : {}),
    ...(typeof value.title === "string" ? { title: value.title } : {}),
    ...(typeof value.slug === "string" ? { slug: value.slug } : {}),
    ...(typeof value.image === "string" ? { image: value.image } : {}),
    ...(typeof value.stock === "number" ? { stock: value.stock } : {}),
    ...(typeof value.shortDescription === "string"
      ? { shortDescription: value.shortDescription }
      : {}),
    ...(typeof value.description === "string"
      ? { description: value.description }
      : {}),
    ...(typeof value.compareAtPrice === "number"
      ? { compareAtPrice: value.compareAtPrice }
      : {}),
    ...(typeof value.salesCount === "number"
      ? { salesCount: value.salesCount }
      : {}),
    ...(typeof value.isFeatured === "boolean"
      ? { isFeatured: value.isFeatured }
      : {}),
    ...(typeof value.isActive === "boolean"
      ? { isActive: value.isActive }
      : {}),
    ...(Array.isArray(categories)
      ? {
          categories: categories.filter(
            (category): category is string => typeof category === "string",
          ),
        }
      : {}),
    ...(Array.isArray(tags)
      ? { tags: tags.filter((tag): tag is string => typeof tag === "string") }
      : {}),
    ...(typeof images === "string"
      ? { images: [images] }
      : Array.isArray(images)
        ? {
            images: images.flatMap<string | ImageType>((image) => {
              if (typeof image === "string") return [image];
              if (!isRecord(image)) return [];
              return [
                {
                  ...(typeof image.url === "string" ? { url: image.url } : {}),
                  ...(typeof image.secureUrl === "string"
                    ? { secureUrl: image.secureUrl }
                    : {}),
                },
              ];
            }),
          }
        : {}),
    ...(Array.isArray(variants)
      ? {
          variants: variants.map((variant) => ({
            ...(typeof variant.id === "string" ? { id: variant.id } : {}),
            ...(typeof variant.name === "string" ? { name: variant.name } : {}),
            ...(typeof variant.price === "number"
              ? { price: variant.price }
              : {}),
            ...(typeof variant.stock === "number"
              ? { stock: variant.stock }
              : {}),
            ...(typeof variant.isActive === "boolean"
              ? { isActive: variant.isActive }
              : {}),
          })),
        }
      : {}),
    ...(isRecord(thumbnailImage)
      ? {
          thumbnailImage: {
            ...(typeof thumbnailImage.url === "string"
              ? { url: thumbnailImage.url }
              : {}),
            ...(typeof thumbnailImage.secureUrl === "string"
              ? { secureUrl: thumbnailImage.secureUrl }
              : {}),
          },
        }
      : {}),
  };
}
