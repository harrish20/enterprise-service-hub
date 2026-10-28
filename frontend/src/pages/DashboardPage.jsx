import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight,
  Shield,
  UserCheck,
  Cpu,
  Database,
  ShieldAlert
} from 'lucide-react';
import StatCard from '../components/StatCard';
import CategoryDonutChart from '../components/CategoryDonutChart';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage({ 
  requests = [], 
  analytics = {}, 
  onOpenNewRequest, 
  onSelectRequest,
  onNavigateRequests
}) {
  const { user } = useAuth();
  const [tableSearch, setTableSearch] = useState('');

  const currentRole = user?.role || 'Admin';

  const filteredRecent = requests
    .filter(r => {
      if (!tableSearch) return true;
      const term = tableSearch.toLowerCase();
      return (
        r.ticketId?.toLowerCase().includes(term) ||
        r.title?.toLowerCase().includes(term) ||
        r.category?.toLowerCase().includes(term)
      );
    })
    .slice(0, 7);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'OPEN':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'IN PROGRESS':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
      case 'COMPLETED':
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  const getStaffRoleIcon = (name = '') => {
    const val = name.toLowerCase();
    if (val.includes('admin')) return <Shield className="w-3 h-3 text-cyan-400" />;
    if (val.includes('manager')) return <Users className="w-3 h-3 text-purple-400" />;
    if (val.includes('security')) return <ShieldAlert className="w-3 h-3 text-rose-400" />;
    if (val.includes('database') || val.includes('dba')) return <Database className="w-3 h-3 text-amber-400" />;
    if (val.includes('devops')) return <Cpu className="w-3 h-3 text-blue-400" />;
    return <UserCheck className="w-3 h-3 text-emerald-400" />;
  };

  const overview = analytics?.overview || {};
  const totalCount = overview.totalRequests || requests.length || 24;
  const pendingCount = overview.pendingRequests || requests.filter(r => ['Open', 'In Progress', 'On Hold'].includes(r.status)).length || 14;
  const resolvedCount = overview.resolvedTickets || requests.filter(r => ['Resolved', 'Closed'].includes(r.status)).length || 10;
  const resolutionRate = overview.resolutionRate || `${Math.round((resolvedCount / totalCount) * 100)}%`;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#121c2e] via-[#101726] to-[#121c2e] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-cyan-500/25">
            {currentRole.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Welcome, {currentRole}
              </h2>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase">
                {currentRole} Session Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enterprise Service Request Operations Center &bull; Live Telemetry &amp; Master Queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateRequests}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#162030] hover:text-white hover:bg-slate-800 border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>Master Queue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenNewRequest}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white glow-btn flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={totalCount}
          delta="+12% this cycle"
          deltaType="positive"
          icon={Layers}
          sparklineColor="cyan"
        />

        <StatCard
          title="Pending / In Progress"
          value={pendingCount}
          delta="Under active SLA"
          deltaType="neutral"
          icon={Clock}
          sparklineColor="purple"
        />

        <StatCard
          title="Resolved Tickets"
          value={resolvedCount}
          delta={`${resolutionRate} resolution rate`}
          deltaType="positive"
          icon={CheckCircle2}
          sparklineColor="cyan"
        />

        <StatCard
          title="Avg. SLA Resolution"
          value={overview.avgResolutionTime || "3.8 hrs"}
          delta="Within 4h threshold"
          deltaType="positive"
          icon={TrendingUp}
          sparklineColor="purple"
        />
      </div>

      {/* Main Grid: Category Donut + Live Recent Requests Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Distribution Donut Chart */}
        <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Requests by Service Category</h3>
              <p className="text-[11px] text-slate-400">Live operational volume breakdown</p>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
              Active
            </span>
          </div>

          <CategoryDonutChart data={analytics?.categoryDistribution} />
        </div>

        {/* Right: Recent Requests Operational Stream */}
        <div className="lg:col-span-2 bg-[#121824] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Service Requests Stream</h3>
              <p className="text-[11px] text-slate-400">Real-time status changes and active tickets</p>
            </div>

            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter stream..."
                className="w-full bg-[#162030] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px] font-bold uppercase">
                  <th className="pb-2.5 px-3">Ticket ID</th>
                  <th className="pb-2.5 px-3">Summary</th>
                  <th className="pb-2.5 px-3">Category</th>
                  <th className="pb-2.5 px-3">Status</th>
                  <th className="pb-2.5 px-3">Priority</th>
                  <th className="pb-2.5 px-3">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecent.map((r) => (
                  <tr
                    key={r._id || r.ticketId}
                    onClick={() => onSelectRequest(r)}
                    className="hover:bg-slate-800/50 cursor-pointer transition group"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-cyan-400 whitespace-nowrap">
                      {r.ticketId}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200 group-hover:text-white max-w-xs truncate">
                      {r.title}
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {r.category}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(r.status)}`}>
                        {r.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-semibold whitespace-nowrap">
                      {r.priority}
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {r.assignedTo ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            {getStaffRoleIcon(r.assignedTo.name)}
                          </div>
                          <span>{r.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Table Navigation */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span>Showing top {filteredRecent.length} tickets</span>
            <button 
              onClick={onNavigateRequests}
              className="px-2.5 py-1 rounded bg-[#162030] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              Open Full Master Queue &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
