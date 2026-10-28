import React from 'react';

export default function ResolutionTrendChart({ trends }) {
  const data = trends && trends.length > 0 ? trends : [
    { month: "May '26", created: 28, resolved: 18 },
    { month: "Jun '26", created: 34, resolved: 22 },
    { month: "Jul '26", created: 31, resolved: 25 },
    { month: "Aug '26", created: 29, resolved: 21 },
    { month: "Sep '26", created: 20, resolved: 16 }
  ];

  const maxVal = 40;

  return (
    <div className="w-full">
      {/* Header & Legend */}
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-sm font-semibold text-slate-200">
          Resolution Trend: Created vs Resolved Tickets (May - Sep 2026)
        </h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#1e40af]"></span>
            <span className="text-slate-400">Created</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#7dd3fc]"></span>
            <span className="text-slate-400">Resolved</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2 border-b border-slate-800">
        {data.map((item, idx) => {
          const createdHeight = (item.created / maxVal) * 100;
          const resolvedHeight = (item.resolved / maxVal) * 100;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full flex items-end justify-center gap-1.5 h-36">
                {/* Created Bar */}
                <div className="relative flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {item.created}
                  </span>
                  <div
                    style={{ height: `${createdHeight}%` }}
                    className="w-5 sm:w-7 bg-[#1e3a8a] hover:bg-[#2563eb] rounded-t-sm transition-all duration-500 shadow-md"
                  ></div>
                </div>

                {/* Resolved Bar */}
                <div className="relative flex flex-col items-center">
                  <span className="text-[10px] font-semibold text-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {item.resolved}
                  </span>
                  <div
                    style={{ height: `${resolvedHeight}%` }}
                    className="w-5 sm:w-7 bg-[#7dd3fc] hover:bg-[#38bdf8] rounded-t-sm transition-all duration-500 shadow-md"
                  ></div>
                </div>
              </div>

              {/* Month label */}
              <span className="text-xs text-slate-400 font-medium">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

