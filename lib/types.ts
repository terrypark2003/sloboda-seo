// 전역 데이터 형태
export type RankEntry = { date: string; naver?: number | null; google?: number | null };
export type KpiEntry = {
  month: string; // YYYY-MM
  reviews?: number;
  storeFollows?: number; // 스토어찜
  revenue?: number;       // 매출 (만원 단위 권장)
  blogPosts?: number;
};
export type LogEntry = { ts: number; kind: string; message: string };

export type AppState = {
  completedTasks: Record<string, { completedAt: number }>;
  ranks: Record<string, RankEntry[]>; // keywordId -> entries
  kpi: KpiEntry[];                     // 월별
  log: LogEntry[];
  lastHealthCheck?: { ts: number; mobile?: number; desktop?: number };
};

export const emptyState: AppState = {
  completedTasks: {},
  ranks: {},
  kpi: [],
  log: [],
};
