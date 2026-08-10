import { api } from "./api";

export const packageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getActivePackages: builder.query<
      any,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/admin/packages",
        params: { page, limit },
      }),
      transformResponse: (response: any) =>
        response?.data?.data ?? response?.data ?? response,
      providesTags: (result) => [{ type: "Package", id: "LIST" }],
    }),

    getPackageBySlug: builder.query<any, string>({
      query: (packageId) => `/admin/packages/${packageId}`,
      transformResponse: (response: any) =>
        response?.data?.data ?? response?.data ?? response,
      providesTags: (result, error, slug) => [{ type: "Package", id: slug }],
    }),

    getPaymentMethods: builder.query<any, void>({
      query: () => "/admin/packages/payment-methods",
      transformResponse: (response: any) =>
        response?.data?.data ?? response?.data ?? response,
      providesTags: [{ type: "Package", id: "PAYMENT_METHODS" }],
    }),

    createPurchaseRequest: builder.mutation<any, Record<string, any>>({
      query: (payload) => ({
        url: "/admin/packages/purchase-requests",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Profile", { type: "Package", id: "LIST" }],
    }),

    getMySubscription: builder.query<
      any,
      { projectId?: string; packagedata?: Record<string, any> } | void
    >({
      query: (params) => ({
        url: "/admin/packages/subscriptions",
        params: params?.packagedata
          ? {
              ...params,
              packagedata: JSON.stringify(params.packagedata),
            }
          : (params ?? {}),
      }),
      transformResponse: (response: any) =>
        response?.data?.data ?? response?.data ?? response,
      providesTags: ["Profile"],
    }),

    renewSubscription: builder.mutation<
      any,
      { packagedata: Record<string, any> }
    >({
      query: ({ packagedata }) => ({
        url: "/admin/packages/subscriptions/renew",
        method: "POST",
        body: { packagedata },
      }),
      invalidatesTags: ["Profile"],
    }),
    cancelSubscription: builder.mutation<
      any,
      { packagedata: Record<string, any> }
    >({
      query: ({ packagedata }) => ({
        url: "/admin/packages/subscriptions/cancel",
        method: "POST",
        body: { packagedata },
      }),
      invalidatesTags: ["Profile"],
    }),
    toggleAutoRenew: builder.mutation<
      any,
      { packagedata: Record<string, any> }
    >({
      query: ({ packagedata }) => ({
        url: "/admin/packages/subscriptions/auto-renew",
        method: "POST",
        body: { packagedata },
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetActivePackagesQuery,
  useGetPackageBySlugQuery,
  useGetPaymentMethodsQuery,
  useCreatePurchaseRequestMutation,
  useGetMySubscriptionQuery,
  useRenewSubscriptionMutation,
  useCancelSubscriptionMutation,
  useToggleAutoRenewMutation,
} = packageApi;
