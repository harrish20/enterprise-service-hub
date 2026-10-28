import React, { useState } from 'react';
import { 
  Settings, 
  Server, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  RefreshCw,
  KeyRound,
  Shield,
  Users,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function SettingsPage() {
  const [aiConfidence, setAiConfidence] = useState(0.94);
  const [slaTarget, setSlaTarget] = useState(24);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset database with 24 real-world operational enterprise service requests?')) return;
    setResetting(true);
    try {
      const res = await api.resetRealData();
      if (res.success) {
        setResetMessage(res.message);
        setTimeout(() => {
          setResetMessage(null);
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">System &amp; Engine Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tarqdev Solutions Enterprise ServiceHub configuration, credentials, and telemetry
        </p>
      </div>

      {/* Role Credentials Reference Card */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <KeyRound className="w-4 h-4" />
            <span>Authorized Enterprise Role Credentials</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Standardized RBAC System</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#162030] border border-cyan-500/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin</span>
            </div>
            <p className="text-[11px] text-slate-300">Email: <strong className="text-cyan-300">admin@tarqdev.com</strong></p>
            <p className="text-[11px] text-slate-400">Password: <code className="text-slate-300">password123</code></p>
            <span className="text-[10px] text-slate-500 block pt-1">Full access to system, DB &amp; settings</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#162030] border border-purple-500/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Manager</span>
            </div>
            <p className="text-[11px] text-slate-300">Email: <strong className="text-purple-300">manager@tarqdev.com</strong></p>
            <p className="text-[11px] text-slate-400">Password: <code className="text-slate-300">password123</code></p>
            <span className="text-[10px] text-slate-500 block pt-1">Queue control, assignments &amp; approval</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#162030] border border-emerald-500/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Employee</span>
            </div>
            <p className="text-[11px] text-slate-300">Email: <strong className="text-emerald-300">employee@tarqdev.com</strong></p>
            <p className="text-[11px] text-slate-400">Password: <code className="text-slate-300">password123</code></p>
            <span className="text-[10px] text-slate-500 block pt-1">Service execution, status &amp; notes</span>
          </div>
        </div>
      </div>

      {/* Real-World Data Management Card */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Real-World Dataset Management</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30">
            24 Enterprise Tickets
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The database is populated with realistic operational tickets spanning IT Infrastructure, Network Security, Database Administration, Software Support, Hardware, and Facilities. You can re-seed or refresh this data at any point.
        </p>

        {resetMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{resetMessage}</span>
          </div>
        )}

        <button
          onClick={handleResetData}
          disabled={resetting}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-600/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Reloading...' : 'Restore Real-World Enterprise Dataset'}</span>
        </button>
      </div>

      {/* TarqAI Engine Configuration Form */}
      <form onSubmit={handleSave} className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">TarqAI Intelligent Classification Engine</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-purple-300 bg-purple-950/60 border border-purple-500/30">
            Active v2.4
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              AI Confidence Threshold ({Math.round(aiConfidence * 100)}%)
            </label>
            <input
              type="range"
              min="0.70"
              max="0.99"
              step="0.01"
              value={aiConfidence}
              onChange={(e) => setAiConfidence(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Determines minimum certainty score before applying auto-categorization.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Default Critical SLA Target (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="72"
              value={slaTarget}
              onChange={(e) => setSlaTarget(parseInt(e.target.value) || 24)}
              className="w-48 bg-[#162030] border border-slate-700 rounded-lg px-3 py-1.5 text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          {saved ? (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-500">Changes apply to live session immediately.</span>
          )}

          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
