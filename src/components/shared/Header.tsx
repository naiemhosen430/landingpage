"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  MapPin,
  MoreVertical,
  PackageSearch,
  ShoppingBag,
  Search,
  UserRound,
  X,
  Phone,
  Menu,
} from "lucide-react";
import type { PublicSettings } from "@/store/publicApi";
import type { Category } from "@/store/categoryApi";
import { useAppSelector } from "@/store/hooks";
import { selectCartTotalItems } from "@/store/cartSlice";
import { getSocialIcon } from "@/lib/socialIcons";

interface HeaderProps {
  settings?: PublicSettings;
  categories?: Category[];
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
  onOpenCart,
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const addressEntries = Object.entries(
    settings?.contact?.address ?? {},
  ).filter(([, value]) => Boolean(value));
  const socialLinks = Object.entries(
    settings?.contact?.socialLinks ?? {},
  ).filter(([, url]) => Boolean(url));

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="store-header">
      <div className="store-utility-bar">
        <div className="store-header-inner">
          {email ? (
            <a className="store-utility-contact" href={`mailto:${email}`}>
              <Mail size={12} aria-hidden="true" />
              Email: {email}
            </a>
          ) : (
            <span>Welcome to our store</span>
          )}
          {announcement && (
            <span className="store-utility-announcement">{announcement}</span>
          )}
          {phone ? (
            <a className="store-utility-contact" href={`tel:${phone}`}>
              <Phone size={12} aria-hidden="true" />
              Phone: {phone}
            </a>
          ) : (
            <span>Free delivery on selected orders</span>
          )}
          <Link className="store-utility-contact" href="/track-order">
            <PackageSearch size={13} aria-hidden="true" />
            Track order
          </Link>
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

          <form className="store-header-search" action="/search" method="get">
            <input
              type="search"
              name="search"
              aria-label="Search products"
              placeholder="Search products..."
            />
            <button type="submit" aria-label="Search products">
              <Search size={18} />
            </button>
          </form>

          <nav className="store-header-actions" aria-label="Store actions">
            <Link
              href="/search"
              className="store-action-button store-mobile-search"
              aria-label="Search products"
              title="Search products"
            >
              <Search size={19} />
            </Link>
            <button
              type="button"
              className="store-action-button store-cart-action"
              onClick={() => (onOpenCart ? onOpenCart() : router.push("/cart"))}
              aria-label={`Shopping cart, ${totalItems} items`}
              title="Shopping cart"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && <strong>{totalItems}</strong>}
            </button>
            <Link
              href="/login"
              className="store-action-button"
              aria-label="Log in"
              title="Log in"
            >
              <UserRound size={19} />
            </Link>
            <Link
              href="/track-order"
              className="store-action-button"
              aria-label="Track order"
              title="Track order"
            >
              <PackageSearch size={19} />
            </Link>
            <button
              type="button"
              className="store-action-button store-menu-toggle"
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="store-mobile-drawer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              title={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </div>

        {mobileMenuOpen && (
          <div className="store-mobile-overlay">
            <button
              type="button"
              className="store-mobile-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            />
            <aside
              className="store-mobile-drawer"
              id="store-mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Store menu"
            >
              <div className="store-mobile-drawer-header">
                <h2>Menu</h2>
                <button
                  type="button"
                  className="store-drawer-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={19} />
                </button>
              </div>
              <div className="store-mobile-drawer-content">
                <nav className="store-mobile-navigation" aria-label="Store">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All products
                  </Link>
                  <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                    My cart ({totalItems})
                  </Link>
                  <Link
                    href="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Track order
                  </Link>
                  {categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${encodeURIComponent(category.slug)}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
                {(phone || email || addressEntries.length > 0) && (
                  <section className="store-mobile-contact">
                    <h3>Contact</h3>
                    {phone && (
                      <a href={`tel:${phone}`}>
                        <Phone size={15} aria-hidden="true" />
                        <span>{phone}</span>
                      </a>
                    )}
                    {email && (
                      <a href={`mailto:${email}`}>
                        <Mail size={15} aria-hidden="true" />
                        <span>{email}</span>
                      </a>
                    )}
                    {addressEntries.map(([label, value]) => (
                      <div className="store-mobile-contact-detail" key={label}>
                        <MapPin size={15} aria-hidden="true" />
                        <p>
                          <strong>{formatContactLabel(label)}:</strong> {value}
                        </p>
                      </div>
                    ))}
                  </section>
                )}
                {socialLinks.length > 0 && (
                  <section className="store-mobile-contact">
                    <h3>Social links</h3>
                    {socialLinks.map(([network, url]) => {
                      const SocialIcon = getSocialIcon(network);
                      return (
                        <a
                          key={network}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <SocialIcon size={15} aria-hidden="true" />
                          <span>{formatContactLabel(network)}</span>
                        </a>
                      );
                    })}
                  </section>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </header>
  );
};
