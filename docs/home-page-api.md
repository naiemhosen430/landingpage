# Homepage Content API

The dashboard homepage editor and the public storefront use the endpoints below. All requests use the existing project headers from `src/store/api.ts`.

## Shared document

```json
{
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
        "imageAlt": "Banner image",
        "eyebrow": "Home edit",
        "title": "Make space for better",
        "href": "/products?category=home",
        "isActive": true,
        "sortOrder": 0
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
    "productIds": [],
    "limit": 8
  },
  "categoryProducts": [
    {
      "categoryId": "category-id",
      "eyebrow": "Home & living",
      "title": "Objects that settle in.",
      "productIds": [],
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
  }
}
```

## Admin: read homepage

`GET /admin/home-page`

Returns the current project homepage document. Requires the existing authenticated admin session. A missing document may return `404`; the frontend displays a clearly marked demo homepage until the document is saved.

## Admin: replace homepage

`PUT /admin/home-page`

Replaces the homepage document. The body is the shared document above. Validate slide IDs, non-empty slide text, `sortOrder`, `intervalMs` between 3000 and 15000, valid URLs, category IDs, and product IDs. Return the saved document in `data`.

## Public: read homepage

`GET /public/v1/home-page`

Returns the published homepage document in `data`. Only active slides, active categories, and published product references should be returned. This endpoint must not expose admin-only fields or unpublished media.

## Media used by homepage

Recommended source image dimensions:

- Slider banner: `1440 x 640 px`
- Category image: `640 x 480 px`
- Product image: `800 x 800 px`

The storefront preserves these image areas when an asset is missing and shows the recommended dimensions to the editor.

The editor uses the existing media contract to upload banner images:

`POST /admin/uploads`

```json
{ "folder": "home-page", "images": ["data:image/jpeg;base64,..."] }
```

The response should return the same `MediaAsset` shape used by `mediaApi`; the editor stores `secureUrl` in `hero.slides[].imageUrl`.

## Cache and publishing

Admin writes should invalidate the project homepage cache. Public reads may be cached for 60 seconds. `updatedAt` should change on every successful admin update so the frontend and CDN can revalidate predictably.
