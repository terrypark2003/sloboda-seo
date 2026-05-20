import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    has_kv_url: !!process.env.KV_REST_API_URL,
    has_kv_token: !!process.env.KV_REST_API_TOKEN,
    has_slb_url: !!process.env.SLB_KV_URL,
    has_slb_token: !!process.env.SLB_KV_TOKEN,
    has_pw: !!process.env.SITE_PASSWORD,
    has_pagespeed: !!process.env.PAGESPEED_API_KEY,
    vercel_env: process.env.VERCEL_ENV,
  });
}
