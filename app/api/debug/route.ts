import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    has_url: !!process.env.KV_REST_API_URL,
    has_token: !!process.env.KV_REST_API_TOKEN,
    has_pw: !!process.env.SITE_PASSWORD,
    url_first10: (process.env.KV_REST_API_URL || "").slice(0, 20),
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV,
  });
}
