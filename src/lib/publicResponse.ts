export async function readPublicJsonResponse(
  response: Response,
  endpoint: string,
): Promise<unknown | null> {
  const contentType = response.headers.get("content-type") ?? "unknown";

  if (!response.ok) {
    console.error(
      `Public API request failed for ${endpoint}: ${response.status} ${response.statusText}`,
    );
    return null;
  }

  const body = await response.text();
  if (!body.trim()) {
    console.error(`Public API returned an empty response for ${endpoint}`);
    return null;
  }

  try {
    return JSON.parse(body) as unknown;
  } catch (error) {
    console.error(
      `Expected JSON from ${endpoint}, received ${contentType} (HTTP ${response.status})`,
      error,
    );
    return null;
  }
}
