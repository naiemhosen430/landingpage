import { notFound } from "next/navigation";
import LandingContent from "@/components/landing/LandingContent";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { fetchPublicLandingPage } from "@/lib/landingPage";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = await fetchPublicLandingPage(params.slug);
  if (!page) {
    notFound();
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
