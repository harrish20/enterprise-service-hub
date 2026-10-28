import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  History, 
  Send, 
  Check, 
  Shield, 
  Users, 
  UserCheck, 
  Cpu, 
  Database, 
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RequestDetailsModal({ isOpen, onClose, request, onStatusUpdated, onCommentAdded }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'activity'
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!isOpen || !request) return null;

  const statuses = ['Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'];

  const getRoleIcon = (name = '', role = '') => {
    const val = (name + ' ' + role).toLowerCase();
    if (val.includes('admin')) return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
    if (val.includes('manager')) return <Users className="w-3.5 h-3.5 text-purple-400" />;
    if (val.includes('security')) return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
    if (val.includes('database') || val.includes('dba')) return <Database className="w-3.5 h-3.5 text-amber-400" />;
    if (val.includes('devops')) return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
    return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === request.status || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await api.updateStatus(request._id || request.ticketId, {
        status: newStatus,
        note: `Status transitioned to ${newStatus} by ${user?.role || 'Staff'}`
      });
      if (res.success) {
        onStatusUpdated(res.data, res.message);
      }
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await api.addComment(request._id || request.ticketId, {
        text: commentText.trim(),
        isInternal,
        author: {
          name: user?.role || 'Staff',
          role: user?.role || 'Employee'
        }
      });

      if (res.success) {
        onCommentAdded(res.data);
        setCommentText('');
        setIsInternal(false);
      }
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border border-red-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border border-slate-600';
    }
  };

  const currentStatusIndex = statuses.indexOf(request.status) !== -1 ? statuses.indexOf(request.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#131926] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30">
              {request.ticketId}
            </span>
            <span className="text-xs font-semibold text-slate-400 border-l border-slate-700 pl-3">
              {request.category}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getPriorityBadge(request.priority)}`}>
              {request.priority}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Title & Department */}
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug">
              {request.title}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span>Department: <strong className="text-slate-300">{request.department || 'IT Operations'}</strong></span>
              <span>&bull;</span>
              <span>Requested by: <strong className="text-slate-300">{request.requestedBy?.name || 'Staff User'}</strong></span>
              <span>&bull;</span>
              <span>SLA Target: <strong className="text-amber-400">{request.sla || '24 Hours'}</strong></span>
            </div>
          </div>

          {/* Workflow Stepper */}
          <div className="p-4 rounded-xl bg-[#162030] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Service Request Lifecycle</span>
              <span className="text-[11px] text-cyan-400">Click stage to transition status</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {statuses.map((st, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = request.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={updatingStatus}
                    className={`p-2 rounded-lg text-xs font-semibold text-center transition flex flex-col items-center gap-1 border ${
                      isCurrent
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : isPassed
                        ? 'bg-[#1b263b] text-emerald-400 border-emerald-500/40'
                        : 'bg-[#111722] text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
                      {isCurrent ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                    </span>
                    <span className="text-[11px] tracking-tight">{st}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI-Generated Summary Box */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.12)] space-y-1.5">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>TarqAI Executive Triage Summary</span>
            </div>
            <p className="text-xs text-purple-200/90 leading-relaxed font-mono">
              {request.aiSummary || `Automated analysis for ${request.title}. System category: ${request.category}. Impact: High. SLA compliance monitoring active.`}
            </p>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Technical Details &amp; Operational Logs
            </h4>
            <div className="p-4 rounded-xl bg-[#161f30] border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
              {request.description}
            </div>
          </div>

          {/* Assigned Staff & Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assigned Staff Card */}
            <div className="p-3.5 rounded-xl bg-[#162030] border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                {getRoleIcon(request.assignedTo?.name, request.assignedTo?.role)}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assigned Engineer</span>
                <p className="text-xs font-bold text-white">
                  {request.assignedTo?.name || 'Unassigned Queue'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {request.assignedTo?.title || request.department || 'Service Desk'}
                </p>
              </div>
            </div>

            {/* SLA & Time Card */}
            <div className="p-3.5 rounded-xl bg-[#162030] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Created Timestamp</span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">
                  {request.createdAt ? new Date(request.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">SLA Target</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30">
                  {request.sla || '24 Hours'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs: Comments & Audit Trail */}
          <div className="pt-2">
            <div className="flex items-center gap-6 border-b border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('comments')}
                className={`pb-2.5 flex items-center gap-1.5 transition ${
                  activeTab === 'comments'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Comments &amp; Internal Notes ({request.comments?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`pb-2.5 flex items-center gap-1.5 transition ${
                  activeTab === 'activity'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Immutable Audit History ({request.history?.length || 0})</span>
              </button>
            </div>

            {/* Tab 1: Comments */}
            {activeTab === 'comments' && (
              <div className="pt-4 space-y-4">
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {(request.comments || []).map((comm, idx) => (
                    <div
                      key={comm.id || idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        comm.isInternal
                          ? 'bg-[#1e1c2a] border-amber-500/40'
                          : 'bg-[#162030] border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                            {comm.author?.name ? comm.author.name.slice(0, 2).toUpperCase() : 'ST'}
                          </div>
                          <span className="font-bold text-white">{comm.author?.name || 'Staff'}</span>
                          {comm.isInternal && (
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.2 rounded-full">
                              Internal Staff Note
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {comm.createdAt ? new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed pl-7">{comm.text}</p>
                    </div>
                  ))}

                  {(!request.comments || request.comments.length === 0) && (
                    <p className="text-xs text-slate-500 py-3 text-center">No comments logged yet. Post an update below.</p>
                  )}
                </div>

                {/* Add Comment Input Form */}
                <form onSubmit={handlePostComment} className="space-y-2 pt-2 border-t border-slate-800">
                  <textarea
                    rows={2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter resolution notes, update details, or internal staff message..."
                    className="w-full bg-[#182133] border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isInternal}
                        onChange={(e) => setIsInternal(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-900"
                      />
                      <span className="text-amber-400 font-semibold">Mark as Internal Staff Note</span>
                    </label>

                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-white glow-btn flex items-center gap-1.5 disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Audit History */}
            {activeTab === 'activity' && (
              <div className="pt-4 space-y-3 max-h-60 overflow-y-auto">
                {(request.history || []).map((h, idx) => (
                  <div key={h.id || idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                    <div className="flex-1 p-2.5 rounded-lg bg-[#162030] border border-slate-800">
                      <div className="flex items-center justify-between font-semibold text-white mb-0.5">
                        <span className="text-cyan-400 font-mono text-[11px]">{h.action}</span>
                        <span className="text-[10px] text-slate-500">{h.timestamp}</span>
                      </div>
                      <p className="text-slate-300">{h.details}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">Logged by: {h.user || 'System'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#0e131d] border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Current Status: <strong className="text-cyan-400">{request.status}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#1a2333] hover:bg-slate-700 transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
