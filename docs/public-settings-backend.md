# Public Settings API Documentation

This document describes the public settings endpoint required by the storefront frontend for browser analytics configuration.

## Endpoint

```http
GET /api/public/v1/settings
```

The frontend calls this endpoint from the server while rendering public landing pages. The response is cached by the frontend for 60 seconds.

## Required Headers

The public project headers are required:

```http
X-Project-ID: <project-id>
X-Project-Key: <project-public-key>
```

Do not require an admin bearer token for this endpoint. The public project key identifies the storefront project.

## Response Envelope

Successful responses use the standard envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Public settings retrieved successfully",
  "data": {}
}
```

## Response Shape

The endpoint must expose only settings that are safe for public browser use.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Public settings retrieved successfully",
  "data": {
    "store": {
      "socialTracking": {
        "facebook": {
          "enabled": true,
          "pixelId": "123456789012345"
        },
        "tiktok": {
          "enabled": true,
          "pixelId": "CABCDEFG1234567890"
        }
      }
    }
  }
}
```

## TypeScript Contract

```ts
interface PublicSettingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    store?: {
      socialTracking?: {
        facebook?: {
          enabled?: boolean;
          pixelId?: string;
        };
        tiktok?: {
          enabled?: boolean;
          pixelId?: string;
        };
      };
    };
  };
}
```

## Field Rules

| Field                                   | Type      | Description                               |
| --------------------------------------- | --------- | ----------------------------------------- |
| `store.socialTracking.facebook.enabled` | `boolean` | Enables Facebook Pixel in the storefront. |
| `store.socialTracking.facebook.pixelId` | `string`  | Public Facebook Pixel ID.                 |
| `store.socialTracking.tiktok.enabled`   | `boolean` | Enables TikTok Pixel in the storefront.   |
| `store.socialTracking.tiktok.pixelId`   | `string`  | Public TikTok Pixel ID.                   |

If a provider is disabled or its pixel ID is empty, the frontend does not initialize that provider or send browser pixel events for it.

## Security Requirements

Never return any of these fields from the public endpoint:

- Facebook access tokens
- TikTok access tokens
- API secrets
- Admin bearer tokens
- Private project settings
- Customer data

Pixel IDs are public identifiers and may be returned to the browser. Access tokens must remain server-side and must be used only by backend Conversions API or Events API integrations.

## Frontend Usage

The frontend requests the endpoint with the project headers:

```ts
const response = await fetch(`${apiBase}/public/v1/settings`, {
  headers: {
    "x-project-id": projectId,
    "x-project-key": projectKey,
  },
});

const result = await response.json();
const facebook = result.data?.store?.socialTracking?.facebook;
const tiktok = result.data?.store?.socialTracking?.tiktok;
```

The current frontend implementation is in:

- `src/lib/landingPage.ts` - server-side public settings fetch
- `src/app/page.tsx` - home landing page integration
- `src/app/[slug]/page.tsx` - dynamic landing page integration
- `src/components/checkout/CheckoutForm.tsx` - browser pixel initialization
- `src/lib/tracking.ts` - browser and server event dispatch

## Browser Events

When enabled, the frontend initializes the configured providers and maps events as follows:

| Frontend event     | Facebook event     | TikTok event       |
| ------------------ | ------------------ | ------------------ |
| `page_view`        | `PageView`         | `PageView`         |
| `product_view`     | `ViewContent`      | `ViewContent`      |
| `add_to_cart`      | `AddToCart`        | `AddToCart`        |
| `checkout_started` | `InitiateCheckout` | `InitiateCheckout` |
| `purchase`         | `Purchase`         | `Purchase`         |

The browser events include standard metadata such as:

- `event_id`
- `event_time`
- `event_source_url`
- `action_source: "website"`
- `content_ids`
- `content_type`
- `contents`
- `num_items`
- `value`
- `currency`

The same enriched event is also sent to the frontend analytics endpoint:

```http
POST /api/public/v1/tracking
```

## Disabled or Missing Settings

The endpoint should return a successful response with an empty or partial `data` object when tracking is not configured:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Public settings retrieved successfully",
  "data": {
    "store": {
      "socialTracking": {
        "facebook": { "enabled": false },
        "tiktok": { "enabled": false }
      }
    }
  }
}
```

The storefront must continue working normally when the endpoint returns no provider settings.

## Error Responses

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid project headers",
  "errors": []
}
```

Recommended status codes:

| Status | Meaning                                    |
| ------ | ------------------------------------------ |
| `200`  | Settings returned successfully.            |
| `400`  | Missing or invalid project headers.        |
| `403`  | Project key does not match the project ID. |
| `404`  | Project not found.                         |
| `429`  | Rate limit exceeded.                       |

For a public settings failure, the frontend should skip pixel initialization and continue rendering the landing page.
