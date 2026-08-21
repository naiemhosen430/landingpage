import { api } from "./api";

export type ImageAsset = {
  publicId: string;
  url: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
};

export type UploadResult = ImageAsset & {
  bytes: number;
  folder: string;
};

export type ProductVariant = {
  id?: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  lowStockThreshold: number;
  attributes: Record<string, string>;
  image?: ImageAsset;
  isActive: boolean;
};

export type Product = {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  thumbnailImage?: ImageAsset;
  images: ImageAsset[];
  categories: string[];
  tags: string[];
  variants: ProductVariant[];
  attributes: Record<string, string>;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductListResponse = {
  data: Product[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
};

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  featured?: boolean;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const unwrapPayload = (response: any) => response?.data ?? response;

const normalizeProductList = (response: any): ProductListResponse => {
  const payload = unwrapPayload(response);
  if (Array.isArray(payload)) return { data: payload };
  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    meta: payload?.meta,
  };
};

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResponse, ProductQueryParams | void>({
      query: (params) => ({
        url: "/admin/products",
        params: params ?? {},
      }),
      transformResponse: normalizeProductList,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              "Products",
            ]
          : ["Products"],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/admin/products/${id}`,
      transformResponse: (response: any) => unwrapPayload(response),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (data) => ({
        url: "/admin/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<
      Product,
      { id: string; [key: string]: any }
    >({
      query: ({ id, ...data }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Products",
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    uploadImages: builder.mutation<
      UploadResult | UploadResult[],
      { projectId?: string; folder?: string; images: string[] }
    >({
      query: (body) => ({
        url: "/admin/uploads",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => unwrapPayload(response),
    }),
    deleteImages: builder.mutation<
      any,
      { projectId?: string; publicId?: string; publicIds?: string[] }
    >({
      query: (body) => ({
        url: "/admin/uploads",
        method: "DELETE",
        body,
      }),
    }),
    getCategories: builder.query({
      query: () => "/admin/categories",
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImagesMutation,
  useDeleteImagesMutation,
  useGetCategoriesQuery,
} = productApi;
