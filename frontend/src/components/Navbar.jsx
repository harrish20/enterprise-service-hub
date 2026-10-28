import React, { useState } from 'react';
import { Search, Bell, Shield, Users, UserCheck, LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenNewRequest, onSearch, searchQuery }) {
  const { user, logout, switchRole } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
      case 'manager':
        return <Users className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'manager':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const currentRole = user?.role || 'Admin';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
      {/* Brand & Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="font-extrabold text-white text-base tracking-wider">T</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider text-white">TARQDEV SOLUTIONS</span>
            <span className="text-[10px] text-cyan-400 font-medium tracking-wide">ENTERPRISE SERVICEHUB</span>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search operational service requests by ID, title, domain..."
            className="w-full bg-[#161f30] border border-slate-700/60 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls & Role Profile */}
      <div className="flex items-center gap-3">
        {/* Quick New Request Button */}
        <button
          onClick={onOpenNewRequest}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-600/20 transition-all transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Request</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0f172a]"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#161f30] border border-slate-700/80 rounded-xl shadow-2xl p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/50 mb-2 font-semibold text-slate-300">
                <span>Active Telemetry Alerts</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">3 New</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
                  <p className="font-medium text-white">REQ-2026-1042 RDS Storage Alert</p>
                  <p className="text-[11px] text-slate-400">Database capacity reaching 88.4%</p>
                </div>
                <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
                  <p className="font-medium text-white">REQ-2026-1088 Ingress TLS Cert</p>
                  <p className="text-[11px] text-amber-400">Expires in 72 hours &bull; Action required</p>
                </div>
                <div className="p-2 rounded bg-slate-800/40 border border-slate-700/40">
                  <p className="font-medium text-white">REQ-2026-1240 Deployment Rollback</p>
                  <p className="text-[11px] text-emerald-400">Hotfix rollback verified and resolved</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Identity Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-800/60 transition group text-left"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${getRoleBadgeColor(currentRole)} shadow-sm`}>
              {currentRole.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-slate-200 group-hover:text-white leading-tight flex items-center gap-1.5">
                {currentRole}
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(currentRole)}`}>
                  Active
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {user?.title || `${currentRole} Account`}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#161f30] border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2.5 border-b border-slate-700/60 mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${getRoleBadgeColor(currentRole)}`}>
                    {currentRole.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{currentRole}</span>
                      {getRoleIcon(currentRole)}
                    </p>
                    <p className="text-[11px] text-slate-400">{user?.email || `${currentRole.toLowerCase()}@tarqdev.com`}</p>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-cyan-300 font-medium">
                  {user?.department || 'System Operations'}
                </div>
              </div>

              <div className="py-1">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Switch Active Role
                </div>
                {[
                  { role: 'Admin', desc: 'System Administrator', icon: Shield },
                  { role: 'Manager', desc: 'Service Desk Operations', icon: Users },
                  { role: 'Employee', desc: 'Support Specialist', icon: UserCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  const isCur = currentRole.toLowerCase() === item.role.toLowerCase();
                  return (
                    <button
                      key={item.role}
                      onClick={() => { switchRole(item.role); setProfileOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-slate-800/60 text-xs flex items-center justify-between ${
                        isCur ? 'text-cyan-400 font-bold bg-cyan-950/30' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <span className="block leading-none font-semibold">{item.role}</span>
                          <span className="text-[10px] text-slate-500">{item.desc}</span>
                        </div>
                      </div>
                      {isCur && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1 border-t border-slate-700/60 mt-1">
                <button
                  onClick={() => { logout(); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
