"use client";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import LandingContent from "@/components/landing/LandingContent";
import { useGetLandingPageQuery } from "@/store/publicApi";

interface LandingPageProps {
  slug: string;
}

export default function LandingPage({ slug }: LandingPageProps) {
  const { data, error, isLoading } = useGetLandingPageQuery(slug);

  if (isLoading) {
    return (
      <div className="lp-loading" style={{ textAlign: "center", padding: 32 }}>
        Loading landing page...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="lp-error" style={{ textAlign: "center", padding: 32 }}>
        Landing page not found.
      </div>
    );
  }

  return (
    <main className="lp-root">
      <section
        className="lp-section"
        style={{ paddingTop: 40, paddingBottom: 80 }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h1 style={{ fontSize: 44, marginBottom: 20 }}>{data.pageName}</h1>
          <LandingContent html={data.landingContent} />
          <div>
            <CheckoutForm
              products={data.products}
              deliveryArea={data.deliveryArea}
              paymentMethods={data.paymentMethods}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
