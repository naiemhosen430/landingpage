import { api } from "./api";

export type HomePageSlide = {
  id: string;
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  imageAlt?: string;
  accentColor?: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomePageBanner = {
  id: string;
  imageUrl: string;
  imageAlt: string;
  eyebrow?: string;
  title?: string;
  href?: string;
  isActive: boolean;
  sortOrder: number;
};

export type HomePageContent = {
  id?: string;
  isDemo?: boolean;
  visibility: {
    hero: boolean;
    categories: boolean;
    banners: boolean;
    categoryProducts: boolean;
    bestsellers: boolean;
    promise: boolean;
  };
  hero: { slides: HomePageSlide[]; autoplay: boolean; intervalMs: number };
  banners: { eyebrow: string; title: string; items: HomePageBanner[] };
  categories: Array<{
    id: string;
    label: string;
    href?: string;
    description?: string;
    imageUrl?: string;
  }>;
  categorySection: { eyebrow: string; title: string };
  bestsellers: {
    eyebrow: string;
    title: string;
    description?: string;
    viewAllLabel: string;
    productIds: string[];
    limit: number;
  };
  categoryProducts: Array<{
    categoryId: string;
    eyebrow?: string;
    title: string;
    productIds: string[];
    limit: number;
  }>;
  promise: {
    eyebrow: string;
    title: string;
    emphasis: string;
    items: Array<{ number: string; text: string }>;
  };
  footer: {
    description: string;
    supportLabel: string;
    supportEmail: string;
    announcement: string;
  };
  updatedAt?: string;
};

export type HomePageEditorContent = {
  visibility: {
    hero: boolean;
    banners: boolean;
    categories: boolean;
    bestsellers: boolean;
    categoryProducts: boolean;
    promise: boolean;
    footer: boolean;
  };
  hero: { slides: HomePageSlide[]; autoplay: boolean; intervalMs: number };
  banners: { eyebrow: string; title: string; items: HomePageBanner[] };
  categories: { eyebrow: string; title: string; categoryIds: string[] };
  categorySection: {
    eyebrow: string;
    title: string;
    categoryIds: string[];
  };
  bestsellers: {
    eyebrow: string;
    title: string;
    limit: number;
    viewAllLabel: string;
    productIds: string[];
  };
  categoryProducts: {
    enabled: boolean;
    items: HomePageContent["categoryProducts"];
  };
  promise: {
    eyebrow: string;
    title: string;
    emphasis: string;
    items: Array<{ number: string; text: string }>;
  };
  footer: {
    supportEmail: string;
    description: string;
    topAnnouncement: string;
  };
};

type HomePageUpdateData = Omit<
  HomePageEditorContent,
  "categories" | "categoryProducts"
> & {
  categories: HomePageContent["categories"];
  categoryProducts: HomePageContent["categoryProducts"];
};

const unwrap = (response: any): HomePageContent =>
  response?.data?.data ?? response?.data ?? response;

const unwrapEditor = (response: any): HomePageEditorContent => {
  const data = response?.data?.data ?? response?.data ?? response;
  return {
    ...data,
    categories: Array.isArray(data.categories)
      ? {
          eyebrow: data.categorySection?.eyebrow ?? "Shop by Category",
          title: data.categorySection?.title ?? "Explore our categories",
          categoryIds: data.categories.map((category: { id: string }) =>
            String(category.id),
          ),
        }
      : data.categories,
    categoryProducts: Array.isArray(data.categoryProducts)
      ? { enabled: true, items: data.categoryProducts }
      : data.categoryProducts,
  };
};

export const homePageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomePage: builder.query<
      HomePageEditorContent,
      { projectId?: string } | void
    >({
      query: () => "/admin/home-page",
      transformResponse: unwrapEditor,
      providesTags: ["HomePage"],
    }),
    updateHomePage: builder.mutation<
      HomePageEditorContent,
      { projectId?: string; data: HomePageUpdateData }
    >({
      query: (body) => ({ url: "/admin/home-page", method: "PUT", body }),
      transformResponse: unwrapEditor,
      invalidatesTags: ["HomePage"],
    }),
    getPublicHomePage: builder.query<HomePageContent, void>({
      query: () => "/public/v1/home-page",
      transformResponse: unwrap,
      providesTags: ["HomePage"],
    }),
  }),
});

export const {
  useGetHomePageQuery,
  useUpdateHomePageMutation,
  useGetPublicHomePageQuery,
} = homePageApi;
