'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, ShieldCheck, Key, Cpu, GitBranch, Save } from 'lucide-react';
import type { AppSettings } from '@/types/claimtrail';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onSettingsSaved?: (settings: AppSettings) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  onShowToast,
  onSettingsSaved,
}: SettingsModalProps) {
  const [githubToken, setGithubToken] = useState('');
  const [activeModel, setActiveModel] = useState<'claude-3-7-sonnet' | 'gpt-4o' | 'deterministic'>('claude-3-7-sonnet');
  const [strictMode, setStrictMode] = useState(true);
  const [autoDetect, setAutoDetect] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data: AppSettings) => {
          if (data) {
            setGithubToken(data.githubToken || '');
            setActiveModel(data.activeModel || 'claude-3-7-sonnet');
            setStrictMode(data.strictVerification ?? true);
            setAutoDetect(data.autoDetectConflicts ?? true);
          }
        })
        .catch((err) => console.error('Failed to load settings:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Partial<AppSettings> = {
        githubToken: githubToken.trim(),
        activeModel,
        strictVerification: strictMode,
        autoDetectConflicts: autoDetect,
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        onShowToast('Settings persisted to server store successfully.', 'success');
        onSettingsSaved?.(data.settings);
        onClose();
      } else {
        onShowToast(data.error || 'Failed to save settings', 'warning');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Error updating settings', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-2xl overflow-hidden text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-container-highest bg-surface-container-low/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">settings</span>
            <span className="font-semibold text-on-surface text-sm">Engine &amp; Assessment Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="py-8 text-center text-secondary">Loading settings...</div>
          ) : (
            <>
              {/* AI Model Configuration */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold block">
                  AI Compliance Engine
                </span>
                <div>
                  <label className="text-xs font-medium text-on-surface block mb-1">
                    Synthesis Model
                  </label>
                  <select
                    value={activeModel}
                    onChange={(e: any) => setActiveModel(e.target.value)}
                    className="w-full text-xs bg-surface-container-low border border-surface-container-highest rounded px-2.5 py-1.5 text-on-surface focus:outline-none focus:border-on-surface cursor-pointer"
                  >
                    <option value="claude-3-7-sonnet">Claude 3.7 Sonnet (Hybrid Verified)</option>
                    <option value="gpt-4o">OpenAI GPT-4o (Grounded Compliance)</option>
                    <option value="deterministic">Deterministic AST Grounded (No External LLM)</option>
                  </select>
                  <p className="text-[11px] text-secondary mt-1">
                    All drafted answers are grounded strictly in uploaded policy citations and repository file ASTs.
                  </p>
                </div>

                <p className="text-[11px] text-secondary">
                  AI drafting uses the server-only <code className="font-mono text-on-surface">OPENAI_API_KEY</code> environment variable. Configure it in the project&apos;s root <code className="font-mono text-on-surface">.env.local</code>; it is never entered or returned by the browser.
                </p>

                <div>
                  <label className="text-xs font-medium text-on-surface block mb-1 flex items-center justify-between">
                    <span>GitHub Personal Access Token (Optional)</span>
                    <span className="text-[10px] text-secondary font-mono">Rate Limit Elevation</span>
                  </label>
                  <input
                    type="password"
                    placeholder="ghp_..."
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full text-xs font-mono bg-surface-container-low border border-surface-container-highest rounded px-2.5 py-1.5 text-on-surface placeholder:text-secondary focus:outline-none focus:border-on-surface"
                  />
                </div>
              </div>

              {/* Evidence Engine Options */}
              <div className="pt-3 border-t border-surface-container-highest space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold block">
                  Verification Protocols
                </span>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={strictMode}
                    onChange={(e) => setStrictMode(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
                  />
                  <div>
                    <p className="text-xs font-medium text-on-surface">Strict Dual-Evidence Verification</p>
                    <p className="text-[11px] text-secondary">
                      Requires both policy citation (PDF) and repository implementation (AST) before certifying answers.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoDetect}
                    onChange={(e) => setAutoDetect(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
                  />
                  <div>
                    <p className="text-xs font-medium text-on-surface">Deterministic Conflict Detection</p>
                    <p className="text-[11px] text-secondary">
                      Automatically evaluate rules #ENG-RLS-09, #SEC-KMS-01, and #IAM-MFA-01 during evidence checks.
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-surface-container-highest bg-surface-container-low/50 flex items-center justify-between">
          <span className="text-[10px] font-mono text-secondary">PERSISTENT SERVER STORE</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs text-secondary border border-surface-container-highest rounded bg-surface-container-lowest hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3.5 py-1.5 text-xs font-medium text-on-primary bg-primary-container hover:bg-[#ea580c] rounded transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
