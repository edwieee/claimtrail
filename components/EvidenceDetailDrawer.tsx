'use client';

import React from 'react';
import { X, FileText, GitBranch, ShieldCheck, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';
import type { EvidenceLibraryItem } from '@/types/claimtrail';

interface EvidenceDetailDrawerProps {
  item: EvidenceLibraryItem | null;
  onClose: () => void;
  onNavigateToQuestion?: (claimCode: string) => void;
}

export function EvidenceDetailDrawer({ item, onClose, onNavigateToQuestion }: EvidenceDetailDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.excerpt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const Icon =
    item.sourceType === 'policy'
      ? FileText
      : item.sourceType === 'repository'
      ? GitBranch
      : ShieldCheck;

  const statusCfg = {
    green: { label: 'SUPPORTING', cls: 'text-signal-green bg-signal-green-bg border-signal-green-border' },
    amber: { label: 'NEEDS REVIEW', cls: 'text-signal-amber bg-signal-amber-bg border-signal-amber-border' },
    red: { label: 'NON-COMPLIANT', cls: 'text-signal-red bg-signal-red-bg border-signal-red-border' },
  }[item.status];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-[1px]">
      <div
        className="w-full max-w-lg bg-surface border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-canvas/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
              Evidence Detail Drawer
            </span>
            <span className="text-text-tertiary">·</span>
            <span className="text-2xs font-mono font-semibold text-accent">{item.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xs font-mono text-signal-amber bg-signal-amber-bg border border-signal-amber-border px-1.5 py-0.5 rounded font-medium">
              DEMO DATA
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-border/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Top Title & Status */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`pill text-2xs ${statusCfg.cls}`}>{statusCfg.label}</span>
              <span className="text-2xs font-mono text-text-tertiary">
                Confidence: {item.confidence}%
              </span>
            </div>
            <h3 className="text-sm font-semibold text-text-primary">{item.sourceName}</h3>
            <p className="text-2xs font-mono text-text-secondary mt-1">{item.pathOrRef}</p>
          </div>

          {/* Exact Location & Security Domain */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-canvas/60 rounded border border-border">
            <div>
              <span className="text-3xs font-mono uppercase tracking-wider text-text-tertiary block">
                Source Location
              </span>
              <span className="font-mono text-xs font-semibold text-text-primary mt-0.5 block">
                {item.location}
              </span>
            </div>
            <div>
              <span className="text-3xs font-mono uppercase tracking-wider text-text-tertiary block">
                Security Domain
              </span>
              <span className="text-xs font-medium text-text-secondary mt-0.5 block">
                {item.domain}
              </span>
            </div>
          </div>

          {/* Source Excerpt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                Verifiable Excerpt Snippet
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-3xs font-mono text-text-secondary hover:text-text-primary transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-signal-green" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Excerpt'}</span>
              </button>
            </div>
            <div className="bg-canvas border border-border rounded p-3 font-mono text-xs text-text-primary whitespace-pre-wrap leading-relaxed">
              {item.excerpt}
            </div>
          </div>

          {/* Why Relevant */}
          <div className="p-3.5 bg-accent-bg/40 border border-accent-border/60 rounded space-y-1">
            <span className="text-3xs font-mono uppercase tracking-wider text-accent font-semibold block">
              Provenance Relevance
            </span>
            <p className="text-xs text-text-primary leading-relaxed">{item.relevance}</p>
          </div>

          {/* Related Question Link */}
          <div className="p-3.5 bg-surface border border-border rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" />
              <div>
                <span className="text-3xs font-mono text-text-tertiary uppercase block">
                  Supports Questionnaire Claim
                </span>
                <span className="text-xs font-mono font-semibold text-text-primary">
                  {item.relatedClaimCode}
                </span>
              </div>
            </div>

            {onNavigateToQuestion && (
              <button
                onClick={() => {
                  onNavigateToQuestion(item.relatedClaimCode);
                  onClose();
                }}
                className="px-2.5 py-1 text-2xs font-medium text-accent border border-accent rounded bg-accent-bg hover:bg-orange-100 transition-colors flex items-center gap-1"
              >
                <span>View Question</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-3 border-t border-border bg-canvas/60 shrink-0 flex items-center justify-between text-2xs font-mono text-text-tertiary">
          <span>SOURCE ID: {item.id}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-surface border border-border rounded text-text-primary font-medium hover:bg-canvas transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
