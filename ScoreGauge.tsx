"use client";

type Props = { value: number; size?: number; label?: string };

export default function ScoreGauge({ value, size = 180, label = "전체 SEO 점수" }: Props) {
  const r = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  const color = value >= 70 ? "#10b981" : value >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="14" />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.2s" }}
        />
      </svg>
      <div className="-ml-[140px] mr-4 w-[100px] text-center">
        <div className="text-4xl font-bold leading-none" style={{ color }}>
          {value}
        </div>
        <div className="text-xs text-slate-500 mt-1">/ 100</div>
      </div>
      <div>
        <div className="text-sm text-slate-500 mb-1">{label}</div>
        <div className="text-slate-700">
          {value >= 70 ? "🌳 우수" : value >= 40 ? "🌱 성장 중" : "🌰 시작 단계"}
        </div>
      </div>
    </div>
  );
}
