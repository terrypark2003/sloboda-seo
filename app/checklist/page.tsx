"use client";

import Link from "next/link";
import { useState } from "react";
import { phases } from "@/lib/data/checklist";
import { useStore, computeScore } from "@/lib/store";

export default function ChecklistPage() {
  const { state, toggleTask } = useStore();
  const completed = state.completedTasks;
  const score = computeScore(completed);
  const [openPhase, setOpenPhase] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">90일 SEO 체크리스트</h1>
          <p className="text-sm text-slate-500 mt-1">각 작업의 가중치가 점수에 반영됩니다. 메인 점수: <strong className="text-brand-700">{score} / 100</strong></p>
        </div>
        <Link href="/" className="btn btn-ghost">← 대시보드</Link>
      </header>

      <div className="space-y-4">
        {phases.map((phase) => {
          const done = phase.tasks.filter((t) => completed[t.id]).length;
          const total = phase.tasks.length;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          const isOpen = openPhase === phase.id || openPhase === null;
          return (
            <section key={phase.id} className="card overflow-hidden">
              <button
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50"
                onClick={() => setOpenPhase(isOpen ? phase.id : null)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-800">{phase.label}</span>
                    <span className="chip bg-brand-50 text-brand-700">{phase.range}</span>
                    <span className={`chip ${pct === 100 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {done} / {total}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">{phase.description}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-2xl text-slate-300">{isOpen ? "▾" : "▸"}</div>
              </button>

              {isOpen && (
                <ul className="divide-y divide-slate-100 border-t border-slate-100">
                  {phase.tasks.map((t) => {
                    const checked = !!completed[t.id];
                    return (
                      <li key={t.id} className={`flex items-start gap-3 px-5 py-3 ${checked ? "bg-emerald-50/40" : ""}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTask(t.id)}
                          className="mt-1 w-5 h-5 accent-brand-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${checked ? "text-slate-500 line-through" : "text-slate-800"}`}>{t.title}</div>
                          {t.detail && <div className="text-sm text-slate-500 mt-0.5">{t.detail}</div>}
                          {t.link && (
                            <Link href={t.link.url} className="inline-block mt-1 text-xs text-brand-600 hover:underline" target={t.link.url.startsWith("http") ? "_blank" : undefined}>
                              {t.link.label} ↗
                            </Link>
                          )}
                          {checked && state.completedTasks[t.id]?.completedAt && (
                            <div className="text-[11px] text-slate-400 mt-1">
                              완료 {new Date(state.completedTasks[t.id].completedAt).toLocaleString("ko-KR")}
                            </div>
                          )}
                        </div>
                        <span className="chip bg-slate-100 text-slate-600 shrink-0">w{t.weight}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
