# Product Creation Guide

This guide describes how to add products from the dashboard and how product options, variants, stock, and pricing are sent to the API.

## Open the Product Form

1. Sign in to the admin dashboard.
2. Open **Products**.
3. Select **Add Product**.
4. Complete the required fields.
5. Select **Create Product**.

The same form is used when editing an existing product.

## Required Fields

- **Product Name**: The product display name.
- **Slug**: The URL-friendly product identifier.
- **Description**: The product description.
- **Price**: The default product price. This is also used when the product has no variants.
- **SKU**: The default product SKU.

## Basic Product Information

Optional fields include:

- Short description
- Compare-at price
- Stock quantity
- Categories
- Tags
- Product images and thumbnail
- Cost price
- Low-stock threshold
- Weight and dimensions
- SEO title and description
- Active/draft/archived status
- Featured status
- Additional product attributes

Tags are entered as comma-separated values, for example:

```text
summer, cotton, t-shirt
```

## Product Options

A product can have no options, sizes, colors, or both sizes and colors.

In **Product options and variant pricing**:

- Enable **This product has sizes** only when the product has size choices.
- Enable **This product has colors** only when the product has color choices.
- Enter options as comma-separated values.
- Select **Generate variants**.

Examples:

```text
Sizes: S, M, L, XL
Colors: Black, White, Red
```

The form creates one variant for each combination:

```text
S / Black
S / White
S / Red
M / Black
M / White
M / Red
```

If only sizes are enabled, the form creates one variant per size. If only colors are enabled, it creates one variant per color. If neither option is enabled, the product submits an empty `variants` array.

## Variant Pricing and Inventory

Each generated variant can be edited separately:

- Variant name
- Variant SKU
- Variant price
- Variant stock
- Active/inactive status

The variant price is independent from the default product price. For example, a product may have:

```text
Default product price: 500
M / Black: 550
L / Black: 600
```

When a customer selects a variant, the storefront should use that variant's price and stock.

## Product Payload

A product without options sends an empty variant list:

```json
{
  "name": "Canvas Backpack",
  "slug": "canvas-backpack",
  "description": "A durable everyday backpack.",
  "price": 1200,
  "sku": "BAG-001",
  "stock": 25,
  "variants": [],
  "isActive": true,
  "isFeatured": false,
  "tags": ["bag", "canvas"]
}
```

A product with size and color options sends variants like this:

```json
{
  "name": "Classic T-Shirt",
  "slug": "classic-t-shirt",
  "description": "A cotton t-shirt.",
  "price": 500,
  "sku": "TSHIRT-001",
  "stock": 0,
  "variants": [
    {
      "name": "M / Black",
      "sku": "TSHIRT-001-M-BLACK",
      "price": 550,
      "stock": 12,
      "lowStockThreshold": 3,
      "attributes": {
        "size": "M",
        "color": "Black"
      },
      "isActive": true
    }
  ],
  "isActive": true,
  "isFeatured": false,
  "tags": ["t-shirt", "cotton"]
}
```

The frontend converts price, stock, and low-stock values to numbers before submitting them.

## Editing Products

When editing a product:

1. Existing size and color values are loaded from the product's variants.
2. Existing variant prices, SKUs, stock values, and active states remain editable.
3. Select **Generate variants** after changing the size or color list.
4. Existing matching variants keep their values where possible.
5. Disable both size and color options to clear the variant list and submit `variants: []`.

## Backend Requirements

The backend should support the following behavior:

- Accept `variants: []` for products without options.
- Store variants under the parent product.
- Allow size-only, color-only, and size-plus-color variants.
- Store a separate price and stock value for every variant.
- Require unique variant SKUs within the project.
- Prevent duplicate combinations for the same product.
- Validate non-negative stock and valid positive prices.
- On update, synchronize variants by creating, updating, or removing variants as needed.
- Use the selected variant price and stock in cart, checkout, orders, and inventory updates.
- Use the parent product price and stock when no variant is selected or when the product has no variants.
- Return variants in product create, list, detail, and update responses.

Recommended combination uniqueness key:

```text
productId + normalized attributes
```

Examples of normalized attributes:

```json
{"size":"M"}
{"color":"Black"}
{"size":"M","color":"Black"}
```

## Common Mistakes

- Do not create variants when the product has no size or color options.
- Do not use the parent price for every variant when variant prices differ.
- Do not reuse the same SKU for multiple variants.
- Do not allow a variant to have negative stock.
- Regenerate variants after changing the option list.
