"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

type Result = { score: number; metrics?: Record<string, string | undefined> };

const SITES = [
  { label: "공식몰 홈", url: "https://slobodacosmetics.com/" },
  { label: "재생크림 상품", url: "https://slobodacosmetics.com/product/sloboda-no7-recovery-cream/31/" },
];

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
      const res = await fetch(`/api/pagespeed?url=${encodeURIComponent(u)}&strategy=${strategy}`);
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "측정 실패");
      setResult({ score: data.score, metrics: data.metrics });
      if (strategy === "mobile") setHealth(data.score, state.lastHealthCheck?.desktop);
      else setHealth(state.lastHealthCheck?.mobile, data.score);
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
          {loading ? "측정 중..." : "지금 측정"}
        </button>
      </div>

      {error && <div className="mt-3 text-sm text-rose-600">{error}</div>}

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
