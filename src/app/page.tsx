import LandingContent from "@/components/landing/LandingContent";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { fetchPublicLandingPage, fetchPublicSettings } from "@/lib/landingPage";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function HomePage() {
  const [page, publicSettings] = await Promise.all([
    fetchPublicLandingPage("home"),
    fetchPublicSettings(),
  ]);
  const facebookPixelId = publicSettings.store?.socialTracking?.facebook
    ?.enabled
    ? publicSettings.store.socialTracking.facebook.pixelId
    : undefined;
  const tiktokPixelId = publicSettings.store?.socialTracking?.tiktok?.enabled
    ? publicSettings.store.socialTracking.tiktok.pixelId
    : undefined;

  console.log({ publicSettings, facebookPixelId, tiktokPixelId });

  // If no page found, render a default landing page
  if (!page) {
    return (
      <main className="lp-root">
        <section
          className="lp-section"
          style={{ paddingTop: 40, paddingBottom: 80 }}
        >
          <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <h1 style={{ fontSize: 44, marginBottom: 20 }}>Welcome</h1>
            <p>Default landing page</p>
            <div>
              <CheckoutForm
                products={[]}
                facebookPixelId={facebookPixelId}
                tiktokPixelId={tiktokPixelId}
              />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="lp-root">
      <LandingContent html={page.landingPage.landingContent} />
      <section
        className="lp-section"
        style={{ paddingTop: 40, paddingBottom: 80 }}
      >
        <div id="checkout" style={{ maxWidth: 980, margin: "0 auto" }}>
          <div>
            <CheckoutForm
              products={page.products}
              deliveryArea={page.deliveryArea}
              paymentMethods={page.paymentMethods}
              facebookPixelId={facebookPixelId}
              tiktokPixelId={tiktokPixelId}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
