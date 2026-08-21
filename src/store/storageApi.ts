import { api } from "./api";

export interface StorageModuleUsage {
  records: number;
  sizeMB: number;
  estimatedMB?: number;
  bytes?: number;
}

export interface StorageUsageResponse {
  projectId: string;
  userId: string;
  unit: "MB";
  totalMB: number;
  mediaMB: number;
  databaseMB: number;
  modules: Record<string, StorageModuleUsage>;
}

export type StorageModule =
  | "activityLogs"
  | "analytics"
  | "couriers"
  | "customers"
  | "deliveryAreas"
  | "landingPages"
  | "orders"
  | "packagePurchaseRequests"
  | "paymentMethods"
  | "products"
  | "projects"
  | "refreshTokens"
  | "subscriptions"
  | "trackingEvents"
  | "uploads"
  | "users";

export interface StorageListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface StorageListResponse<T = Record<string, unknown>> {
  module: StorageModule;
  data: T[];
  meta: StorageListMeta;
}

export interface StorageDeleteResponse {
  requestedCount?: number;
  deletedCount: number;
}

export const storageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStorageUsage: builder.query<StorageUsageResponse, void>({
      query: () => "/admin/storage",
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: ["Storage"],
    }),
    listStorageModule: builder.query<
      StorageListResponse,
      { module: StorageModule; page?: number; limit?: number }
    >({
      query: ({ module, page = 1, limit = 20 }) => ({
        url: `/admin/storage/${module}`,
        params: { page, limit },
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result, error, { module }) => [
        { type: "Storage", id: module },
      ],
    }),
    deleteStorageRecords: builder.mutation<
      StorageDeleteResponse,
      {
        module: StorageModule;
        payload: { id: string } | { ids: string[] } | { all: true };
      }
    >({
      query: ({ module, payload }) => ({
        url: `/admin/storage/${module}`,
        method: "DELETE",
        body: payload,
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: (result, error, { module }) => [
        "Storage",
        { type: "Storage", id: module },
      ],
    }),
  }),
});

export const {
  useGetStorageUsageQuery,
  useListStorageModuleQuery,
  useDeleteStorageRecordsMutation,
} = storageApi;
