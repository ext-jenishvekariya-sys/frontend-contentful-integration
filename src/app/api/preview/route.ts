import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Enables Next.js Draft Mode so subsequent requests read from the
 * Contentful Content Preview API instead of the Content Delivery API.
 *
 * Wire this up as the "Preview URL" on the carProduct content type in
 * Contentful, e.g.:
 *   https://your-domain/api/preview?secret=YOUR_SECRET&path=/cars/{entry_id}
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") ?? "/";

  if (!secret || secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  if (!path.startsWith("/")) {
    return new Response("Invalid path", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}
