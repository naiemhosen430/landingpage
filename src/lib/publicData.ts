import type { HomePageContent } from "@/store/homePageApi";
import type { PublicSettings } from "@/store/publicApi";

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

    if (!response.ok) return null;
    const json = await response.json();
    return (json?.data?.data ?? json?.data ?? json) as T;
  } catch (error) {
    console.error(`Failed to fetch public data from ${path}:`, error);
    return null;
  }
}

export function fetchPublicProducts(
  params: Record<string, string | number> = {},
) {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  );
  return fetchPublic<unknown[]>(`/public/v1/products?${query.toString()}`);
}

export function fetchPublicProduct(slug: string) {
  return fetchPublic<unknown>(
    `/public/v1/products/${encodeURIComponent(slug)}`,
  );
}

export function fetchPublicHomePage() {
  return fetchPublic<HomePageContent>("/public/v1/home-page");
}

export function fetchPublicPaymentMethods() {
  return fetchPublic<any[]>("/public/v1/payment-methods");
}

export function fetchPublicStoreSettings() {
  return fetchPublic<PublicSettings>("/public/v1/settings");
}
