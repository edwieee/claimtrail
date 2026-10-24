'use client';

import React, { useState, useMemo } from 'react';
import type {
  ConflictItem,
  DeterministicFinding,
  FindingReviewStatus,
  RuleEvidenceReference,
  SecurityCheckResult,
  SecurityClaim,
} from '@/types/claimtrail';

interface FindingsAndChecksViewProps {
  conflicts: ConflictItem[];
  claims: SecurityClaim[];
  findings?: DeterministicFinding[];
  checkResults?: SecurityCheckResult[];
  onSelectClaimForReview?: (claimCode: string) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onResolveFinding?: (findingId: string, status: FindingReviewStatus, notes?: string) => Promise<void>;
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
  status: FindingReviewStatus;
  evidenceReferences?: RuleEvidenceReference[];
  ruleStatus?: string;
  whatEvidenceProves?: string;
  whatEvidenceDoesNotProve?: string;
  draftAnswer?: string;
  stale?: boolean;
}

export function FindingsAndChecksView({
  conflicts = [],
  claims = [],
  findings = [],
  checkResults = [],
  onSelectClaimForReview,
  onShowToast,
  onResolveFinding,
  onRunEvidenceCheck,
}: FindingsAndChecksViewProps) {
  // Transform conflicts and unverified claims into unified display findings
  const findingsList: DisplayFinding[] = useMemo(() => {
    const list: DisplayFinding[] = [];

    findings.forEach((finding, idx) => {
      const policyEvidence = finding.evidence.find((item) => item.sourceType === 'pdf');
      const repoEvidence = finding.evidence.find((item) => item.sourceType === 'repo');
      const relatedClaim = claims.find((claim) => finding.relatedClaimIds.includes(claim.id));
      list.push({
        id: finding.id,
        code: `D-${String(idx + 1).padStart(3, '0')}`,
        title: finding.title,
        type: finding.findingType === 'policy_config_conflict' ? 'conflict' : finding.findingType === 'missing_evidence' ? 'missing' : 'check',
        typeLabel: finding.findingType.replaceAll('_', ' '),
        severity: finding.priority,
        severityLabel: finding.priority === 'high' ? 'High Priority' : finding.priority === 'medium' ? 'Needs Review' : 'Low Priority',
        relatedQuestionCode: finding.relatedQuestionCodes[0] || relatedClaim?.code || 'Unlinked',
        relatedControl: finding.category,
        questionText: relatedClaim?.question || 'Question unavailable',
        sourceSummary: `${finding.evidence.length} evidence reference${finding.evidence.length === 1 ? '' : 's'}`,
        flagReason: finding.trigger,
        policyCitation: {
          docName: policyEvidence?.sourceName || 'No policy evidence retrieved',
          section: policyEvidence?.pageNumber ? `Page ${policyEvidence.pageNumber}` : 'Location unavailable',
          quote: policyEvidence?.excerpt || 'No policy excerpt available.',
          status: finding.status,
        },
        codeEvidence: {
          file: repoEvidence?.filePath || repoEvidence?.sourceName || 'No repository evidence retrieved',
          line: repoEvidence?.lineRange?.start || 0,
          lines: repoEvidence ? [{ num: repoEvidence.lineRange?.start || 0, text: repoEvidence.excerpt, isHighlighted: true }] : [],
        },
        relationshipAnalysis: finding.explanation,
        status: finding.reviewStatus || 'open',
        evidenceReferences: finding.evidence,
        ruleStatus: finding.status,
        whatEvidenceProves: finding.whatEvidenceProves,
        whatEvidenceDoesNotProve: finding.whatEvidenceDoesNotProve,
        draftAnswer: relatedClaim?.answerDraftDetails?.draftAnswer,
        stale: finding.stale,
      });
    });

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
          line: 0,
          lines: [],
        },
        relationshipAnalysis: `Discrepancy identified between policy specification and actual runtime code behavior. Requires manual engineering confirmation.`,
        status: (c.status as any) || 'open',
      });
    });

    return list;
  }, [conflicts, claims, findings]);

  const [selectedFindingId, setSelectedFindingId] = useState<string>(findingsList[0]?.id || 'f-201');
  const [typeFilter, setTypeFilter] = useState<'all' | 'conflict' | 'missing' | 'check'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');

  const selectedFinding = useMemo(
      () => findingsList.find((f) => f.id === selectedFindingId) || findingsList[0] || {
      id: 'empty',
      code: '--',
      title: 'No finding selected',
      type: 'check',
      typeLabel: 'No result',
      severity: 'low',
      severityLabel: 'No result',
      relatedQuestionCode: '--',
      relatedControl: '--',
      questionText: 'Run a deterministic security check to inspect evidence-backed results.',
      sourceSummary: 'No evidence references',
      flagReason: 'No deterministic finding is currently selected.',
      policyCitation: { docName: 'Unavailable', section: 'Unavailable', quote: 'No policy evidence.', status: 'Not evaluated' },
      codeEvidence: { file: 'Unavailable', line: 0, lines: [] },
      relationshipAnalysis: 'No result is available until a check is run.',
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
    if (!reviewNotes.trim()) {
      onShowToast('Add a resolution reason before closing this finding.', 'warning');
      return;
    }
    try {
      if (onResolveFinding) {
        await onResolveFinding(id, 'resolved', reviewNotes.trim());
      }
      onShowToast(`Finding ${selectedFinding.code} marked as Resolved`, 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to resolve finding', 'warning');
    }
  };

  const handleMarkReviewed = async (id: string) => {
    try {
      if (onResolveFinding) {
        await onResolveFinding(id, 'in_review', reviewNotes.trim() || undefined);
      }
      onShowToast(`Finding ${selectedFinding.code} moved to In Review`, 'info');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to review finding', 'warning');
    }
  };

  const activeFindings = findingsList.filter((f) => !['resolved', 'accepted_risk', 'false_positive'].includes(f.status));
  const openCount = activeFindings.length;
  const conflictCount = activeFindings.filter((f) => f.type === 'conflict').length;
  const missingCount = activeFindings.filter((f) => f.type === 'missing').length;
  const reviewedCount = findingsList.filter((f) => ['resolved', 'accepted_risk', 'false_positive'].includes(f.status)).length;
  const passedCount = checkResults.filter((check) => check.status === 'pass').length;
  const insufficientCount = checkResults.filter((check) => check.status === 'insufficient_evidence').length;

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
          <p className="text-[11px] font-code-sm text-secondary mt-1">
            Checks run: {checkResults.length} · Passed: {passedCount} · Insufficient evidence: {insufficientCount}
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
            <button
              onClick={() => setTypeFilter('check')}
              className={`px-2.5 py-1 rounded transition-colors ${
                typeFilter === 'check'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold border border-surface-container-highest'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Rule Checks ({findingsList.filter((finding) => finding.type === 'check').length})
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
              <option value="in_review">In Review</option>
              <option value="awaiting_evidence">Awaiting Evidence</option>
              <option value="resolved">Resolved</option>
              <option value="accepted_risk">Accepted Risk</option>
              <option value="false_positive">False Positive</option>
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
                          finding.stale
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : ['resolved', 'accepted_risk', 'false_positive'].includes(finding.status)
                            ? 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'
                            : finding.severity === 'high'
                            ? 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {finding.stale ? 'Stale - Re-review' : finding.status === 'accepted_risk' ? 'Accepted Risk' : finding.status === 'false_positive' ? 'False Positive' : finding.status === 'resolved' ? 'Resolved' : finding.status === 'in_review' ? 'In Review' : finding.status === 'awaiting_evidence' ? 'Awaiting Evidence' : finding.severityLabel}
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

            {selectedFinding.relatedQuestionCode !== '--' && (
              <button
                onClick={() => onSelectClaimForReview?.(selectedFinding.relatedQuestionCode)}
                className="h-8 px-2.5 rounded bg-surface hover:bg-surface-container-low text-on-surface border border-surface-container-highest text-label-sm font-label-sm flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                <span>Open Related Question ({selectedFinding.relatedQuestionCode})</span>
              </button>
            )}
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

            {selectedFinding.evidenceReferences && selectedFinding.evidenceReferences.length > 0 && (
              <div className="rounded-lg border border-surface-container-highest bg-surface-container-lowest overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-surface-container-highest bg-surface-container-low/40 flex items-center justify-between">
                  <h4 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider text-xs">
                    Rule Evidence References
                  </h4>
                  <span className="text-[11px] font-code-sm text-secondary">{selectedFinding.ruleStatus || 'review required'}</span>
                </div>
                <div className="divide-y divide-surface-container-highest">
                  {selectedFinding.evidenceReferences.map((evidence) => (
                    <div key={evidence.evidenceId} className="p-3 space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-on-surface">{evidence.sourceName}</span>
                        <span className="text-[10px] font-code-sm text-secondary">{evidence.sourceType.toUpperCase()}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] font-code-sm text-secondary">
                        {evidence.pageNumber !== undefined && <span>Page {evidence.pageNumber}</span>}
                        {evidence.filePath && <span>{evidence.filePath}</span>}
                        {evidence.lineRange && <span>Lines {evidence.lineRange.start}-{evidence.lineRange.end}</span>}
                        {evidence.commitSha && <span>Commit {evidence.commitSha.slice(0, 12)}</span>}
                      </div>
                      <p className="border-l-2 border-primary bg-surface-container-low/50 px-2.5 py-2 text-xs text-on-surface whitespace-pre-wrap leading-relaxed">
                        {evidence.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="px-3.5 py-2.5 border-t border-amber-200 bg-amber-50 text-[11px] text-amber-900">
                  This result evaluates only the retrieved evidence. It does not prove deployment state, execution, or complete control coverage.
                </p>
              </div>
            )}

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

            {(selectedFinding.whatEvidenceProves || selectedFinding.whatEvidenceDoesNotProve || selectedFinding.draftAnswer) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedFinding.whatEvidenceProves && (
                  <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-950">
                    <span className="font-semibold block mb-1">What the evidence establishes</span>
                    <p>{selectedFinding.whatEvidenceProves}</p>
                  </div>
                )}
                {selectedFinding.whatEvidenceDoesNotProve && (
                  <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-950">
                    <span className="font-semibold block mb-1">What remains unknown</span>
                    <p>{selectedFinding.whatEvidenceDoesNotProve}</p>
                  </div>
                )}
                {selectedFinding.draftAnswer && (
                  <div className="p-3.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-xs text-on-surface md:col-span-2">
                    <span className="font-semibold block mb-1">Related questionnaire draft</span>
                    <p className="whitespace-pre-line">{selectedFinding.draftAnswer}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Inspector Action Footer */}
          <div className="px-5 py-3.5 bg-surface-container-lowest border-t border-surface-container-highest flex flex-wrap items-center justify-between gap-3 mt-auto">
            <div className="flex items-center gap-2">
              <input
                value={reviewNotes}
                onChange={(event) => setReviewNotes(event.target.value)}
                placeholder="Reviewer note or resolution reason"
                aria-label="Reviewer note or resolution reason"
                className="h-8 w-56 px-2.5 text-xs border border-surface-container-highest rounded bg-surface-container-lowest text-on-surface placeholder:text-secondary focus:outline-none focus:border-on-surface"
              />
              <button
                onClick={() => handleMarkReviewed(selectedFinding.id)}
                className="h-8 px-3 rounded bg-surface hover:bg-surface-container-low text-on-surface border border-surface-container-highest font-label-md text-label-md flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-emerald-600">done</span>
                <span>Start Review</span>
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
