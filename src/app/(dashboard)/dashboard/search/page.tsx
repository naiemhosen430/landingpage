"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  useGlobalSearchQuery,
  type GlobalSearchResult,
} from "@/store/searchApi";

const dashboardPages = [
  {
    title: "Dashboard",
    description: "Overview and recent activity",
    href: "/dashboard",
  },
  {
    title: "Products",
    description: "Product catalogue and inventory",
    href: "/dashboard/products",
  },
  {
    title: "Categories",
    description: "Product categories",
    href: "/dashboard/categories",
  },
  {
    title: "Orders",
    description: "Customer orders and payments",
    href: "/dashboard/orders",
  },
  {
    title: "Home page",
    description: "Website homepage content",
    href: "/dashboard/home-page",
  },
  {
    title: "Subscription",
    description: "Plan and billing information",
    href: "/dashboard/subscription",
  },
  {
    title: "Storage",
    description: "Storage usage and uploaded files",
    href: "/dashboard/storage",
  },
  {
    title: "Courier",
    description: "Courier providers",
    href: "/dashboard/courier",
  },
  {
    title: "Delivery Areas",
    description: "Shipping regions and delivery charges",
    href: "/dashboard/delivery-areas",
  },
  {
    title: "Payment Methods",
    description: "Checkout payment options",
    href: "/dashboard/payment-methods",
  },
  {
    title: "Media Library",
    description: "Store images and uploaded media",
    href: "/dashboard/media",
  },
  {
    title: "Landing Pages",
    description: "Campaign and custom landing pages",
    href: "/dashboard/landing-pages",
  },
  {
    title: "Recycle Bin",
    description: "Recently deleted store data",
    href: "/dashboard/recycle-bin",
  },
  {
    title: "Settings",
    description: "Store, branding, and contact settings",
    href: "/dashboard/settings",
  },
  {
    title: "Profile",
    description: "Your account profile",
    href: "/dashboard/profile",
  },
];

function DashboardSearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeQuery = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(routeQuery);
  const [offset, setOffset] = useState(0);
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const query = routeQuery.trim();
  const { currentData, isLoading, isFetching, isError } = useGlobalSearchQuery(
    { query, offset },
    { skip: query.length < 2 },
  );

  useEffect(() => {
    setSearch(routeQuery);
    setOffset(0);
    setResults([]);
    setHasMore(false);
  }, [routeQuery]);

  useEffect(() => {
    if (!currentData) return;
    setResults((previous) => {
      if (offset === 0) return currentData.results;
      const seen = new Set(
        previous.map((result) => `${result.type}-${result.id}`),
      );
      return [
        ...previous,
        ...currentData.results.filter(
          (result) => !seen.has(`${result.type}-${result.id}`),
        ),
      ];
    });
    setHasMore(currentData.hasMore);
  }, [currentData, offset]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = search.trim();
    if (nextQuery.length >= 2) {
      router.push(`/dashboard/search?q=${encodeURIComponent(nextQuery)}`);
    }
  };

  const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const pageResults = dashboardPages.filter((page) => {
    const searchable = `${page.title} ${page.description}`.toLocaleLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
  const loading = isLoading || isFetching;

  return (
    <section className="global-search-page">
      <div className="page-header">
        <div>
          <h1>Search</h1>
          <p>Find records and pages across your store dashboard.</p>
        </div>
      </div>

      <form
        className="global-search-form"
        role="search"
        onSubmit={submitSearch}
      >
        <Search size={20} aria-hidden="true" />
        <input
          autoFocus
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products, orders, customers, settings..."
          aria-label="Search the store dashboard"
        />
        <button type="submit" disabled={search.trim().length < 2}>
          Search
        </button>
      </form>

      {query.length < 2 ? (
        <div className="global-search-state">
          Enter at least two characters to search.
        </div>
      ) : (
        <>
          <div className="global-search-summary" aria-live="polite">
            {loading
              ? "Searching..."
              : `Results for “${query}” · ${pageResults.length + results.length} ${hasMore ? "shown" : "found"}`}
          </div>

          {isError && (
            <div
              className="global-search-state global-search-error"
              role="alert"
            >
              Search could not be completed. Please try again.
            </div>
          )}

          {!loading &&
            !isError &&
            pageResults.length === 0 &&
            results.length === 0 && (
              <div className="global-search-state">
                No matching records or dashboard pages were found.
              </div>
            )}

          {pageResults.length > 0 && (
            <section className="global-search-section">
              <h2>Dashboard pages</h2>
              <div className="global-search-results">
                {pageResults.map((page) => (
                  <Link
                    className="global-search-result"
                    href={page.href}
                    key={page.href}
                  >
                    <span className="global-search-result-icon">
                      <Search size={17} aria-hidden="true" />
                    </span>
                    <span className="global-search-result-copy">
                      <strong>{page.title}</strong>
                      <span>{page.description}</span>
                    </span>
                    <span className="global-search-result-type">Page</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.length > 0 && (
            <section className="global-search-section">
              <h2>Store data</h2>
              <div className="global-search-results">
                {results.map((result) => (
                  <Link
                    className="global-search-result"
                    href={result.href}
                    key={`${result.type}-${result.id}`}
                  >
                    <span className="global-search-result-icon">
                      <Search size={17} aria-hidden="true" />
                    </span>
                    <span className="global-search-result-copy">
                      <strong>{result.title}</strong>
                      <span>{result.subtitle}</span>
                    </span>
                    <span className="global-search-result-type">
                      {result.type}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {hasMore && !isError && (
            <div className="global-search-more">
              <button
                type="button"
                onClick={() => setOffset((current) => current + 8)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load more results"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function DashboardSearchPage() {
  return (
    <Suspense
      fallback={<div className="global-search-state">Loading search...</div>}
    >
      <DashboardSearchResults />
    </Suspense>
  );
}
