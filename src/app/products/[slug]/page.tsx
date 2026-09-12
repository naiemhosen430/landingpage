import { ProductDetailStorefront } from "@/components/storefront/Storefront";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailStorefront slug={slug} />;
}
