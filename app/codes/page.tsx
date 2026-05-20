"use client";

import { useEffect } from "react";
import { snippets } from "@/lib/data/codes";
import CopyButton from "@/components/CopyButton";

export default function CodesPage() {
  // 해시(#home-meta 등) 자동 스크롤
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">코드 스니펫</h1>
        <p className="text-sm text-slate-500 mt-1">
          공식몰 head 태그·robots.txt·스마트스토어 상품명 등 즉시 적용 가능한 코드. 우측 상단 [복사] 버튼으로 클립보드에 복사됩니다.
        </p>
      </header>

      <nav className="card card-pad flex flex-wrap gap-2 text-sm">
        {snippets.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="px-2 py-1 rounded-md bg-slate-100 hover:bg-brand-100 text-slate-700">
            {s.title}
          </a>
        ))}
      </nav>

      <div className="space-y-5">
        {snippets.map((s) => (
          <section key={s.id} id={s.id} className="card card-pad scroll-mt-20">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h2 className="text-base font-bold text-slate-800">{s.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{s.description}</p>
                {s.note && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1 mt-2 inline-block">
                    💡 {s.note}
                  </p>
                )}
              </div>
              <CopyButton text={s.code} />
            </div>
            <pre className="code mt-3 whitespace-pre">{s.code}</pre>
          </section>
        ))}
      </div>
    </div>
  );
}
