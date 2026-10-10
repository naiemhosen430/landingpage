import { api } from "./api";

export type PaymentMethod = {
  id: string;
  projectId: string;
  code: string;
  name: string;
  description?: string;
  instructions?: string;
  details?: Record<string, string>;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PaymentMethodInput = Omit<
  PaymentMethod,
  "id" | "projectId" | "createdAt" | "updatedAt"
>;

export type PaymentMethodListResponse = {
  data: PaymentMethod[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type PaymentMethodQueryParams = {
  page?: number;
  limit?: number;
};

const unwrapData = (response: any) => response?.data ?? response;

const unwrapPaymentMethods = (response: any): PaymentMethodListResponse => {
  const data = unwrapData(response);
  return Array.isArray(data)
    ? { data }
    : { data: data?.data ?? [], meta: data?.meta };
};

export const paymentMethodApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethodsAdmin: builder.query<
      PaymentMethodListResponse,
      PaymentMethodQueryParams | void
    >({
      query: (params) => ({
        url: "/admin/payment-methods",
        params: params ?? {},
      }),
      transformResponse: unwrapPaymentMethods,
      providesTags: ["PaymentMethods"],
    }),
    createPaymentMethod: builder.mutation<PaymentMethod, PaymentMethodInput>({
      query: (body) => ({
        url: "/admin/payment-methods",
        method: "POST",
        body,
      }),
      transformResponse: unwrapData,
      invalidatesTags: ["PaymentMethods"],
    }),
    updatePaymentMethod: builder.mutation<
      PaymentMethod,
      { id: string; data: Partial<PaymentMethodInput> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/payment-methods/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: unwrapData,
      invalidatesTags: ["PaymentMethods"],
    }),
    deletePaymentMethod: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/payment-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentMethods"],
    }),
  }),
});

export const {
  useGetPaymentMethodsAdminQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodApi;
