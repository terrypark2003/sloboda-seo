// 우선 공략 키워드 30선 - 5개 그룹
export type Keyword = {
  id: string;
  group: string;
  text: string;
  priority: "high" | "mid" | "low";
};

export const keywords: Keyword[] = [
  // 성분 기반
  { id: "k1",  group: "성분",   text: "EGF 크림",            priority: "high" },
  { id: "k2",  group: "성분",   text: "EGF 재생크림",         priority: "high" },
  { id: "k3",  group: "성분",   text: "세라마이드 크림",       priority: "mid"  },
  { id: "k4",  group: "성분",   text: "PDRN 크림",           priority: "mid"  },
  { id: "k5",  group: "성분",   text: "시카크림",             priority: "mid"  },
  { id: "k6",  group: "성분",   text: "센텔라 크림",          priority: "mid"  },

  // 고민 기반
  { id: "k7",  group: "고민",   text: "민감성 피부 크림",      priority: "high" },
  { id: "k8",  group: "고민",   text: "피부장벽 강화 크림",    priority: "high" },
  { id: "k9",  group: "고민",   text: "환절기 진정크림",       priority: "mid"  },
  { id: "k10", group: "고민",   text: "홍조 진정크림",         priority: "mid"  },
  { id: "k11", group: "고민",   text: "각질 진정크림",         priority: "low"  },
  { id: "k12", group: "고민",   text: "건성 보습크림",         priority: "mid"  },

  // 상황 기반
  { id: "k13", group: "상황",   text: "레이저 시술 후 크림",   priority: "high" },
  { id: "k14", group: "상황",   text: "박피 후 진정크림",      priority: "mid"  },
  { id: "k15", group: "상황",   text: "필링 후 보습크림",      priority: "mid"  },
  { id: "k16", group: "상황",   text: "여드름 흉터 재생크림",  priority: "mid"  },
  { id: "k17", group: "상황",   text: "피부과 추천 재생크림",  priority: "high" },
  { id: "k18", group: "상황",   text: "마스크팩 후 크림",      priority: "low"  },

  // 트렌드/속성
  { id: "k19", group: "트렌드", text: "클린뷰티 크림",         priority: "mid"  },
  { id: "k20", group: "트렌드", text: "비건 화장품",           priority: "mid"  },
  { id: "k21", group: "트렌드", text: "더마 코스메틱",         priority: "mid"  },
  { id: "k22", group: "트렌드", text: "K뷰티 재생크림",        priority: "low"  },
  { id: "k23", group: "트렌드", text: "데일리 리커버리 크림",  priority: "mid"  },
  { id: "k24", group: "트렌드", text: "수분장벽 크림",         priority: "mid"  },

  // 브랜드 결합
  { id: "k25", group: "브랜드", text: "슬로보다 재생크림",     priority: "high" },
  { id: "k26", group: "브랜드", text: "슬로보다 No.7",         priority: "high" },
  { id: "k27", group: "브랜드", text: "슬로보다 EGF",          priority: "high" },
  { id: "k28", group: "브랜드", text: "슬로보다 리커버리 크림",priority: "high" },
  { id: "k29", group: "브랜드", text: "슬로보다 후기",         priority: "high" },
  { id: "k30", group: "브랜드", text: "슬로보다 가격",         priority: "mid"  },
];

export const keywordGroups = Array.from(new Set(keywords.map((k) => k.group)));
