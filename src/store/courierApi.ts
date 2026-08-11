import { api } from "./api";

export type Courier = {
  id: string;
  projectId: string;
  name: string;
  code: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  trackingUrlTemplate?: string;
  config?: Record<string, string>;
  isActive: boolean;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CourierInput = Omit<
  Courier,
  "id" | "projectId" | "createdAt" | "updatedAt"
>;

type CourierListResponse = {
  data: Courier[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export const courierApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourierSettings: builder.query({
      query: () => "/courier/settings",
      providesTags: ["Courier"],
    }),
    updateCourierSettings: builder.mutation({
      query: (data) => ({
        url: "/courier/settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Courier"],
    }),
    getCourierProviders: builder.query({
      query: () => "/courier/providers",
    }),
    testCourierConnection: builder.mutation({
      query: (providerId) => ({
        url: `/courier/${providerId}/test`,
        method: "POST",
      }),
    }),
    getCouriers: builder.query<
      CourierListResponse,
      Record<string, unknown> | void
    >({
      query: (params) => ({ url: "/admin/couriers", params: params ?? {} }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Courier" as const,
                id,
              })),
              "Courier",
            ]
          : ["Courier"],
    }),
    getCourier: builder.query<Courier, string>({
      query: (id) => `/admin/couriers/${id}`,
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result, error, id) => [{ type: "Courier", id }],
    }),
    createCourier: builder.mutation<
      Courier,
      CourierInput & { projectId?: string }
    >({
      query: (body) => ({ url: "/admin/couriers", method: "POST", body }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Courier"],
    }),
    updateCourier: builder.mutation<
      Courier,
      { id: string; data: Partial<CourierInput> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/couriers/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: (result, error, { id }) => [
        { type: "Courier", id },
        "Courier",
      ],
    }),
    setDefaultCourier: builder.mutation<Courier, string>({
      query: (id) => ({
        url: `/admin/couriers/${id}`,
        method: "PATCH",
        body: { action: "set-default" },
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Courier"],
    }),
    deleteCourier: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/couriers/${id}`, method: "DELETE" }),
      invalidatesTags: ["Courier"],
    }),
    bookOrderWithDefaultCourier: builder.mutation<any, string>({
      query: (orderId) => ({
        url: `/admin/orders/${orderId}/courier/book`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: "Order", id: orderId },
        "Orders",
      ],
    }),
  }),
});

export const {
  useGetCourierSettingsQuery,
  useUpdateCourierSettingsMutation,
  useGetCourierProvidersQuery,
  useTestCourierConnectionMutation,
  useGetCouriersQuery,
  useGetCourierQuery,
  useCreateCourierMutation,
  useUpdateCourierMutation,
  useSetDefaultCourierMutation,
  useDeleteCourierMutation,
  useBookOrderWithDefaultCourierMutation,
} = courierApi;
