import { CheckoutStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicCategories,
  fetchPublicDeliveryArea,
  fetchPublicPaymentMethods,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function CheckoutPage() {
  const [paymentMethods, deliveryArea, settings, categories] = await Promise.all([
    fetchPublicPaymentMethods(),
    fetchPublicDeliveryArea(),
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);
  return (
    <CheckoutStorefront
      initialPaymentMethods={paymentMethods ?? undefined}
      initialDeliveryArea={deliveryArea ?? undefined}
      settings={settings ?? undefined}
      categories={categories ?? []}
    />
  );
}
