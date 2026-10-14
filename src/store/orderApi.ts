import { api } from "./api";

export type OrderStatus =
  | "incomplete"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type OrderQueryParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
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
  paymentMethodName?: string;
  sourcePlatform?: string;
  paymentStatus?: string;
  shippingMethod?: string;
  deliveryZone?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  status: OrderStatus;
  notes?: string;
  courier?: {
    courierId?: string;
    providerCode?: string;
    name: string;
    status?: "ASSIGNED" | "BOOKED" | "FAILED";
    trackingNumber?: string;
    consignmentId?: string;
    estimatedDelivery?: string;
    bookingError?: string;
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

export type PublicOrderTracking = {
  orderNumber: string;
  items: Array<{
    productName: string;
    quantity: number;
    variantName?: string;
  }>;
  total: number;
  status: OrderStatus;
  paymentStatus: string;
  paymentMethodName?: string;
  courier?: {
    name: string;
    status: "ASSIGNED" | "BOOKED" | "FAILED";
    trackingNumber?: string;
  };
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
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
    createOrder: builder.mutation<
      Order,
      {
        projectId: string;
        customerName: string;
        customer?: {
          name?: string;
          phone?: string;
          address?: string;
        };
        customerEmail?: string;
        customerPhone?: string;
        shippingAddress?: {
          street?: string;
          city?: string;
          state?: string;
          zipCode?: string;
          country?: string;
        };
        items: Array<{ productId: string; quantity: number }>;
        notes?: string;
        paymentMethod?: string;
        paymentStatus?: string;
        deliveryZone?: string;
        sourcePlatform?: string;
      }
    >({
      query: (body) => ({
        url: "/admin/orders",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => unwrapData(response),
      invalidatesTags: ["Orders"],
    }),
    trackPublicOrder: builder.mutation<
      PublicOrderTracking,
      { orderNumber: string; phone: string }
    >({
      query: (body) => ({
        url: "/public/v1/orders/track",
        method: "POST",
        body,
      }),
      transformResponse: unwrapData,
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
  useCreateOrderMutation,
  useTrackPublicOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useExportOrdersQuery,
} = orderApi;
