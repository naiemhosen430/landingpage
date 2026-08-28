import { api } from "./api";
import type { ImageAsset } from "./productApi";

export type Category = {
  id: string;
  projectId?: string;
  name: string;
  slug: string;
  description?: string;
  image?: ImageAsset | null;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CategoryListResponse = {
  data: Category[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
};

const normalizeList = (response: any): CategoryListResponse => {
  const payload = response?.data ?? response;
  return {
    data: Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [],
    meta: payload?.meta,
  };
};

const unwrap = (response: any) => response?.data ?? response;

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<
      CategoryListResponse,
      { search?: string; projectId?: string } | void
    >({
      query: (params) => ({
        url: "/admin/categories",
        params: params ?? {},
      }),
      transformResponse: normalizeList,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Category" as const,
                id,
              })),
              "Categories",
            ]
          : ["Categories"],
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => `/admin/categories/${id}`,
      transformResponse: unwrap,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string } & Partial<Category>
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/categories/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        "Categories",
      ],
    }),
    deleteCategory: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
