import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md animate-fade-in shadow-2xl transition-all duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium ${
        isSuccess 
          ? 'bg-[#064e3b]/90 border-emerald-500/50 text-emerald-200 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.3)]'
          : isError
          ? 'bg-[#7f1d1d]/90 border-red-500/50 text-red-200 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.3)]'
          : 'bg-[#1e293b]/90 border-blue-500/50 text-blue-200 backdrop-blur-md'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        
        <span className="flex-1">{toast.message}</span>
        
        {toast.onDismissText ? (
          <button 
            onClick={onClose} 
            className="text-xs uppercase font-semibold text-emerald-300 hover:text-white px-2 py-0.5 rounded bg-emerald-900/40 hover:bg-emerald-900/80 transition"
          >
            {toast.onDismissText}
          </button>
        ) : (
          <button onClick={onClose} className="text-slate-400 hover:text-white p-0.5 rounded transition">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

