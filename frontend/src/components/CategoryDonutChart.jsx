import React from 'react';

export default function CategoryDonutChart({ data }) {
  const defaultData = [
    { name: 'IT Support', percentage: 42, color: '#38bdf8' },
    { name: 'Facility Mgmt', percentage: 28, color: '#06b6d4' },
    { name: 'HR Services', percentage: 18, color: '#3b82f6' },
    { name: 'Onboarding', percentage: 12, color: '#10b981' }
  ];

  const items = data && data.length > 0 ? data : defaultData;

  // Compute SVG circle segments
  let cumulative = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          {items.map((item, index) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulative / 100) * circumference);
            cumulative += item.percentage;

            return (
              <circle
                key={index}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={item.color || '#38bdf8'}
                strokeWidth="24"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 hover:opacity-80 cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-white">42%</span>
          <span className="text-[10px] text-slate-400 font-medium">IT Support</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full text-xs">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color || '#38bdf8' }}
            ></span>
            <span className="text-slate-300 truncate">{item.name}</span>
            <span className="text-slate-500 text-[11px] ml-auto font-medium">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

