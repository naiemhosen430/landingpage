"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Grid2X2,
  Headset,
  Menu,
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

export const Header: React.FC<HeaderProps> = ({
  settings,
  categories = [],
  searchTerm = "",
  onSearchChange,
  onOpenCart,
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => setLocalSearch(searchTerm), [searchTerm]);

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
          {phone ? <a href={`tel:${phone}`}>Phone: {phone}</a> : <span>Free delivery on selected orders</span>}
        </div>
      </div>

      <div className="store-main-header">
        <div className="store-header-inner store-main-header-inner">
          <Link href="/" className="store-brand" aria-label={`${storeName} home`}>
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
    </header>
  );
};
