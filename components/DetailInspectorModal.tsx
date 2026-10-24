'use client';

import React from 'react';
import { SecurityClaim, EvidenceNode } from '@/types/claimtrail';
import { X, GitBranch, Copy, Check } from 'lucide-react';

interface DetailInspectorModalProps {
  claim: SecurityClaim;
  node: EvidenceNode | null;
  onClose: () => void;
}

export const DetailInspectorModal: React.FC<DetailInspectorModalProps> = ({
  claim,
  node,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const title = node ? node.title : `${claim.code}: Security Claim Dossier`;
  const sourceLabel = node ? node.sourceLabel : 'SECURITY QUESTIONNAIRE';
  const pathRef = node ? node.pathOrReference : claim.primarySourcePath;
  const linePageRef = node ? node.lineOrPageRef : claim.linePageRef;
  const status = node ? node.status : claim.status;

  const statusCfg = {
    green: { label: 'SUPPORTING', cls: 'text-signal-green bg-signal-green-bg border-signal-green-border' },
    amber: { label: 'AMBIGUOUS', cls: 'text-signal-amber bg-signal-amber-bg border-signal-amber-border' },
    red: { label: 'UNSAFE', cls: 'text-signal-red bg-signal-red-bg border-signal-red-border' },
  }[status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface border border-border rounded shadow-card flex flex-col max-h-[84vh] overflow-hidden text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0 bg-canvas">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider shrink-0">
              Evidence Inspector
            </span>
            <span className="text-text-tertiary">·</span>
            <span className="text-xs font-mono font-semibold text-accent truncate">{claim.code}</span>
            <span className={`pill ml-1 ${statusCfg.cls}`}>{statusCfg.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xs font-mono text-signal-amber font-semibold">DEMO AUDIT TRAIL</span>
            <button
              onClick={onClose}
              className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-border transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Source + title */}
          <div className="pb-4 border-b border-border">
            <p className="text-xs font-mono text-text-tertiary uppercase mb-1">{sourceLabel}</p>
            <h2 className="text-base font-semibold text-text-primary leading-snug">{title}</h2>
            <p className="text-xs text-text-tertiary mt-1 font-mono">
              Last synced: {claim.verifiedTimestamp}
            </p>
          </div>

          {/* Question */}
          <div className="space-y-1.5">
            <p className="text-2xs font-semibold uppercase tracking-wider text-text-tertiary font-mono">
              1. Question in Scope
            </p>
            <div className="p-3 rounded border border-border bg-canvas text-sm text-text-primary leading-relaxed">
              {claim.question}
            </div>
          </div>

          {/* Source path */}
          <div className="space-y-1.5">
            <p className="text-2xs font-semibold uppercase tracking-wider text-text-tertiary font-mono">
              2. Provenance Source & Coordinates
            </p>
            <div className="p-3 rounded border border-border bg-surface space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs text-text-tertiary uppercase font-mono">Source path</span>
                <button
                  onClick={() => handleCopy(pathRef)}
                  className="flex items-center gap-1 text-2xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-signal-green" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-canvas rounded border border-border px-3 py-2 font-mono text-xs text-text-primary break-all">
                {pathRef}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-tertiary font-mono text-2xs uppercase">Line / page ref</span>
                <span className="text-accent font-semibold font-mono">{linePageRef}</span>
              </div>
            </div>
          </div>

          {/* Raw citation */}
          {node?.snippet && (
            <div className="space-y-1.5">
              <p className="text-2xs font-semibold uppercase tracking-wider text-text-tertiary font-mono">
                3. Raw Evidence Citation
              </p>
              <pre className="p-3 rounded border border-border bg-[#1a1a1a] text-[#e5e5e5] font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {node.snippet}
              </pre>
            </div>
          )}

          {/* Draft answer */}
          <div className="space-y-1.5">
            <p className="text-2xs font-semibold uppercase tracking-wider text-text-tertiary font-mono">
              {node?.snippet ? '4' : '3'}. Draft Questionnaire Answer
            </p>
            <div className="p-3 rounded border border-border bg-canvas text-sm text-text-primary leading-relaxed">
              {claim.vendorDraftAnswer}
            </div>
          </div>

          {/* Limitations */}
          <div className="space-y-1.5">
            <p className="text-2xs font-semibold uppercase tracking-wider text-signal-amber font-mono">
              {node?.snippet ? '5' : '4'}. Scope Limitations & Divergence
            </p>
            <div className="p-3 rounded border border-signal-amber-border bg-signal-amber-bg text-sm text-text-primary leading-relaxed">
              {claim.limitations}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-canvas border-t border-border shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
            <span>STATUS:</span>
            <span className={`font-semibold ${statusCfg.cls.split(' ')[0]}`}>
              {statusCfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-text-primary hover:bg-black text-white text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
