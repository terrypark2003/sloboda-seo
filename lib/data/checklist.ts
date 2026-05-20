// 90일 SEO 실행 체크리스트
// 각 항목에는 점수 가중치(weight)가 있어 전체 점수에 반영됩니다.
// total weight = 100

export type Task = {
  id: string;
  title: string;
  detail?: string;
  weight: number; // 합산 100
  link?: { label: string; url: string };
};

export type Phase = {
  id: string;
  label: string;
  range: string; // 0~7일차 등
  description: string;
  tasks: Task[];
};

export const phases: Phase[] = [
  {
    id: "phase1",
    label: "Phase 1 · 기반 정비",
    range: "0~7일차",
    description: "가장 ROI 높은 1주차 작업. 메타·서치콘솔·상품명을 일괄 정비합니다.",
    tasks: [
      {
        id: "p1-1",
        title: "공식몰 홈 메타 description 70~150자로 확장",
        detail: "현재 9자(SLOBODA 쇼핑몰 | 재생크림). EGF·시술후·민감성·피부장벽 키워드 자연스럽게 포함.",
        weight: 4,
        link: { label: "코드 스니펫 보기", url: "/codes#home-meta" },
      },
      {
        id: "p1-2",
        title: "공식몰 홈 meta keywords 10개로 확장",
        detail: "슬로보다, SLOBODA, 재생크림, EGF크림, 시술후크림, 민감성피부, 피부장벽, 리커버리크림, 클린뷰티, K뷰티",
        weight: 2,
        link: { label: "코드 스니펫 보기", url: "/codes#home-meta" },
      },
      {
        id: "p1-3",
        title: "og:title / og:description / og:image(1200×630) 정비",
        detail: "공유 시 카카오톡·페이스북·인스타에 노출되는 카드 이미지.",
        weight: 3,
        link: { label: "코드 스니펫 보기", url: "/codes#og-tags" },
      },
      {
        id: "p1-4",
        title: "상품 페이지 title에 한글 키워드 보강",
        detail: "현재: SLOBODA | No.7 Recovery Cream → 권장: SLOBODA 슬로보다 No.7 EGF 재생크림 · 시술후 진정",
        weight: 3,
      },
      {
        id: "p1-5",
        title: "이미지 alt 텍스트 전수 작성",
        detail: "자동생성된 'S4L19' 형태 → '슬로보다 No.7 재생크림 50ml 제품 이미지' 식으로 수동 작성.",
        weight: 3,
      },
      {
        id: "p1-6",
        title: "구글 서치콘솔 등록 + 사이트맵 제출",
        detail: "search.google.com/search-console → URL 접두어 등록 → HTML 태그 인증 → sitemap.xml 제출.",
        weight: 4,
        link: { label: "Search Console 열기", url: "https://search.google.com/search-console" },
      },
      {
        id: "p1-7",
        title: "네이버 웹마스터도구 사이트맵·RSS 제출",
        detail: "이미 사이트 인증 완료. searchadvisor.naver.com에서 사이트맵 제출 + 웹페이지 최적화 점수 확인.",
        weight: 3,
        link: { label: "Search Advisor 열기", url: "https://searchadvisor.naver.com" },
      },
      {
        id: "p1-8",
        title: "상품 페이지에 Product 스키마(JSON-LD) 삽입",
        detail: "구글 리치 결과(별점·가격·재고) 노출용. aggregateRating은 실제 리뷰 누적 후 삽입.",
        weight: 4,
        link: { label: "스키마 코드 보기", url: "/codes#product-schema" },
      },
      {
        id: "p1-9",
        title: "스마트스토어 상품명 재등록 (49자 이하, 키워드 좌측)",
        detail: "예: 슬로보다 No.7 EGF 재생크림 시술후크림 민감성피부 진정 장벽 보습 50ml (39자)",
        weight: 5,
      },
      {
        id: "p1-10",
        title: "스마트스토어 태그 10개 정리",
        detail: "재생크림, EGF크림, 시술후크림, 민감성크림, 피부장벽크림, 진정크림, 클린뷰티, 리커버리크림, 비건크림, 데일리크림",
        weight: 3,
      },
      {
        id: "p1-11",
        title: "robots.txt에 Sitemap 라인 + 차단 경로 확인",
        detail: "/member, /order, /myshop 등 색인 불필요 경로 Disallow. sitemap.xml 명시.",
        weight: 2,
      },
    ],
  },
  {
    id: "phase2",
    label: "Phase 2 · 콘텐츠 가동",
    range: "8~30일차",
    description: "블로그·체험단·리뷰·플레이스로 외부 신호를 빠르게 누적합니다.",
    tasks: [
      {
        id: "p2-1",
        title: "네이버 공식 블로그 개설 + 채널 인증 신청",
        weight: 3,
        link: { label: "네이버 블로그", url: "https://blog.naver.com" },
      },
      {
        id: "p2-2",
        title: "블로그 첫 정성글 4편 발행",
        detail: "성분 이야기 / 시술 후 케어 루틴 / EGF 효능 / 사용법 — 각 1,500~2,000자, 사진 7~12장.",
        weight: 5,
      },
      {
        id: "p2-3",
        title: "체험단 1차 모집 10~15명 (블로그)",
        detail: "레뷰, 디너의여왕, 태그바이 등. 필수 키워드 가이드라인 명시.",
        weight: 4,
      },
      {
        id: "p2-4",
        title: "스마트스토어 첫 리뷰 20건 확보",
        detail: "텍스트 500P / 포토 1,500P 적립금 + 첫구매 쿠폰 결합.",
        weight: 5,
      },
      {
        id: "p2-5",
        title: "공식몰 리뷰·Q&A 10건 확보",
        detail: "초기 고객·체험단·내부 인원에게 솔직 후기 작성 요청.",
        weight: 3,
      },
      {
        id: "p2-6",
        title: "인스타그램 릴스 8편 업로드",
        detail: "성분 스토리·시술 전후·사용 방법·고객 후기·매장 모습 등 주 2편 페이스.",
        weight: 3,
      },
      {
        id: "p2-7",
        title: "네이버 플레이스 등록 (대구 수성구 오프라인)",
        detail: "smartplace.naver.com → 사진 20장+, 영업시간·전화·인스타 연동.",
        weight: 4,
        link: { label: "Smart Place", url: "https://smartplace.naver.com" },
      },
      {
        id: "p2-8",
        title: "네이버 쇼핑 검색광고 소액 운영 시작",
        detail: "일 5,000~10,000원 / ROAS 300% 모니터링.",
        weight: 2,
      },
    ],
  },
  {
    id: "phase3",
    label: "Phase 3 · 확장",
    range: "31~60일차",
    description: "유튜브·플랫폼·라이브·지식인 등 채널을 확장해 SERP 점유를 늘립니다.",
    tasks: [
      {
        id: "p3-1",
        title: "유튜브 채널 개설 또는 인플루언서 시딩 10명",
        weight: 4,
      },
      {
        id: "p3-2",
        title: "화해(Hwahae) · 글로우픽 브랜드/상품 등록",
        detail: "브랜드 페이지 자체 백링크 + 초기 후기 시딩.",
        weight: 4,
        link: { label: "Hwahae Biz", url: "https://business.hwahae.co.kr" },
      },
      {
        id: "p3-3",
        title: "네이버 쇼핑라이브 1~2회 진행",
        detail: "라이브 가점 + 구매전환 동시 확보.",
        weight: 3,
      },
      {
        id: "p3-4",
        title: "블로그 누적 12편 이상, 키워드 카니발리제이션 점검",
        weight: 3,
      },
      {
        id: "p3-5",
        title: "지식iN 답변 누적 20건+",
        detail: "레이저 후 크림 추천, 민감성 진정크림 등 자연스러운 사용 후기 형식.",
        weight: 3,
      },
      {
        id: "p3-6",
        title: "카카오채널 / 네이버 톡톡 운영",
        detail: "이탈 고객 재방문 메시지·신상품 안내.",
        weight: 2,
      },
    ],
  },
  {
    id: "phase4",
    label: "Phase 4 · 최적화",
    range: "61~90일차",
    description: "데이터 기반으로 키워드·메타·상품 라인업을 다듬고 다음 분기를 설계합니다.",
    tasks: [
      {
        id: "p4-1",
        title: "서치콘솔·웹마스터 데이터로 메타 재작성",
        detail: "클릭률 낮은 페이지 → title/description A/B 테스트.",
        weight: 4,
      },
      {
        id: "p4-2",
        title: "리뷰 100건+ 확보, 별점 4.7+ 유지",
        weight: 4,
      },
      {
        id: "p4-3",
        title: "두 번째 상품 라인업 출시 + 키워드 카테고리 확장",
        weight: 4,
      },
      {
        id: "p4-4",
        title: "해외 진출 검토 (영문 페이지 / hreflang / en sitemap)",
        weight: 2,
      },
      {
        id: "p4-5",
        title: "PR 기사 1~2건 게재 (뷰티 매거진)",
        weight: 3,
      },
      {
        id: "p4-6",
        title: "KPI 리포트 + 다음 분기 계획 수립",
        weight: 3,
      },
    ],
  },
];

// 전체 가중치 합산 (디버그용)
export const TOTAL_WEIGHT = phases
  .flatMap((p) => p.tasks)
  .reduce((sum, t) => sum + t.weight, 0);

export const allTasks: Task[] = phases.flatMap((p) => p.tasks);

// 오늘 해야 할 일 후보 — 빠른 우선순위 정렬
export function nextActionableTasks(completedIds: Set<string>, limit = 3): Task[] {
  for (const phase of phases) {
    const pending = phase.tasks.filter((t) => !completedIds.has(t.id));
    if (pending.length > 0) return pending.slice(0, limit);
  }
  return [];
}
