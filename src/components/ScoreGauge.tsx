interface ScoreGaugeProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  label?: string;
}

export function ScoreGauge({ value, max = 100, size = 100, thickness = 7, label }: ScoreGaugeProps) {
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.min(value / max, 1);
  const dash = progress * circumference;
  const gap = circumference - dash;
  const color = value >= 80 ? '#10B981' : value >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-lg font-bold text-on-surface">{Math.round(value)}%</span>
        {label && <span className="text-[10px] text-on-surface-muted">{label}</span>}
      </div>
    </div>
  );
}
