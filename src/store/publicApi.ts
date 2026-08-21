import { api } from "./api";

export type PublicAnalyticsEvent = {
  eventType:
    | "page_view"
    | "product_view"
    | "add_to_cart"
    | "checkout_started"
    | "purchase"
    | "custom";
  eventName: string;
  payload?: Record<string, unknown>;
  sessionId?: string;
  visitorId?: string;
  url?: string;
  referrer?: string;
};

export type PublicAnalyticsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: Record<string, unknown>;
  errors?: string[];
};

export type PublicDeliveryPrice = {
  price: number;
  deliveryCharge: number;
};

export const publicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProducts: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: "/public/v1/products",
        params: params ?? {},
      }),
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getPublicProduct: builder.query<any, string>({
      query: (slug) => `/public/v1/products/${encodeURIComponent(slug)}`,
      transformResponse: (response: any) => response?.data ?? response,
    }),
    getPublicPaymentMethods: builder.query<any[], void>({
      query: () => "/public/v1/payment-methods",
      transformResponse: (response: any) => response?.data ?? response ?? [],
    }),
    getPublicDeliveryPrice: builder.query<PublicDeliveryPrice, string | void>({
      query: (zone) => ({
        url: "/public/v1/delivery-prices",
        params: zone ? { zone } : undefined,
      }),
      transformResponse: (response: any) => response?.data ?? response,
    }),
    placeOrder: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: "/public/v1/orders",
        method: "POST",
        body: data,
      }),
    }),
    getPublicOrder: builder.query<any, string>({
      query: (id) => `/public/v1/orders/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => response?.data ?? response,
    }),
    createIncompleteOrder: builder.mutation<any, { phone: string }>({
      query: (data) => ({
        url: "/public/v1/orders/incomplete",
        method: "POST",
        body: data,
      }),
    }),
    updateIncompleteOrder: builder.mutation<
      any,
      { id: string; data: Record<string, any> }
    >({
      query: ({ id, data }) => ({
        url: `/public/v1/orders/incomplete/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: data,
      }),
    }),
    subscribeNewsletter: builder.mutation({
      query: (email) => ({
        url: "/public/newsletter",
        method: "POST",
        body: { email },
      }),
    }),
    submitContact: builder.mutation({
      query: (data) => ({
        url: "/public/contact",
        method: "POST",
        body: data,
      }),
    }),
    getLandingPage: builder.query({
      query: (slug: string) =>
        `/public/v1/landing-pages/${encodeURIComponent(slug)}`,
      transformResponse: (response: any) => response?.data ?? response,
    }),
    trackPageView: builder.mutation<PublicAnalyticsResponse, string | void>({
      query: (visitorId) => ({
        url: "/public/v1/tracking",
        method: "GET",
        params: visitorId ? { visitorId } : undefined,
      }),
    }),
    trackAnalyticsEvent: builder.mutation<
      PublicAnalyticsResponse,
      PublicAnalyticsEvent
    >({
      query: (data) => ({
        url: "/public/v1/tracking",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPublicProductsQuery,
  useGetPublicProductQuery,
  useGetPublicPaymentMethodsQuery,
  useGetPublicDeliveryPriceQuery,
  usePlaceOrderMutation,
  useGetPublicOrderQuery,
  useCreateIncompleteOrderMutation,
  useUpdateIncompleteOrderMutation,
  useTrackPageViewMutation,
  useTrackAnalyticsEventMutation,
  useSubscribeNewsletterMutation,
  useSubmitContactMutation,
  useGetLandingPageQuery,
} = publicApi;
