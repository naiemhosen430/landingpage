"use client";

import { useEffect, useState } from "react";

interface ThemeToggleProps {
  rootSelector?: string;
}

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem("dashboard-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch (e) {
    return "light";
  }
};

export default function ThemeToggle({ rootSelector }: ThemeToggleProps) {
  const [theme, setTheme] = useState<string>(getInitialTheme);

  useEffect(() => {
    const root = rootSelector
      ? document.querySelector(rootSelector)
      : document.documentElement;

    if (!root) return;

    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("dashboard-theme", theme);
    } catch (e) {}
  }, [theme, rootSelector]);

  return (
    <button
      className="btn btn-ghost"
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 19v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.2 4.2l1.4 1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.4 18.4l1.4 1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
