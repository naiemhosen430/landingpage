"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Grid2X2,
  Headset,
  Menu,
  MoreVertical,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import type { PublicSettings } from "@/store/publicApi";
import type { Category } from "@/store/categoryApi";
import { useAppSelector } from "@/store/hooks";
import { selectCartTotalItems } from "@/store/cartSlice";

interface HeaderProps {
  settings?: PublicSettings;
  categories?: Category[];
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onOpenCart?: () => void;
}

function formatContactLabel(label: string) {
  return label
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  categories = [],
  searchTerm = "",
  onSearchChange,
  onOpenCart,
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactDrawerOpen, setContactDrawerOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const totalItems = useAppSelector(selectCartTotalItems);
  const storeName =
    settings?.branding?.storeName ||
    settings?.store?.storeName ||
    settings?.store?.name ||
    "Store";
  const logo =
    settings?.branding?.logoUrl ||
    settings?.branding?.logo ||
    settings?.store?.logoUrl ||
    settings?.store?.logo;

  const email = settings?.contact?.email;
  const phone = settings?.contact?.phone;
  const announcement = settings?.store?.announcement;
  const addressEntries = Object.entries(settings?.contact?.address ?? {}).filter(
    ([, value]) => Boolean(value),
  );
  const socialLinks = Object.entries(
    settings?.contact?.socialLinks ?? {},
  ).filter(([, url]) => Boolean(url));

  useEffect(() => setLocalSearch(searchTerm), [searchTerm]);

  useEffect(() => {
    if (!contactDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setContactDrawerOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contactDrawerOpen]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSearchChange) {
      onSearchChange(localSearch);
    } else {
      router.push(
        localSearch.trim()
          ? `/products?search=${encodeURIComponent(localSearch.trim())}`
          : "/products",
      );
    }
  };

  const renderSearch = (mobile = false) => (
    <form
      className={`store-search ${mobile ? "store-search-mobile" : ""}`}
      onSubmit={handleSearchSubmit}
      role="search"
    >
      <input
        aria-label="Search products"
        type="search"
        placeholder="Search masterpieces..."
        value={localSearch}
        onChange={(event) => {
          setLocalSearch(event.target.value);
          onSearchChange?.(event.target.value);
        }}
      />
      <button type="submit" aria-label="Search">
        <Search size={14} />
        <span>Search</span>
      </button>
    </form>
  );

  return (
    <header className="store-header">
      <div className="store-utility-bar">
        <div className="store-header-inner">
          <span>{email ? `Email: ${email}` : "Welcome to our store"}</span>
          {announcement && (
            <span className="store-utility-announcement">{announcement}</span>
          )}
          {phone ? (
            <a href={`tel:${phone}`}>Phone: {phone}</a>
          ) : (
            <span>Free delivery on selected orders</span>
          )}
        </div>
      </div>

      <div className="store-main-header">
        <div className="store-header-inner store-main-header-inner">
          <Link
            href="/"
            className="store-brand"
            aria-label={`${storeName} home`}
          >
            {logo ? (
              <img src={logo} alt={storeName} />
            ) : (
              <span>{storeName}</span>
            )}
          </Link>

          <div className="store-header-search">{renderSearch()}</div>

          <nav className="store-header-actions" aria-label="Store actions">
            <Link href="/products" aria-label="Browse products" title="Browse">
              <Grid2X2 size={17} />
            </Link>
            {email && (
              <a
                href={`mailto:${email}`}
                aria-label="Contact customer support"
                title="Customer support"
              >
                <Headset size={17} />
              </a>
            )}
            <button
              type="button"
              className="store-cart-action"
              onClick={() => (onOpenCart ? onOpenCart() : router.push("/cart"))}
              aria-label={`Shopping cart, ${totalItems} items`}
            >
              <ShoppingBag size={16} />
              <span>My Cart</span>
              <strong>{totalItems}</strong>
            </button>
            <button
              type="button"
              className="store-contact-trigger"
              onClick={() => setContactDrawerOpen(true)}
              aria-label="Open contact and social links"
              aria-haspopup="dialog"
              aria-expanded={contactDrawerOpen}
            >
              <MoreVertical size={19} />
            </button>
          </nav>

          <button
            type="button"
            className="store-mobile-toggle"
            onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="store-mobile-menu">
            {renderSearch(true)}
            <Link href="/products">All products</Link>
            <Link href="/cart">My cart ({totalItems})</Link>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {contactDrawerOpen && (
        <div className="store-contact-overlay">
          <button
            type="button"
            className="store-contact-backdrop"
            onClick={() => setContactDrawerOpen(false)}
            aria-label="Close contact and social links"
          />
          <aside
            className="store-contact-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-contact-title"
          >
            <div className="store-contact-drawer-header">
              <div>
                <span>We are here to help</span>
                <h2 id="store-contact-title">Contact &amp; social</h2>
              </div>
              <button
                type="button"
                className="store-contact-close"
                onClick={() => setContactDrawerOpen(false)}
                aria-label="Close contact and social links"
              >
                <X size={19} />
              </button>
            </div>

            <div className="store-contact-drawer-content">
              {phone && (
                <section className="store-contact-section">
                  <h3>Phone</h3>
                  <a href={`tel:${phone}`}>{phone}</a>
                </section>
              )}

              {email && (
                <section className="store-contact-section">
                  <h3>Email</h3>
                  <a href={`mailto:${email}`}>{email}</a>
                </section>
              )}

              {addressEntries.map(([label, value]) => (
                <section className="store-contact-section" key={label}>
                  <h3>{formatContactLabel(label)}</h3>
                  <p>{value}</p>
                </section>
              ))}

              {socialLinks.length > 0 && (
                <section className="store-contact-section">
                  <h3>Social links</h3>
                  <div className="store-contact-social-links">
                    {socialLinks.map(([network, url]) => (
                      <a
                        key={network}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {formatContactLabel(network)}
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {!phone &&
                !email &&
                addressEntries.length === 0 &&
                socialLinks.length === 0 && (
                  <p className="store-contact-empty">
                    Contact details are not available right now.
                  </p>
                )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};
