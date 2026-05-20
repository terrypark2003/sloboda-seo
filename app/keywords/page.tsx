"use client";

import { Fragment, useMemo, useState } from "react";
import { keywords, keywordGroups } from "@/lib/data/keywords";
import { useStore } from "@/lib/store";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function KeywordsPage() {
  const { state, addRank } = useStore();
  const [activeGroup, setActiveGroup] = useState<string>("전체");
  const [filter, setFilter] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return keywords.filter((k) => {
      if (activeGroup !== "전체" && k.group !== activeGroup) return false;
      if (filter && !k.text.toLowerCase().includes(filter.toLowerCase())) return false;
      return true;
    });
  }, [activeGroup, filter]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">키워드 순위 트래커</h1>
        <p className="text-sm text-slate-500 mt-1">
          네이버·구글에서 직접 검색한 순위를 수동 입력하면 추이가 그래프로 누적됩니다.
        </p>
      </header>

      <div className="card card-pad space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {["전체", ...keywordGroups].map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`chip px-3 py-1 ${activeGroup === g ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              {g}
            </button>
          ))}
          <input
            placeholder="키워드 검색"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input ml-auto w-48"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-left border-b border-slate-200">
              <tr>
                <th className="py-2 pr-3 w-16">그룹</th>
                <th className="py-2 pr-3">키워드</th>
                <th className="py-2 pr-3 w-20">우선도</th>
                <th className="py-2 pr-3 w-24 text-right">네이버</th>
                <th className="py-2 pr-3 w-24 text-right">구글</th>
                <th className="py-2 pr-3 w-32">최근 기록</th>
                <th className="py-2 w-16 text-center">상세</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((k) => {
                const entries = state.ranks[k.id] || [];
                const last = entries.at(-1);
                return (
                  <Fragment key={k.id}>
                    <tr className="border-b border-slate-100">
                      <td className="py-2 pr-3"><span className="chip bg-slate-100 text-slate-600">{k.group}</span></td>
                      <td className="py-2 pr-3 font-medium text-slate-800">{k.text}</td>
                      <td className="py-2 pr-3">
                        <span className={`chip ${k.priority === "high" ? "bg-rose-100 text-rose-700" : k.priority === "mid" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                          {k.priority}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{last?.naver ?? "-"}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{last?.google ?? "-"}</td>
                      <td className="py-2 pr-3 text-xs text-slate-500">{last?.date ?? "-"}</td>
                      <td className="py-2 text-center">
                        <button onClick={() => setOpenId(openId === k.id ? null : k.id)} className="text-brand-600 hover:underline">
                          {openId === k.id ? "닫기" : "열기"}
                        </button>
                      </td>
                    </tr>
                    {openId === k.id && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={7} className="px-4 py-4">
                          <KeywordDetail keywordId={k.id} entries={entries} onAdd={addRank} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">결과 없음</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KeywordDetail({
  keywordId,
  entries,
  onAdd,
}: {
  keywordId: string;
  entries: { date: string; naver?: number | null; google?: number | null }[];
  onAdd: (id: string, entry: any) => void;
}) {
  const [date, setDate] = useState(todayStr());
  const [naver, setNaver] = useState<string>("");
  const [google, setGoogle] = useState<string>("");

  const submit = () => {
    onAdd(keywordId, {
      date,
      naver: naver === "" ? null : parseInt(naver),
      google: google === "" ? null : parseInt(google),
    });
    setNaver("");
    setGoogle("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div className="text-xs text-slate-500 mb-1">추이 (낮을수록 좋음, 1 = 1등)</div>
        <div className="h-44 bg-white rounded-lg border border-slate-200">
          {entries.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">아직 기록 없음</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries} margin={{ top: 10, right: 16, left: 0, bottom: 6 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis reversed domain={[1, 100]} tick={{ fontSize: 11, fill: "#64748b" }} width={32} />
                <Tooltip />
                <ReferenceLine y={10} stroke="#94a3b8" strokeDasharray="2 2" label={{ value: "1페이지", fontSize: 10, fill: "#94a3b8" }} />
                <Line type="monotone" dataKey="naver" stroke="#03c75a" dot={false} strokeWidth={2} name="네이버" />
                <Line type="monotone" dataKey="google" stroke="#4285f4" dot={false} strokeWidth={2} name="구글" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-xs text-slate-500">새 기록 추가</div>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input col-span-2" />
          <input type="number" placeholder="네이버 순위" value={naver} onChange={(e) => setNaver(e.target.value)} className="input" />
          <input type="number" placeholder="구글 순위" value={google} onChange={(e) => setGoogle(e.target.value)} className="input" />
        </div>
        <button onClick={submit} className="btn btn-primary w-full">저장</button>
        <div className="text-[11px] text-slate-500">검색 결과에 보이지 않으면 비워두세요. 100 = 노출 안됨으로 입력 가능.</div>
      </div>
    </div>
  );
}
