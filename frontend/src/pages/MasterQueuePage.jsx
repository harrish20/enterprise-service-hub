import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  Shield,
  Users,
  UserCheck,
  Cpu,
  Database,
  ShieldAlert
} from 'lucide-react';

export default function MasterQueuePage({
  requests = [],
  pagination = {},
  search = '',
  status = 'All',
  priority = 'All',
  category = 'All',
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onClearFilters,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPage = 10,
  onSelectRequest,
  onOpenAssign,
  onOpenNewRequest,
  onRefresh
}) {
  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'IT Infrastructure':
        return 'bg-blue-950/60 text-blue-300 border border-blue-500/30';
      case 'Network Security':
        return 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30';
      case 'Database Admin':
        return 'bg-purple-950/60 text-purple-300 border border-purple-500/30';
      case 'Hardware Failure':
        return 'bg-amber-950/60 text-amber-300 border border-amber-500/30';
      case 'HR Services':
        return 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30';
      case 'Facilities':
        return 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'Critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-red-300 bg-red-950/60 border border-red-500/40 flex items-center gap-1.5 w-fit">
            <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-orange-300 bg-orange-950/60 border border-orange-500/40 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-300 bg-slate-800 border border-slate-700 flex items-center gap-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case 'in progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 flex items-center gap-1">
            In Progress <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          </span>
        );
      case 'open':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-blue-300 bg-blue-950/60 border border-blue-500/40">
            Open
          </span>
        );
      case 'resolved':
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40">
            Resolved
          </span>
        );
      case 'on hold':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-300 bg-slate-800 border border-slate-700">
            On Hold
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-400 bg-slate-900 border border-slate-800">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-300 bg-slate-800 border border-slate-700">
            {st}
          </span>
        );
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

  const hasActiveFilters = search || status !== 'All' || priority !== 'All' || category !== 'All';

  return (
    <div className="space-y-5">
      {/* Page Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Service Request Master Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational triage, lifecycle monitoring, and departmental assignments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-[#162030] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenNewRequest}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white glow-btn flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Request</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#121824] border border-slate-800/80 rounded-2xl p-4 shadow-lg flex flex-wrap items-center gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets, titles, logs, IDs..."
            className="w-full bg-[#162030] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-36">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-[#162030] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="w-36">
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full bg-[#162030] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="w-40">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-[#162030] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Categories</option>
            <option value="IT Infrastructure">IT Infrastructure</option>
            <option value="Network Security">Network Security</option>
            <option value="Database Admin">Database Admin</option>
            <option value="Software Support">Software Support</option>
            <option value="Hardware Failure">Hardware Failure</option>
            <option value="HR Services">HR Services</option>
            <option value="Facilities">Facilities</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Requests Table */}
      <div className="bg-[#121824] border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#151d2d] text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Ticket Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {requests.map((r) => (
                <tr
                  key={r._id || r.ticketId}
                  className="hover:bg-slate-800/40 transition duration-150 group"
                >
                  {/* Ticket ID */}
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                    {r.ticketId}
                  </td>

                  {/* Title */}
                  <td className="py-3 px-4 font-semibold text-slate-200 group-hover:text-white transition max-w-sm truncate">
                    {r.title}
                  </td>

                  {/* Category badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getCategoryBadgeClass(r.category)}`}>
                      {r.category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getPriorityBadge(r.priority)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getStatusBadge(r.status)}
                  </td>

                  {/* Assigned Staff (Role-denoted chip) */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {r.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                          {getStaffRoleIcon(r.assignedTo.name)}
                        </div>
                        <span className="font-semibold text-slate-300">{r.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Unassigned Queue</span>
                    )}
                  </td>

                  {/* Actions: View Details & Assign */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectRequest(r)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 bg-[#162030] hover:text-white hover:bg-slate-700/80 border border-slate-700 transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onOpenAssign(r)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/40 transition"
                      >
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No service requests match the specified filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-white">{requests.length}</strong> of{' '}
              <strong className="text-white">{pagination.total || requests.length}</strong> requests
            </span>

            <div className="flex items-center gap-1.5 ml-4">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
                className="bg-[#162030] border border-slate-700 rounded px-2 py-1 text-xs text-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-slate-700 bg-[#162030] disabled:opacity-30 hover:text-white hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page || 1} of {pagination.pages || 1}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-1.5 rounded-lg border border-slate-700 bg-[#162030] disabled:opacity-30 hover:text-white hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
