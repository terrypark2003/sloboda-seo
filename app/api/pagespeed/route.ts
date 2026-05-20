// Google PageSpeed Insights 호출 라우트.
// 쿼리: ?url=... &strategy=mobile|desktop
// API 키가 없어도 호출은 되지만 한도가 낮음. 키가 있으면 헤더로 전달.
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url") || "https://slobodacosmetics.com/";
  const strategy = (searchParams.get("strategy") || "mobile").toLowerCase() === "desktop" ? "desktop" : "mobile";

  const params = new URLSearchParams({ url, strategy, category: "performance" });
  const key = process.env.PAGESPEED_API_KEY;
  if (key) params.set("key", key);

  const target = `${BASE}?${params.toString()}`;

  try {
    const res = await fetch(target, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, status: res.status, error: await res.text() },
        { status: 502 }
      );
    }
    const data: any = await res.json();
    const score = Math.round((data?.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
    const audits = data?.lighthouseResult?.audits ?? {};
    const metrics = {
      lcp: audits["largest-contentful-paint"]?.displayValue,
      fcp: audits["first-contentful-paint"]?.displayValue,
      cls: audits["cumulative-layout-shift"]?.displayValue,
      tbt: audits["total-blocking-time"]?.displayValue,
      si: audits["speed-index"]?.displayValue,
    };
    return NextResponse.json({ ok: true, url, strategy, score, metrics });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "fetch failed" }, { status: 500 });
  }
}
