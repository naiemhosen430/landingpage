import { api } from "./api";

export const publicApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPublicProducts: builder.query({
      query: (params) => ({
        url: "/public/products",
        params,
      }),
    }),
    getPublicProduct: builder.query({
      query: (slug) => `/public/products/${slug}`,
    }),
    placeOrder: builder.mutation({
      query: (data) => ({
        url: "/public/orders",
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
