import { CheckoutStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicPaymentMethods,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function CheckoutPage() {
  const [paymentMethods, settings] = await Promise.all([
    fetchPublicPaymentMethods(),
    fetchPublicStoreSettings(),
  ]);
  return (
    <CheckoutStorefront
      initialPaymentMethods={paymentMethods ?? undefined}
      settings={settings ?? undefined}
    />
  );
}
