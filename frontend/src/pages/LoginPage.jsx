import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Users, UserCheck, ArrowUpRight, Server, Database, Layers, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onLoginSuccess }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@tarqdev.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('ADMIN'); // 'ADMIN' | 'MANAGER' | 'EMPLOYEE'

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'ADMIN') setEmail('admin@tarqdev.com');
    if (role === 'MANAGER') setEmail('manager@tarqdev.com');
    if (role === 'EMPLOYEE') setEmail('employee@tarqdev.com');
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, selectedRole);
    if (res.success) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0e17] flex flex-col justify-between relative overflow-hidden text-slate-100 select-none">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-800/60 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="font-extrabold text-white text-lg">T</span>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider text-white">TARQDEV SOLUTIONS</h1>
            <span className="text-[10px] text-cyan-400 font-medium tracking-wide">ENTERPRISE CLOUD SUITE</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Production API Online
          </span>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Info Glass Card */}
          <div className="glass-card rounded-2xl p-8 space-y-6 relative border border-slate-700/60 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="font-black text-white text-xl">T</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                Tarqdev Solutions <br />
                Enterprise Service Request <br />
                Backend Management System
              </h2>
              <div className="space-y-1.5 pt-2 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Real-time Multi-Departmental Service Lifecycle
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  MERN Stack Architecture with Role-Based Access Control
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Intelligent NLP Triage &amp; Capacity Analytics
                </p>
              </div>
            </div>

            {/* Quick Credentials Info Box */}
            <div className="p-4 rounded-xl bg-[#111927] border border-cyan-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <KeyRound className="w-4 h-4" />
                <span>Authorized Login Credentials</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('ADMIN')}
                  className={`p-2 rounded-lg text-left transition border ${
                    selectedRole === 'ADMIN'
                      ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-300'
                      : 'bg-[#151f30] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold block text-white flex items-center gap-1">
                    <Shield className="w-3 h-3 text-cyan-400" /> Admin
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">admin@tarqdev.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('MANAGER')}
                  className={`p-2 rounded-lg text-left transition border ${
                    selectedRole === 'MANAGER'
                      ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-300'
                      : 'bg-[#151f30] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold block text-white flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-400" /> Manager
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">manager@tarqdev.com</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('EMPLOYEE')}
                  className={`p-2 rounded-lg text-left transition border ${
                    selectedRole === 'EMPLOYEE'
                      ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-300'
                      : 'bg-[#151f30] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold block text-white flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-400" /> Employee
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">employee@tarqdev.com</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 pt-1">
                Password: <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono">password123</code> (Select any role above to auto-populate)
              </p>
            </div>

            {/* Tech Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 border-t border-slate-800">
              <div className="p-2.5 rounded-xl bg-[#131c2d] border border-cyan-500/20 text-center">
                <Layers className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-slate-300 block">React 18 &amp; Vite</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#131c2d] border border-emerald-500/20 text-center">
                <Server className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-slate-300 block">Node &amp; Express</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#131c2d] border border-purple-500/20 text-center">
                <Database className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <span className="text-[10px] font-semibold text-slate-300 block">RESTful DB Layer</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="glass-panel rounded-2xl p-8 border border-slate-700/80 shadow-2xl relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Enterprise Sign In</h3>
              <p className="text-xs text-slate-400 mt-1">
                Authenticate with your system role credentials to access the service desk.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector Pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Select Active Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ADMIN', label: 'Admin', icon: Shield },
                    { id: 'MANAGER', label: 'Manager', icon: Users },
                    { id: 'EMPLOYEE', label: 'Employee', icon: UserCheck }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedRole === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleRoleSelect(item.id)}
                        className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : 'bg-[#151f33] text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter role email address"
                    className="w-full bg-[#151f33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#151f33] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-white glow-btn flex items-center justify-center gap-2 mt-2 active:scale-[0.99] transition-transform"
              >
                <span>{loading ? 'AUTHENTICATING...' : `SIGN IN AS ${selectedRole}`}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <div className="p-2.5 rounded-lg bg-[#0e1422] border border-slate-800 text-[11px] text-slate-400 text-center">
                Denoted Roles: <strong className="text-slate-200">Admin</strong> &bull; <strong className="text-slate-200">Manager</strong> &bull; <strong className="text-slate-200">Employee</strong>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 z-10">
        &copy; 2026 Tarqdev Solutions &bull; Enterprise Service Request Backend Management System &bull; Mohan B Training Module
      </footer>
    </div>
  );
}
