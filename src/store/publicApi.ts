import { api } from "./api";

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
      query: (slug) => `/public/v1/products/slug/${slug}`,
      transformResponse: (response: any) => response?.data ?? response,
    }),
    placeOrder: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: "/public/v1/orders",
        method: "POST",
        body: data,
      }),
    }),
    trackVisitor: builder.mutation({
      query: (data) => ({
        url: "/public/track/visitor",
        method: "POST",
        body: data,
      }),
    }),
    trackEvent: builder.mutation({
      query: (data) => ({
        url: "/public/track/event",
        method: "POST",
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
      query: () => "/public/landing",
    }),
  }),
});

export const {
  useGetPublicProductsQuery,
  useGetPublicProductQuery,
  usePlaceOrderMutation,
  useTrackVisitorMutation,
  useTrackEventMutation,
  useSubscribeNewsletterMutation,
  useSubmitContactMutation,
  useGetLandingPageQuery,
} = publicApi;
