# Landing Pages Backend API Documentation

This document describes the API contract for landing pages used by the storefront and admin dashboard.

## Response Envelope

All successful responses use:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "...",
  "errors": []
}
```

---

## Public Landing Page Fetch

Frontend can retrieve a single landing page by slug using the public storefront API.

### Endpoint

```http
GET /api/public/v1/landing-pages/{slug}
```

### Headers

```http
X-Project-ID: 64f000000000000000000001
X-Project-Key: <project-public-key>
```

### Path Parameters

| Parameter | Type   | Description                 |
| --------- | ------ | --------------------------- |
| `slug`    | string | Landing page slug to fetch. |

### Example

```bash
curl "https://your-domain.com/api/public/v1/landing-pages/home" \
  -H "X-Project-ID: 64f000000000000000000001" \
  -H "X-Project-Key: <project-public-key>"
```

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Landing page retrieved successfully",
  "data": {
    "id": "64f000000000000000000101",
    "projectId": "64f000000000000000000001",
    "pageName": "Home",
    "slug": "home",
    "status": "ACTIVE",
    "landingContent": "<div>...HTML...</div>",
    "seo": {
      "title": "Welcome to Our Store",
      "description": "Best products for your business",
      "keywords": ["store", "landing", "sale"]
    },
    "createdAt": "2026-08-12T10:00:00.000Z",
    "updatedAt": "2026-08-12T10:00:00.000Z"
  }
}
```

### Notes

- Public endpoint only returns pages with `status: ACTIVE`.
- The frontend uses the page slug to request a single landing page.
- If the slug does not exist or the page is inactive, the API returns `404`.

---

## Admin Landing Page APIs

### Authentication

Admin requests require bearer authentication:

```http
Authorization: Bearer <access-token>
```

Allowed roles: `ADMIN`, `SUPER_ADMIN`.

### List Landing Pages

```http
GET /api/admin/landing-pages?projectId=64f000000000000000000001&page=1&limit=10&search=home&status=ACTIVE
```

Query parameters:

| Parameter   | Type   | Description                                       |
| ----------- | ------ | ------------------------------------------------- |
| `projectId` | string | Project ObjectId. Required if JWT has no project. |
| `page`      | number | Default `1`.                                      |
| `limit`     | number | Default `10`.                                     |
| `search`    | string | Search slug or pageName.                          |
| `status`    | string | `ACTIVE` or `INACTIVE`.                           |

### Create Landing Page

```http
POST /api/admin/landing-pages
Content-Type: application/json
Authorization: Bearer <access-token>
```

Body:

```json
{
  "pageName": "Home",
  "slug": "home",
  "status": "ACTIVE",
  "landingContent": "<div><h1>Welcome</h1></div>",
  "seo": {
    "title": "Home Page",
    "description": "Landing page description",
    "keywords": ["home", "landing"]
  }
}
```

### Get Landing Page by ID

```http
GET /api/admin/landing-pages/{id}
Authorization: Bearer <access-token>
```

### Update Landing Page

```http
PATCH /api/admin/landing-pages/{id}
Content-Type: application/json
Authorization: Bearer <access-token>
```

Body can include any of these fields:

```json
{
  "pageName": "Home Updated",
  "slug": "home-updated",
  "status": "INACTIVE",
  "landingContent": "<div>Updated content</div>",
  "seo": {
    "title": "Updated Home",
    "description": "Updated SEO description",
    "keywords": ["home", "update"]
  }
}
```

### Delete Landing Page

```http
DELETE /api/admin/landing-pages/{id}
Authorization: Bearer <access-token>
```

### Landing Page Object

| Field            | Type   | Description                     |
| ---------------- | ------ | ------------------------------- |
| `id`             | string | Landing page document ID.       |
| `projectId`      | string | Project ObjectId.               |
| `pageName`       | string | Display name for the page.      |
| `slug`           | string | URL-friendly slug.              |
| `status`         | string | `ACTIVE` or `INACTIVE`.         |
| `landingContent` | string | Full HTML content for the page. |
| `seo`            | object | Optional SEO metadata.          |
| `createdAt`      | string | Creation timestamp.             |
| `updatedAt`      | string | Last update timestamp.          |

### SEO Object

| Field         | Type     | Description      |
| ------------- | -------- | ---------------- |
| `title`       | string   | SEO title.       |
| `description` | string   | SEO description. |
| `keywords`    | string[] | SEO keywords.    |

---

## Frontend Public Rendering

- `/` renders the home landing page slug `home`.
- `/[slug]` renders any public landing page slug.
- Both routes fetch the page server-side and render HTML content as static/ISR output.
- Embedded scripts inside the landing page HTML are re-mounted on the client using `useRef` and `useEffect`.

### Example public render request

```js
fetch("https://your-domain.com/api/public/v1/landing-pages/home", {
  headers: {
    "X-Project-ID": "64f000000000000000000001",
    "X-Project-Key": "<project-public-key>",
  },
});
```

### Notes

- Use server-side rendering for public landing pages to keep content SEO-friendly.
- Use client-side hydration to execute inline `<script>` tags and preserve links.
- `home` slug is the homepage content.
- Other slugs are rendered by the dynamic route `/[slug]`.
