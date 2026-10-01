import { ProductDetailStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicCategories,
  fetchPublicProduct,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

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
  return (
    <ProductDetailStorefront
      slug={slug}
      initialProduct={product}
      settings={settings ?? undefined}
      categories={categories ?? []}
    />
  );
}
