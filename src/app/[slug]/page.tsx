import { notFound } from "next/navigation";
import LandingContent from "@/components/landing/LandingContent";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { fetchPublicLandingPage } from "@/lib/landingPage";
import {
  fetchPublicCategories,
  fetchPublicStoreSettings,
} from "@/lib/publicData";
import {
  StorefrontFooter,
  StorefrontHeader,
} from "@/components/storefront/Storefront";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [page, publicSettings, categories] = await Promise.all([
    fetchPublicLandingPage(slug),
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);
  const settings = publicSettings ?? undefined;
  if (!page) {
    notFound();
  }

  return (
    <div
      className="storefront-shell"
      style={
        settings?.branding?.primaryColor
          ? ({
              "--store-teal": settings.branding.primaryColor,
            } as React.CSSProperties)
          : undefined
      }
    >
      <StorefrontHeader
        settings={settings}
        categories={categories ?? []}
      />
      <main className="storefront-main store-landing-main">
        <section className="store-landing-content">
          <h1>{page.landingPage.pageName}</h1>
          <LandingContent html={page.landingPage.landingContent} />
          <div>
            <CheckoutForm
              products={page.products}
              deliveryArea={page.deliveryArea}
              paymentMethods={page.paymentMethods}
              currency={settings?.store?.currency}
              facebookPixelId={
                settings?.store?.socialTracking?.facebook?.enabled
                  ? settings.store.socialTracking.facebook.pixelId
                  : undefined
              }
              tiktokPixelId={
                settings?.store?.socialTracking?.tiktok?.enabled
                  ? settings.store.socialTracking.tiktok.pixelId
                  : undefined
              }
            />
          </div>
        </section>
      </main>
      <StorefrontFooter
        settings={settings}
        categories={categories ?? []}
      />
    </div>
  );
}
