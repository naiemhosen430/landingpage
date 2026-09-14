import { CatalogStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicProducts,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function ProductsPage() {
  const [products, settings] = await Promise.all([
    fetchPublicProducts({ limit: 100 }),
    fetchPublicStoreSettings(),
  ]);
  return (
    <CatalogStorefront
      initialProducts={products}
      settings={settings ?? undefined}
    />
  );
}
