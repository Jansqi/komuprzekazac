'use client';

interface Segment {
  label: string;
  value: number;
  color: string;
}

export default function FinancialBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  if (total === 0) return null;

  return (
    <div>
      <div className="flex rounded-lg overflow-hidden h-8">
        {segments.map((s, i) => {
          const pct = (Math.max(0, s.value) / total) * 100;
          if (pct < 1) return null;
          return (
            <div
              key={i}
              className="flex items-center justify-center text-xs text-white font-medium"
              style={{ width: `${pct}%`, backgroundColor: s.color, minWidth: pct > 5 ? 'auto' : 0 }}
              title={`${s.label}: ${pct.toFixed(1)}%`}
            >
              {pct > 10 ? `${Math.round(pct)}%` : ''}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
        {segments.map((s, i) => {
          const pct = (Math.max(0, s.value) / total) * 100;
          if (pct < 1) return null;
          return (
            <div key={i} className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
              {s.label}: {Math.round(pct)}%
            </div>
          );
        })}
      </div>
    </div>
  );
}
