import { HomeStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicHomePage,
  fetchPublicCategories,
  fetchPublicProducts,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function HomePage() {
  const [products, homePage, settings, categories] = await Promise.all([
    fetchPublicProducts({ limit: 100 }),
    fetchPublicHomePage(),
    fetchPublicStoreSettings(),
    fetchPublicCategories(),
  ]);

  return (
    <HomeStorefront
      initialProducts={products}
      initialHomePage={homePage ?? undefined}
      settings={settings ?? undefined}
      categories={categories ?? []}
    />
  );
}
