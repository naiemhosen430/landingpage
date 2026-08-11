# Settings API - Backend Spec

This document describes the backend contract for the Store Settings used by the frontend.
The frontend expects a stable `/settings` GET plus segmented PATCH endpoints. Implement these endpoints to match the examples.

## HTTP Endpoints

### GET /settings

Returns all settings for the current project (project determined by JWT / auth context).

Response 200
{
"success": true,
"statusCode": 200,
"message": "Settings retrieved",
"data": {
"storeName": "My Store",
"logo": "https://.../logo.png", // OR publicId string
"contactEmail": "support@example.com",
"contactPhone": "+1234567890",
"address": "123 Main St, City, Country",
"deliveryCharge": 5.0, // number (currency units) - default per-order delivery charge
"taxRate": 7.5, // percent as number (0-100)
"supportText": "For support, email...",
"additionalInfo": "{...}", // optional free-form JSON string
// legacy/other values may exist; don't break if extra fields present
}
}

Notes:

- `logo` can be a public URL or a Cloudinary publicId depending on your preference. The frontend stores and expects a URL (secure URL preferred). If you choose to return `publicId`, include an additional `logoUrl` field or make the frontend resolve it.
- `deliveryCharge` is the default fallback charge applied when courier-specific logic isn't present.

### PATCH /settings/store

Update store-level settings. Accepts a JSON body with any of the fields below. Partial updates allowed.

Request body (example):
{
"storeName": "New Store",
"logo": "https://.../logo.png",
"contactEmail": "help@example.com",
"contactPhone": "+1234567890",
"address": "...",
"deliveryCharge": 4.5,
"taxRate": 8.25,
"supportText": "New support text",
"additionalInfo": "{\"key\":\"value\"}"
}

Response 200
{
"success": true,
"statusCode": 200,
"message": "Store settings updated",
"data": {
// updated settings object (same shape as GET /settings data)
}
}

Validation hints:

- `contactEmail` must be valid email if provided.
- `deliveryCharge` and `taxRate` must be non-negative numbers.
- `additionalInfo` must be a string (backend may also accept structured JSON).

## Other PATCH endpoints (optional / already present in frontend client)

The frontend includes mutation hooks for the following endpoints. Implement as convenient for your backend, matching the route names used by the frontend.

- PATCH /settings/seo - body: { title, description, keywords }
- PATCH /settings/social - body: { facebookUrl, instagramUrl, twitterUrl, ... }
- PATCH /settings/pixels - body: { pixels: [{ provider: 'facebook', id: '...' }] }
- PATCH /settings/theme - body: { primaryColor, accentColor, logoPosition, ... }
- PATCH /settings/custom-code - body: { headerHtml: "<script>..</script>", footerHtml: "..." }

Responses should follow the same wrapper shape: `success`, `statusCode`, `message`, `data`.

## Storage & Data Types

- Persist settings per project (projectId from auth). Only project-scoped settings should be returned.
- Use appropriate types in DB: strings for text, numbers for numeric values, and a JSON/text column for `additionalInfo`.

## Logo / Media Handling

Recommended options:

- Option A (simple): Persist `logo` as a public HTTPS URL string. The frontend will use it directly.
- Option B (media-backed): Persist the Cloudinary `publicId` and return `logoUrl` (secure) in GET /settings. If backend stores only publicId, add code to resolve Cloudinary secure URL before returning.

If you implement server-side upload endpoints for images, ensure they return a predictable shape: `{ success: true, data: { publicId, url, secureUrl, bytes, folder, ... } }` so the frontend's `mediaApi` can consume it.

## Example: Full GET /settings Response

{
"success": true,
"statusCode": 200,
"message": "Settings retrieved",
"data": {
"storeName": "Zane Store",
"logo": "https://res.cloudinary.com/.../v.../logo.png",
"contactEmail": "support@zanestore.com",
"contactPhone": "+11234567890",
"address": "1 Commerce St, City",
"deliveryCharge": 6.0,
"taxRate": 7.5,
"supportText": "Contact support@zanestore.com for help",
"additionalInfo": "{\"holidayMessage\":\"We are closed Christmas Day\"}"
}
}

## Notes on Courier Settings

- The courier-specific settings (default courier, provider toggles, provider configs) should remain in the courier module (`/dashboard/courier`) and be handled via the Courier API.
- Do not duplicate default courier selection in the store settings to avoid conflicting configuration.

## Implementation Checklist for Backend

- [ ] Add GET `/settings` returning project-scoped settings
- [ ] Add PATCH `/settings/store` to update store-level settings
- [ ] (Optional) Add PATCH endpoints for `/settings/seo`, `/settings/social`, `/settings/pixels`, `/settings/theme`, `/settings/custom-code`
- [ ] Persist `logo` either as URL or publicId + resolve URL in GET
- [ ] Validate numeric and email fields
- [ ] Ensure response wrapper matches existing API style with `success`, `statusCode`, `message`, `data`

If you want, I can also generate example backend controller code (Node/Express + Mongoose or Next.js API route) for these endpoints — tell me which stack you prefer and I'll scaffold it.
