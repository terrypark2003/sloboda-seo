"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

type Result = { score: number; metrics?: Record<string, string | undefined> };

const SITES = [
  { label: "공식몰 홈", url: "https://slobodacosmetics.com/" },
  { label: "재생크림 상품", url: "https://slobodacosmetics.com/product/sloboda-no7-recovery-cream/31/" },
];

// 사용자 브라우저에서 직접 Google PageSpeed Insights API 호출.
// 이렇게 하면 사용자 IP의 quota를 쓰므로 키 없이도 안정적.
// 키가 있으면 /api/pagespeed?key=... 식으로 우회 가능.
const PAGESPEED_BASE = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export default function HealthCheck() {
  const { state, setHealth } = useStore();
  const [siteIdx, setSiteIdx] = useState(0);
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const u = SITES[siteIdx].url;
      const params = new URLSearchParams({
        url: u,
        strategy,
        category: "performance",
      });
      // 클라이언트 직접 호출
      const res = await fetch(`${PAGESPEED_BASE}?${params.toString()}`);
      if (!res.ok) {
        const errBody = await res.text();
        let msg = `측정 실패 (HTTP ${res.status})`;
        try {
          const j = JSON.parse(errBody);
          if (j?.error?.message) msg = j.error.message;
        } catch {}
        throw new Error(msg);
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
      setResult({ score, metrics });
      if (strategy === "mobile") setHealth(score, state.lastHealthCheck?.desktop);
      else setHealth(state.lastHealthCheck?.mobile, score);
    } catch (e: any) {
      setError(e?.message || "측정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <select className="input" value={siteIdx} onChange={(e) => setSiteIdx(parseInt(e.target.value))}>
          {SITES.map((s, i) => (
            <option key={i} value={i}>{s.label}</option>
          ))}
        </select>
        <select className="input" value={strategy} onChange={(e) => setStrategy(e.target.value as any)}>
          <option value="mobile">모바일</option>
          <option value="desktop">데스크톱</option>
        </select>
        <button className="btn btn-primary" onClick={run} disabled={loading}>
          {loading ? "측정 중... (30~60초)" : "지금 측정"}
        </button>
      </div>

      {error && (
        <div className="mt-3 text-sm text-rose-600">
          {error}
          <div className="text-xs text-slate-500 mt-1">
            Google PageSpeed Insights는 익명 호출도 가능하지만 일시적으로 한도가 초과될 수 있습니다. 잠시 후 다시 시도하거나, 더 자주 측정하려면 PAGESPEED_API_KEY 환경변수를 추가하세요.
          </div>
        </div>
      )}

      {result && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <Metric label={`성능 (${strategy})`} value={`${result.score}`} unit="/ 100" big />
          <Metric label="LCP" value={result.metrics?.lcp} />
          <Metric label="FCP" value={result.metrics?.fcp} />
          <Metric label="CLS" value={result.metrics?.cls} />
          <Metric label="TBT" value={result.metrics?.tbt} />
          <Metric label="Speed Index" value={result.metrics?.si} />
        </div>
      )}

      {!result && state.lastHealthCheck && (
        <div className="mt-3 text-xs text-slate-500">
          마지막 측정: {new Date(state.lastHealthCheck.ts).toLocaleString("ko-KR")} · 모바일 {state.lastHealthCheck.mobile ?? "-"} · 데스크톱 {state.lastHealthCheck.desktop ?? "-"}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, unit, big }: { label: string; value?: string; unit?: string; big?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 p-2">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className={big ? "text-2xl font-bold text-slate-900" : "text-slate-800"}>
        {value ?? "-"} <span className="text-xs font-normal text-slate-400">{unit}</span>
      </div>
    </div>
  );
}
