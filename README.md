# SLOBODA · SEO Dashboard

슬로보다 코스메틱(slobodacosmetics.com + 네이버 스마트스토어)의 SEO 작업 진척도를
한 페이지에서 관리하는 내부용 대시보드입니다.

## 한눈에 보기

- **대시보드**: 전체 SEO 점수(가중치 합산), 오늘의 할 일 3개, 사이트 헬스(PageSpeed), 최신 KPI, 활동 로그
- **체크리스트**: 90일 4단계(Phase 1~4) · 30개 작업 · 가중치 기반 점수
- **키워드**: 30개 우선 키워드 · 네이버/구글 순위 수동 입력 · 추이 그래프
- **월간 KPI**: 리뷰·스토어찜·블로그·매출을 매월 입력 → 추이 그래프
- **코드**: 메타 태그·OG·JSON-LD(Product/Organization/WebSite)·robots.txt·스마트스토어 상품명 A/B/C안 — 모두 원클릭 복사

데이터는 기본적으로 **브라우저 localStorage**에 저장됩니다.
Vercel KV(또는 Upstash Redis) 환경변수를 설정하면 자동으로 클라우드로 전환돼 여러 기기에서 동일한 데이터를 볼 수 있습니다.

## 로컬 실행

```bash
npm install
npm run dev
```

기본 포트는 `http://localhost:3000`.

## Vercel 배포 (sloboda-seo.vercel.app)

### 1. GitHub 저장소 만들기

이 폴더 전체를 새 저장소에 푸시하세요.

```bash
git init
git add .
git commit -m "init sloboda-seo dashboard"
git branch -M main
git remote add origin https://github.com/<your-id>/sloboda-seo.git
git push -u origin main
```

### 2. Vercel에서 import

1. https://vercel.com/new 접속 → "Import Git Repository"
2. 위 저장소 선택 → "Deploy"
3. 약 1~2분 후 `https://sloboda-seo.vercel.app` 로 자동 배포 (도메인이 이미 사용 중이면 Vercel이 자동으로 대체 도메인을 부여)
4. 프로젝트 → Settings → Domains 에서 `sloboda-seo.vercel.app` 으로 원하는 이름을 지정

### 3. (선택) 여러 기기 동기화 — Vercel KV 연결

기본은 localStorage라 PC/모바일/노트북 데이터가 분리됩니다.
다중 기기 동기화가 필요하면 KV를 붙이세요(둘 다 무료 플랜 충분).

**옵션 A — Vercel KV**
1. Vercel 대시보드 → Storage → "Create Database" → "KV"
2. 만들어진 KV → "Connect Project" → 이 프로젝트 연결
3. 자동으로 `KV_REST_API_URL`, `KV_REST_API_TOKEN` 환경변수가 주입됩니다
4. Settings → Deployments → Redeploy

**옵션 B — Upstash Redis (KV 대안)**
1. https://console.upstash.com 에서 Redis DB 생성 (Region: ap-northeast-1 추천)
2. "REST API" 탭에서 `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` 값을 복사
3. Vercel 프로젝트 → Settings → Environment Variables 에서
   - `KV_REST_API_URL` ← Upstash URL
   - `KV_REST_API_TOKEN` ← Upstash Token
4. Redeploy

`@vercel/kv` 클라이언트는 양쪽 모두와 호환됩니다.

### 4. (선택) PageSpeed API 키 추가

대시보드의 "사이트 헬스" 카드는 키 없이도 동작하지만, 키를 추가하면 호출 한도가 훨씬 늘어납니다.

1. https://developers.google.com/speed/docs/insights/v5/get-started → API 키 발급
2. Vercel → Environment Variables → `PAGESPEED_API_KEY` 추가
3. Redeploy

## 데이터 백업 / 이전

브라우저 개발자도구 콘솔에서 다음을 실행하면 현재 데이터가 JSON으로 출력됩니다:

```js
copy(localStorage.getItem("sloboda-seo-state-v1"));
```

복원은 같은 키에 값을 넣고 새로고침하면 됩니다.

## 폴더 구조

```
app/
├── layout.tsx            # 전역 레이아웃 + StoreProvider
├── page.tsx              # 대시보드(메인)
├── checklist/page.tsx    # 90일 체크리스트
├── keywords/page.tsx     # 키워드 트래커
├── kpi/page.tsx          # 월간 KPI
├── codes/page.tsx        # 메타·스키마 코드
└── api/
    ├── state/route.ts    # KV GET/POST
    └── pagespeed/route.ts# PageSpeed Insights 프록시
components/               # ScoreGauge, Nav, HealthCheck, CopyButton
lib/
├── data/                 # 정적 데이터 (체크리스트·키워드·코드)
├── store.tsx             # localStorage + KV 어댑터 (React Context)
├── kv.ts                 # @vercel/kv 래퍼 (환경변수 없으면 비활성)
└── types.ts
```

## 커스터마이즈 포인트

- 체크리스트 항목 추가/수정: `lib/data/checklist.ts`
- 키워드 추가/수정: `lib/data/keywords.ts`
- 코드 스니펫 수정: `lib/data/codes.ts`
- 점수 가중치 변경: 각 task의 `weight` 값. 합계가 100이면 점수가 직관적.

## 보안 메모

- 이 대시보드는 내부 운영 도구이므로 layout.tsx에서 `robots: { index: false, follow: false }`로 검색엔진 색인을 차단했습니다.
- 외부에 노출하기 싫다면 Vercel → Settings → Deployment Protection 에서 "Password Protection" 또는 "Vercel Authentication" 활성화 (Pro 플랜).

## 라이선스

내부 사용 목적의 비공개 프로젝트.
