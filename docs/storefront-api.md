# Storefront Backend API Contract

This document is the implementation handoff for the current public storefront and homepage dashboard editor.

All project-scoped requests use the existing headers:

```http
x-project-id: <project id>
x-project-key: <project key>
```

Admin endpoints also require the existing authenticated session:

```http
Authorization: Bearer <access token>
```

## Response envelope

The frontend accepts the following successful response shapes:

```json
{ "data": { "...": "payload" } }
```

or:

```json
{ "data": ["...items"] }
```

Use this error shape consistently:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Readable error message",
  "errors": ["Optional validation detail"]
}
```

# 1. Homepage APIs

These are the new endpoints required by the homepage editor and public homepage.

## 1.1 Read admin homepage

```http
GET /admin/home-page
```

Returns the saved homepage document for the current project. If no document exists, return `404` with a stable error code such as `HOME_PAGE_NOT_FOUND`. The frontend shows editable demo content until the first successful save.

## 1.2 Save homepage

```http
PUT /admin/home-page
Content-Type: application/json
```

Creates or replaces the homepage document. Return the saved document in `data`.

Recommended validation:

- `hero.slides` can be empty, but every slide must have a unique `id`.
- `hero.intervalMs` must be between `3000` and `15000`.
- `banners.items` should contain at most 2 items.
- `categoryProducts[].limit` must be clamped between `1` and `10`.
- Referenced category IDs and product IDs must belong to the current project.
- Only valid internal paths or approved URLs should be accepted for links.
- Image URLs must point to project-owned/public media where possible.
- `updatedAt` must change after every successful save.

## 1.3 Read public homepage

```http
GET /public/v1/home-page
Cache-Control: public, max-age=60
```

Returns the published homepage document in `data`.

The public response must:

- Include only active slides, banners, categories, and product references.
- Exclude admin-only fields, access tokens, internal media metadata, and draft content.
- Return `404 HOME_PAGE_NOT_FOUND` when no homepage has been saved.
- Preserve the configured order using `sortOrder`.

## Homepage document

```json
{
  "id": "home-page-id",
  "visibility": {
    "hero": true,
    "categories": true,
    "banners": true,
    "categoryProducts": true,
    "bestsellers": true,
    "promise": true
  },
  "hero": {
    "autoplay": true,
    "intervalMs": 5500,
    "slides": [
      {
        "id": "slide-1",
        "eyebrow": "The considered edit",
        "title": "Good things,",
        "emphasis": "made simply.",
        "description": "A quieter way to shop for pieces that make daily life feel more yours.",
        "buttonLabel": "Shop the collection",
        "buttonHref": "/products",
        "imageUrl": "https://cdn.example.com/home/slide-1.jpg",
        "imageAlt": "Featured collection",
        "accentColor": "#b36d4c",
        "isActive": true,
        "sortOrder": 0
      }
    ]
  },
  "banners": {
    "eyebrow": "More to explore",
    "title": "Small changes, good energy.",
    "items": [
      {
        "id": "banner-1",
        "imageUrl": "https://cdn.example.com/home/banner-1.jpg",
        "imageAlt": "Home collection",
        "eyebrow": "Home edit",
        "title": "Make space for better",
        "href": "/products?category=home",
        "isActive": true,
        "sortOrder": 0
      },
      {
        "id": "banner-2",
        "imageUrl": "https://cdn.example.com/home/banner-2.jpg",
        "imageAlt": "Personal care collection",
        "eyebrow": "Personal edit",
        "title": "Rituals worth keeping",
        "href": "/products?category=personal",
        "isActive": true,
        "sortOrder": 1
      }
    ]
  },
  "categories": [
    {
      "id": "category-id",
      "label": "Home & living",
      "href": "/products?category=home",
      "description": "Useful objects for your space.",
      "imageUrl": "https://cdn.example.com/categories/home.jpg"
    }
  ],
  "categorySection": {
    "eyebrow": "Browse the edit",
    "title": "Find your next favorite."
  },
  "bestsellers": {
    "eyebrow": "Curated for you",
    "title": "Shop bestsellers",
    "description": "",
    "viewAllLabel": "View all",
    "productIds": ["product-id-1", "product-id-2"],
    "limit": 8
  },
  "categoryProducts": [
    {
      "categoryId": "category-id",
      "eyebrow": "Home & living",
      "title": "Objects that settle in.",
      "productIds": ["product-id-1", "product-id-2"],
      "limit": 10
    }
  ],
  "promise": {
    "eyebrow": "The store promise",
    "title": "Less noise.",
    "emphasis": "More meaning.",
    "items": [{ "number": "01", "text": "Useful products chosen to last." }]
  },
  "footer": {
    "description": "Thoughtful products for everyday living, delivered to your door.",
    "supportLabel": "Need help?",
    "supportEmail": "support@example.com",
    "announcement": "Complimentary delivery on orders over 3000"
  },
  "updatedAt": "2026-09-12T00:00:00.000Z"
}
```

# 2. Public catalog APIs

These endpoints are already called by the storefront and must support the homepage, catalog, product detail, cart, and checkout flows.

## 2.1 Product list

```http
GET /public/v1/products
```

Supported query parameters:

```text
limit       Number of products to return. Homepage requests up to 100.
search      Product name/search text.
category    Category slug or category ID.
page        Optional page number.
```

Return active, in-stock products for the public storefront. Product list items should include:

```json
{
  "id": "product-id",
  "name": "Product name",
  "slug": "product-slug",
  "description": "Product description",
  "price": 1250,
  "stock": 20,
  "isActive": true,
  "thumbnailImage": {
    "url": "https://cdn.example.com/products/product.jpg",
    "secureUrl": "https://cdn.example.com/products/product.jpg"
  },
  "images": [],
  "categories": ["home"],
  "tags": [],
  "variants": [
    {
      "id": "variant-id",
      "name": "Large",
      "price": 1400,
      "stock": 5,
      "isActive": true
    }
  ]
}
```

The frontend shows a stable `800 x 800 px` product image placeholder when no image is available.

## 2.2 Product detail

```http
GET /public/v1/products/:slug
```

Return the same product shape as the list endpoint, with the full description, images, variants, stock, and active status.

# 3. Checkout and order APIs

## 3.1 Payment methods

```http
GET /public/v1/payment-methods
```

Return active methods ordered by `sortOrder`:

```json
[
  {
    "id": "payment-id",
    "code": "cod",
    "name": "Cash on Delivery",
    "description": "Pay when your order arrives.",
    "instructions": "",
    "details": {},
    "isActive": true,
    "sortOrder": 0
  }
]
```

## 3.2 Delivery price

```http
GET /public/v1/delivery-prices?zone=area-slug
```

Return:

```json
{ "price": 60, "deliveryCharge": 60 }
```

## 3.3 Place order

```http
POST /public/v1/orders
Content-Type: application/json
```

Request body:

```json
{
  "items": [
    {
      "productId": "product-id",
      "variantId": "variant-id",
      "quantity": 2
    }
  ],
  "customer": {
    "name": "Customer name",
    "phone": "01700000000",
    "address": "Full delivery address"
  },
  "notes": "Optional order note",
  "paymentMethod": "cod",
  "shippingMethod": "standard",
  "deliveryZone": "dhaka"
}
```

Return at least the created order ID:

```json
{ "id": "order-id", "orderNumber": "ORD-1001" }
```

The frontend redirects to `/thank-you/:orderId` after a successful response.

## 3.4 Read order

```http
GET /public/v1/orders/:id
```

Return customer-safe order details, items, totals, payment method, delivery information, status, and order number.

# 4. Public settings and tracking

## 4.1 Public settings

```http
GET /public/v1/settings
```

The storefront currently reads:

```json
{
  "store": {
    "socialTracking": {
      "facebook": { "enabled": true, "pixelId": "..." },
      "tiktok": { "enabled": true, "pixelId": "..." }
    }
  }
}
```

Never return provider access tokens from this public endpoint.

## 4.2 Tracking event

```http
POST /public/v1/tracking
Content-Type: application/json
```

Request example:

```json
{
  "eventType": "add_to_cart",
  "eventName": "add_to_cart",
  "payload": {
    "content_ids": ["product-id"],
    "content_type": "product",
    "contents": [{ "id": "product-id", "quantity": 1 }],
    "value": 1250,
    "currency": "BDT",
    "event_id": "add_to_cart-demo-1"
  },
  "sessionId": "session-id",
  "visitorId": "visitor-id",
  "url": "https://store.example.com/products/product-slug",
  "referrer": "https://google.com"
}
```

Supported event types:

```text
page_view
product_view
add_to_cart
checkout_started
purchase
custom
```

The backend should persist the event and forward it to configured Facebook/TikTok server-side integrations where enabled. Do not persist raw customer phone, email, name, or address in third-party tracking payloads.

# 5. Existing supporting APIs

## Newsletter

```http
POST /public/newsletter
{ "email": "customer@example.com" }
```

## Contact

```http
POST /public/contact
{ "name": "Customer", "email": "customer@example.com", "message": "Hello" }
```

## Landing pages

```http
GET /public/v1/landing-pages/:slug
```

Return the existing landing page document with its products, delivery area, and payment methods. This remains separate from the normal `/` ecommerce homepage.

## Admin categories

The homepage editor reads the existing category endpoint:

```http
GET /admin/categories?search=<optional>
```

Category records should include `id`, `name`, `slug`, `description`, `isActive`, `sortOrder`, and optional image fields:

```json
{
  "image": {
    "url": "https://cdn.example.com/categories/home.jpg",
    "secureUrl": "https://cdn.example.com/categories/home.jpg"
  }
}
```

## Admin media upload

The homepage editor uses the existing upload endpoint:

```http
POST /admin/uploads
Content-Type: application/json
```

```json
{
  "folder": "home-page",
  "images": ["data:image/jpeg;base64,..."]
}
```

Recommended source dimensions:

```text
Hero slider banner: 1440 x 640 px
Two-image promotion banner: 900 x 560 px
Category image: 640 x 480 px
Product image: 800 x 800 px
```

Return the existing media asset shape with `publicId`, `url`, `secureUrl`, `width`, `height`, `format`, `bytes`, `folder`, and `resourceType`.

# 6. Publishing and cache behavior

- Admin homepage saves should invalidate the project homepage cache.
- Public homepage responses may be cached for 60 seconds.
- Product, category, payment, and settings responses should be project-scoped.
- Draft homepage changes must not appear on the public endpoint until published/saved according to the project workflow.
- The frontend uses demo content only when the public homepage request has finished and no document exists; this is client-side preview behavior and does not need to be stored by the backend.
