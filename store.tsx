"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState, emptyState, KpiEntry, LogEntry, RankEntry } from "./types";

const STORAGE_KEY = "sloboda-seo-state-v1";

type StoreApi = {
  state: AppState;
  ready: boolean;
  source: "local" | "cloud";
  toggleTask: (id: string) => void;
  addRank: (keywordId: string, entry: RankEntry) => void;
  removeRank: (keywordId: string, date: string) => void;
  upsertKpi: (entry: KpiEntry) => void;
  removeKpi: (month: string) => void;
  setHealth: (mobile?: number, desktop?: number) => void;
  resetAll: () => void;
  exportJson: () => string;
  importJson: (raw: string) => boolean;
};

const StoreContext = createContext<StoreApi | null>(null);

async function loadFromServer(): Promise<AppState | null> {
  try {
    const res = await fetch("/api/state", { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.source === "cloud" && json?.state) return json.state as AppState;
    return null;
  } catch {
    return null;
  }
}

async function saveToServer(state: AppState): Promise<boolean> {
  try {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<"local" | "cloud">("local");

  // 초기 로드: 서버(KV)에 데이터 있으면 클라우드, 아니면 localStorage
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cloud = await loadFromServer();
      if (cancelled) return;
      if (cloud) {
        setState(cloud);
        setSource("cloud");
        setReady(true);
        return;
      }
      // local fallback
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setState(JSON.parse(raw));
      } catch {}
      setSource("local");
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 변경 시 저장
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
    if (source === "cloud") {
      // best-effort, fire and forget
      saveToServer(state);
    }
  }, [state, ready, source]);

  const log = useCallback((kind: string, message: string) => {
    setState((s) => ({
      ...s,
      log: [{ ts: Date.now(), kind, message }, ...s.log].slice(0, 200),
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((s) => {
      const next = { ...s.completedTasks };
      let msg = "";
      if (next[id]) {
        delete next[id];
        msg = `작업 해제: ${id}`;
      } else {
        next[id] = { completedAt: Date.now() };
        msg = `작업 완료: ${id}`;
      }
      return {
        ...s,
        completedTasks: next,
        log: [{ ts: Date.now(), kind: "task", message: msg }, ...s.log].slice(0, 200),
      };
    });
  }, []);

  const addRank = useCallback((keywordId: string, entry: RankEntry) => {
    setState((s) => {
      const list = [...(s.ranks[keywordId] || []).filter((e) => e.date !== entry.date), entry].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      return {
        ...s,
        ranks: { ...s.ranks, [keywordId]: list },
        log: [
          { ts: Date.now(), kind: "rank", message: `${keywordId} ${entry.date} N:${entry.naver ?? "-"} G:${entry.google ?? "-"}` },
          ...s.log,
        ].slice(0, 200),
      };
    });
  }, []);

  const removeRank = useCallback((keywordId: string, date: string) => {
    setState((s) => ({
      ...s,
      ranks: {
        ...s.ranks,
        [keywordId]: (s.ranks[keywordId] || []).filter((e) => e.date !== date),
      },
    }));
  }, []);

  const upsertKpi = useCallback((entry: KpiEntry) => {
    setState((s) => {
      const others = s.kpi.filter((e) => e.month !== entry.month);
      const merged = [...others, entry].sort((a, b) => a.month.localeCompare(b.month));
      return {
        ...s,
        kpi: merged,
        log: [{ ts: Date.now(), kind: "kpi", message: `${entry.month} KPI 저장` }, ...s.log].slice(0, 200),
      };
    });
  }, []);

  const removeKpi = useCallback((month: string) => {
    setState((s) => ({ ...s, kpi: s.kpi.filter((e) => e.month !== month) }));
  }, []);

  const setHealth = useCallback((mobile?: number, desktop?: number) => {
    setState((s) => ({
      ...s,
      lastHealthCheck: { ts: Date.now(), mobile, desktop },
      log: [
        { ts: Date.now(), kind: "health", message: `사이트 헬스 측정 모바일:${mobile ?? "-"} 데스크톱:${desktop ?? "-"}` },
        ...s.log,
      ].slice(0, 200),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(emptyState);
  }, []);

  const exportJson = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importJson = useCallback((raw: string) => {
    try {
      const next = JSON.parse(raw);
      setState({ ...emptyState, ...next });
      return true;
    } catch {
      return false;
    }
  }, []);

  const api = useMemo<StoreApi>(
    () => ({
      state,
      ready,
      source,
      toggleTask,
      addRank,
      removeRank,
      upsertKpi,
      removeKpi,
      setHealth,
      resetAll,
      exportJson,
      importJson,
    }),
    [state, ready, source, toggleTask, addRank, removeRank, upsertKpi, removeKpi, setHealth, resetAll, exportJson, importJson]
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

// 점수 계산: 완료된 task의 weight 합 / 총 weight × 100
import { phases } from "./data/checklist";
export function computeScore(completedTasks: Record<string, unknown>): number {
  const all = phases.flatMap((p) => p.tasks);
  const total = all.reduce((s, t) => s + t.weight, 0);
  const done = all.filter((t) => completedTasks[t.id]).reduce((s, t) => s + t.weight, 0);
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
