import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  return NextResponse.json({
    has_kv_url: !!process.env.KV_REST_API_URL,
    has_kv_token: !!process.env.KV_REST_API_TOKEN,
    has_slb_url: !!process.env.SLB_KV_URL,
    has_slb_token: !!process.env.SLB_KV_TOKEN,
    has_pw: !!process.env.SITE_PASSWORD,
    has_pagespeed: !!process.env.PAGESPEED_API_KEY,
    has_test_hello: !!process.env.TEST_VAR_HELLO,
    test_hello_val: process.env.TEST_VAR_HELLO || "",
    all_env_starts_with_S: Object.keys(process.env).filter(k => k.startsWith("S")).join(","),
    all_env_starts_with_K: Object.keys(process.env).filter(k => k.startsWith("K")).join(","),
    all_env_starts_with_T: Object.keys(process.env).filter(k => k.startsWith("T")).join(","),
    vercel_env: process.env.VERCEL_ENV,
  });
}
