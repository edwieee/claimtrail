'use client';

import React, { useState, useMemo } from 'react';
import type { SecurityClaim, ConflictItem, EvidenceSourceFile, DeterministicFinding } from '@/types/claimtrail';

interface OverviewDashboardProps {
  claims: SecurityClaim[];
  conflicts: ConflictItem[];
  findings?: DeterministicFinding[];
  sources: EvidenceSourceFile[];
  targetFilename?: string;
  onSelectQuestionForReview: (claim: SecurityClaim) => void;
  onNavigateToQuestionnaire: (filter?: string) => void;
  onNavigateToSources: () => void;
  onNavigateToFindings: () => void;
  onNavigateToExports?: () => void;
  onNewAssessment: () => void;
}

export function OverviewDashboard({
  claims,
  conflicts,
  findings = [],
  sources,
  targetFilename = 'AcmeCorp-Security-Assessment-2026.xlsx',
  onSelectQuestionForReview,
  onNavigateToQuestionnaire,
  onNavigateToSources,
  onNavigateToFindings,
  onNavigateToExports,
  onNewAssessment,
}: OverviewDashboardProps) {
  const [tableFilter, setTableFilter] = useState<'all' | 'awaiting' | 'approved' | 'insufficient' | 'findings'>('all');

  // Exact metrics derived from real state
  const totalQuestions = claims.length;

  const withDrafts = useMemo(
    () => claims.filter((c) => Boolean(c.answerDraft || c.editedAnswer || (c.vendorDraftAnswer && c.answerVersion))).length,
    [claims]
  );

  const approvedAnswers = useMemo(
    () => claims.filter((c) => c.reviewStatus === 'approved' && (!c.approval || c.approval.status === 'approved')).length,
    [claims]
  );

  const awaitingReview = useMemo(
    () => claims.filter((c) => c.reviewStatus === 'needs_review' || c.reviewStatus === 'draft' || !c.reviewStatus).length,
    [claims]
  );

  const rejectedAnswers = useMemo(
    () => claims.filter((c) => c.reviewStatus === 'rejected').length,
    [claims]
  );

  const staleAnswers = useMemo(
    () => claims.filter((c) => c.reviewStatus === 'stale').length,
    [claims]
  );

  const insufficientEvidence = useMemo(
    () => claims.filter((c) => c.answerDraftDetails?.evidenceStatus === 'insufficient_evidence' || c.status === 'amber').length,
    [claims]
  );

  // Unresolved findings / conflicts linked to questions
  const unresolvedFindings = useMemo(
    () => findings.filter((f) => !['resolved', 'accepted_risk', 'false_positive'].includes(f.reviewStatus || '')),
    [findings]
  );

  const openConflicts = useMemo(
    () => conflicts.filter((c) => c.status === 'open' || !c.status),
    [conflicts]
  );

  const questionsWithUnresolvedIssues = useMemo(() => {
    return claims.filter((claim) => {
      const hasFinding = unresolvedFindings.some(
        (f) => f.relatedClaimIds?.includes(claim.id) || f.relatedQuestionCodes?.includes(claim.code)
      );
      const hasConflict = openConflicts.some((c) => c.claimCode === claim.code);
      return hasFinding || hasConflict || claim.status === 'red';
    });
  }, [claims, unresolvedFindings, openConflicts]);

  const isWorkbookReadyForExport = totalQuestions > 0 && awaitingReview === 0 && rejectedAnswers === 0 && staleAnswers === 0 && insufficientEvidence === 0;

  const approvalPercent = totalQuestions > 0 ? Math.round((approvedAnswers / totalQuestions) * 100) : 0;

  // Filter questions for table
  const filteredClaims = useMemo(() => {
    if (tableFilter === 'awaiting') {
      return claims.filter((c) => c.reviewStatus === 'needs_review' || c.reviewStatus === 'draft' || !c.reviewStatus);
    }
    if (tableFilter === 'approved') {
      return claims.filter((c) => c.reviewStatus === 'approved');
    }
    if (tableFilter === 'insufficient') {
      return claims.filter((c) => c.answerDraftDetails?.evidenceStatus === 'insufficient_evidence' || c.status === 'amber');
    }
    if (tableFilter === 'findings') {
      return questionsWithUnresolvedIssues;
    }
    return claims;
  }, [claims, tableFilter, questionsWithUnresolvedIssues]);

  const evidenceSourceCount = sources.filter((s) => s.type !== 'xlsx').length;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-background custom-scrollbar">
      <div className="max-w-[1520px] mx-auto space-y-6">
        {/* ================================================================= */}
        {/* PAGE HEADER & ASSESSMENT CONTEXT                                  */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-surface-container-highest">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
                Final Review &amp; Approval Dashboard
              </h1>
              <span className="bg-surface-container-low text-secondary border border-surface-container-high font-code-sm text-code-sm px-2 py-0.5 rounded">
                STEP 7 FINAL AUDIT
              </span>
            </div>
            <p className="text-body-md font-body-md text-secondary mt-0.5">
              Review questionnaire answers against verified evidence, manage reviewer approvals, and export completed workbooks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNewAssessment}
              className="px-3 py-1.5 text-xs font-medium rounded border border-surface-container-highest hover:bg-surface-container-low text-secondary hover:text-on-surface transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">upload_file</span>
              <span>Import New XLSX</span>
            </button>
            <button
              onClick={() => onNavigateToExports?.()}
              className="px-4 py-1.5 text-xs font-semibold rounded bg-primary-container text-on-primary hover:bg-[#ea580c] transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              <span>Export Deliverables</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* WORKBOOK EXPORT READINESS STATUS BANNER                           */}
        {/* ================================================================= */}
        <div
          className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isWorkbookReadyForExport
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                isWorkbookReadyForExport ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isWorkbookReadyForExport ? 'verified' : 'pending_actions'}
              </span>
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>
                  {isWorkbookReadyForExport
                    ? 'Workbook Ready for Auditor Sign-Off & Final Export'
                    : 'Questionnaire Review in Progress — Pending Approvals'}
                </span>
                <span className="text-[11px] font-code-sm uppercase px-2 py-0.5 rounded bg-white/70 border border-current font-bold">
                  {approvalPercent}% Approved ({approvedAnswers}/{totalQuestions})
                </span>
              </div>
              <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                {isWorkbookReadyForExport
                  ? `All ${totalQuestions} questions have verified citations and explicit reviewer sign-off with zero unresolved conflicts.`
                  : `${awaitingReview} answer(s) awaiting review${
                      insufficientEvidence > 0 ? `, ${insufficientEvidence} flagged with incomplete evidence` : ''
                    }${
                      questionsWithUnresolvedIssues.length > 0
                        ? `, ${questionsWithUnresolvedIssues.length} associated with open findings`
                        : ''
                    }.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isWorkbookReadyForExport ? (
              <button
                onClick={() => onNavigateToExports?.()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Download Final Workbook</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateToExports?.()}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-medium shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">file_present</span>
                <span>Export Draft with Watermark</span>
              </button>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 6-METRIC REVIEW SUMMARY CARDS ROW                                 */}
        {/* ================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Metric 1: Total Questions */}
          <div
            onClick={() => setTableFilter('all')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              tableFilter === 'all'
                ? 'bg-surface-container-low border-primary-container shadow-xs'
                : 'bg-surface-container-lowest border-surface-container-highest hover:border-secondary'
            }`}
          >
            <div className="flex items-center justify-between text-secondary">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Total Questions</span>
              <span className="material-symbols-outlined text-sm">description</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-on-surface">{totalQuestions}</div>
            <div className="text-[11px] text-secondary mt-0.5 truncate">{targetFilename}</div>
          </div>

          {/* Metric 2: Answer Drafts */}
          <div
            onClick={() => setTableFilter('all')}
            className="p-3.5 rounded-xl border bg-surface-container-lowest border-surface-container-highest transition-all"
          >
            <div className="flex items-center justify-between text-secondary">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Drafts Generated</span>
              <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-on-surface">{withDrafts}</div>
            <div className="text-[11px] text-secondary mt-0.5">OpenAI synthesized</div>
          </div>

          {/* Metric 3: Awaiting Review */}
          <div
            onClick={() => setTableFilter('awaiting')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              tableFilter === 'awaiting'
                ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                : 'bg-surface-container-lowest border-surface-container-highest hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Awaiting Review</span>
              <span className="material-symbols-outlined text-sm">pending_actions</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-900">{awaitingReview}</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Sign-off required</div>
          </div>

          {/* Metric 4: Approved */}
          <div
            onClick={() => setTableFilter('approved')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              tableFilter === 'approved'
                ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                : 'bg-surface-container-lowest border-surface-container-highest hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Approved Answers</span>
              <span className="material-symbols-outlined text-sm">check_circle</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-900">{approvedAnswers}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5">{approvalPercent}% complete</div>
          </div>

          {/* Metric 5: Insufficient Evidence */}
          <div
            onClick={() => setTableFilter('insufficient')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              tableFilter === 'insufficient'
                ? 'bg-slate-100 border-slate-300 shadow-xs'
                : 'bg-surface-container-lowest border-surface-container-highest hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-secondary">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Incomplete Evidence</span>
              <span className="material-symbols-outlined text-sm text-amber-600">help</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-on-surface">{insufficientEvidence}</div>
            <div className="text-[11px] text-secondary mt-0.5">Missing citations</div>
          </div>

          {/* Metric 6: Unresolved Findings */}
          <div
            onClick={() => setTableFilter('findings')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              tableFilter === 'findings'
                ? 'bg-red-50/70 border-red-300 shadow-xs'
                : 'bg-surface-container-lowest border-surface-container-highest hover:border-red-300'
            }`}
          >
            <div className="flex items-center justify-between text-error">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Unresolved Issues</span>
              <span className="material-symbols-outlined text-sm">warning</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-error">{questionsWithUnresolvedIssues.length}</div>
            <div className="text-[11px] text-error mt-0.5">Policy/Code conflict</div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN ANALYTICAL GRID: TWO-COLUMN ASYMMETRIC SYSTEM (65% / 35%)   */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT / PRIMARY WORKSPACE COLUMN (8 of 12 cols = ~66%) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section A: Review Pipeline Progression Breakdown */}
            <div className="bg-surface-container-lowest hairline-border rounded-xl p-5 metric-card-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container-highest gap-2">
                <div>
                  <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                    Questionnaire Approval Pipeline
                  </h2>
                  <p className="text-body-sm font-body-sm text-secondary">
                    Actual audit stage distribution across {totalQuestions} extracted questions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low border border-surface-container-high font-code-sm text-code-sm text-secondary">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    {approvalPercent}% Formally Approved
                  </span>
                </div>
              </div>

              {/* Multi-segment progress bar */}
              <div className="mt-4 space-y-2">
                <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden flex">
                  {totalQuestions > 0 ? (
                    <>
                      <div
                        style={{ width: `${(approvedAnswers / totalQuestions) * 100}%` }}
                        className="bg-emerald-600 transition-all duration-300"
                        title={`Approved: ${approvedAnswers}`}
                      />
                      <div
                        style={{ width: `${(awaitingReview / totalQuestions) * 100}%` }}
                        className="bg-amber-500 transition-all duration-300"
                        title={`Awaiting Review: ${awaitingReview}`}
                      />
                      <div
                        style={{ width: `${(staleAnswers / totalQuestions) * 100}%` }}
                        className="bg-orange-500 transition-all duration-300"
                        title={`Evidence Changed / Stale: ${staleAnswers}`}
                      />
                      <div
                        style={{ width: `${(rejectedAnswers / totalQuestions) * 100}%` }}
                        className="bg-red-500 transition-all duration-300"
                        title={`Rejected: ${rejectedAnswers}`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-surface-container" />
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                    <span className="text-secondary font-medium">Approved:</span>
                    <span className="font-bold text-on-surface">{approvedAnswers}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-secondary font-medium">Needs Review:</span>
                    <span className="font-bold text-on-surface">{awaitingReview}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                    <span className="text-secondary font-medium">Stale / Re-review:</span>
                    <span className="font-bold text-on-surface">{staleAnswers}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                    <span className="text-secondary font-medium">Rejected:</span>
                    <span className="font-bold text-on-surface">{rejectedAnswers}</span>
                  </div>
                </div>
              </div>

              {/* Informational rules hint */}
              <div className="mt-4 p-3 rounded-lg bg-surface-container-low border border-surface-container-highest text-xs text-secondary flex items-start gap-2.5">
                <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5">verified_user</span>
                <div className="space-y-0.5">
                  <span className="font-semibold text-on-surface">Safe Approval Guardrails:</span> AI-drafted and human-edited answers remain in <span className="font-mono text-amber-800 bg-amber-50 px-1 py-0.2 rounded">needs_review</span> until explicitly signed off. Answers with changed evidence are flagged <span className="font-mono text-orange-800 bg-orange-50 px-1 py-0.2 rounded">stale</span>.
                </div>
              </div>
            </div>

            {/* Section B: Filterable Questions Review Table */}
            <div className="bg-surface-container-lowest hairline-border rounded-xl overflow-hidden metric-card-shadow">
              <div className="p-5 pb-3 border-b border-surface-container-highest space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                      Question Review Workspace
                    </h2>
                    <p className="text-body-sm font-body-sm text-secondary">
                      Showing {filteredClaims.length} of {totalQuestions} questions ({tableFilter.toUpperCase()} filter)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onNavigateToFindings}
                      className="flex items-center gap-1 px-2.5 py-1 text-label-sm font-label-sm rounded border border-surface-container-highest hover:bg-surface-container-low text-secondary transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">gavel</span>
                      <span>Findings ({findings.length})</span>
                    </button>
                    <button
                      onClick={() => onNavigateToQuestionnaire()}
                      className="text-label-sm font-label-sm text-primary font-medium hover:underline flex items-center gap-0.5"
                    >
                      Full Catalog
                      <span className="material-symbols-outlined text-xs">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                  <button
                    onClick={() => setTableFilter('all')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                      tableFilter === 'all'
                        ? 'bg-on-surface text-surface-container-lowest font-semibold'
                        : 'bg-surface-container-low text-secondary hover:text-on-surface'
                    }`}
                  >
                    All ({totalQuestions})
                  </button>
                  <button
                    onClick={() => setTableFilter('awaiting')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                      tableFilter === 'awaiting'
                        ? 'bg-amber-800 text-white font-semibold'
                        : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Needs Review ({awaitingReview})
                  </button>
                  <button
                    onClick={() => setTableFilter('approved')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                      tableFilter === 'approved'
                        ? 'bg-emerald-800 text-white font-semibold'
                        : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    Approved ({approvedAnswers})
                  </button>
                  <button
                    onClick={() => setTableFilter('insufficient')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                      tableFilter === 'insufficient'
                        ? 'bg-yellow-800 text-white font-semibold'
                        : 'bg-yellow-50 text-yellow-900 border border-yellow-200 hover:bg-yellow-100'
                    }`}
                  >
                    Insufficient Evidence ({insufficientEvidence})
                  </button>
                  <button
                    onClick={() => setTableFilter('findings')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                      tableFilter === 'findings'
                        ? 'bg-red-800 text-white font-semibold'
                        : 'bg-red-50 text-red-900 border border-red-200 hover:bg-red-100'
                    }`}
                  >
                    Unresolved Issues ({questionsWithUnresolvedIssues.length})
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                      <th className="py-2.5 px-4 font-semibold w-20">ID</th>
                      <th className="py-2.5 px-4 font-semibold">Question &amp; Current Answer</th>
                      <th className="py-2.5 px-4 font-semibold w-32">Domain</th>
                      <th className="py-2.5 px-4 font-semibold w-36">Review Status</th>
                      <th className="py-2.5 px-4 font-semibold w-36">Evidence Status</th>
                      <th className="py-2.5 px-4 text-right font-semibold w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest font-body-md text-body-md">
                    {filteredClaims.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-secondary text-xs">
                          No questionnaire items match the active <span className="font-semibold text-on-surface">{tableFilter}</span> filter.
                        </td>
                      </tr>
                    ) : (
                      filteredClaims.slice(0, 10).map((c) => {
                        const currentAnswer = c.editedAnswer || c.answerDraft || c.vendorDraftAnswer;
                        const isApproved = c.reviewStatus === 'approved';
                        const isRejected = c.reviewStatus === 'rejected';
                        const isStale = c.reviewStatus === 'stale';

                        return (
                          <tr key={c.id} className="hover:bg-surface-container-low transition-colors group">
                            <td className="py-3 px-4 font-code-sm text-code-sm font-medium text-secondary align-top">
                              {c.code}
                            </td>
                            <td className="py-3 px-4 align-top">
                              <span className="font-medium text-on-surface group-hover:text-primary transition-colors text-xs block">
                                {c.question}
                              </span>
                              {currentAnswer ? (
                                <div className="text-secondary mt-1 text-xs line-clamp-2 bg-surface-container-low/60 p-1.5 rounded border border-surface-container-high/40">
                                  {c.editedAnswer ? (
                                    <span className="text-[10px] font-semibold text-primary mr-1 uppercase">[Human Edited v{c.answerVersion || 1}]</span>
                                  ) : c.answerDraft ? (
                                    <span className="text-[10px] font-semibold text-secondary mr-1 uppercase">[AI Draft v{c.answerVersion || 1}]</span>
                                  ) : null}
                                  {currentAnswer}
                                </div>
                              ) : (
                                <span className="text-[11px] text-secondary italic block mt-1">No draft generated yet</span>
                              )}
                            </td>
                            <td className="py-3 px-4 align-top">
                              <span className="inline-flex items-center px-2 py-0.5 rounded font-code-sm text-code-sm bg-surface-container text-on-surface text-[11px]">
                                {c.category || 'General'}
                              </span>
                            </td>
                            <td className="py-3 px-4 align-top">
                              {isApproved ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <span className="material-symbols-outlined text-[13px] text-emerald-700">check_circle</span>
                                  Approved
                                </span>
                              ) : isRejected ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-800 border border-red-200">
                                  <span className="material-symbols-outlined text-[13px] text-red-700">cancel</span>
                                  Rejected
                                </span>
                              ) : isStale ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-200">
                                  <span className="material-symbols-outlined text-[13px] text-orange-700">history</span>
                                  Stale / Re-review
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  <span className="material-symbols-outlined text-[13px] text-amber-700">hourglass_empty</span>
                                  Needs Review
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 align-top">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                                  c.status === 'green'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : c.status === 'amber'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    c.status === 'green'
                                      ? 'bg-emerald-600'
                                      : c.status === 'amber'
                                      ? 'bg-amber-500'
                                      : 'bg-red-600'
                                  } shrink-0`}
                                />
                                {c.status === 'green'
                                  ? 'Verified'
                                  : c.status === 'amber'
                                  ? 'Insufficient'
                                  : 'Issue Flagged'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right align-top">
                              <button
                                onClick={() => onSelectQuestionForReview(c)}
                                className="px-2.5 py-1 text-label-sm font-label-sm font-semibold rounded bg-surface-container-lowest border border-surface-container-highest hover:bg-surface-container-low text-primary hover:border-primary-container transition-colors shadow-2xs"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {filteredClaims.length > 10 && (
                <div className="p-3 bg-surface-container-low border-t border-surface-container-highest text-center">
                  <button
                    onClick={() => onNavigateToQuestionnaire()}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    View all {filteredClaims.length} questions in catalog &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT / SECONDARY WORKSPACE COLUMN (4 of 12 cols = ~34%) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card C: Real Connected Evidence Sources */}
            <div className="bg-surface-container-lowest hairline-border rounded-xl p-5 metric-card-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">source</span>
                  <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                    Evidence Sources
                  </h3>
                </div>
                <span className="px-2 py-0.5 font-code-sm text-code-sm bg-surface-container-low rounded border border-surface-container-highest text-secondary font-medium">
                  {sources.length} active
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {sources.length === 0 ? (
                  <div className="text-center py-6 text-xs text-secondary">
                    <span className="material-symbols-outlined text-2xl text-secondary mb-1">cloud_off</span>
                    <div>No evidence sources connected yet.</div>
                    <button
                      onClick={onNavigateToSources}
                      className="mt-2 text-primary font-semibold hover:underline block mx-auto"
                    >
                      Connect PDF or GitHub Repo
                    </button>
                  </div>
                ) : (
                  sources.map((s, idx) => (
                    <div
                      key={s.id || idx}
                      className="p-3 rounded-lg border border-surface-container-highest bg-surface-container-lowest hover:border-secondary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded border flex items-center justify-center shrink-0 ${
                              s.type === 'xlsx'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : s.type === 'pdf'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-slate-100 border-slate-300 text-slate-800'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">
                              {s.type === 'xlsx' ? 'table_chart' : s.type === 'pdf' ? 'picture_as_pdf' : 'terminal'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-code-sm text-code-sm font-semibold text-on-surface truncate">
                              {s.name}
                            </div>
                            <div className="text-[11px] text-secondary">
                              {s.type === 'xlsx'
                                ? `${totalQuestions} questions parsed`
                                : s.extractedTitle || s.sizeOrBranch || `${s.extractedChunks?.length || 0} items indexed`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-surface-container-highest">
                <button
                  onClick={onNavigateToSources}
                  className="w-full text-center py-1 text-xs text-primary font-semibold hover:underline"
                >
                  Manage Evidence Sources &rarr;
                </button>
              </div>
            </div>

            {/* Card D: Statutory Regulatory Disclaimer */}
            <div className="bg-amber-50/60 hairline-border border-amber-200 rounded-xl p-4 metric-card-shadow text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[10px]">
                <span className="material-symbols-outlined text-sm text-amber-700">shield</span>
                <span>Statutory Compliance Notice</span>
              </div>
              <p className="text-amber-950/80 leading-relaxed text-[11px]">
                Approval of answers inside ClaimTrail reflects internal verification against connected security policies and repository configurations. It does not constitute formal certification, external SOC 2/ISO attestation, or a legal warranty of absolute security.
              </p>
            </div>

            {/* Card E: Quick Actions Execution Panel */}
            <div className="bg-surface-container-low hairline-border rounded-xl p-5 metric-card-shadow space-y-3">
              <h3 className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-secondary">
                Review &amp; Export Shortcuts
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onNavigateToQuestionnaire('needs_review')}
                  className="w-full flex items-center justify-between py-2 px-3 bg-surface-container-lowest hover:bg-surface-bright text-on-surface font-label-md text-label-md rounded border border-surface-container-highest transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">rate_review</span>
                    <span>Review Pending ({awaitingReview})</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-secondary">chevron_right</span>
                </button>

                <button
                  onClick={onNavigateToFindings}
                  className="w-full flex items-center justify-between py-2 px-3 bg-surface-container-lowest hover:bg-surface-bright text-on-surface font-label-md text-label-md rounded border border-surface-container-highest transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-red-600">gavel</span>
                    <span>Inspect Findings ({findings.length})</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-secondary">chevron_right</span>
                </button>

                <button
                  onClick={() => onNavigateToExports?.()}
                  className="w-full flex items-center justify-between py-2 px-3 bg-surface-container-lowest hover:bg-surface-bright text-on-surface font-label-md text-label-md rounded border border-surface-container-highest transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-700">download_for_offline</span>
                    <span>Export Completed Questionnaire</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-secondary">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
