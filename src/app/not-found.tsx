import Link from "next/link";
import {
  StorefrontFooter,
  StorefrontHeader,
} from "@/components/storefront/Storefront";
import {
  fetchPublicCategories,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function NotFound() {
  const [settings, categories] = await Promise.all([
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);

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
        settings={settings ?? undefined}
        categories={categories ?? []}
      />
      <main className="storefront-main store-not-found">
        <div className="store-not-found-code">404</div>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="store-primary-link">
          Back to home
        </Link>
      </main>
      <StorefrontFooter
        settings={settings ?? undefined}
        categories={categories ?? []}
      />
    </div>
  );
}
