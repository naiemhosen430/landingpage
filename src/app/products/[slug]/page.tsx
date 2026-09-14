import { ProductDetailStorefront } from "@/components/storefront/Storefront";
import { fetchPublicProduct, fetchPublicStoreSettings } from "@/lib/publicData";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    fetchPublicProduct(slug),
    fetchPublicStoreSettings(),
  ]);
  return (
    <ProductDetailStorefront
      slug={slug}
      initialProduct={product}
      settings={settings ?? undefined}
    />
  );
}
