import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  Settings, 
  Layers, 
  Activity, 
  Cpu
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Service Requests', icon: Inbox },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0a0e17] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-6">
        {/* Navigation List */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-cyan-400 border-l-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Operational Section */}
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            ServiceHQ
          </p>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Operations Center</span>
            </button>
            <button
              onClick={() => setCurrentTab('analytics')}
              className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition"
            >
              <Activity className="w-4 h-4 text-slate-500" />
              <span>Performance SLA</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status card */}
      <div className="p-4 border-t border-slate-800/70">
        <div className="p-3 rounded-xl bg-[#111827] border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-300">Platform Online</span>
          </div>
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>TarqAI Core &bull; Node.js + Express</span>
          </p>
        </div>
      </div>
    </aside>
  );
}

