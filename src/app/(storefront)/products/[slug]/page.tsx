import { ProductDetailStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicCategories,
  fetchPublicProduct,
  fetchPublicProducts,
  fetchPublicStoreSettings,
} from "@/lib/publicData";
import type { Product } from "@/components/storefront/types";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings, categories] = await Promise.all([
    fetchPublicProduct(slug),
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);
  let relatedProducts: Product[] = [];
  if (product) {
    try {
      let candidates = product.categories?.[0]
        ? await fetchPublicProducts({
            category: product.categories[0],
            limit: 12,
          })
        : null;
      const excludeCurrent = (items: Product[] | null) =>
        (items ?? []).filter(
          (candidate) =>
            candidate.id !== product.id &&
            candidate.slug !== product.slug &&
            candidate.isActive !== false,
        );
      let matches = excludeCurrent(candidates);
      if (!matches.length) {
        candidates = await fetchPublicProducts({
          limit: 20,
          featured: "true",
        });
        matches = excludeCurrent(candidates);
      }
      relatedProducts = matches.slice(0, 8);
    } catch (error) {
      console.error("Failed to load related products:", error);
    }
  }
  return (
    <ProductDetailStorefront
      slug={slug}
      initialProduct={product}
      relatedProducts={relatedProducts}
      settings={settings ?? undefined}
      categories={categories ?? []}
    />
  );
}
