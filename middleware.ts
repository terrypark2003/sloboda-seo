// HTTP Basic Auth로 사이트 전체 보호.
// 환경변수 SITE_PASSWORD가 설정돼 있으면 활성화, 없으면 우회.
// 브라우저는 한 번 인증 후 같은 도메인의 모든 요청에 자동으로 헤더를 첨부함.
import { NextRequest, NextResponse } from "next/server";

export const config = {
  // 미들웨어가 적용될 경로. 정적 리소스만 제외.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const idx = decoded.indexOf(":");
        const pass = idx >= 0 ? decoded.slice(idx + 1) : decoded;
        if (pass === password) {
          return NextResponse.next();
        }
      } catch {}
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SLOBODA SEO Dashboard"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
