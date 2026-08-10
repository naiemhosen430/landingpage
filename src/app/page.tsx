"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  useGetPublicProductsQuery,
  useGetLandingPageQuery,
  useTrackVisitorMutation,
} from "@/store/publicApi";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { formatCurrency } from "@/lib/utils";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function LandingPage() {
  const { data: landingData } = useGetLandingPageQuery(undefined);
  const { data: productsData } = useGetPublicProductsQuery({ limit: 8 });
  const [trackVisitor] = useTrackVisitorMutation();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Track visitor on mount
  // Track visitor on mount
  useEffect(() => {
    trackVisitor({
      page: "/",
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      device: /Mobile|Android|iPhone/i.test(navigator.userAgent)
        ? "mobile"
        : "desktop",
    });
  }, [trackVisitor]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images?.[0]?.url,
        },
      ];
    });
    setShowCheckout(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const landing = landingData?.data;
  const products = productsData?.data || [];

  const scrollToCheckout = () => {
    setShowCheckout(true);
    setTimeout(() => {
      document
        .getElementById("checkout")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <style>{`
        .lp-root {
          font-family: var(--font-sans);
          color: var(--text-primary);
          background: radial-gradient(circle at top, rgba(56, 189, 248, 0.08), transparent 22%), var(--bg-secondary);
          min-height: 100%;
        }

        .lp-hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%);
          color: var(--text-inverse);
          position: relative;
          overflow: hidden;
        }

        .lp-hero-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 80px 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          width: 100%;
        }

        .lp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          font-size: 14px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          color: rgba(255, 255, 255, 0.9);
        }

        .lp-hero h1 {
          font-size: clamp(3rem, 5vw, 4.8rem);
          font-weight: 800;
          line-height: 1.03;
          margin-bottom: 24px;
          letter-spacing: -0.04em;
          max-width: 12ch;
        }

        .lp-hero p {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.75;
          margin-bottom: 36px;
          max-width: 540px;
        }

        .lp-hero-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .lp-btn-primary,
        .lp-btn-secondary {
          padding: 14px 32px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
        }

        .lp-btn-primary {
          background: var(--primary);
          color: white;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .lp-btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        .lp-btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.18);
          cursor: pointer;
        }

        .lp-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
        }

        .lp-hero-img {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.35);
          min-height: 420px;
          background: radial-gradient(circle at top, rgba(99, 102, 241, 0.15), transparent 45%), var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lp-section {
          padding: 80px 24px;
          max-width: 1240px;
          margin: 0 auto;
        }

        .lp-section-title {
          text-align: center;
          margin-bottom: 48px;
        }

        .lp-section-title h2 {
          font-size: clamp(2.25rem, 3.5vw, 3rem);
          font-weight: 800;
          margin-bottom: 12px;
        }

        .lp-section-title p {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .lp-features,
        .lp-testimonials {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .lp-feature,
        .lp-testimonial,
        .lp-product,
        .lp-faq-item {
          border-radius: 22px;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .lp-feature {
          padding: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(148, 163, 184, 0.14);
          text-align: center;
        }

        .lp-feature:hover,
        .lp-product:hover,
        .lp-testimonial:hover,
        .lp-faq-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
          border-color: rgba(99, 102, 241, 0.26);
        }

        .lp-feature-icon {
          width: 64px;
          height: 64px;
          background: rgba(99, 102, 241, 0.14);
          color: var(--primary);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .lp-feature h3 {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .lp-feature p {
          font-size: 0.96rem;
          color: var(--text-secondary);
          line-height: 1.8;
        }

        .lp-products {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
        }

        .lp-product {
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(255, 255, 255, 0.04);
        }

        .lp-product-img {
          aspect-ratio: 1;
          background: rgba(148, 163, 184, 0.08);
          position: relative;
          overflow: hidden;
        }

        .lp-product-info {
          padding: 20px;
        }

        .lp-product-name {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 8px;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .lp-product-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 14px;
        }

        .lp-product-btn {
          width: 100%;
          padding: 12px 0;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .lp-product-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .lp-testimonial {
          padding: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(148, 163, 184, 0.14);
        }

        .lp-stars {
          color: #f59e0b;
          margin-bottom: 18px;
          font-size: 1rem;
          letter-spacing: 0.06em;
        }

        .lp-testimonial p {
          font-size: 0.97rem;
          line-height: 1.8;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .lp-testimonial-author {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .lp-testimonial-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.16);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
        }

        .lp-testimonial-name {
          font-weight: 700;
          margin-bottom: 4px;
        }

        .lp-testimonial-role {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .lp-faq-item {
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(255, 255, 255, 0.04);
        }

        .lp-faq-question {
          width: 100%;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          color: var(--text-primary);
        }

        .lp-faq-answer {
          padding: 0 24px 22px;
          font-size: 0.98rem;
          color: var(--text-secondary);
          line-height: 1.75;
        }

        .lp-checkout-section {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%);
          padding: 80px 24px;
        }

        .lp-checkout-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .lp-checkout-title {
          text-align: center;
          margin-bottom: 40px;
        }

        .lp-checkout-title h2 {
          font-size: clamp(2.1rem, 3vw, 2.75rem);
          margin-bottom: 10px;
        }

        .lp-checkout-title p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .lp-cart-items {
          display: grid;
          gap: 12px;
          margin-bottom: 32px;
        }

        .lp-cart-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 18px;
        }

        .lp-cart-item-img {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(148, 163, 184, 0.1);
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }

        .lp-cart-item-info {
          flex: 1;
          min-width: 0;
        }

        .lp-cart-item-name {
          font-weight: 700;
          font-size: 0.98rem;
          margin-bottom: 4px;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lp-cart-item-price {
          font-size: 0.92rem;
          color: var(--text-secondary);
        }

        .lp-cart-item-remove {
          color: var(--danger);
          cursor: pointer;
          padding: 8px;
          background: transparent;
          border: none;
          border-radius: 12px;
          transition: background 0.2s ease;
        }

        .lp-cart-item-remove:hover {
          background: rgba(249, 115, 22, 0.08);
        }

        .card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
        }

        .card-body {
          padding: 28px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;
          margin-bottom: 10px;
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 600;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.06);
          color: #ffff;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-size: 0.95rem;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: rgba(99, 102, 241, 0.55);
          box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.1);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-textarea {
          resize: vertical;
          min-height: 96px;
        }

        .form-error {
          margin-top: 8px;
          color: var(--danger);
          font-size: 0.86rem;
        }

        .lp-footer {
          background: transparent;
          color: rgba(203, 213, 225, 0.8);
          padding: 48px 24px;
          text-align: center;
          font-size: 0.95rem;
          border-top: 1px solid rgba(148, 163, 184, 0.09);
        }

        .lp-footer p {
          margin: 0;
        }

        .lp-sticky-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.96);
          border-top: 1px solid rgba(148, 163, 184, 0.12);
          padding: 14px 24px;
          display: flex;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .lp-sticky-cta button {
          padding: 14px 30px;
          border-radius: 14px;
        }

        @media (max-width: 1024px) {
          .lp-hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .lp-hero-img {
            min-height: 320px;
          }

          .lp-section {
            padding: 64px 20px;
          }

          .lp-products {
            grid-template-columns: repeat(2, minmax(220px, 1fr));
          }
        }

        @media (max-width: 760px) {
          .lp-hero {
            min-height: auto;
          }

          .lp-hero-inner {
            gap: 28px;
            padding: 56px 20px;
          }

          .lp-hero h1 {
            font-size: 2.7rem;
          }

          .lp-hero p {
            margin: 0 auto 28px;
          }

          .lp-hero-btns {
            flex-direction: column;
            align-items: stretch;
          }

          .lp-products,
          .lp-features,
          .lp-testimonials {
            grid-template-columns: 1fr;
          }

          .lp-section {
            padding: 48px 20px;
          }

          .lp-checkout-section {
            padding: 56px 20px;
          }

          .lp-cart-item {
            flex-wrap: wrap;
            justify-content: space-between;
          }

          .lp-cart-item-info {
            width: 100%;
          }
        }
      `}</style>

      <div className="lp-root">
        {/* Hero */}
        <section className="lp-hero">
          <div className="lp-hero-inner">
            <div>
              <div className="lp-hero-badge">
                <span>✨</span> New Collection Available
              </div>
              <h1>{landing?.hero?.title || "Welcome to Our Store"}</h1>
              <p>
                {landing?.hero?.description ||
                  "Discover premium quality products at unbeatable prices. Fast delivery across Bangladesh."}
              </p>
              <div className="lp-hero-btns">
                <button className="lp-btn-primary" onClick={scrollToCheckout}>
                  Shop Now
                </button>
                <button
                  className="lp-btn-secondary"
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View Products
                </button>
              </div>
            </div>
            <div className="lp-hero-img">
              {landing?.hero?.image ? (
                <Image
                  src={landing.hero.image}
                  alt="Hero"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                  }}
                >
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="lp-section">
          <div className="lp-section-title">
            <h2>Why Choose Us</h2>
            <p>We provide the best shopping experience</p>
          </div>
          <div className="lp-features">
            {(
              landing?.features || [
                {
                  icon: "🚚",
                  title: "Fast Delivery",
                  description:
                    "Get your orders delivered within 24-48 hours across Bangladesh.",
                },
                {
                  icon: "✅",
                  title: "Quality Guaranteed",
                  description:
                    "Every product is carefully checked before shipping to you.",
                },
                {
                  icon: "🔒",
                  title: "Secure Payment",
                  description:
                    "Pay with confidence using our secure payment methods.",
                },
              ]
            ).map((f: any, i: number) => (
              <div key={i} className="lp-feature">
                <div className="lp-feature-icon">
                  <span style={{ fontSize: 24 }}>{f.icon}</span>
                </div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="lp-section" id="products">
          <div className="lp-section-title">
            <h2>Our Products</h2>
            <p>Handpicked items just for you</p>
          </div>
          <div className="lp-products">
            {products.map((product: any) => (
              <div key={product.id} className="lp-product">
                <div className="lp-product-img">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-muted)",
                      }}
                    >
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="lp-product-info">
                  <div className="lp-product-name">{product.name}</div>
                  <div className="lp-product-price">
                    {formatCurrency(product.price)}
                  </div>
                  <button
                    className="lp-product-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: 40,
                  color: "var(--text-muted)",
                }}
              >
                No products available
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="lp-section">
          <div className="lp-section-title">
            <h2>What Customers Say</h2>
            <p>Trusted by thousands of happy customers</p>
          </div>
          <div className="lp-testimonials">
            {(
              landing?.testimonials || [
                {
                  name: "Rahim K.",
                  role: "Regular Customer",
                  content:
                    "Amazing quality and super fast delivery. Will definitely order again!",
                  rating: 5,
                },
                {
                  name: "Fatima S.",
                  role: "Verified Buyer",
                  content:
                    "The customer service is excellent. They helped me choose the perfect product.",
                  rating: 5,
                },
                {
                  name: "Karim H.",
                  role: "Repeat Customer",
                  content:
                    "Best prices I have found online. The packaging was also very secure.",
                  rating: 4,
                },
              ]
            ).map((t: any, i: number) => (
              <div key={i} className="lp-testimonial">
                <div className="lp-stars">
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>
                <p>"{t.content}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="lp-section">
          <div className="lp-section-title">
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We have answers.</p>
          </div>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {(
              landing?.faqs || [
                {
                  id: "1",
                  question: "How long does delivery take?",
                  answer:
                    "We deliver within 24-48 hours in Dhaka and 3-5 days for other districts.",
                },
                {
                  id: "2",
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept Cash on Delivery (COD) and online payments through bKash, Nagad, and cards.",
                },
                {
                  id: "3",
                  question: "Can I return a product?",
                  answer:
                    "Yes, we offer a 7-day return policy for defective or wrong items.",
                },
                {
                  id: "4",
                  question: "Is there a delivery charge?",
                  answer:
                    "Delivery charge varies by location. Free delivery available for orders above a certain amount.",
                },
              ]
            ).map((faq: any) => (
              <div key={faq.id} className="lp-faq-item">
                <button
                  className="lp-faq-question"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  {faq.question}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: openFaq === faq.id ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openFaq === faq.id && (
                  <div className="lp-faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Checkout */}
        <section className="lp-checkout-section" id="checkout">
          <div className="lp-checkout-inner">
            <div className="lp-checkout-title">
              <h2>Complete Your Order</h2>
              <p>Fill in your details and we will deliver to your doorstep</p>
            </div>

            {cart.length > 0 && (
              <div className="lp-cart-items">
                {cart.map((item) => (
                  <div key={item.productId} className="lp-cart-item">
                    <div className="lp-cart-item-img">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-muted)",
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="lp-cart-item-info">
                      <div className="lp-cart-item-name">{item.name}</div>
                      <div className="lp-cart-item-price">
                        {formatCurrency(item.price)} x {item.quantity}
                      </div>
                    </div>
                    <button
                      className="lp-cart-item-remove"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="card">
              <div className="card-body">
                <CheckoutForm items={cart} onClear={() => setCart([])} />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="lp-footer">
          <p
            style={{
              marginBottom: 8,
              color: "white",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            {process.env.NEXT_PUBLIC_STORE_NAME || "Store"}
          </p>
          <p>
            © {new Date().getFullYear()} All rights reserved. Powered by{" "}
            {process.env.NEXT_PUBLIC_APP_NAME || "Platform"}.
          </p>
        </footer>

        {/* Sticky CTA */}
        {!showCheckout && (
          <div className="lp-sticky-cta">
            <button className="lp-btn-primary" onClick={scrollToCheckout}>
              Order Now
            </button>
          </div>
        )}
      </div>
    </>
  );
}
