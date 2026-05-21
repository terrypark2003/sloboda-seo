// 쿠키 기반 비밀번호 보호.
// 처음 접속 시 로그인 페이지 → 비밀번호 맞으면 30일간 쿠키 저장 → 자동 통과.
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

const COOKIE = "slb-auth";

export function middleware(req: NextRequest) {
  const pw = process.env.SITE_PASSWORD;
  if (!pw) return NextResponse.next();

  // 이미 인증된 쿠키 있음
  if (req.cookies.get(COOKIE)?.value === pw) return NextResponse.next();

  // ?password= 쿼리로 인증 시도
  const queryPw = req.nextUrl.searchParams.get("password");
  if (queryPw === pw) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("password");
    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE, pw, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30일
    });
    return res;
  }

  // 로그인 페이지 HTML
  return new NextResponse(LOGIN_HTML, {
    status: 401,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="ko"><head>
<meta charset="utf-8">
<meta 