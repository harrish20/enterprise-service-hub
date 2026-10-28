import React, { useState } from 'react';
import { X, Sparkles, Upload, Loader2, Check } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CreateRequestModal({ isOpen, onClose, onRequestCreated }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('VPN Access Timeout on Remote Gate');
  const [category, setCategory] = useState('IT Infrastructure');
  const [department, setDepartment] = useState('Information Technology');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState(
    'The VPN gateway on the West Coast is timing out for multiple users during login. Attempts fail after 30 seconds. Affecting remote productivity. See logs attached.'
  );

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  if (!isOpen) return null;

  const handleAiAutoClassify = async () => {
    setIsAiLoading(true);
    try {
      const res = await api.aiClassify({ title, description });
      if (res.success) {
        setCategory(res.suggestedCategory);
        setPriority(res.suggestedPriority);
        setAiResult({
          category: res.suggestedCategory,
          priority: res.suggestedPriority,
          summary: res.summary
        });
      }
    } catch (err) {
      console.error('AI classify error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createRequest({
        title,
        description,
        category,
        department,
        priority,
        aiSummary: aiResult?.summary || '',
        requesterName: user?.role || user?.name || 'Admin',
        requesterRole: user?.role || 'Admin'
      });

      if (res.success) {
        onRequestCreated(res.data, res.message);
        onClose();
      }
    } catch (err) {
      console.error('Create request error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#131926] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with Step indicator */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white tracking-tight">Create Service Request</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-cyan-400">Step 1: Details</span>
            <div className="w-36 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Request Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1a2333] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="Brief summary of the issue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#1a2333] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="IT Infrastructure">IT Infrastructure</option>
                <option value="Network Security">Network Security</option>
                <option value="Database Admin">Database Admin</option>
                <option value="Software Support">Software Support</option>
                <option value="Hardware Failure">Hardware Failure</option>
                <option value="HR Services">HR Services</option>
                <option value="Facilities">Facilities</option>
                <option value="Finance & Billing">Finance & Billing</option>
              </select>
            </div>
          </div>

          {/* Row 2: Department & Requestor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#1a2333] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Network Security">Network Security</option>
                <option value="Database Admin">Database Admin</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Billing">Finance & Billing</option>
                <option value="Facilities & Operations">Facilities & Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Requestor</label>
              <input
                type="text"
                disabled
                value={`${user?.name || 'Sarah Johnson'} - ${user?.role || 'Admin'}`}
                className="w-full bg-[#1a2333]/50 border border-slate-800 text-slate-400 rounded-lg px-3 py-2 text-xs cursor-not-allowed"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Detailed Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1a2333] border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
              placeholder="Describe symptoms, system environment, and observed impact..."
            />
          </div>

          {/* File upload + AI Button Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setFileUploaded(!fileUploaded)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                fileUploaded
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#1a2333] border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{fileUploaded ? 'Files Attached (gateway_log.txt)' : 'Upload Files (Optional)'}</span>
            </button>

            {/* AI Auto-Classify Button */}
            <button
              type="button"
              onClick={handleAiAutoClassify}
              disabled={isAiLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white glow-purple-btn disabled:opacity-50"
            >
              {isAiLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>AI Auto-Classify & Suggest</span>
            </button>
          </div>

          {/* AI Banner Box if generated (from Screenshot 3) */}
          {aiResult && (
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] text-xs text-purple-200 animate-fade-in space-y-1">
              <div className="flex items-center gap-2 font-semibold text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>
                  AI Auto-Detect: Category: <strong>{aiResult.category}</strong> | Priority: <strong className="text-amber-300">{aiResult.priority}</strong>
                </span>
              </div>
              <p className="text-[11px] text-purple-300/80 leading-relaxed">
                Summary: {aiResult.summary}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white glow-btn disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

