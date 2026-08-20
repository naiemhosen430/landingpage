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

const unwrapData = (response: any) => response?.data ?? response;

export const paymentMethodApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethodsAdmin: builder.query<PaymentMethod[], void>({
      query: () => "/admin/payment-methods",
      transformResponse: (response: any) => {
        const data = unwrapData(response);
        return Array.isArray(data) ? data : [];
      },
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
