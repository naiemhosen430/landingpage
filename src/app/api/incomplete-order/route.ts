import { NextResponse } from "next/server";

const getApiBase = () => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function POST(request: Request) {
  const apiBase = getApiBase();
  if (!apiBase) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_URL is not configured" },
      { status: 500 },
    );
  }

  try {
    const orderData = await request.json();
    const customerPhone = orderData?.customer?.phone;
    if (!customerPhone) {
      return NextResponse.json(
        { message: "A customer phone number is required" },
        { status: 400 },
      );
    }

    const headers = {
      "content-type": "application/json",
      "x-project-id": process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
      "x-project-key": process.env.NEXT_PUBLIC_PROJECT_KEY ?? "",
    };
    const createResponse = await fetch(
      `${apiBase}/public/v1/orders/incomplete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ ...orderData }),
        cache: "no-store",
      },
    );

    const created = await createResponse.json().catch(() => null);
    if (!createResponse.ok) {
      return NextResponse.json(
        created ?? { message: "Unable to create incomplete order" },
        { status: createResponse.status },
      );
    }

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to save incomplete order" },
      { status: 500 },
    );
  }
}
