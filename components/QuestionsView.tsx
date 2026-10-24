'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Layers,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Info,
} from 'lucide-react';
import type { SecurityClaim, ConflictItem, EvidenceStatus } from '@/types/claimtrail';

interface QuestionsViewProps {
  claims: SecurityClaim[];
  conflicts: ConflictItem[];
  onSelectClaimForEvidence: (claim: SecurityClaim) => void;
  onSelectClaimForFinding: (conflict: ConflictItem) => void;
  onOpenInspector: (claim: SecurityClaim) => void;
}

export function QuestionsView({
  claims,
  conflicts,
  onSelectClaimForEvidence,
  onSelectClaimForFinding,
  onOpenInspector,
}: QuestionsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EvidenceStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>('claim-1');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(claims.map((c) => c.category));
    return ['all', ...Array.from(set)];
  }, [claims]);

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      if (statusFilter !== 'all' && claim.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && claim.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          claim.code.toLowerCase().includes(q) ||
          claim.question.toLowerCase().includes(q) ||
          claim.category.toLowerCase().includes(q) ||
          claim.primarySourcePath.toLowerCase().includes(q) ||
          claim.vendorDraftAnswer.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [claims, statusFilter, categoryFilter, searchQuery]);

  // Status counts
  const counts = useMemo(() => {
    return {
      all: claims.length,
      green: claims.filter((c) => c.status === 'green').length,
      amber: claims.filter((c) => c.status === 'amber').length,
      red: claims.filter((c) => c.status === 'red').length,
    };
  }, [claims]);

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden bg-canvas">
      {/* Top Header & Filter Toolbar */}
      <div className="shrink-0 bg-surface border-b border-border px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary tracking-tight">Questionnaire Catalog</h1>
              <span className="text-2xs font-mono px-2 py-0.5 rounded bg-canvas border border-border text-text-secondary">
                SIG_Lite_2026_Vendor_Assessment.xlsx
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Review questionnaire items row-by-row with AI-drafted answers, source citations, and deterministic verification signals.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xs font-mono text-signal-amber font-medium px-2 py-1 bg-signal-amber-bg border border-signal-amber-border rounded">
              DEMO DATA · 5 QUESTIONS
            </span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, question, or path..."
              className="w-full text-xs bg-canvas border border-border rounded pl-8 pr-3 py-1.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Status Segmented Buttons */}
          <div className="flex items-center rounded border border-border bg-canvas p-0.5 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium ${
                statusFilter === 'all'
                  ? 'bg-surface text-text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter('green')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1 ${
                statusFilter === 'green'
                  ? 'bg-surface text-signal-green shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-green" />
              Supported ({counts.green})
            </button>
            <button
              onClick={() => setStatusFilter('amber')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1 ${
                statusFilter === 'amber'
                  ? 'bg-surface text-signal-amber shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-amber" />
              Review ({counts.amber})
            </button>
            <button
              onClick={() => setStatusFilter('red')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1 ${
                statusFilter === 'red'
                  ? 'bg-surface text-signal-red shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-red" />
              Unsafe ({counts.red})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-canvas border border-border rounded px-2.5 py-1.5 text-text-primary focus:outline-none focus:border-accent cursor-pointer pr-7"
            >
              <option value="all">All Categories</option>
              {categories
                .filter((c) => c !== 'all')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-[1440px] mx-auto space-y-3">
          {filteredClaims.length === 0 ? (
            <div className="bg-surface border border-border rounded p-8 text-center">
              <Info className="w-6 h-6 text-text-tertiary mx-auto mb-2" />
              <p className="text-sm font-medium text-text-primary">No matching questions found</p>
              <p className="text-xs text-text-secondary mt-1">
                Try adjusting your search keywords or clear active filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="mt-3 px-3 py-1.5 text-xs text-accent border border-accent rounded bg-accent-bg font-medium hover:bg-orange-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded overflow-hidden shadow-xs divide-y divide-border">
              {filteredClaims.map((claim) => {
                const isExpanded = expandedClaimId === claim.id;
                const relatedConflict = conflicts.find((c) => c.claimCode === claim.code);

                const statusBadge = {
                  green: {
                    cls: 'bg-signal-green-bg text-signal-green border-signal-green-border',
                    label: 'SUPPORTING',
                    icon: CheckCircle2,
                  },
                  amber: {
                    cls: 'bg-signal-amber-bg text-signal-amber border-signal-amber-border',
                    label: 'NEEDS REVIEW',
                    icon: AlertCircle,
                  },
                  red: {
                    cls: 'bg-signal-red-bg text-signal-red border-signal-red-border',
                    label: 'UNSAFE',
                    icon: XCircle,
                  },
                }[claim.status];
                const StatusIcon = statusBadge.icon;

                // Extract row from claim node
                const claimNode = claim.nodes.find((n) => n.type === 'claim');
                const rowLabel = claimNode?.lineOrPageRef?.split(',')[0] || 'Row --';

                return (
                  <div key={claim.id} className="transition-colors hover:bg-canvas/50">
                    {/* Primary Row Header */}
                    <div
                      className="p-4 flex items-start gap-4 cursor-pointer select-none"
                      onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
                    >
                      {/* Expand Toggle */}
                      <button
                        type="button"
                        className="mt-0.5 text-text-tertiary hover:text-text-primary p-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedClaimId(isExpanded ? null : claim.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-text-primary" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      {/* Code & Row */}
                      <div className="shrink-0 w-28">
                        <span className="text-xs font-mono font-semibold text-accent block">
                          {claim.code}
                        </span>
                        <span className="text-2xs font-mono text-text-tertiary block mt-0.5">
                          {rowLabel}
                        </span>
                      </div>

                      {/* Question & Category */}
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-xs font-medium text-text-primary leading-relaxed">
                          {claim.question}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-2xs font-medium text-text-tertiary bg-canvas px-2 py-0.5 rounded border border-border">
                            {claim.category}
                          </span>
                          <span className="text-2xs text-text-tertiary font-mono">
                            Source: {claim.primarySourcePath}
                          </span>
                        </div>
                      </div>

                      {/* Signals Count */}
                      <div className="shrink-0 hidden md:flex items-center gap-3 text-2xs font-mono text-text-tertiary">
                        <span className="flex items-center gap-1 text-signal-green">
                          <CheckCircle2 className="w-3 h-3" />
                          {claim.signalsCount.supporting}
                        </span>
                        {claim.signalsCount.conflicting > 0 && (
                          <span className="flex items-center gap-1 text-signal-red">
                            <AlertTriangle className="w-3 h-3" />
                            {claim.signalsCount.conflicting}
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0">
                        <span className={`pill flex items-center gap-1 ${statusBadge.cls}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="px-6 pb-5 pt-2 border-t border-border/60 bg-canvas/40 pl-14">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          {/* Left: Draft Answer & Limitations */}
                          <div className="lg:col-span-2 space-y-3">
                            <div className="bg-surface border border-border rounded p-3.5">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-2xs font-mono uppercase tracking-wider text-text-tertiary font-semibold">
                                  Grounded Draft Answer
                                </span>
                                <span className="text-2xs font-mono text-text-tertiary">
                                  Verified {claim.verifiedTimestamp}
                                </span>
                              </div>
                              <p className="text-xs text-text-primary leading-relaxed bg-canvas/60 p-2.5 rounded border border-border font-sans">
                                {claim.vendorDraftAnswer}
                              </p>
                            </div>

                            {/* Verification Finding / Divergence Note */}
                            <div className="bg-surface border border-border rounded p-3.5 space-y-2">
                              <span className="text-2xs font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                                Evidence Verification Note
                              </span>
                              <p className="text-xs text-text-secondary leading-relaxed">
                                {claim.statusDetail}
                              </p>
                              {claim.limitations && (
                                <div className="mt-2 pt-2 border-t border-border flex items-start gap-2 text-2xs text-text-tertiary">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-signal-amber mt-0.5" />
                                  <span>
                                    <strong className="text-text-secondary">Limitations:</strong> {claim.limitations}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Sources & Cross-Links */}
                          <div className="space-y-3">
                            <div className="bg-surface border border-border rounded p-3.5 space-y-2.5">
                              <span className="text-2xs font-mono uppercase tracking-wider text-text-tertiary font-semibold block">
                                Provenance Trace
                              </span>

                              <div className="space-y-1.5 text-xs">
                                {claim.nodes.map((node) => (
                                  <div
                                    key={node.id}
                                    className="flex items-start gap-2 p-1.5 rounded border border-border/80 bg-canvas/40"
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                        node.status === 'green'
                                          ? 'bg-signal-green'
                                          : node.status === 'amber'
                                          ? 'bg-signal-amber'
                                          : 'bg-signal-red'
                                      }`}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-2xs font-semibold text-text-primary truncate">
                                        {node.title}
                                      </p>
                                      <p className="text-2xs font-mono text-text-tertiary truncate">
                                        {node.pathOrReference}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-2 border-t border-border space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => onSelectClaimForEvidence(claim)}
                                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent border border-accent rounded bg-accent-bg hover:bg-orange-100 transition-colors"
                                >
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>Inspect in Evidence Graph</span>
                                  <ArrowRight className="w-3 h-3 ml-auto" />
                                </button>

                                {relatedConflict && (
                                  <button
                                    type="button"
                                    onClick={() => onSelectClaimForFinding(relatedConflict)}
                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-signal-red border border-signal-red-border rounded bg-signal-red-bg hover:bg-red-100 transition-colors"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Investigate Finding</span>
                                    <ArrowRight className="w-3 h-3 ml-auto" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => onOpenInspector(claim)}
                                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary border border-border rounded bg-canvas hover:text-text-primary hover:border-border-strong transition-colors"
                                >
                                  <span>Open Evidence Dossier</span>
                                  <ExternalLink className="w-3 h-3 ml-auto" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
