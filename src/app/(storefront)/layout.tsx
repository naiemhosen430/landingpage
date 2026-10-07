import type { Metadata } from "next";
import StoreUnavailable from "@/components/store/StoreUnavailable";
import StorefrontTracker from "@/components/storefront/StorefrontTracker";
import { fetchPublicStoreSettings } from "@/lib/publicData";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicStoreSettings();
  const storeName =
    settings?.branding?.storeName ||
    settings?.store?.storeName ||
    settings?.store?.name ||
    process.env.NEXT_PUBLIC_STORE_NAME;

  return {
    title: storeName || "Storefront",
    description: settings?.store?.description || undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSubscriptionError(value: unknown): boolean {
  if (!isRecord(value)) return false;

  return (
    value.success === false &&
    value.statusCode === 401 &&
    typeof value.message === "string" &&
    value.message.toLowerCase().includes("subscription")
  );
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await fetchPublicStoreSettings();

  if (isSubscriptionError(settings)) {
    return <StoreUnavailable />;
  }

  return (
    <>
      <StorefrontTracker />
      {children}
    </>
  );
}
