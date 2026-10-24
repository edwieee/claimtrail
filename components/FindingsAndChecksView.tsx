'use client';

import React, { useState, useMemo } from 'react';
import type { ConflictItem, SecurityClaim } from '@/types/claimtrail';

interface FindingsAndChecksViewProps {
  conflicts: ConflictItem[];
  claims: SecurityClaim[];
  onSelectClaimForReview?: (claimCode: string) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onResolveFinding?: (findingId: string, status: 'open' | 'reviewed' | 'resolved') => Promise<void>;
  onRunEvidenceCheck?: () => void;
}

interface DisplayFinding {
  id: string;
  code: string;
  title: string;
  type: 'conflict' | 'missing' | 'check';
  typeLabel: string;
  severity: 'high' | 'medium' | 'low';
  severityLabel: string;
  relatedQuestionCode: string;
  relatedControl: string;
  questionText: string;
  sourceSummary: string;
  flagReason: string;
  policyCitation: {
    docName: string;
    section: string;
    quote: string;
    status: string;
  };
  codeEvidence: {
    file: string;
    line: number;
    lines: { num: number; text: string; isHighlighted?: boolean }[];
  };
  relationshipAnalysis: string;
  status: 'open' | 'reviewed' | 'resolved';
}

export function FindingsAndChecksView({
  conflicts = [],
  claims = [],
  onSelectClaimForReview,
  onShowToast,
  onResolveFinding,
  onRunEvidenceCheck,
}: FindingsAndChecksViewProps) {
  // Transform conflicts and unverified claims into unified display findings
  const findingsList: DisplayFinding[] = useMemo(() => {
    const list: DisplayFinding[] = [];

    // From explicit conflicts
    conflicts.forEach((c, idx) => {
      const relatedClaim = claims.find((cl) => cl.code === c.claimCode);
      list.push({
        id: c.id,
        code: `F-${201 + idx}`,
        title: c.title,
        type: c.severity === 'high' ? 'conflict' : 'missing',
        typeLabel: c.severity === 'high' ? 'Policy Conflict' : 'Missing Evidence',
        severity: c.severity,
        severityLabel: c.severity === 'high' ? 'High Priority' : 'Needs Review',
        relatedQuestionCode: c.claimCode,
        relatedControl: relatedClaim?.category || 'Access Control',
        questionText: relatedClaim?.question || 'How is customer data isolated and protected?',
        sourceSummary: `${c.sourceA.label} vs ${c.sourceB.label}`,
        flagReason: `Discrepancy detected between policy mandate (${c.sourceA.statement}) and code implementation (${c.sourceB.statement}).`,
        policyCitation: {
          docName: c.sourceA.label,
          section: c.sourceA.ref,
          quote: c.sourceA.statement,
          status: 'Mandated by Compliance Framework',
        },
        codeEvidence: {
          file: c.sourceB.ref,
          line: 44,
          lines: [
            { num: 42, text: '// Inspected repository source' },
            { num: 43, text: `// Target: ${c.sourceB.label}` },
            { num: 44, text: c.sourceB.statement, isHighlighted: true },
          ],
        },
        relationshipAnalysis: `Discrepancy identified between policy specification and actual runtime code behavior. Requires manual engineering confirmation.`,
        status: (c.status as any) || 'open',
      });
    });

    // Also include claims flagged with status 'red'
    claims
      .filter((cl) => cl.status === 'red' && !conflicts.some((c) => c.claimCode === cl.code))
      .forEach((cl, idx) => {
        list.push({
          id: `f-claim-${cl.id}`,
          code: `F-${250 + idx}`,
          title: `Unverified Claim: ${cl.code} (${cl.category})`,
          type: 'conflict',
          typeLabel: 'Discrepancy',
          severity: 'high',
          severityLabel: 'High Priority',
          relatedQuestionCode: cl.code,
          relatedControl: cl.category,
          questionText: cl.question,
          sourceSummary: cl.primarySourcePath,
          flagReason: cl.statusDetail || 'Claimed control has not been verified in inspected repository AST.',
          policyCitation: {
            docName: cl.policyCitation?.docName || 'InfoSec Policy v4.2',
            section: cl.policyCitation?.section || 'Security Controls',
            quote: cl.policyCitation?.quote || 'Policy mandates formal verification.',
            status: 'Under Review',
          },
          codeEvidence: {
            file: cl.primarySourcePath,
            line: 1,
            lines: cl.codeCitation?.lines || [
              { num: 1, text: '// Inspected scope' },
              { num: 2, text: '// Discrepancy flagged by deterministic check', isHighlighted: true },
            ],
          },
          relationshipAnalysis: cl.limitations || 'Implementation requires developer review.',
          status: 'open',
        });
      });

    return list;
  }, [conflicts, claims]);

  const [selectedFindingId, setSelectedFindingId] = useState<string>(findingsList[0]?.id || 'f-201');
  const [typeFilter, setTypeFilter] = useState<'all' | 'conflict' | 'missing' | 'check'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedFinding = useMemo(
    () => findingsList.find((f) => f.id === selectedFindingId) || findingsList[0] || {
      id: 'default',
      code: 'F-201',
      title: 'Tenant Isolation Parameter Scope vs Policy Rule',
      type: 'conflict',
      typeLabel: 'Policy Conflict',
      severity: 'high',
      severityLabel: 'High Priority',
      relatedQuestionCode: 'SEC-104',
      relatedControl: 'SOC2 CC6.1',
      questionText: 'How is customer data separated and isolated across multi-tenant storage layers?',
      sourceSummary: '2 sources',
      flagReason: 'Discrepancy between policy and implementation.',
      policyCitation: {
        docName: 'Acme_InfoSec_Policy_v4.2.pdf',
        section: 'Section 3.2',
        quote: 'All multi-tenant data stores must enforce logical segregation.',
        status: 'Approved',
      },
      codeEvidence: {
        file: 'tenant_middleware.go:44',
        line: 44,
        lines: [{ num: 44, text: 'db.Exec("SET LOCAL app.current_tenant_id = ?", tID)', isHighlighted: true }],
      },
      relationshipAnalysis: 'Policy mandates session level, code injects per HTTP request.',
      status: 'open',
    },
    [findingsList, selectedFindingId]
  );

  const filteredFindings = useMemo(() => {
    return findingsList.filter((f) => {
      if (typeFilter !== 'all' && f.type !== typeFilter) return false;
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.code.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.relatedQuestionCode.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [findingsList, typeFilter, statusFilter, searchQuery]);

  const handleMarkResolved = async (id: string) => {
    try {
      if (onResolveFinding) {
        await onResolveFinding(id, 'resolved');
      }
      onShowToast(`Finding ${selectedFinding.code} marked as Resolved`, 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to resolve finding', 'warning');
    }
  };

  const handleMarkReviewed = async (id: string) => {
    try {
      if (onResolveFinding) {
        await onResolveFinding(id, 'reviewed');
      }
      onShowToast(`Finding ${selectedFinding.code} marked as Reviewed`, 'info');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to review finding', 'warning');
    }
  };

  const openCount = findingsList.filter((f) => f.status === 'open').length;
  const conflictCount = findingsList.filter((f) => f.type === 'conflict').length;
  const missingCount = findingsList.filter((f) => f.type === 'missing').length;
  const reviewedCount = findingsList.filter((f) => f.status === 'reviewed' || f.status === 'resolved').length;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5 bg-background custom-scrollbar">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
              Findings
            </h1>
            <span className="bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] px-2 py-0.5 rounded text-code-sm font-code-sm uppercase tracking-wide">
              {openCount} Open Exceptions
            </span>
          </div>
          <p className="text-body-md font-body-md text-secondary mt-0.5">
            Review evidence gaps, security-check results, and policy conflicts across imported security questionnaire responses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRunEvidenceCheck && (
            <button
              onClick={onRunEvidenceCheck}
              className="h-8 px-3 rounded bg-primary-container text-on-primary font-label-md text-label-md flex items-center gap-1.5 hover:bg-[#ea580c] transition-colors shadow-sm border border-[#9a3412]"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Re-run Evidence Check</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Tiles Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tile 1: Open Findings */}
        <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-surface-container-highest shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-label-sm font-label-sm uppercase tracking-wider text-secondary font-semibold">
              Open Findings
            </span>
            <span className="material-symbols-outlined text-[16px] text-primary">warning</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-headline-xl font-headline-xl text-on-surface font-bold">{openCount}</span>
            <span className="text-label-sm font-label-sm text-[#b91c1c] flex items-center">
              Active review required
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary-container h-full w-3/5" />
          </div>
        </div>

        {/* Tile 2: Policy-Implementation Conflicts */}
        <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-surface-container-highest shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-label-sm font-label-sm uppercase tracking-wider text-secondary font-semibold">
              Policy–Implementation Conflicts
            </span>
            <span className="material-symbols-outlined text-[16px] text-amber-600">rule</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-headline-xl font-headline-xl text-on-surface font-bold">{conflictCount}</span>
            <span className="text-label-sm font-label-sm text-amber-700">Discrepancy detected</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-600 h-full w-1/4" />
          </div>
        </div>

        {/* Tile 3: Missing Evidence */}
        <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-surface-container-highest shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-label-sm font-label-sm uppercase tracking-wider text-secondary font-semibold">
              Missing Evidence
            </span>
            <span className="material-symbols-outlined text-[16px] text-secondary">search_off</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-headline-xl font-headline-xl text-on-surface font-bold">{missingCount}</span>
            <span className="text-label-sm font-label-sm text-secondary">
              Repository reference absent
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-secondary h-full w-1/4" />
          </div>
        </div>

        {/* Tile 4: Reviewed Findings */}
        <div className="bg-surface-container-lowest p-3.5 rounded-lg border border-surface-container-highest shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-label-sm font-label-sm uppercase tracking-wider text-secondary font-semibold">
              Reviewed Findings
            </span>
            <span className="material-symbols-outlined text-[16px] text-emerald-600">task_alt</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-headline-xl font-headline-xl text-on-surface font-bold">{reviewedCount}</span>
            <span className="text-label-sm font-label-sm text-emerald-700">Audited &amp; signed</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full w-full" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container-highest">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface p-0.5 rounded border border-surface-container-highest text-label-sm font-label-sm">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'all'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold border border-surface-container-highest'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              All ({findingsList.length})
            </button>
            <button
              onClick={() => setTypeFilter('conflict')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'conflict'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold border border-surface-container-highest'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Policy Conflict ({conflictCount})
            </button>
            <button
              onClick={() => setTypeFilter('missing')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'missing'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold border border-surface-container-highest'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Missing Evidence ({missingCount})
            </button>
          </div>

          <div className="h-4 w-px bg-surface-container-highest mx-1" />

          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-secondary">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-7 text-label-sm font-label-sm bg-surface-container-lowest border border-surface-container-highest rounded px-2 py-0 text-on-surface focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Right: Search */}
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-7 pl-7 pr-2 text-label-sm font-label-sm bg-surface border border-surface-container-highest rounded text-on-surface placeholder:text-secondary focus:outline-none focus:border-on-surface"
              placeholder="Filter findings..."
              type="text"
            />
            <span className="absolute inset-y-0 left-2 flex items-center pointer-events-none text-secondary">
              <span className="material-symbols-outlined text-[14px]">filter_list</span>
            </span>
          </div>
        </div>
      </div>

      {/* Master-Detail Inspection Workspace Split */}
      <div className="grid grid-cols-12 gap-4 flex-1 pb-6 items-start">
        {/* Master Table (Left 5 Cols) */}
        <section className="col-span-12 xl:col-span-5 flex flex-col bg-surface-container-lowest rounded-lg border border-surface-container-highest overflow-hidden">
          <div className="px-4 py-2.5 bg-surface-container-low border-b border-surface-container-highest flex items-center justify-between">
            <span className="text-label-sm font-label-sm font-semibold uppercase text-secondary">
              Identified Findings ({filteredFindings.length})
            </span>
            <span className="text-code-sm font-code-sm text-secondary">Select row to inspect</span>
          </div>

          <div className="divide-y divide-surface-container-highest">
            {filteredFindings.length === 0 ? (
              <div className="p-8 text-center text-secondary text-xs">
                No findings match the selected filters.
              </div>
            ) : (
              filteredFindings.map((finding) => {
                const isSelected = selectedFinding.id === finding.id;
                return (
                  <div
                    key={finding.id}
                    onClick={() => setSelectedFindingId(finding.id)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-surface-container-low border-l-4 border-l-primary-container'
                        : 'bg-surface-container-lowest hover:bg-surface border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-code-sm font-code-sm font-semibold ${
                          isSelected ? 'text-primary' : 'text-secondary'
                        }`}
                      >
                        {finding.code}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wide border ${
                          finding.status === 'resolved'
                            ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                            : finding.severity === 'high'
                            ? 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {finding.status === 'resolved' ? 'Resolved' : finding.severityLabel}
                      </span>
                    </div>

                    <h3 className="text-headline-sm font-headline-sm text-on-surface mt-1 font-semibold text-xs leading-snug">
                      {finding.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-code-sm bg-surface-container text-on-surface border border-surface-container-high">
                        {finding.typeLabel}
                      </span>
                      <span className="text-body-sm font-body-sm text-secondary text-xs">
                        Related: <strong className="text-on-surface font-medium">{finding.relatedQuestionCode}</strong>
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-surface-container-highest flex items-center justify-between text-body-sm font-body-sm text-secondary text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-amber-600">
                          inventory_2
                        </span>
                        <span className="text-code-sm font-code-sm truncate max-w-[200px]">
                          {finding.sourceSummary}
                        </span>
                      </div>
                      {isSelected ? (
                        <span className="text-label-sm font-label-sm text-primary font-semibold flex items-center">
                          Active Focus
                          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </span>
                      ) : (
                        <span className="text-label-sm font-label-sm text-secondary hover:text-on-surface">
                          Inspect
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Detail Inspector Canvas (Right 7 Cols) */}
        <section className="col-span-12 xl:col-span-7 bg-surface-container-lowest rounded-lg border border-surface-container-highest shadow-xs flex flex-col overflow-hidden">
          {/* Inspector Header */}
          <div className="px-5 py-4 border-b border-surface-container-highest bg-surface-container-lowest flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-code-sm font-code-sm font-semibold">
                  {selectedFinding.code}
                </span>
                <span className="text-label-sm font-label-sm text-[#b91c1c] font-medium bg-[#fef2f2] px-2 py-0.5 rounded border border-[#fecaca]">
                  {selectedFinding.typeLabel} Discrepancy
                </span>
              </div>
              <h2 className="text-headline-md font-headline-md font-bold text-on-surface text-base">
                {selectedFinding.title}
              </h2>
            </div>

            <button
              onClick={() => onSelectClaimForReview?.(selectedFinding.relatedQuestionCode)}
              className="h-8 px-2.5 rounded bg-surface hover:bg-surface-container-low text-on-surface border border-surface-container-highest text-label-sm font-label-sm flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              <span>Open Related Question ({selectedFinding.relatedQuestionCode})</span>
            </button>
          </div>

          {/* Inspector Body Content */}
          <div className="p-5 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
            {/* Context / Question Requirement Card */}
            <div className="p-3.5 bg-surface rounded-lg border border-surface-container-highest flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-code-sm font-code-sm font-semibold text-primary">
                    QUESTION CONTEXT
                  </span>
                  <span className="text-label-sm font-label-sm bg-surface-container px-2 py-0.2 rounded border border-surface-container-high text-on-surface">
                    {selectedFinding.relatedQuestionCode} ({selectedFinding.relatedControl})
                  </span>
                </div>
                <span className="text-code-sm font-code-sm text-secondary">
                  Control: {selectedFinding.relatedControl}
                </span>
              </div>
              <p className="text-body-md font-body-md text-on-surface italic text-xs">
                &ldquo;{selectedFinding.questionText}&rdquo;
              </p>
            </div>

            {/* Flag Callout Explanation Banner */}
            <div className="p-3.5 bg-[#fff7ed] border border-[#ffedd5] rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                report_problem
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-label-md font-label-md font-semibold text-[#9a3412]">
                  Why it was flagged:
                </span>
                <p className="text-body-sm font-body-sm text-[#7c2d12] text-xs leading-relaxed">
                  {selectedFinding.flagReason}
                </p>
              </div>
            </div>

            {/* Side-by-side Evidence Comparison */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
                  Side-by-Side Evidence Verification
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Left: Policy Evidence Excerpt */}
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg overflow-hidden flex flex-col">
                  <div className="px-3 py-2 bg-surface-container-low border-b border-surface-container-highest flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-secondary">
                        article
                      </span>
                      <span className="text-label-sm font-label-sm font-semibold text-on-surface text-xs">
                        Policy Evidence
                      </span>
                    </div>
                    <span className="text-code-sm font-code-sm text-secondary truncate max-w-[150px]">
                      {selectedFinding.policyCitation.docName}
                    </span>
                  </div>
                  <div className="p-3 bg-surface-container-lowest font-body-sm text-body-sm text-secondary leading-relaxed flex flex-col gap-2">
                    <p className="text-[11px] text-secondary font-medium">
                      {selectedFinding.policyCitation.section}
                    </p>
                    <div className="p-2.5 bg-surface border-l-2 border-primary rounded text-on-surface text-xs">
                      <mark className="bg-[#ea580c1a] text-on-surface border-b border-primary-container px-0.5 font-medium">
                        {selectedFinding.policyCitation.quote}
                      </mark>
                    </div>
                    <p className="text-[11px] text-secondary mt-1">
                      Status: {selectedFinding.policyCitation.status}
                    </p>
                  </div>
                </div>

                {/* Right: Code AST Scan Viewer */}
                <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg overflow-hidden flex flex-col">
                  <div className="px-3 py-2 bg-surface-container-low border-b border-surface-container-highest flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        code
                      </span>
                      <span className="text-label-sm font-label-sm font-semibold text-on-surface text-xs">
                        Implementation Evidence
                      </span>
                    </div>
                    <span className="text-code-sm font-code-sm text-secondary truncate max-w-[150px]">
                      {selectedFinding.codeEvidence.file}
                    </span>
                  </div>

                  <div className="p-3 bg-[#0f172a] text-[#f8fafc] font-code-sm text-[11px] overflow-x-auto flex flex-col leading-5">
                    {selectedFinding.codeEvidence.lines.map((line, idx) => (
                      <div
                        key={idx}
                        className={
                          line.isHighlighted
                            ? 'bg-[#c2410c33] border-l-2 border-primary text-[#ffdbce] px-1 py-0.5 rounded-sm my-0.5'
                            : 'text-[#94a3b8]'
                        }
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deep Analysis */}
            <div className="bg-surface p-3.5 rounded-lg border border-surface-container-highest flex flex-col gap-1.5">
              <span className="text-label-sm font-label-sm uppercase font-semibold text-secondary text-xs">
                Relationship Analysis
              </span>
              <p className="text-body-sm font-body-sm text-on-surface leading-normal text-xs">
                {selectedFinding.relationshipAnalysis}
              </p>
            </div>
          </div>

          {/* Inspector Action Footer */}
          <div className="px-5 py-3.5 bg-surface-container-lowest border-t border-surface-container-highest flex flex-wrap items-center justify-between gap-3 mt-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectClaimForReview?.(selectedFinding.relatedQuestionCode)}
                className="h-8 px-3 rounded bg-surface hover:bg-surface-container-low text-on-surface border border-surface-container-highest font-label-md text-label-md flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-secondary">visibility</span>
                <span>Review Question</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleMarkReviewed(selectedFinding.id)}
                className="h-8 px-3 rounded bg-surface hover:bg-surface-container-low text-on-surface border border-surface-container-highest font-label-md text-label-md flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-emerald-600">done</span>
                <span>Mark Reviewed</span>
              </button>
              <button
                onClick={() => handleMarkResolved(selectedFinding.id)}
                className="h-8 px-3.5 rounded bg-primary-container hover:bg-[#ea580c] text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm border border-[#9a3412] transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>Mark Resolved</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
