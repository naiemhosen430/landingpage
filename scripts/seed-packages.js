#!/usr/bin/env node
/* Seed script to create default packages via admin API
   Usage:
     SEED_API_URL=https://api.example.com ADMIN_TOKEN=<token> node scripts/seed-packages.js
*/

const API_URL = process.env.SEED_API_URL || process.env.NEXT_PUBLIC_API_URL;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!API_URL) {
  console.error("Missing SEED_API_URL or NEXT_PUBLIC_API_URL");
  process.exit(1);
}

if (!ADMIN_TOKEN) {
  console.error("Missing ADMIN_TOKEN (use a SUPER_ADMIN token)");
  process.exit(1);
}

const packages = [
  {
    name: "Basic",
    slug: "basic",
    description: "Basic plan with 500MB storage",
    price: 5,
    billingCycle: "monthly",
    features: ["500MB storage", "Basic support"],
    limits: {
      maxProducts: 100,
      maxOrders: 1000,
      maxCustomers: 500,
      maxStorageGB: 0.5,
      maxTeamMembers: 1,
      analyticsRetentionDays: 30,
      customDomain: false,
      apiAccess: true,
      prioritySupport: false,
    },
    isPopular: false,
    isActive: true,
  },
  {
    name: "Standard",
    slug: "standard",
    description: "Standard plan with 1GB storage",
    price: 9,
    billingCycle: "monthly",
    features: ["1GB storage", "Standard support"],
    limits: {
      maxProducts: 500,
      maxOrders: 5000,
      maxCustomers: 2000,
      maxStorageGB: 1,
      maxTeamMembers: 5,
      analyticsRetentionDays: 90,
      customDomain: true,
      apiAccess: true,
      prioritySupport: false,
    },
    isPopular: true,
    isActive: true,
  },
  {
    name: "Premium",
    slug: "premium",
    description: "Premium plan with 5GB storage and priority support",
    price: 40,
    billingCycle: "monthly",
    features: ["5GB storage", "Priority support"],
    limits: {
      maxProducts: 5000,
      maxOrders: 50000,
      maxCustomers: 20000,
      maxStorageGB: 5,
      maxTeamMembers: 20,
      analyticsRetentionDays: 365,
      customDomain: true,
      apiAccess: true,
      prioritySupport: true,
    },
    isPopular: false,
    isActive: true,
  },
];

async function upsertPackage(pkg) {
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, "")}/admin/packages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(pkg),
    });

    const body = await res.json().catch(() => null);

    if (res.ok) {
      return body;
    }

    // If already exists or conflict, try to find and update by slug
    if (
      res.status === 409 ||
      (body && body.message && body.message.includes("exists"))
    ) {
      return body;
    }

    console.error(`Failed to create ${pkg.slug}:`, res.status, body);
    return null;
  } catch (err) {
    console.error(`Error creating ${pkg.slug}:`, err.message || err);
    return null;
  }
}

(async function main() {
  for (const p of packages) {
    await upsertPackage(p);
  }
})();
