import { CartStorefront } from "@/components/storefront/Storefront";
import { fetchPublicStoreSettings } from "@/lib/publicData";

export default async function CartPage() {
  const settings = await fetchPublicStoreSettings();
  return <CartStorefront settings={settings ?? undefined} />;
}
