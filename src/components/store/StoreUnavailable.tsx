"use client";

import { Store, RefreshCw, MessageCircle } from "lucide-react";

export default function StoreUnavailable() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-card shadow-sm">
          <Store className="h-9 w-9 text-foreground" strokeWidth={1.7} />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          We’ll Be Back Soon
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
          This store is temporarily unavailable at the moment. We’re working
          behind the scenes to get everything ready for you.
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          Thank you for your patience and understanding.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>

        <div className="mt-10 border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">
            Please check back again shortly.
          </p>
        </div>
      </div>
    </main>
  );
}
