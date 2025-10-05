'use client';

import React from 'react';

export interface WeeklyPoint {
  date: string; // YYYY-MM-DD
  spent: number;
}

interface AnalyticsProps {
  weeklySpending: WeeklyPoint[]; // last up to 7 days ascending
  dailyLimit: number;
  totalSaved: number; // aggregate of all goal savedAmounts
  totalSpent: number; // aggregate spending (e.g., weekly sum)
}

// Helper to format date label (e.g., Mon, Tue)
function shortWeekday(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

export default function Analytics({ weeklySpending, dailyLimit, totalSaved, totalSpent }: AnalyticsProps) {
  // Prepare chart dimensions
  const width = 460;
  const height = 220;
  const paddingX = 32;
  const paddingY = 24;
  // Always show exactly 7 consecutive days ending with the last provided date (or today if none)
  const sorted = [...weeklySpending].sort((a,b) => a.date.localeCompare(b.date));
  const lastDateStr = sorted.length ? sorted[sorted.length - 1].date : new Date().toISOString().slice(0,10);
  const lastDate = new Date(lastDateStr + 'T00:00:00');
  const byDate = new Map(sorted.map(d => [d.date, d.spent]));
  const data: WeeklyPoint[] = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(lastDate);
    d.setDate(lastDate.getDate() - (6 - idx)); // oldest to newest
    const ds = d.toISOString().slice(0,10);
    return { date: ds, spent: byDate.get(ds) ?? 0 };
  });
  const maxSpent = Math.max(dailyLimit, ...data.map(d => d.spent), 10);

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.spent / maxSpent) * (height - paddingY * 2);
    return { x, y, label: shortWeekday(d.date), value: d.spent, date: d.date };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  // ---------------------------------------------
  // Sample Spending Categories (static placeholder)
  // Replace later with real data via props or hook
  // ---------------------------------------------
  const categoryPalette = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4'];
  const sampleCategories: { name: string; amount: number }[] = [
    { name: 'Food', amount: 120 },
    { name: 'Transport', amount: 45 },
    { name: 'Entertainment', amount: 60 },
    { name: 'Utilities', amount: 80 },
    { name: 'Shopping', amount: 95 },
    { name: 'Other', amount: 30 }
  ];
  const catTotal = sampleCategories.reduce((s,c) => s + c.amount, 0) || 1;
  const pieSize = 240;
  const r = pieSize / 2 - 8;
  let acc = 0;
  const categorySlices = sampleCategories.map((c, idx) => {
    const ang = (c.amount / catTotal) * Math.PI * 2;
    const start = acc;
    const end = acc + ang;
    acc = end;
    const largeArc = ang > Math.PI ? 1 : 0;
    const x1 = r + r * Math.sin(start);
    const y1 = r - r * Math.cos(start);
    const x2 = r + r * Math.sin(end);
    const y2 = r - r * Math.cos(end);
    const path = `M ${r} ${r} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    const percent = (c.amount / catTotal) * 100;
    return { c, path, percent, color: categoryPalette[idx % categoryPalette.length] };
  });

  return (
  <div className="flex flex-col md:flex-row flex-wrap gap-8 items-start">
      {/* Left column: Weekly chart + metric cards */}
      <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a] w-full">
        <h2 className="text-xl font-bold text-white mb-4">Weekly Spending</h2>
      {points.length < 2 ? (
        <p className="text-[#a1a1aa] text-sm">Not enough data yet. Add some expenses across days to see the line graph.</p>
      ) : (
        <div className="overflow-x-auto">
          <svg width={width} height={height} className="block">
            {/* Grid lines */}
            {Array.from({ length: 5 }).map((_, idx) => {
              const y = paddingY + (idx / 4) * (height - paddingY * 2);
              return (
                <line
                  key={idx}
                  x1={paddingX}
                  x2={width - paddingX}
                  y1={y}
                  y2={y}
                  stroke="#27272a"
                  strokeWidth={1}
                />
              );
            })}
            {/* Daily limit line */}
            <line
              x1={paddingX}
              x2={width - paddingX}
              y1={height - paddingY - (dailyLimit / maxSpent) * (height - paddingY * 2)}
              y2={height - paddingY - (dailyLimit / maxSpent) * (height - paddingY * 2)}
              stroke="#3b82f6"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            {/* Line path */}
            <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth={2} />
            {/* Area under line */}
            <path
              d={`${linePath} L${points[points.length - 1].x},${height - paddingY} L${points[0].x},${height - paddingY} Z`}
              fill="url(#gradient)"
              opacity={0.25}
            />
            <defs>
              <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* Points */}
            {points.map(p => (
              <g key={p.date}>
                <circle cx={p.x} cy={p.y} r={5} fill="#8b5cf6" stroke="#1a1a2e" strokeWidth={2} />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className="fill-white text-[10px]"
                >
                  ${p.value.toFixed(0)}
                </text>
              </g>
            ))}
            {/* X Axis labels */}
            {points.map(p => (
              <text
                key={p.date + '-lbl'}
                x={p.x}
                y={height - paddingY + 14}
                textAnchor="middle"
                className="fill-[#a1a1aa] text-[10px]"
              >
                {p.label}
              </text>
            ))}
          </svg>
        </div>
        
      )}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#a1a1aa]">
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-[#8b5cf6]"></span>Spent</div>
          <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6]"></span>Daily Limit ({dailyLimit})</div>
        </div>
      </div>
      {/* Metric small cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-4 border border-[#27272a] flex flex-col justify-between">
          <p className="text-xs uppercase tracking-wide text-[#6e6e78] font-semibold mb-1">Total Savings</p>
          <p className="text-2xl font-bold text-white mb-1">${totalSaved.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          <p className="text-[10px] text-[#a1a1aa]">Across all goals</p>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-4 border border-[#27272a] flex flex-col justify-between">
          <p className="text-xs uppercase tracking-wide text-[#6e6e78] font-semibold mb-1">Total Spending</p>
          <p className="text-2xl font-bold text-white mb-1">${totalSpent.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          <p className="text-[10px] text-[#a1a1aa]">Sum of last 7 days</p>
        </div>
      </div>
      </div>

  {/* Spending Categories Pie (Sample Data) */}
  <div className="bg-[#1a1a2e] rounded-xl card-shadow-lg p-6 border border-[#27272a] w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Spending by Category (Sample)</h2>
        <div className="flex flex-wrap gap-8 items-center">
          <svg width={pieSize} height={pieSize} viewBox={`0 0 ${pieSize} ${pieSize}`}>      
            {categorySlices.map(s => (
              <path key={s.c.name} d={s.path} fill={s.color} stroke="#0f0f23" strokeWidth={2} />
            ))}
            {/* Donut hole */}
            <circle cx={r} cy={r} r={r * 0.45} fill="#1a1a2e" stroke="#27272a" strokeWidth={1} />
            <text x={r} y={r - 4} textAnchor="middle" className="fill-white text-sm font-semibold">Total</text>
            <text x={r} y={r + 14} textAnchor="middle" className="fill-[#a1a1aa] text-xs">${catTotal}</text>
          </svg>
          <div className="flex-1 space-y-2 min-w-[200px]">
            {categorySlices.map(s => (
              <div key={s.c.name} className="flex items-center justify-between text-xs bg-[#222237] px-3 py-2 rounded-lg border border-[#27272a]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ background: s.color }} />
                  <span className="text-white font-medium">{s.c.name}</span>
                </div>
                <div className="text-[#a1a1aa] font-mono">${s.c.amount} ({s.percent.toFixed(1)}%)</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] mt-3 text-[#6e6e78]">Sample data only. Replace with real categorized transactions later.</p>
      </div>
    </div>
  );
}
