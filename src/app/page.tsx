import LandingContent from "@/components/landing/LandingContent";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { fetchPublicLandingPage } from "@/lib/landingPage";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function HomePage() {
  const page = await fetchPublicLandingPage("home");

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
              <CheckoutForm items={[] as any} />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="lp-root">
      <section
        className="lp-section"
        style={{ paddingTop: 40, paddingBottom: 80 }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h1 style={{ fontSize: 44, marginBottom: 20 }}>{page.pageName}</h1>
          <LandingContent html={page.landingContent} />
          <div>
            <CheckoutForm items={[] as any} />
          </div>
        </div>
      </section>
    </main>
  );
}
