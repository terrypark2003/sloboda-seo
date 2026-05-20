import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "SLOBODA · SEO Dashboard",
  description: "슬로보다 코스메틱 네이버·구글 SEO 진행 현황 대시보드",
  robots: { index: false, follow: false }, // 내부용 대시보드 → 색인 차단
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <StoreProvider>
          <Nav />
          <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
          <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-slate-400">
            SLOBODA SEO Dashboard · 내부용 진행 관리 도구 · 검색엔진 색인 차단
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
