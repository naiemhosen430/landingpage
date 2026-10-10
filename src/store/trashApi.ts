import { api } from "./api";

export type TrashItem = {
  id: string;
  _id: string;
  entityType: string;
  recordId: string;
  label: string;
  deletedAt: string;
  expiresAt: string;
};

export type TrashListResponse = {
  data: TrashItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export const trashApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTrashItems: builder.query<
      TrashListResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 25 }) => ({
        url: "/admin/trash",
        params: { page, limit },
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: ["Trash"],
    }),
    restoreTrashItems: builder.mutation<{ restoredCount: number }, string[]>({
      query: (ids) => ({
        url: "/admin/trash",
        method: "POST",
        body: { ids },
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: [
        "Trash",
        "Products",
        "Orders",
        "Categories",
        "DeliveryAreas",
        "Media",
        "PaymentMethods",
        "LandingPages",
        "Courier",
        "TrackingEvents",
        "Storage",
      ],
    }),
    permanentlyDeleteTrashItems: builder.mutation<
      { deletedCount: number },
      string[]
    >({
      query: (ids) => ({
        url: "/admin/trash",
        method: "DELETE",
        body: { ids },
      }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ["Trash", "Storage"],
    }),
  }),
});

export const {
  useGetTrashItemsQuery,
  useRestoreTrashItemsMutation,
  usePermanentlyDeleteTrashItemsMutation,
} = trashApi;
