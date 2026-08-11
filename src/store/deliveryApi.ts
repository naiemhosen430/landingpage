import { api } from "./api";

export type DeliveryArea = {
  id: string;
  name: string;
  isActive?: boolean;
  zones: Array<{ zone: string; price: number }>;
};

export const deliveryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryAreas: builder.query<any, Record<string, any> | void>({
      query: (params) => ({
        url: "/admin/delivery-areas",
        params: params ?? {},
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result) =>
        result?.data ? [{ type: "DeliveryAreas" as const }] : [],
    }),
    createDeliveryArea: builder.mutation<any, Partial<DeliveryArea>>({
      query: (body) => ({ url: "/admin/delivery-areas", method: "POST", body }),
      invalidatesTags: ["DeliveryAreas"],
    }),
    updateDeliveryArea: builder.mutation<
      any,
      { id: string; body: Partial<DeliveryArea> }
    >({
      query: ({ id, body }) => ({
        url: `/admin/delivery-areas/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["DeliveryAreas"],
    }),
    deleteDeliveryArea: builder.mutation<any, string>({
      query: (id) => ({ url: `/admin/delivery-areas/${id}`, method: "DELETE" }),
      invalidatesTags: ["DeliveryAreas"],
    }),
  }),
});

export const {
  useGetDeliveryAreasQuery,
  useCreateDeliveryAreaMutation,
  useUpdateDeliveryAreaMutation,
  useDeleteDeliveryAreaMutation,
} = deliveryApi;
