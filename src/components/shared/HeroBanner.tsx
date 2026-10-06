"use client";

import React from "react";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  imageUrl?: string;
  paginationCount?: number;
  activePage?: number;
  onSelectPage?: (index: number) => void;
  onCtaClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "Discover Our New Collection",
  subtitle = "Explore the latest arrivals designed for effortless everyday style.",
  ctaText = "Shop Now",
  imageUrl,
  paginationCount = 1,
  activePage = 0,
  onSelectPage,
  onCtaClick,
}) => {
  return (
    <section className="store-hero">
      <div
        className="store-hero-image"
        role="img"
        aria-label={title || "Featured collection"}
        style={{
          backgroundImage: `url("${imageUrl || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85"}")`,
        }}
      />
      <div className="store-hero-copy">
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
        <button
          type="button"
          onClick={onCtaClick}
          className="store-hero-cta"
        >
          {ctaText} <span aria-hidden="true">→</span>
        </button>
      </div>
      {paginationCount > 1 && (
        <div className="store-hero-pagination" aria-label="Featured slides">
          {Array.from({ length: paginationCount }).map((_, index) => (
            <button
              type="button"
              key={index}
              className={index === activePage ? "is-active" : ""}
              aria-label={`Show featured slide ${index + 1}`}
              aria-current={index === activePage ? "true" : undefined}
              onClick={() => onSelectPage?.(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
