import { CheckoutStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicCategories,
  fetchPublicPaymentMethods,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function CheckoutPage() {
  const [paymentMethods, settings, categories] = await Promise.all([
    fetchPublicPaymentMethods(),
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);
  return (
    <CheckoutStorefront
      initialPaymentMethods={paymentMethods ?? undefined}
      settings={settings ?? undefined}
      categories={categories ?? []}
    />
  );
}
