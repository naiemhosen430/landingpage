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

const unwrap = (response: any): HomePageContent =>
  response?.data?.data ?? response?.data ?? response;

export const homePageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getHomePage: builder.query<HomePageContent, void>({
      query: () => "/admin/home-page",
      transformResponse: unwrap,
      providesTags: ["HomePage"],
    }),
    updateHomePage: builder.mutation<HomePageContent, Partial<HomePageContent>>(
      {
        query: (body) => ({ url: "/admin/home-page", method: "PUT", body }),
        transformResponse: unwrap,
        invalidatesTags: ["HomePage"],
      },
    ),
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
