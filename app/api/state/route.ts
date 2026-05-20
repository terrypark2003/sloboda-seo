// 상태 GET/POST 라우트. KV가 연결돼 있을 때만 클라우드로 동작.
import { NextResponse } from "next/server";
import { kvConnected, kvGet, kvSet } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!kvConnected()) {
    return NextResponse.json({ source: "local", state: null });
  }
  const state = await kvGet();
  return NextResponse.json({ source: "cloud", state });
}

export async function POST(req: Request) {
  if (!kvConnected()) {
    return NextResponse.json({ ok: false, source: "local" }, { status: 200 });
  }
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  const ok = await kvSet(body);
  return NextResponse.json({ ok, source: "cloud" });
}
