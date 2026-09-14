import { HomeStorefront } from "@/components/storefront/Storefront";
import {
  fetchPublicHomePage,
  fetchPublicProducts,
  fetchPublicStoreSettings,
} from "@/lib/publicData";

export default async function HomePage() {
  const [products, homePage, settings] = await Promise.all([
    fetchPublicProducts({ limit: 100 }),
    fetchPublicHomePage(),
    fetchPublicStoreSettings(),
  ]);

  return (
    <HomeStorefront
      initialProducts={products}
      initialHomePage={homePage ?? undefined}
      settings={settings ?? undefined}
    />
  );
}
