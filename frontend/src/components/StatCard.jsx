import React from 'react';
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function StatCard({ title, value, badge, badgeType = 'info', sparkline = true, icon: Icon }) {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'orange':
        return 'text-orange-400 bg-orange-950/40 border border-orange-500/30';
      case 'green':
        return 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30';
      case 'teal':
        return 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30';
      default:
        return 'text-blue-400 bg-blue-950/40 border border-blue-500/30';
    }
  };

  return (
    <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group shadow-lg">
      {/* Subtle background glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide">{title}</span>
        {badge && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${getBadgeStyle()}`}>
            {badgeType === 'orange' && <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>}
            {badgeType === 'green' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            {badgeType === 'teal' && <Clock className="w-3 h-3 text-cyan-400" />}
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        </div>

        {sparkline && (
          <div className="h-8 w-20 flex items-end">
            <svg viewBox="0 0 80 32" className="w-full h-full stroke-cyan-400 fill-none stroke-[2.2]">
              <path
                d="M 2 24 Q 16 10, 30 18 T 56 6 T 78 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 2 24 Q 16 10, 30 18 T 56 6 T 78 4 L 78 32 L 2 32 Z"
                fill="url(#sparkline-gradient)"
                opacity="0.15"
              />
              <defs>
                <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0b0f17" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

