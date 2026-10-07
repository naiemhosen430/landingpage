import { CatalogStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicCategories,
  fetchPublicProducts,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const query = await searchParams;
  const [settings, categories] = await Promise.all([
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);

  const selectedCategory = categories?.find(
    (category) =>
      category.id === query.category || category.slug === query.category,
  );
  const products =
    query.category && !selectedCategory
      ? []
      : await fetchPublicProducts({
          limit: 100,
          ...(query.search ? { search: query.search } : {}),
          ...(selectedCategory ? { category: selectedCategory.id } : {}),
        });
  return (
    <CatalogStorefront
      initialProducts={products}
      settings={settings ?? undefined}
      initialCategory={selectedCategory?.name ?? "all"}
      initialSearch={query.search ?? ""}
      categories={categories ?? []}
    />
  );
}
