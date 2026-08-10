import { api } from "./api";

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: "/admin/orders",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }: { id: string }) => ({
                type: "Order" as const,
                id,
              })),
              "Orders",
            ]
          : ["Orders"],
    }),
    getOrder: builder.query({
      query: (id) => `/admin/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status, note },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        "Orders",
      ],
    }),
    exportOrders: builder.query({
      query: (params) => ({
        url: "/admin/orders/export",
        params,
        responseHandler: (response: any) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useExportOrdersQuery,
} = orderApi;
