import { CartStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicCategories,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function CartPage() {
  const [settings, categories] = await Promise.all([
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);
  return (
    <CartStorefront
      settings={settings ?? undefined}
      categories={categories ?? []}
    />
  );
}
