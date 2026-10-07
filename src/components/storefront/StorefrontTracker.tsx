"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  initializeBrowserPixels,
  trackStorefrontEvent,
} from "@/lib/tracking";
import {
  useGetPublicSettingsQuery,
  useTrackAnalyticsEventMutation,
} from "@/store/publicApi";
import { selectCartItems, selectCartTotalPrice } from "@/store/cartSlice";
import { useAppSelector } from "@/store/hooks";

export default function StorefrontTracker() {
  const pathname = usePathname();
  const { data: settings, isSuccess } = useGetPublicSettingsQuery();
  const [trackAnalyticsEvent] = useTrackAnalyticsEventMutation();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotalPrice);

  useEffect(() => {
    if (!isSuccess) return;
    initializeBrowserPixels({
      facebookPixelId: settings?.store?.socialTracking?.facebook?.enabled
        ? settings.store.socialTracking.facebook.pixelId
        : undefined,
      tiktokPixelId: settings?.store?.socialTracking?.tiktok?.enabled
        ? settings.store.socialTracking.tiktok.pixelId
        : undefined,
    });
  }, [isSuccess, settings]);

  useEffect(() => {
    if (!isSuccess || !pathname) return;
    const url = window.location.href;
    trackStorefrontEvent(
      {
        eventType: "page_view",
        eventName: "page_view",
        url,
        payload: {
          currency: "BDT",
          event_source_url: url,
          page_title: document.title,
        },
      },
      `page-view-${pathname}`,
      (event) => {
        void trackAnalyticsEvent(event);
      },
    );
  }, [isSuccess, pathname, trackAnalyticsEvent]);

  useEffect(() => {
    if (!isSuccess || pathname !== "/checkout" || !cartItems.length) return;
    const contents = cartItems.map((item) => {
      const product = item.product;
      const price =
        (item.variantId
          ? product.variants?.find((variant) => variant.id === item.variantId)
              ?.price
          : undefined) ??
        product.price ??
        item.price ??
        0;
      return {
        id: product.id || product._id || item.id,
        content_name: product.name || product.title || item.name,
        quantity: item.quantity,
        item_price: price,
      };
    });
    const url = window.location.href;

    trackStorefrontEvent(
      {
        eventType: "checkout_started",
        eventName: "checkout_started",
        url,
        payload: {
          currency: "BDT",
          value: cartTotal,
          contents,
          contentIds: contents.map((item) => item.id).filter(Boolean),
          num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          event_source_url: url,
        },
      },
      "checkout-started",
      (event) => {
        void trackAnalyticsEvent(event);
      },
    );
  }, [cartItems, cartTotal, isSuccess, pathname, trackAnalyticsEvent]);

  return null;
}
