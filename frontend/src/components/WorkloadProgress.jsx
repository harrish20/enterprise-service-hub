import React from 'react';
import { Shield, Users, UserCheck, Cpu, ShieldAlert, Database } from 'lucide-react';

export default function WorkloadProgress({ workloads }) {
  const getRoleIcon = (name = '', role = '') => {
    const val = (name + ' ' + role).toLowerCase();
    if (val.includes('admin')) return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
    if (val.includes('manager')) return <Users className="w-3.5 h-3.5 text-purple-400" />;
    if (val.includes('security')) return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
    if (val.includes('database') || val.includes('dba')) return <Database className="w-3.5 h-3.5 text-amber-400" />;
    if (val.includes('devops')) return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
    return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
  };

  const defaultWorkloads = [
    {
      name: 'Manager',
      title: 'Service Operations Manager',
      totalTickets: 8,
      activeCount: 5,
      onHoldCount: 2,
      workloadPct: 75
    },
    {
      name: 'Employee',
      title: 'Senior Support Specialist',
      totalTickets: 9,
      activeCount: 6,
      onHoldCount: 1,
      workloadPct: 85
    },
    {
      name: 'DevOps Engineer',
      title: 'Cloud Infrastructure Lead',
      totalTickets: 7,
      activeCount: 4,
      onHoldCount: 1,
      workloadPct: 60
    },
    {
      name: 'Security Analyst',
      title: 'Information Security Analyst',
      totalTickets: 5,
      activeCount: 3,
      onHoldCount: 0,
      workloadPct: 45
    }
  ];

  const list = workloads && workloads.length > 0 ? workloads : defaultWorkloads;

  return (
    <div className="space-y-4">
      {list.slice(0, 4).map((staff, idx) => (
        <div key={idx} className="space-y-1.5 p-2 rounded-xl bg-[#162030]/50 border border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                {getRoleIcon(staff.name, staff.role)}
              </div>
              <div>
                <span className="font-bold text-slate-200 block leading-tight">{staff.name}</span>
                <span className="text-[10px] text-slate-400 block">{staff.title || staff.department}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-400">{staff.workloadPct}%</span>
              <span className="text-[10px] text-slate-400">
                Active <strong className="text-emerald-400">{staff.activeCount}</strong> &bull; On Hold {staff.onHoldCount || 0}
              </span>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              style={{ width: `${staff.workloadPct}%` }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-700 shadow-sm"
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
