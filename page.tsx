"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { KpiEntry } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid } from "recharts";

function thisMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function KpiPage() {
  const { state, upsertKpi, removeKpi } = useStore();
  const [form, setForm] = useState<KpiEntry>({
    month: thisMonth(),
    reviews: undefined,
    storeFollows: undefined,
    revenue: undefined,
    blogPosts: undefined,
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertKpi({
      ...form,
      reviews: numOrUndef(form.reviews),
      storeFollows: numOrUndef(form.storeFollows),
      revenue: numOrUndef(form.revenue),
      blogPosts: numOrUndef(form.blogPosts),
    });
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">월간 KPI</h1>
        <p className="text-sm text-slate-500 mt-1">
          매월 말일에 5분만 입력하세요. 리뷰·찜·블로그·매출 추이를 한눈에 볼 수 있습니다.
        </p>
      </header>

      <div className="card card-pad">
        <h2 className="text-base font-semibold text-slate-700 mb-3">이번 달 데이터 입력</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Field label="기준월 (YYYY-MM)">
            <input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="input w-full" />
          </Field>
          <Field label="스토어 리뷰 수">
            <input type="number" value={form.reviews ?? ""} onChange={(e) => setForm({ ...form, reviews: numOrUndef(e.target.value) })} className="input w-full" />
          </Field>
          <Field label="스토어찜">
            <input type="number" value={form.storeFollows ?? ""} onChange={(e) => setForm({ ...form, storeFollows: numOrUndef(e.target.value) })} className="input w-full" />
          </Field>
          <Field label="블로그 누적 글">
            <input type="number" value={form.blogPosts ?? ""} onChange={(e) => setForm({ ...form, blogPosts: numOrUndef(e.target.value) })} className="input w-full" />
          </Field>
          <Field label="매출 (만원)">
            <input type="number" value={form.revenue ?? ""} onChange={(e) => setForm({ ...form, revenue: numOrUndef(e.target.value) })} className="input w-full" />
          </Field>
          <div className="col-span-2 sm:col-span-3 lg:col-span-5 flex justify-end">
            <button type="submit" className="btn btn-primary">저장 / 덮어쓰기</button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="리뷰 · 찜 · 블로그">
          {state.kpi.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={state.kpi}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reviews" name="리뷰" stroke="#03c75a" strokeWidth={2} dot />
                <Line type="monotone" dataKey="storeFollows" name="스토어찜" stroke="#4285f4" strokeWidth={2} dot />
                <Line type="monotone" dataKey="blogPosts" name="블로그" stroke="#a855f7" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="월매출 (만원)">
          {state.kpi.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={state.kpi}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="revenue" name="매출(만원)" fill="#36608a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="card card-pad">
        <h2 className="text-base font-semibold text-slate-700 mb-3">기록 표</h2>
        {state.kpi.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="text-left py-2 pr-3">월</th>
                  <th className="text-right py-2 pr-3">리뷰</th>
                  <th className="text-right py-2 pr-3">스토어찜</th>
                  <th className="text-right py-2 pr-3">블로그</th>
                  <th className="text-right py-2 pr-3">매출(만원)</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {state.kpi.map((e) => (
                  <tr key={e.month} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-medium text-slate-800">{e.month}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{e.reviews ?? "-"}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{e.storeFollows ?? "-"}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{e.blogPosts ?? "-"}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{e.revenue ?? "-"}</td>
                    <td className="py-2 text-right">
                      <button onClick={() => removeKpi(e.month)} className="text-xs text-rose-600 hover:underline">삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function numOrUndef(v: any): number | undefined {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return isNaN(n) ? undefined : n;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      {children}
    </label>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card card-pad">
      <h2 className="text-base font-semibold text-slate-700 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Empty() {
  return <div className="h-44 flex items-center justify-center text-sm text-slate-400">기록 후 그래프가 표시됩니다.</div>;
}
