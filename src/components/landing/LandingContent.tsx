"use client";

import { useEffect, useRef } from "react";

interface LandingContentProps {
  html: string;
}

export default function LandingContent({ html }: LandingContentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scripts = Array.from(container.querySelectorAll("script"));
    scripts.forEach((oldScript) => {
      const scriptSource = oldScript.src.toLowerCase();
      const scriptCode = oldScript.textContent?.toLowerCase() ?? "";
      const isAnalyticsBootstrap =
        scriptSource.includes("connect.facebook.net") ||
        scriptSource.includes("fbevents.js") ||
        scriptSource.includes("analytics.tiktok.com") ||
        scriptSource.includes("tiktok.com/i18n/pixel") ||
        scriptCode.includes("fbq(") ||
        scriptCode.includes("fbevents.js") ||
        scriptCode.includes("ttq.load") ||
        scriptCode.includes("tiktok.com/i18n/pixel");

      if (isAnalyticsBootstrap) {
        oldScript.remove();
        return;
      }

      const script = document.createElement("script");
      script.async = false;

      if (oldScript.src) {
        script.src = oldScript.src;
      } else {
        script.text = oldScript.innerHTML;
      }

      oldScript.parentNode?.replaceChild(script, oldScript);
    });

    const links = Array.from(container.querySelectorAll("a"));
    links.forEach((link) => {
      if (!link.target) {
        link.target = "_self";
      }
    });
  }, [html]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}
