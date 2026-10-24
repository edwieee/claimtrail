'use client';

import React from 'react';
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning';
  onClose: () => void;
}

export function ToastNotification({ message, type = 'info', onClose }: ToastProps) {
  const Icon = type === 'success' ? CheckCircle2 : type === 'warning' ? AlertTriangle : Info;
  const borderCls =
    type === 'success'
      ? 'border-signal-green-border bg-signal-green-bg text-signal-green'
      : type === 'warning'
      ? 'border-signal-amber-border bg-signal-amber-bg text-signal-amber'
      : 'border-border bg-surface text-text-primary';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        className={`flex items-start gap-3 p-3.5 rounded border shadow-card text-xs ${borderCls}`}
      >
        <Icon className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex-1 font-medium leading-relaxed">{message}</div>
        <button
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
