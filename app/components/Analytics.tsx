'use client';

import React from 'react';

export interface WeeklyPoint {
  date: string; // YYYY-MM-DD
  spent: number;
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  website: string;
  date: Date;
  type: 'expense' | 'income'; // Add type to distinguish expenses from income
}

interface AnalyticsProps {
  transactions?: Transaction[]; // Make optional with default
  dailyLimit: number;
  totalSaved: number;
}

// Helper to format date label (e.g., Mon, Tue)
function shortWeekday(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

// Helper to get date string from Date object
function getDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function Analytics({ transactions = [], dailyLimit, totalSaved }: AnalyticsProps) {
  // Filter only expenses for analytics - handle undefined transactions
  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Calculate weekly spending data from real transactions
  const today = new Date();
  const weeklySpending: WeeklyPoint[] = Array.from({ length: 7 }).map((_, idx) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - idx)); // oldest to newest
    const dateStr = getDateString(date);
    
    // Sum all expenses for this date
    const dayExpenses = expenses.filter(t => getDateString(t.date) === dateStr);
    const spent = dayExpenses.reduce((sum, t) => sum + t.amount, 0);
    
    return { date: dateStr, spent };
  });

  // Calculate total spent (last 7 days)
  const totalSpent = weeklySpending.reduce((sum, day) => sum + day.spent, 0);

  // Calculate spending by category from real data
  const categoryTotals = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const realCategories = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount
  }));

  // Generate heatmap data from real transactions (last 5 weeks)
  const generateHeatmapData = () => {
    const heatmapData = [];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 34); // 5 weeks back
    
    for (let week = 0; week < 5; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * 7) + day);
        const dateStr = getDateString(currentDate);
        
        // Calculate spending intensity for this day
        const dayExpenses = expenses.filter(t => getDateString(t.date) === dateStr);
        const dayTotal = dayExpenses.reduce((sum, t) => sum + t.amount, 0);
        const intensity = Math.min(dayTotal / (dailyLimit || 100), 1); // Normalize to daily limit
        
        weekData.push({
          date: dateStr,
          intensity,
          amount: dayTotal
        });
      }
      heatmapData.push(weekData);
    }
    return heatmapData;
  };

  const heatmapData = generateHeatmapData();
  // Prepare chart dimensions
  const width = 460;
  const height = 220;
  const paddingX = 32;
  const paddingY = 24;
  
  // Use the calculated weeklySpending data
  const data = weeklySpending;
  const maxSpent = Math.max(dailyLimit, ...data.map(d => d.spent), 10);

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.spent / maxSpent) * (height - paddingY * 2);
    return { x, y, label: shortWeekday(d.date), value: d.spent, date: d.date };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  // Use real category data instead of sample data - distinct colors for better visibility
  const categoryPalette = [
    '#3b82f6', // Blue
    '#ef4444', // Red  
    '#10b981', // Green
    '#f59e0b', // Orange
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange-red
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#eab308'  // Yellow
  ];
  const catTotal = realCategories.reduce((s,c) => s + c.amount, 0) || 1;
  const pieSize = 240;
  const r = pieSize / 2 - 8;
  let acc = 0;
  const categorySlices = realCategories.map((c, idx) => {
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
    <div className="flex flex-col gap-8 h-full w-full">
      {/* Top row: Weekly chart (left) + Heatmap (right) */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left: Weekly Spending Chart */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)] w-full flex-1">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Weekly Spending</h2>
            {points.length < 2 ? (
              <p className="text-[var(--text-secondary)] text-sm">Not enough data yet. Add some expenses across days to see the line graph.</p>
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
                        stroke="var(--border-color)"
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
                    stroke="var(--accent-primary)"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  {/* Line path */}
                  <path d={linePath} fill="none" stroke="var(--accent-secondary)" strokeWidth={2} />
                  {/* Area under line */}
                  <path
                    d={`${linePath} L${points[points.length - 1].x},${height - paddingY} L${points[0].x},${height - paddingY} Z`}
                    fill="url(#gradient)"
                    opacity={0.25}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {/* Points */}
                  {points.map(p => (
                    <g key={p.date}>
                      <circle cx={p.x} cy={p.y} r={5} fill="var(--accent-secondary)" stroke="var(--card-bg)" strokeWidth={2} />
                      <text
                        x={p.x}
                        y={p.y - 10}
                        textAnchor="middle"
                        className="fill-[var(--foreground)] text-[10px]"
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
                      className="fill-[var(--text-secondary)] text-[10px]"
                    >
                      {p.label}
                    </text>
                  ))}
                </svg>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-[var(--accent-secondary)]"></span>Spent</div>
              <div className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-[var(--accent-primary)]"></span>Daily Limit ({dailyLimit})</div>
            </div>
          </div>
        </div>

        {/* Right: Spending Heatmap */}
        <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)] flex-1 min-w-0 max-w-md">
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Spending Heatmap</h2>
          <div className="space-y-3 overflow-hidden">
            {/* Real heatmap data from transactions */}
            {heatmapData.map((week, weekIdx) => (
              <div key={weekIdx} className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)] w-6 text-right flex-shrink-0">
                  W{weekIdx + 1}
                </span>
                <div className="flex gap-3 flex-1 justify-between max-w-xs">
                  {week.map((day, dayIdx) => {
                    const opacity = Math.max(0.1, day.intensity);
                    return (
                      <div
                        key={dayIdx}
                        className="w-8 h-8 rounded-sm border border-[var(--border-color)] cursor-pointer hover:ring-2 hover:ring-[var(--accent-primary)] transition-all flex-shrink-0"
                        style={{
                          backgroundColor: day.intensity > 0.7 
                            ? `rgba(239, 68, 68, ${opacity})` 
                            : day.intensity > 0.4 
                              ? `rgba(251, 146, 60, ${opacity})` 
                            : day.intensity > 0 
                              ? `rgba(34, 197, 94, ${opacity})`
                              : 'transparent'
                        }}
                        title={`${day.date}: $${day.amount.toFixed(2)}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-secondary)]">
              <span>Less</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-3 h-3 rounded-sm border border-[var(--border-color)]"
                    style={{
                      backgroundColor: `rgba(34, 197, 94, ${0.2 + (idx * 0.2)})`
                    }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Spending Categories Pie Chart (full width) */}
      <div className="bg-[var(--card-bg)] rounded-xl card-shadow-lg p-6 border border-[var(--border-color)]">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">Spending by Category</h2>
        {realCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">No expense data yet. Add some transactions to see category breakdown.</p>
          </div>
        ) : (
          <div className="flex flex-row gap-8 items-center justify-center">
            <svg width={pieSize} height={pieSize} viewBox={`0 0 ${pieSize} ${pieSize}`} className="flex-shrink-0">      
              {categorySlices.map(s => (
                <path key={s.c.name} d={s.path} fill={s.color} stroke="var(--background)" strokeWidth={2} />
              ))}
              {/* Donut hole */}
              <circle cx={r} cy={r} r={r * 0.45} fill="var(--card-bg)" stroke="var(--border-color)" strokeWidth={1} />
              <text x={r} y={r - 4} textAnchor="middle" className="fill-[var(--foreground)] text-sm font-semibold">Total</text>
              <text x={r} y={r + 14} textAnchor="middle" className="fill-[var(--text-secondary)] text-xs">${catTotal.toFixed(0)}</text>
            </svg>
            <div className="flex-1 space-y-2 min-w-[250px] max-w-md">
              {categorySlices.map(s => (
                <div key={s.c.name} className="flex items-center justify-between text-xs bg-[var(--sidebar-bg)] px-3 py-2 rounded-lg border border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ background: s.color }} />
                    <span className="text-[var(--foreground)] font-medium">{s.c.name}</span>
                  </div>
                  <div className="text-[var(--text-secondary)] font-mono">${s.c.amount.toFixed(2)} ({s.percent.toFixed(1)}%)</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
