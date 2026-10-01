import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/providers/StoreProvider";
import { fetchPublicStoreSettings } from "@/lib/publicData";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

async function getStoreSettings() {
  try {
    return await fetchPublicStoreSettings();
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();
  const language = settings?.store?.language?.replace("_", "-") || "en";
  return (
    <html lang={language}>
      <body className={inter.variable}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
