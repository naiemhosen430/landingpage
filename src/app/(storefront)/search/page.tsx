import { CatalogStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicCategories,
  fetchPublicProducts,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search = "" } = await searchParams;
  const [products, settings, categories] = await Promise.all([
    fetchPublicProducts({
      limit: 100,
      ...(search ? { search } : {}),
    }),
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);

  return (
    <CatalogStorefront
      initialProducts={products ?? []}
      initialSearch={search}
      searchPage
      settings={settings ?? undefined}
      categories={categories ?? []}
    />
  );
}
