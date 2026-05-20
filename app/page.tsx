"use client";

import Link from "next/link";
import { useStore, computeScore } from "@/lib/store";
import { nextActionableTasks, phases } from "@/lib/data/checklist";
import ScoreGauge from "@/components/ScoreGauge";
import HealthCheck from "@/components/HealthCheck";

export default function Home() {
  const { state, ready, toggleTask } = useStore();
  const score = computeScore(state.completedTasks);
  const completedSet = new Set(Object.keys(state.completedTasks));
  const todays = nextActionableTasks(completedSet, 3);

  const phaseStats = phases.map((ph) => {
    const total = ph.tasks.length;
    const done = ph.tasks.filter((t) => completedSet.has(t.id)).length;
    return { ...ph, total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
  });

  const lastKpi = state.kpi.at(-1);

  return (
    <div className="space-y-6">
      {/* 상단 — 점수 + 헬스 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card card-pad lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-slate-700">전체 진행 점수</h2>
            <Link href="/checklist" className="text-sm text-brand-600 hover:underline">체크리스트 →</Link>
          </div>
          <ScoreGauge value={ready ? score : 0} />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {phaseStats.map((p) => (
              <Link key={p.id} href="/checklist" className="block rounded-xl border border-slate-200 p-3 hover:border-brand-300 hover:bg-brand-50/40 transition">
                <div className="text-[11px] text-slate-500">{p.range}</div>
                <div className="text-sm font-semibold text-slate-800 truncate">{p.label.replace("Phase ", "P")}</div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: `${p.pct}%` }} />
                </div>
                <div className="text-[11px] mt-1 text-slate-500">{p.done} / {p.total} ({p.pct}%)</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h2 className="text-base font-semibold text-slate-700 mb-2">사이트 헬스 (PageSpeed)</h2>
          <HealthCheck />
        </div>
      </div>

      {/* 오늘의 할 일 + KPI 요약 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card card-pad lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-700">오늘 할 일 (우선순위 3)</h2>
            <Link href="/checklist" className="text-sm text-brand-600 hover:underline">전체 보기 →</Link>
          </div>
          {todays.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <div className="text-3xl">🎉</div>
              <div className="mt-2">모든 체크리스트를 완료했습니다.</div>
            </div>
          ) : (
            <ul className="space-y-2">
              {todays.map((t) => (
                <li key={t.id} className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={!!state.completedTasks[t.id]}
                    onChange={() => toggleTask(t.id)}
                    className="mt-1 w-5 h-5 accent-brand-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800">{t.title}</div>
                    {t.detail && <div className="text-sm text-slate-500 mt-0.5">{t.detail}</div>}
                    {t.link && (
                      <Link href={t.link.url} className="inline-block mt-1 text-xs text-brand-600 hover:underline">
                        {t.link.label}
                      </Link>
                    )}
                  </div>
                  <span className="chip bg-slate-100 text-slate-600">w{t.weight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card card-pad">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-700">최신 KPI</h2>
            <Link href="/kpi" className="text-sm text-brand-600 hover:underline">기록 →</Link>
          </div>
          {!lastKpi ? (
            <div className="text-sm text-slate-500">아직 입력된 KPI가 없습니다. 월간 KPI 페이지에서 첫 달 데이터를 입력하세요.</div>
          ) : (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">기준월</dt><dd className="font-semibold">{lastKpi.month}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">리뷰 수</dt><dd className="font-semibold">{lastKpi.reviews ?? "-"}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">스토어찜</dt><dd className="font-semibold">{lastKpi.storeFollows ?? "-"}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">블로그 글</dt><dd className="font-semibold">{lastKpi.blogPosts ?? "-"}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">매출(만원)</dt><dd className="font-semibold">{lastKpi.revenue ?? "-"}</dd></div>
            </dl>
          )}
        </div>
      </div>

      {/* 활동 로그 */}
      <div className="card card-pad">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-700">최근 활동 로그</h2>
          <span className="text-xs text-slate-400">최근 12개</span>
        </div>
        {state.log.length === 0 ? (
          <div className="text-sm text-slate-500">아직 기록된 활동이 없습니다. 체크박스를 클릭하거나 KPI를 입력하면 여기에 자동 기록됩니다.</div>
        ) : (
          <ul className="text-sm divide-y divide-slate-100">
            {state.log.slice(0, 12).map((entry, i) => (
              <li key={i} className="py-2 flex items-center gap-3">
                <span className={`chip ${kindColor(entry.kind)}`}>{entry.kind}</span>
                <span className="text-slate-700 flex-1 truncate">{entry.message}</span>
                <span className="text-xs text-slate-400 shrink-0">{new Date(entry.ts).toLocaleString("ko-KR")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function kindColor(kind: string) {
  switch (kind) {
    case "task":   return "bg-blue-100 text-blue-700";
    case "rank":   return "bg-purple-100 text-purple-700";
    case "kpi":    return "bg-emerald-100 text-emerald-700";
    case "health": return "bg-amber-100 text-amber-700";
    default:       return "bg-slate-100 text-slate-700";
  }
}
