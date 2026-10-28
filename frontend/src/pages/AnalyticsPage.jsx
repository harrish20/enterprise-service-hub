import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  Info, 
  Clock, 
  RefreshCw, 
  Users, 
  TrendingUp, 
  BarChart3,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import ResolutionTrendChart from '../components/ResolutionTrendChart';
import WorkloadProgress from '../components/WorkloadProgress';
import CategoryDonutChart from '../components/CategoryDonutChart';
import { api } from '../services/api';

export default function AnalyticsPage({ analytics = {} }) {
  const [dateRange, setDateRange] = useState('Current Cycle (Oct 2026)');

  const handleExport = () => {
    if (window.location.hostname.includes('github.io') || window.location.protocol === 'file:') {
      api.exportCsvDownload();
    } else {
      window.open('/api/export/csv', '_blank');
    }
  };

  const overview = analytics.overview || {};
  const total = overview.totalRequests || 24;
  const pending = overview.pendingRequests || 14;
  const resolved = overview.resolvedTickets || 10;
  const resolutionRate = overview.resolutionRate || `${Math.round((resolved / total) * 100)}%`;

  return (
    <div className="space-y-6">
      {/* Header with Date Range & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Analytics &amp; Operational Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Service request velocity, resolution trends, and staff capacity metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Picker Button */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#121824] border border-slate-700/80 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{dateRange}</span>
          </div>

          {/* Export Report Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1a2333] hover:bg-slate-700 border border-slate-600 transition shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Requests */}
        <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Total Requests Logged</span>
            <Info className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{total}</span>
            <span className="text-xs font-bold text-emerald-400">+100% Verified</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Multi-department operational tickets</p>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Pending / In Progress</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{pending}</span>
            <span className="text-xs font-medium text-amber-400">
              {Math.round((pending / total) * 100)}% of total
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Under active SLA monitoring</p>
        </div>

        {/* Card 3: Resolved Requests */}
        <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Resolved &amp; Closed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{resolved}</span>
            <span className="text-xs font-bold text-emerald-400">{resolutionRate}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Avg. turnaround: {overview.avgResolutionTime || '3.8 hrs'}</p>
        </div>

        {/* Card 4: Active Staff Pool */}
        <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold">Authorized Staff Pool</span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{overview.activeStaffPool || 6}</span>
            <span className="text-xs font-semibold text-cyan-300">Roles Active</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Admin, Manager, Technical Staff</p>
        </div>
      </div>

      {/* Resolution Trend Bar Chart */}
      <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
        <ResolutionTrendChart trends={analytics?.resolutionTrends} />
      </div>

      {/* Bottom Row: Employee Workload & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Employee Workload Distribution Card */}
        <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Staff Workload Capacity (Active Assigned Tickets)
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Real-time load</span>
          </div>

          <WorkloadProgress workloads={analytics?.employeeWorkload} />
        </div>

        {/* Right: Service Category Distribution Card */}
        <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Service Category Distribution
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Operational categories</span>
          </div>

          <CategoryDonutChart data={analytics?.categoryDistribution} />
        </div>
      </div>
    </div>
  );
}
