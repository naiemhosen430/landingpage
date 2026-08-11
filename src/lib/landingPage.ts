export type LandingPageData = {
  id: string;
  projectId: string;
  pageName: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  landingContent: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectKey = process.env.NEXT_PUBLIC_PROJECT_KEY;

export async function fetchPublicLandingPage(
  slug: string,
): Promise<LandingPageData | null> {
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_URL must be defined");
  }

  const res = await fetch(
    `${apiBase}/public/v1/landing-pages/${encodeURIComponent(slug)}`,
    {
      headers: {
        "x-project-id": projectId ?? "",
        "x-project-key": projectKey ?? "",
      },
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json?.data ?? null;
}
