// 공식몰 head 태그 / robots.txt / JSON-LD 스니펫
// 모두 원클릭 복사용으로 키 = 앵커, value = 코드 본문.

export type Snippet = {
  id: string;
  title: string;
  description: string;
  language: "html" | "json" | "txt";
  code: string;
  note?: string;
};

export const snippets: Snippet[] = [
  {
    id: "home-meta",
    title: "공식몰 홈 — 메타 태그",
    description: "현재 description이 9자로 너무 짧음. 아래 블록으로 교체 또는 보강.",
    language: "html",
    code: `<title>SLOBODA 슬로보다 | EGF 재생크림 · 피부 회복과 진정 케어</title>
<meta name="description" content="민감성 피부의 회복을 위한 클린뷰티 브랜드 슬로보다. EGF 함유 No.7 리커버리 크림으로 시술 후 진정과 피부장벽 강화를 한 번에. 공식몰에서 만나보세요." />
<meta name="keywords" content="슬로보다, SLOBODA, 재생크림, EGF크림, 시술후크림, 민감성피부, 피부장벽, 리커버리크림, 클린뷰티, K뷰티" />
<meta name="author" content="SLOBODA" />
<link rel="canonical" href="https://slobodacosmetics.com/" />`,
    note: "카페24: 쇼핑몰 설정 → 검색 엔진 최적화(SEO) → HTML 헤드 영역에 추가",
  },
  {
    id: "og-tags",
    title: "공식몰 홈 — Open Graph & Twitter Card",
    description: "카카오톡·페이스북·트위터 공유 카드. og:image는 1200×630px PNG/JPG.",
    language: "html",
    code: `<meta property="og:type" content="website" />
<meta property="og:site_name" content="SLOBODA" />
<meta property="og:title" content="SLOBODA 슬로보다 | EGF 재생크림" />
<meta property="og:description" content="민감성 피부의 회복을 위한 클린뷰티 브랜드 슬로보다. EGF 함유 No.7 리커버리 크림으로 시술 후 진정과 피부장벽 강화를 한 번에." />
<meta property="og:image" content="https://slobodacosmetics.com/web/upload/og-1200x630.jpg" />
<meta property="og:url" content="https://slobodacosmetics.com/" />
<meta property="og:locale" content="ko_KR" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="SLOBODA 슬로보다 | EGF 재생크림" />
<meta name="twitter:description" content="민감성 피부를 위한 EGF 함유 리커버리 크림." />
<meta name="twitter:image" content="https://slobodacosmetics.com/web/upload/og-1200x630.jpg" />`,
  },
  {
    id: "product-schema",
    title: "상품 페이지 — Product 스키마 (JSON-LD)",
    description: "구글 리치 결과로 가격·재고·별점 표시. aggregateRating은 실제 리뷰 누적 후 삽입.",
    language: "json",
    code: `<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "SLOBODA No.7 Recovery Cream",
  "image": [
    "https://slobodacosmetics.com/web/product/big/202601/e962ec91cf517dfa323cab86f3e71192.jpg"
  ],
  "description": "민감한 피부를 위한 EGF 함유 리커버리 크림. 시술 후 진정과 피부장벽 강화.",
  "sku": "SLB-N7-50",
  "brand": { "@type": "Brand", "name": "SLOBODA" },
  "offers": {
    "@type": "Offer",
    "url": "https://slobodacosmetics.com/product/sloboda-no7-recovery-cream/31/",
    "priceCurrency": "KRW",
    "price": "48000",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
    note: "리뷰 누적 후 마지막 } 앞에 다음을 추가: \"aggregateRating\":{\"@type\":\"AggregateRating\",\"ratingValue\":\"4.8\",\"reviewCount\":\"20\"}",
  },
  {
    id: "organization-schema",
    title: "전체 페이지 — Organization 스키마",
    description: "구글 지식패널·브랜드 카드 노출용.",
    language: "json",
    code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SLOBODA",
  "alternateName": "슬로보다",
  "url": "https://slobodacosmetics.com",
  "logo": "https://slobodacosmetics.com/web/upload/category/logo/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "대구 수성구 달구벌대로 2362 6층",
    "addressLocality": "대구",
    "postalCode": "42085",
    "addressCountry": "KR"
  },
  "telephone": "+82-70-8027-4463",
  "sameAs": [
    "https://instagram.com/sloboda_cosmetics",
    "https://pf.kakao.com/sloboda"
  ]
}
</script>`,
  },
  {
    id: "website-schema",
    title: "전체 페이지 — WebSite + SearchAction",
    description: "구글 검색 결과에 사이트 자체 검색박스 노출.",
    language: "json",
    code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SLOBODA",
  "url": "https://slobodacosmetics.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://slobodacosmetics.com/product/search.html?keyword={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`,
  },
  {
    id: "robots",
    title: "robots.txt",
    description: "검색엔진 크롤러에게 허용·차단할 경로를 알리는 파일. /robots.txt 위치에 업로드.",
    language: "txt",
    code: `User-agent: *
Allow: /
Disallow: /member/
Disallow: /order/
Disallow: /myshop/
Disallow: /exec/
Disallow: /admin/

Sitemap: https://slobodacosmetics.com/sitemap.xml`,
  },
  {
    id: "store-title-a",
    title: "스마트스토어 상품명 A안 (시술후 타깃, 39자)",
    description: "레이저·필링 등 시술 직후 회복용을 검색하는 사용자를 끌어옴.",
    language: "txt",
    code: `슬로보다 No.7 EGF 재생크림 시술후크림 민감성피부 진정 장벽 보습 50ml`,
  },
  {
    id: "store-title-b",
    title: "스마트스토어 상품명 B안 (성분 강조, 41자)",
    description: "EGF·세라마이드 등 성분으로 검색하는 사용자 대상.",
    language: "txt",
    code: `슬로보다 No.7 리커버리크림 EGF 세라마이드 피부장벽 재생크림 민감성 50ml`,
  },
  {
    id: "store-title-c",
    title: "스마트스토어 상품명 C안 (클린뷰티 강조, 42자)",
    description: "비건·클린뷰티 관심층 대상.",
    language: "txt",
    code: `슬로보다 No.7 Recovery 재생크림 EGF 시술후 진정크림 민감성 클린뷰티 50ml`,
  },
  {
    id: "store-tags",
    title: "스마트스토어 태그 10개",
    description: "상품 등록 화면 → 태그 입력란에 그대로 붙여넣기.",
    language: "txt",
    code: `재생크림, EGF크림, 시술후크림, 민감성크림, 피부장벽크림, 진정크림, 클린뷰티, 리커버리크림, 비건크림, 데일리크림`,
  },
];
