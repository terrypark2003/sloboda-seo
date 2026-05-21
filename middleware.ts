import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

const COOKIE = "slb-auth";

export function middleware(req: NextRequest) {
  const pw = process.env.SITE_PASSWORD;
  if (!pw) return NextResponse.next();

  if (req.cookies.get(COOKIE)?.value === pw) return NextResponse.next();

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
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  const wrong = req.nextUrl.searchParams.has("password");
  const html = buildLoginHtml(wrong);
  return new NextResponse(html, {
    status: wrong ? 401 : 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function buildLoginHtml(wrong: boolean): string {
  const errMsg = wrong ? '<div class="err">비밀번호가 맞지 않습니다.</div>' : "";
  return [
    '<!DOCTYPE html><html lang="ko"><head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>Login · SLOBODA SEO</title>',
    '<style>',
    '*{box-sizing:border-box}',
    'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Pretendard,sans-serif;',
    'min-height:100vh;display:flex;align-items:center;justify-content:center;',
    'background:linear-gradient(180deg,#f3f7fb 0%,#e3edf6 100%);margin:0;color:#1a2333}',
    '.box{background:#fff;border-radius:16px;padding:32px;',
    'box-shadow:0 4px 20px rgba(40,67,94,.08);width:360px;max-width:90vw}',
    '.brand{font-weight:700;font-size:13px;color:#36608a;letter-spacing:.04em;margin-bottom:4px}',
    'h1{font-size:22px;margin:0 0 6px;color:#243a51}',
    'p{margin:0 0 24px;font-size:13px;color:#64748b}',
    'label{display:block;font-size:12px;color:#64748b;margin-bottom:6px}',
    'input{width:100%;padding:10px 14px;border:1px solid #cbd5e0;border-radius:8px;font-size:14px}',
    'input:focus{outline:none;border-color:#477aa8;box-shadow:0 0 0 3px rgba(71,122,168,.18)}',
    'button{width:100%;margin-top:12px;padding:11px;background:#36608a;color:#fff;',
    'border:none;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer}',
    'button:hover{background:#2e5071}',
    '.hint{font-size:12px;color:#94a3b8;text-align:center;margin-top:16px}',
    '.err{font-size:13px;color:#dc2626;margin-bottom:12px}',
    '</style></head><body>',
    '<form class="box" action="" method="get">',
    '<div class="brand">SLOBODA</div>',
    '<h1>SEO Dashboard</h1>',
    '<p>접속하려면 비밀번호를 입력하세요.</p>',
    errMsg,
    '<label for="pw">비밀번호</label>',
    '<input id="pw" type="password" name="password" autofocus autocomplete="current-password">',
    '<button type="submit">입장</button>',
    '<div class="hint">30일간 자동 로그인됩니다.</div>',
    '</form></body></html>',
  ].join("\n");
}
