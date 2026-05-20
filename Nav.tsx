"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const links = [
  { href: "/", label: "대시보드" },
  { href: "/checklist", label: "체크리스트" },
  { href: "/keywords", label: "키워드" },
  { href: "/kpi", label: "월간 KPI" },
  { href: "/codes", label: "코드" },
];

export default function Nav() {
  const pathname = usePathname();
  const { source, ready } = useStore();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link href="/" className="font-bold tracking-tight text-brand-700 text-lg">
          SLOBODA <span className="text-slate-400 font-normal">· SEO Dashboard</span>
        </Link>
        <nav className="flex items-center gap-1 ml-auto">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <span
            title={source === "cloud" ? "Vercel KV에 자동 동기화 중" : "브라우저 localStorage 사용 중"}
            className={`ml-3 chip ${source === "cloud" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
          >
            {ready ? (source === "cloud" ? "Cloud" : "Local") : "..."}
          </span>
        </nav>
      </div>
    </header>
  );
}
