'use client';

import React from 'react';
import { 
  SecurityClaim, 
  ConflictItem, 
  EvidenceStatus 
} from '@/types/claimtrail';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  GitBranch, 
  AlertTriangle,
  Info,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface BottomPanelsProps {
  selectedClaim: SecurityClaim;
  claims: SecurityClaim[];
  onSelectClaim: (claim: SecurityClaim) => void;
  conflicts: ConflictItem[];
  onSelectConflict: (conflict: ConflictItem) => void;
  onOpenFullDetail: () => void;
}

export const BottomPanels: React.FC<BottomPanelsProps> = ({
  selectedClaim,
  claims,
  onSelectClaim,
  conflicts,
  onSelectConflict,
  onOpenFullDetail,
}) => {
  const getStatusPill = (status: EvidenceStatus) => {
    switch (status) {
      case 'green':
        return (
          <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-3xs font-mono font-medium">
            SUPPORTING
          </span>
        );
      case 'amber':
        return (
          <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-3xs font-mono font-medium">
            AMBIGUOUS
          </span>
        );
      case 'red':
        return (
          <span className="px-1.5 py-0.2 rounded bg-red-50 text-red-800 border border-red-200 text-3xs font-mono font-medium">
            UNSAFE
          </span>
        );
    }
  };

  return (
    <footer className="h-[260px] xl:h-[280px] border-t border-console-border bg-console-card select-none grid grid-cols-1 lg:grid-cols-[30%_43%_27%] shrink-0 divide-y lg:divide-y-0 lg:divide-x divide-console-border text-xs z-20 min-h-0 overflow-hidden">
      {/* Panel 1: Claim Inspector (30%) */}
      <div className="flex flex-col h-full bg-white overflow-hidden min-h-0 min-w-0">
        <div className="h-7 px-3 bg-console-subtle border-b border-console-border flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 font-mono text-2xs font-semibold uppercase text-console-muted">
            <Info className="w-3 h-3 text-console-accent" />
            <span>Claim Inspector</span>
            <span className="text-console-faint">•</span>
            <span className="text-console-accent font-bold">{selectedClaim.code}</span>
          </div>
          <button
            onClick={onOpenFullDetail}
            className="text-3xs font-mono text-console-accent hover:underline flex items-center space-x-1"
          >
            <span>FULL DOSSIER</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        <div className="p-3 overflow-y-auto space-y-2 flex-1 min-h-0 text-left">
          {/* Header metadata */}
          <div className="flex items-center justify-between">
            <span className="text-3xs font-mono uppercase tracking-wider text-console-faint font-semibold truncate max-w-[180px]">
              {selectedClaim.category}
            </span>
            {getStatusPill(selectedClaim.status)}
          </div>

          {/* Question text */}
          <div>
            <span className="text-3xs font-mono uppercase text-console-faint block mb-0.5">
              QUESTION IN SCOPE:
            </span>
            <p className="text-xs font-medium text-console-text line-clamp-2 leading-snug">
              {selectedClaim.question}
            </p>
          </div>

          {/* Primary Source Ref */}
          <div className="bg-console-subtle/80 p-2 rounded border border-console-border text-2xs font-mono space-y-0.5">
            <div className="flex items-center justify-between text-console-muted">
              <span className="text-3xs text-console-faint uppercase">PRIMARY SOURCE:</span>
              <span className="text-console-accent font-semibold">{selectedClaim.linePageRef}</span>
            </div>
            <div className="text-console-text truncate flex items-center space-x-1">
              <GitBranch className="w-3 h-3 text-purple-600 shrink-0" />
              <span className="truncate">{selectedClaim.primarySourcePath}</span>
            </div>
          </div>

          {/* Limitations Notice */}
          <div className="bg-amber-50/70 p-2 rounded border border-amber-200/80 text-3xs font-sans text-amber-900 leading-relaxed">
            <span className="font-mono font-bold uppercase text-amber-800 block mb-0.5">
              LIMITATIONS & AMBIGUITY:
            </span>
            <p className="line-clamp-2">{selectedClaim.limitations}</p>
          </div>
        </div>
      </div>

      {/* Panel 2: Question Queue (43%) */}
      <div className="flex flex-col h-full bg-white overflow-hidden min-h-0 min-w-0">
        <div className="h-7 px-3 bg-console-subtle border-b border-console-border flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 font-mono text-2xs font-semibold uppercase text-console-muted">
            <FileText className="w-3 h-3 text-console-muted" />
            <span>Question Queue</span>
            <span className="text-console-faint">({claims.length} ITEMS)</span>
          </div>
          <span className="text-3xs font-mono text-console-faint">SELECT TO INSPECT</span>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 bg-white z-10 border-b border-console-border shadow-2xs">
              <tr className="bg-console-subtle/40 text-3xs font-mono uppercase text-console-faint">
                <th className="py-1 px-2.5 font-semibold">CODE</th>
                <th className="py-1 px-2 font-semibold">QUESTION & CATEGORY</th>
                <th className="py-1 px-2 font-semibold">SIGNALS</th>
                <th className="py-1 px-2.5 font-semibold text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-console-border/70 text-xs font-sans">
              {claims.map((claim) => {
                const isSelected = selectedClaim.id === claim.id;
                return (
                  <tr
                    key={claim.id}
                    onClick={() => onSelectClaim(claim)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-orange-50/80 text-console-text font-medium border-l-2 border-console-accent'
                        : 'hover:bg-console-subtle/60 text-console-muted hover:text-console-text'
                    }`}
                  >
                    <td className="py-1.5 px-2.5 font-mono text-2xs font-bold text-console-text shrink-0">
                      {claim.code}
                    </td>
                    <td className="py-1.5 px-2 max-w-[280px]">
                      <div className="truncate text-xs font-normal text-console-text">
                        {claim.question}
                      </div>
                      <div className="text-3xs font-mono text-console-faint uppercase truncate">
                        {claim.category}
                      </div>
                    </td>
                    <td className="py-1.5 px-2 font-mono text-3xs whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-emerald-700 font-semibold">✓{claim.signalsCount.supporting}</span>
                        {claim.signalsCount.conflicting > 0 && (
                          <span className="text-red-700 font-semibold">!{claim.signalsCount.conflicting}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-1.5 px-2.5 text-right shrink-0">
                      {getStatusPill(claim.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel 3: Conflict Feed (27%) */}
      <div className="flex flex-col h-full bg-white overflow-hidden min-h-0 min-w-0">
        <div className="h-7 px-3 bg-console-subtle border-b border-console-border flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-1.5 font-mono text-2xs font-semibold uppercase text-console-muted">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span>Conflict Feed</span>
            <span className="text-red-600 font-bold">({conflicts.length})</span>
          </div>
          <span className="text-3xs font-mono text-console-faint">LIVE TRIAGE</span>
        </div>

        <div className="p-2 overflow-y-auto space-y-1.5 flex-1 min-h-0 text-left">
          {conflicts.map((conflict) => (
            <div
              key={conflict.id}
              onClick={() => onSelectConflict(conflict)}
              className="p-2 rounded border border-console-border hover:border-console-accent bg-console-subtle/30 hover:bg-white cursor-pointer transition-all space-y-1"
            >
              <div className="flex items-center justify-between text-3xs font-mono">
                <div className="flex items-center space-x-1 truncate">
                  <span className="font-bold text-console-accent">{conflict.claimCode}</span>
                  <span className="text-console-faint">•</span>
                  <span
                    className={`font-semibold uppercase ${
                      conflict.severity === 'high'
                        ? 'text-red-600'
                        : conflict.severity === 'medium'
                        ? 'text-amber-600'
                        : 'text-console-muted'
                    }`}
                  >
                    {conflict.severity} SEV
                  </span>
                </div>
                <span className="text-console-faint shrink-0">{conflict.detectedAt}</span>
              </div>

              <h4 className="text-xs font-semibold text-console-text line-clamp-1">
                {conflict.title}
              </h4>

              <div className="text-3xs font-mono text-console-muted flex items-center space-x-1 pt-0.5 truncate">
                <span className="truncate text-blue-700">{conflict.sourceA.label}</span>
                <ArrowRight className="w-2.5 h-2.5 shrink-0 text-console-faint" />
                <span className="truncate text-purple-700">{conflict.sourceB.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
