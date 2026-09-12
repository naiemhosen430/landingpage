import { notFound } from "next/navigation";
import LandingContent from "@/components/landing/LandingContent";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { fetchPublicLandingPage, fetchPublicSettings } from "@/lib/landingPage";
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
  const [page, publicSettings] = await Promise.all([
    fetchPublicLandingPage(slug),
    fetchPublicSettings(),
  ]);
  if (!page) {
    notFound();
  }

  return (
    <>
      <StorefrontHeader />
      <main className="lp-root">
        <section
          className="lp-section"
          style={{ paddingTop: 40, paddingBottom: 80 }}
        >
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <h1 style={{ fontSize: 44, marginBottom: 20 }}>
              {page.landingPage.pageName}
            </h1>
            <LandingContent html={page.landingPage.landingContent} />
            <div>
              <CheckoutForm
                products={page.products}
                deliveryArea={page.deliveryArea}
                paymentMethods={page.paymentMethods}
                facebookPixelId={
                  publicSettings.store?.socialTracking?.facebook?.enabled
                    ? publicSettings.store.socialTracking.facebook.pixelId
                    : undefined
                }
                tiktokPixelId={
                  publicSettings.store?.socialTracking?.tiktok?.enabled
                    ? publicSettings.store.socialTracking.tiktok.pixelId
                    : undefined
                }
              />
            </div>
          </div>
        </section>
      </main>
      <StorefrontFooter />
    </>
  );
}
