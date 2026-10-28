import React, { useState, useEffect } from 'react';
import { X, UserCheck, Shield, Users, Database, ShieldAlert, Cpu } from 'lucide-react';
import { api } from '../services/api';

export default function AssignRequestModal({ isOpen, onClose, request, onAssigned }) {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.getStaff().then((res) => {
        if (res.success && res.data) {
          setStaffList(res.data);
          if (request?.assignedTo?._id) {
            setSelectedStaffId(request.assignedTo._id);
          } else if (res.data.length > 0) {
            setSelectedStaffId(res.data[0]._id);
          }
        }
      });
    }
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  const handleConfirm = async () => {
    if (!selectedStaffId) return;
    setSubmitting(true);
    const chosen = staffList.find((s) => s._id === selectedStaffId);

    try {
      const res = await api.assignRequest(request._id || request.ticketId, {
        assignedToId: chosen._id,
        staffName: chosen.name,
        staffTitle: chosen.title,
        department: chosen.department
      });

      if (res.success) {
        onAssigned(res.data, res.message);
        onClose();
      }
    } catch (err) {
      console.error('Assign error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleIcon = (name = '', role = '') => {
    const val = (name + ' ' + role).toLowerCase();
    if (val.includes('admin') || val.includes('director')) return <Shield className="w-4 h-4 text-cyan-400" />;
    if (val.includes('manager')) return <Users className="w-4 h-4 text-purple-400" />;
    if (val.includes('security')) return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    if (val.includes('database') || val.includes('dba')) return <Database className="w-4 h-4 text-amber-400" />;
    if (val.includes('devops') || val.includes('cloud')) return <Cpu className="w-4 h-4 text-blue-400" />;
    return <UserCheck className="w-4 h-4 text-emerald-400" />;
  };

  const getWorkloadBadge = (level, count) => {
    if (level === 'High' || count >= 6) {
      return (
        <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Active Tickets: {count} (High)
        </span>
      );
    }
    if (level === 'Medium' || count >= 3) {
      return (
        <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Active Tickets: {count} (Medium)
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Active Tickets: {count} (Low)
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#131926] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Assign Request</span>
              <span className="text-cyan-400 font-mono text-sm">{request.ticketId}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-md">
              Select authorized staff member for: <strong className="text-slate-200">{request.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Staff Members List */}
        <div className="p-6 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {staffList.map((staff) => {
            const isSelected = selectedStaffId === staff._id;
            return (
              <div
                key={staff._id}
                onClick={() => setSelectedStaffId(staff._id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500'
                    : 'bg-[#182030] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 shrink-0">
                    {getRoleIcon(staff.name, staff.role)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{staff.name}</span>
                      <span className="text-[10px] text-cyan-400 font-medium">
                        [{staff.role}]
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                      {staff.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {staff.department}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Workload Capacity
                  </span>
                  {getWorkloadBadge(staff.workloadLevel, staff.liveWorkload)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0e131d] border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="px-5 py-2 rounded-lg text-xs font-bold text-white glow-btn disabled:opacity-50"
          >
            {submitting ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}
