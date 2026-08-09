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
        .lp-root { font-family: var(--font-sans); color: var(--text-primary); background: var(--bg-primary); }
        .lp-hero { min-height: 90vh; display: flex; align-items: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; position: relative; overflow: hidden; }
        .lp-hero-inner { max-width: 1280px; margin: 0 auto; padding: 80px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; width: 100%; }
        .lp-hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255,255,255,0.1); border-radius: 999px; font-size: 14px; margin-bottom: 24px; backdrop-filter: blur(10px); }
        .lp-hero h1 { font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 20px; letter-spacing: -1px; }
        .lp-hero p { font-size: 18px; color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 32px; max-width: 480px; }
        .lp-hero-btns { display: flex; gap: 16px; }
        .lp-btn-primary { padding: 14px 32px; background: var(--primary); color: white; border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.2s; border: none; cursor: pointer; }
        .lp-btn-primary:hover { background: var(--primary-dark); transform: translateY(-2px); }
        .lp-btn-secondary { padding: 14px 32px; background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-weight: 600; font-size: 16px; transition: all 0.2s; cursor: pointer; }
        .lp-btn-secondary:hover { background: rgba(255,255,255,0.1); }
        .lp-hero-img { position: relative; border-radius: 20px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.4); aspect-ratio: 4/3; background: var(--bg-tertiary); }
        .lp-section { padding: 80px 24px; max-width: 1280px; margin: 0 auto; }
        .lp-section-title { text-align: center; margin-bottom: 48px; }
        .lp-section-title h2 { font-size: 36px; font-weight: 700; margin-bottom: 12px; }
        .lp-section-title p { font-size: 16px; color: var(--text-secondary); }
        .lp-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .lp-feature { padding: 32px; border: 1px solid var(--border-color); border-radius: 16px; text-align: center; transition: all 0.2s; background: var(--bg-primary); }
        .lp-feature:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); border-color: var(--primary-light); }
        .lp-feature-icon { width: 56px; height: 56px; background: var(--primary-light); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .lp-feature h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .lp-feature p { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }
        .lp-products { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .lp-product { border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden; background: var(--bg-primary); transition: all 0.2s; }
        .lp-product:hover { box-shadow: var(--shadow-md); }
        .lp-product-img { aspect-ratio: 1; background: var(--bg-tertiary); position: relative; overflow: hidden; }
        .lp-product-info { padding: 16px; }
        .lp-product-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lp-product-price { font-size: 18px; font-weight: 700; color: var(--primary); margin-bottom: 12px; }
        .lp-product-btn { width: 100%; padding: 10px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .lp-product-btn:hover { background: var(--primary-dark); }
        .lp-testimonials { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .lp-testimonial { padding: 28px; border: 1px solid var(--border-color); border-radius: 16px; background: var(--bg-primary); }
        .lp-stars { color: #f59e0b; margin-bottom: 12px; font-size: 18px; }
        .lp-testimonial p { font-size: 15px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 16px; }
        .lp-testimonial-author { display: flex; align-items: center; gap: 12px; }
        .lp-testimonial-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
        .lp-testimonial-name { font-weight: 600; font-size: 14px; }
        .lp-testimonial-role { font-size: 13px; color: var(--text-muted); }
        .lp-faq-item { border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 12px; overflow: hidden; }
        .lp-faq-question { width: 100%; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary); border: none; font-size: 16px; font-weight: 600; cursor: pointer; color: var(--text-primary); }
        .lp-faq-answer { padding: 0 24px 20px; font-size: 15px; color: var(--text-secondary); line-height: 1.6; }
        .lp-checkout-section { background: var(--bg-secondary); padding: 80px 24px; }
        .lp-checkout-inner { max-width: 800px; margin: 0 auto; }
        .lp-checkout-title { text-align: center; margin-bottom: 40px; }
        .lp-checkout-title h2 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
        .lp-checkout-title p { color: var(--text-secondary); }
        .lp-cart-items { margin-bottom: 24px; }
        .lp-cart-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--bg-primary); border-radius: 8px; margin-bottom: 8px; }
        .lp-cart-item-img { width: 48px; height: 48px; border-radius: 8px; background: var(--bg-tertiary); overflow: hidden; position: relative; flex-shrink: 0; }
        .lp-cart-item-info { flex: 1; }
        .lp-cart-item-name { font-weight: 500; font-size: 14px; }
        .lp-cart-item-price { font-size: 13px; color: var(--text-muted); }
        .lp-cart-item-remove { color: var(--danger); cursor: pointer; padding: 4px; background: none; border: none; }
        .lp-footer { background: var(--bg-dark); color: rgba(255,255,255,0.6); padding: 48px 24px; text-align: center; font-size: 14px; }
        .lp-sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; background: var(--bg-primary); border-top: 1px solid var(--border-color); padding: 12px 24px; display: flex; justify-content: center; gap: 16px; z-index: 100; box-shadow: 0 -4px 20px rgba(0,0,0,0.08); }
        .lp-sticky-cta button { padding: 12px 32px; }
        @media (max-width: 1024px) { .lp-hero-inner { grid-template-columns: 1fr; text-align: center; } .lp-hero h1 { font-size: 40px; } .lp-hero p { margin: 0 auto 32px; } .lp-features { grid-template-columns: 1fr; } .lp-products { grid-template-columns: repeat(2, 1fr); } .lp-testimonials { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .lp-hero h1 { font-size: 32px; } .lp-products { grid-template-columns: 1fr; } .lp-hero-btns { flex-direction: column; } }
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
