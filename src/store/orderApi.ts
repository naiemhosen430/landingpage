import { api } from "./api";

export type OrderStatus =
  | "incomplete"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type OrderQueryParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  paymentStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type Order = {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
    address?: string | Record<string, string>;
    city?: string;
    district?: string;
  };
  items: Array<Record<string, unknown>>;
  total: number;
  subtotal: number;
  tax: number;
  taxAmount?: number;
  shipping?: number;
  shippingAmount?: number;
  deliveryCharge: number;
  discount: number;
  discountAmount?: number;
  codCharge: number;
  currency?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingMethod?: string;
  status: OrderStatus;
  notes?: string;
  courier?: {
    name: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
  } | null;
  timeline?: Array<{
    id: string;
    status: OrderStatus;
    note?: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt?: string;
};

export type OrderListResponse = {
  data: Order[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
};

const unwrapData = (response: any) => response?.data ?? response;

const normalizeOrderList = (response: any): OrderListResponse => {
  const payload = unwrapData(response);
  if (Array.isArray(payload)) return { data: payload };
  return { data: payload?.data ?? [], meta: payload?.meta };
};

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrderListResponse, OrderQueryParams | void>({
      query: (params) => ({
        url: "/admin/orders",
        params,
      }),
      transformResponse: normalizeOrderList,
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
    getOrder: builder.query<Order, string>({
      query: (id) => `/admin/orders/${id}`,
      transformResponse: (response: any) => unwrapData(response),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    updateOrder: builder.mutation<
      Order,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/orders/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => unwrapData(response),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        "Orders",
      ],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: string; status: OrderStatus; note?: string }
    >({
      query: ({ id, status, note }) => ({
        url: `/admin/orders/${id}/status`,
        method: "PATCH",
        body: { status, note },
      }),
      transformResponse: (response: any) => unwrapData(response),
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
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useExportOrdersQuery,
} = orderApi;
