import type { HomePageContent } from "@/store/homePageApi";

export const demoHomePage: HomePageContent = {
  isDemo: true,
  visibility: {
    hero: true,
    categories: true,
    banners: true,
    categoryProducts: true,
    bestsellers: true,
    promise: true,
  },
  hero: {
    autoplay: true,
    intervalMs: 5000,
    slides: [
      {
        id: "demo-hero-1",
        eyebrow: "Demo banner",
        title: "A brighter",
        emphasis: "everyday.",
        description: "This preview is ready to be replaced from the dashboard.",
        buttonLabel: "Shop the edit",
        buttonHref: "/products",
        imageUrl:
          "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1440&q=80",
        imageAlt: "Bright home interior",
        isActive: true,
        sortOrder: 0,
      },
      {
        id: "demo-hero-2",
        eyebrow: "Demo banner",
        title: "Made for",
        emphasis: "real life.",
        description:
          "Add your own banner, copy, and call to action in Homepage Studio.",
        buttonLabel: "Explore products",
        buttonHref: "/products",
        imageUrl:
          "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1440&q=80",
        imageAlt: "Curated home objects",
        isActive: true,
        sortOrder: 1,
      },
    ],
  },
  banners: {
    eyebrow: "More to explore",
    title: "Small changes, good energy.",
    items: [
      {
        id: "demo-banner-1",
        imageUrl:
          "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
        imageAlt: "Warm living room",
        eyebrow: "Home edit",
        title: "Make space for better",
        href: "/products?category=home",
        isActive: true,
        sortOrder: 0,
      },
      {
        id: "demo-banner-2",
        imageUrl:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
        imageAlt: "Personal care products",
        eyebrow: "Personal edit",
        title: "Rituals worth keeping",
        href: "/products?category=personal",
        isActive: true,
        sortOrder: 1,
      },
    ],
  },
  categories: [
    {
      id: "home",
      label: "Home & living",
      href: "/products?category=home",
      description: "Useful pieces for your space.",
    },
    {
      id: "personal",
      label: "Personal care",
      href: "/products?category=personal",
      description: "Small rituals, thoughtfully chosen.",
    },
    {
      id: "new",
      label: "Just in",
      href: "/products?category=new",
      description: "The latest additions to the edit.",
    },
  ],
  categorySection: {
    eyebrow: "Browse the edit",
    title: "Find your next favorite.",
  },
  bestsellers: {
    eyebrow: "Curated for you",
    title: "Shop bestsellers",
    viewAllLabel: "View all",
    productIds: ["demo-1", "demo-2", "demo-3", "demo-4"],
    limit: 4,
  },
  categoryProducts: [
    {
      categoryId: "home",
      eyebrow: "Home & living",
      title: "Objects that settle in.",
      productIds: ["demo-1", "demo-2"],
      limit: 10,
    },
    {
      categoryId: "personal",
      eyebrow: "Personal care",
      title: "Everyday rituals.",
      productIds: ["demo-3", "demo-4"],
      limit: 10,
    },
  ],
  promise: {
    eyebrow: "The store promise",
    title: "Less noise.",
    emphasis: "More meaning.",
    items: [
      {
        number: "01",
        text: "Useful products chosen to last beyond the scroll.",
      },
      {
        number: "02",
        text: "Clear pricing and delivery, with a real person behind every order.",
      },
      {
        number: "03",
        text: "Simple checkout with cash on delivery available nationwide.",
      },
    ],
  },
  footer: {
    description:
      "Thoughtful products for everyday living, delivered to your door.",
    supportLabel: "Need help?",
    supportEmail: "support@example.com",
    announcement: "Demo content - replace this homepage from the dashboard",
  },
};

export const demoProducts = [
  {
    id: "demo-1",
    name: "Linen everyday tote",
    price: 1250,
    slug: "linen-everyday-tote",
    stock: 20,
    categories: ["home"],
    isActive: true,
    thumbnailImage: {
      url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    },
  },
  {
    id: "demo-2",
    name: "Soft morning mug",
    price: 780,
    slug: "soft-morning-mug",
    stock: 20,
    categories: ["home"],
    isActive: true,
    thumbnailImage: {
      url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    },
  },
  {
    id: "demo-3",
    name: "Daily wash bar",
    price: 520,
    slug: "daily-wash-bar",
    stock: 20,
    categories: ["personal"],
    isActive: true,
    thumbnailImage: {
      url: "https://images.unsplash.com/photo-1607006344380-b6775a0824ad?auto=format&fit=crop&w=800&q=80",
    },
  },
  {
    id: "demo-4",
    name: "Quiet hand cream",
    price: 690,
    slug: "quiet-hand-cream",
    stock: 20,
    categories: ["personal"],
    isActive: true,
    thumbnailImage: {
      url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
    },
  },
];
