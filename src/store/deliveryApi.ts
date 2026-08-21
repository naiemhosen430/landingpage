import { api } from "./api";

export type DeliveryArea = {
  id: string;
  projectId?: string;
  name: string;
  deliveryCharge?: number;
  isActive?: boolean;
  zones: Array<{ zone: string; price: number }>;
  createdAt?: string;
  updatedAt?: string;
};

export type DeliveryAreaInput = Omit<
  DeliveryArea,
  "id" | "projectId" | "createdAt" | "updatedAt"
>;

export type DeliveryAreaListResponse = {
  data: DeliveryArea[];
  meta?: Record<string, unknown>;
};

const unwrapData = (response: any) => response?.data ?? response;

export const deliveryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveryAreas: builder.query<
      DeliveryAreaListResponse,
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: "/admin/delivery-areas",
        params: params ?? {},
      }),
      transformResponse: (response: any) => {
        const payload = unwrapData(response);
        return Array.isArray(payload)
          ? { data: payload }
          : { data: payload?.data ?? [], meta: payload?.meta };
      },
      providesTags: ["DeliveryAreas"],
    }),
    createDeliveryArea: builder.mutation<DeliveryArea, DeliveryAreaInput>({
      query: (body) => ({ url: "/admin/delivery-areas", method: "POST", body }),
      invalidatesTags: ["DeliveryAreas"],
    }),
    updateDeliveryArea: builder.mutation<
      DeliveryArea,
      { id: string; body: Partial<DeliveryAreaInput> }
    >({
      query: ({ id, body }) => ({
        url: `/admin/delivery-areas/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrapData,
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
