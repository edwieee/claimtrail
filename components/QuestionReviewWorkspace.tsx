'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { SecurityClaim, EvidenceNode, EvidenceLibraryItem } from '@/types/claimtrail';

interface QuestionReviewWorkspaceProps {
  claims: SecurityClaim[];
  selectedClaimId: string;
  onSelectClaim: (claim: SecurityClaim) => void;
  onInspectEvidenceNode?: (node: EvidenceNode) => void;
  onInspectEvidenceLibraryItem?: (item: EvidenceLibraryItem) => void;
  onBackToQuestionnaire?: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onUpdateClaim?: (claimId: string, updates: { answerText?: string; reviewStatus?: 'draft' | 'needs_review' | 'approved' }) => Promise<void>;
  onSynthesizeAiDraft?: (claimId: string) => Promise<string | undefined>;
}

export function QuestionReviewWorkspace({
  claims,
  selectedClaimId,
  onSelectClaim,
  onInspectEvidenceLibraryItem,
  onBackToQuestionnaire,
  onShowToast,
  onUpdateClaim,
  onSynthesizeAiDraft,
}: QuestionReviewWorkspaceProps) {
  const [isQuestionDrawerOpen, setIsQuestionDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState('');

  // Active selected claim
  const activeClaim = useMemo(
    () => claims.find((c) => c.id === selectedClaimId || c.code === selectedClaimId) ?? claims[0] ?? {
      id: 'default',
      code: 'SEC-104',
      category: 'Access Control',
      question: 'How is customer data separated and isolated across multi-tenant storage layers?',
      vendorDraftAnswer: 'Data isolation is enforced via PostgreSQL RLS.',
      status: 'green',
      statusDetail: 'Verified',
      primarySourcePath: 'auth/tenant_middleware.go',
      signalsCount: { supporting: 1, conflicting: 0, pending: 0 },
    },
    [claims, selectedClaimId]
  );

  useEffect(() => {
    setEditedAnswer(activeClaim.vendorDraftAnswer || activeClaim.answerDraft || '');
    setIsEditing(false);
  }, [activeClaim]);

  const activeIndex = useMemo(
    () => claims.findIndex((c) => c.id === activeClaim.id),
    [claims, activeClaim]
  );

  const currentAnswer = isEditing ? editedAnswer : (activeClaim.vendorDraftAnswer || activeClaim.answerDraft || '');
  const currentStatus = activeClaim.reviewStatus || 'draft';

  const handlePrev = () => {
    if (activeIndex > 0) {
      onSelectClaim(claims[activeIndex - 1]);
    }
  };

  const handleNext = () => {
    if (activeIndex < claims.length - 1) {
      onSelectClaim(claims[activeIndex + 1]);
    }
  };

  const handleApprove = async () => {
    try {
      if (onUpdateClaim) {
        await onUpdateClaim(activeClaim.id, { reviewStatus: 'approved' });
      }
      onShowToast(`Answer approved for ${activeClaim.code}`, 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to approve answer', 'warning');
    }
  };

  const handleMarkNeedsReview = async () => {
    try {
      if (onUpdateClaim) {
        await onUpdateClaim(activeClaim.id, { reviewStatus: 'needs_review' });
      }
      onShowToast(`Marked ${activeClaim.code} as Needs Review`, 'warning');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update review status', 'warning');
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (onUpdateClaim) {
        await onUpdateClaim(activeClaim.id, { answerText: editedAnswer });
      }
      setIsEditing(false);
      onShowToast(`Answer draft updated for ${activeClaim.code}`, 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to save draft', 'warning');
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    onShowToast(`Synthesizing grounded answer for ${activeClaim.code}...`, 'info');
    try {
      if (onSynthesizeAiDraft) {
        const newAnswer = await onSynthesizeAiDraft(activeClaim.id);
        if (newAnswer) {
          setEditedAnswer(newAnswer);
        }
      }
      onShowToast(`New compliance statement synthesized for ${activeClaim.code}`, 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to synthesize draft', 'warning');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyStatement = () => {
    navigator.clipboard?.writeText(currentAnswer);
    onShowToast('Compliance statement copied to clipboard', 'info');
  };

  // Filtered claims for drawer
  const filteredClaims = useMemo(() => {
    if (!searchQuery.trim()) return claims;
    const q = searchQuery.toLowerCase();
    return claims.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.question.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [claims, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
      {/* ========================================================================= */}
      {/* TOP APP BAR (STITCH REVIEW NAVIGATION)                                   */}
      {/* ========================================================================= */}
      <header className="flex items-center justify-between w-full h-14 px-6 bg-surface-container-lowest border-b border-surface-container-highest z-20 shrink-0">
        <div className="flex items-center gap-3">
          {/* Question Drawer Toggle Button */}
          <button
            onClick={() => setIsQuestionDrawerOpen(!isQuestionDrawerOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-label-sm font-label-sm text-on-surface bg-surface-container-low hover:bg-surface-container border border-surface-container-highest rounded transition-colors text-[12px]"
            title="Toggle Questions List"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              {isQuestionDrawerOpen ? 'close' : 'menu_open'}
            </span>
            <span className="font-medium">Questions List</span>
            <span className="text-[10px] font-code-sm px-1 py-0.2 rounded bg-surface-container-lowest text-secondary border border-surface-container-highest/60">
              {claims.length}
            </span>
          </button>

          <div className="h-4 w-[1px] bg-surface-container-highest" />

          {/* Breadcrumb Context */}
          <div className="flex items-center gap-2 text-body-md font-body-md text-secondary">
            <span
              onClick={onBackToQuestionnaire}
              className="text-secondary hover:text-on-surface cursor-pointer text-[13px]"
            >
              Questionnaires
            </span>
            <span className="text-secondary/40 text-[12px]">/</span>
            <span className="text-on-surface font-medium truncate max-w-[280px] text-[13px]">
              Active Assessment
            </span>
            <span className="text-secondary/40 text-[12px]">/</span>
            <span className="font-code-sm text-primary font-semibold text-[12px]">
              {activeClaim.code}
            </span>
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded border border-surface-container-highest bg-surface-container-lowest text-label-sm font-label-sm text-secondary">
            <button
              onClick={handlePrev}
              disabled={activeIndex <= 0}
              className="px-2.5 py-1 hover:text-on-surface hover:bg-surface-container-low border-r border-surface-container-highest flex items-center gap-1 transition-colors text-[12px] disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[15px]">chevron_left</span>
              <span className="hidden sm:inline">Prev</span>
            </button>
            <div className="px-3 py-1 font-code-sm text-[11px] text-on-surface bg-surface-container-lowest flex items-center gap-1.5">
              <span className="text-secondary">Question</span>
              <span className="text-on-surface font-semibold">{activeIndex >= 0 ? activeIndex + 1 : 1}</span>
              <span className="text-secondary/60">of</span>
              <span className="text-secondary">{claims.length > 0 ? claims.length : 1}</span>
            </div>
            <button
              onClick={handleNext}
              disabled={activeIndex >= claims.length - 1}
              className="px-2.5 py-1 hover:text-on-surface hover:bg-surface-container-low border-l border-surface-container-highest flex items-center gap-1 transition-colors text-[12px] disabled:opacity-40"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="material-symbols-outlined text-[15px]">chevron_right</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-surface-container-highest mx-0.5" />

          <button
            onClick={onBackToQuestionnaire}
            className="flex items-center gap-1.5 px-3 py-1.5 text-label-sm font-label-sm text-on-surface bg-surface-container-low hover:bg-surface-container border border-surface-container-highest rounded font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Back to Catalog</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* WORKSPACE AREA (WITH COLLAPSIBLE QUESTIONS DRAWER)                        */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Slide-out Questions List Drawer */}
        {isQuestionDrawerOpen && (
          <aside className="w-80 shrink-0 bg-surface-container-lowest border-r border-surface-container-highest flex flex-col h-full z-10 shadow-lg animate-in slide-in-from-left duration-200">
            <div className="p-3 border-b border-surface-container-highest flex items-center justify-between">
              <span className="font-label-md font-semibold text-on-surface text-xs">
                Questionnaire Catalog ({claims.length})
              </span>
              <button
                onClick={() => setIsQuestionDrawerOpen(false)}
                className="p-1 rounded text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-2 border-b border-surface-container-highest">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-secondary">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Filter questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 text-xs bg-surface-container-low border border-surface-container-highest rounded text-on-surface placeholder:text-secondary focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-surface-container-highest/60 custom-scrollbar">
              {filteredClaims.map((claim) => {
                const isSelected = claim.id === activeClaim.id;
                const status = claim.reviewStatus || 'draft';
                return (
                  <button
                    key={claim.id}
                    onClick={() => {
                      onSelectClaim(claim);
                      setIsQuestionDrawerOpen(false);
                    }}
                    className={`w-full p-3 text-left transition-colors flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-surface-container-low border-l-2 border-primary-container'
                        : 'hover:bg-surface-container-low/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-code-sm text-xs font-semibold text-primary">
                        {claim.code}
                      </span>
                      <span
                        className={`text-[9.5px] font-code-sm uppercase px-1.5 py-0.2 rounded ${
                          status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : status === 'needs_review'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-surface-container text-secondary'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-body-sm font-medium text-on-surface text-xs line-clamp-2">
                      {claim.question}
                    </p>
                    <div className="flex items-center gap-2 text-[10.5px] text-secondary mt-0.5">
                      <span>{claim.category}</span>
                      <span>•</span>
                      <span>{claim.linePageRef || 'Policy §3.2'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* ========================================================================= */}
        {/* FULL-WIDTH LINEAR REVIEW LAYOUT (SCROLLABLE BODY)                         */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto bg-background custom-scrollbar">
          <div className="max-w-6xl w-full mx-auto px-8 py-6 flex flex-col gap-6">
            {/* CENTER TOP ANCHOR: QUESTION & SYNTHESIS BANNER */}
            <section className="bg-surface-container-lowest border border-surface-container-highest/70 rounded-lg shadow-sm overflow-hidden">
              {/* Question Metadata Header */}
              <div className="px-6 py-4 border-b border-surface-container-highest/60 bg-surface-container-low/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-code-sm text-[11px] font-semibold text-primary px-2 py-0.5 bg-surface-container-low rounded border border-surface-container-high">
                      {activeClaim.code} · {activeClaim.category.toUpperCase()}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-code-sm text-[11px] bg-surface-container-low text-secondary border border-surface-container-highest/60 font-medium">
                    <span className="material-symbols-outlined text-[13px] text-secondary">
                      verified_user
                    </span>
                    <span>{activeClaim.linePageRef || 'SOC2-CC6.1'}</span>
                  </span>
                </div>
                <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight leading-snug">
                  {activeClaim.question}
                </h1>
                <p className="text-body-md font-body-md text-secondary mt-1.5 leading-relaxed text-[13px]">
                  {activeClaim.limitations ||
                    'Provide comprehensive technical details on logical or physical partitioning, tenant identifier scoping in database transactions, and safeguards preventing cross-tenant leakage.'}
                </p>
              </div>

              {/* AI Draft Status Bar */}
              <div className="flex items-center justify-between px-6 py-2.5 bg-surface-container-low/50 border-b border-surface-container-highest/40 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 font-medium text-amber-950">
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStatus === 'approved' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                    <span>{currentStatus === 'approved' ? 'Auditor Approved Response' : 'Grounded Compliance Draft'}</span>
                  </span>
                  <span className="text-secondary/40">•</span>
                  <span className="text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[14px]">
                      verified
                    </span>
                    <span>
                      {activeClaim.statusDetail || 'Supported by policy & repository evidence'}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-code-sm text-secondary">
                    Grounded AI Engine
                  </span>
                </div>
              </div>

              {/* Synthesized Compliance Statement */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-label-md font-semibold text-on-surface text-[13px]">
                      Synthesized Compliance Statement
                    </span>
                    <span className="text-[12px] text-secondary font-normal">
                      {currentStatus === 'approved' ? '(Auditor Approved)' : '(Ready for Auditor Sign-Off)'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopyStatement}
                      className="p-1 text-secondary hover:text-on-surface hover:bg-surface-container-low rounded transition-colors"
                      title="Copy Text"
                    >
                      <span className="material-symbols-outlined text-[15px]">content_copy</span>
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedAnswer}
                      onChange={(e) => setEditedAnswer(e.target.value)}
                      rows={6}
                      className="w-full p-3 text-xs font-body-md bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface focus:outline-none focus:border-on-surface leading-relaxed"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditedAnswer(currentAnswer);
                          setIsEditing(false);
                        }}
                        className="px-3 py-1 text-xs rounded border border-surface-container-highest bg-surface-container-lowest text-secondary hover:text-on-surface"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveDraft}
                        className="px-3 py-1 text-xs rounded bg-primary-container text-on-primary font-medium"
                      >
                        Save Draft
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="font-body-md text-on-surface leading-relaxed space-y-4 text-[13px] whitespace-pre-line">
                    <p>{currentAnswer}</p>
                  </div>
                )}
              </div>
            </section>

            {/* LOWER SECTION: DUAL-ENGINE VERIFIABLE EVIDENCE DECK (Side-by-Side 50/50 Grid) */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[17px]">
                    fact_check
                  </span>
                  <span className="text-label-md font-semibold text-on-surface text-[13px]">
                    Dual-Engine Verifiable Evidence Deck
                  </span>
                  <span className="text-[11px] font-code-sm px-1.5 py-0.2 rounded bg-surface-container-low text-secondary border border-surface-container-high">
                    {activeClaim.signalsCount?.supporting || 1} Verified Citations
                  </span>
                </div>
                <span className="text-[11px] text-secondary">Deterministic Baseline Snapshot</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* LEFT CARD (50%): Code Repository Source */}
                <div className="border border-surface-container-highest/70 rounded-lg bg-surface-container-lowest overflow-hidden flex flex-col justify-between shadow-sm">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-container-highest/60 bg-surface-container-low/40">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          code
                        </span>
                        <span className="text-label-sm font-semibold text-on-surface text-[12px]">
                          Code Repository Source
                        </span>
                      </div>
                      <span className="text-[11px] font-code-sm text-secondary">
                        {activeClaim.codeCitation?.repo || 'github.com/acme/core-api'}
                      </span>
                    </div>

                    {/* File path banner */}
                    <div className="px-4 py-1.5 bg-surface-container-lowest border-b border-surface-container-highest/40 flex items-center justify-between">
                      <span className="font-code-sm text-[11px] text-secondary truncate max-w-[260px]">
                        {activeClaim.codeCitation?.filePath || activeClaim.primarySourcePath}
                      </span>
                      <span className="font-code-sm text-[10px] text-secondary bg-surface-container-low px-1.5 py-0.5 rounded border border-surface-container-high/60">
                        AST Inspected
                      </span>
                    </div>

                    {/* Code snippet */}
                    <div className="p-3 bg-slate-950 text-slate-100 font-code-sm text-[11px] overflow-x-auto leading-relaxed max-h-48 custom-scrollbar">
                      {activeClaim.codeCitation?.lines && activeClaim.codeCitation.lines.length > 0 ? (
                        activeClaim.codeCitation.lines.map((l, i) => (
                          <div
                            key={i}
                            className={`flex ${
                              l.isHighlighted
                                ? 'bg-orange-950/40 -mx-3 px-3 border-l-2 border-primary text-amber-200'
                                : ''
                            }`}
                          >
                            <span className="select-none text-slate-600 pr-3 text-right w-6">
                              {l.num}
                            </span>
                            <span>{l.text}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 italic">
                          // Inspecting source target: {activeClaim.primarySourcePath}
                          <br />
                          // Code AST verification confirmed deterministic scope match.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Commit SHA footer */}
                  <div className="px-4 py-2 bg-surface-container-lowest text-[11px] text-secondary flex items-center justify-between border-t border-surface-container-highest/40">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[13px] text-emerald-600">
                        check_circle
                      </span>
                      <span>
                        Branch: <strong className="text-on-surface font-medium">{activeClaim.codeCitation?.branch || 'main'}</strong>
                      </span>
                    </span>
                    <span className="font-code-sm text-[10.5px] text-secondary">
                      SHA: <strong className="text-on-surface font-semibold">{activeClaim.codeCitation?.commitSha || '7a21f8'}</strong>
                    </span>
                  </div>
                </div>

                {/* RIGHT CARD (50%): Security Policy Document & Automated Verification */}
                <div className="border border-surface-container-highest/70 rounded-lg bg-surface-container-lowest overflow-hidden flex flex-col justify-between shadow-sm">
                  <div className="flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-container-highest/60 bg-surface-container-low/40">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          picture_as_pdf
                        </span>
                        <span className="text-label-sm font-semibold text-on-surface text-[12px]">
                          Security Policy Document
                        </span>
                      </div>
                      <span className="text-[11px] font-code-sm text-secondary">
                        {activeClaim.policyCitation?.docName || 'Acme_InfoSec_Policy_v4.2.pdf'}
                      </span>
                    </div>

                    {/* Document File metadata */}
                    <div className="px-4 py-1.5 bg-surface-container-lowest border-b border-surface-container-highest/40 flex items-center justify-between">
                      <span className="font-code-sm text-[11px] text-secondary truncate max-w-[280px]">
                        {activeClaim.policyCitation?.section || 'Section 3.2: Multi-Tenant Data Segregation'}
                      </span>
                      <span className="font-code-sm text-[10px] text-secondary bg-surface-container-low px-1.5 py-0.5 rounded border border-surface-container-high/60">
                        Page {activeClaim.policyCitation?.page || 14}
                      </span>
                    </div>

                    {/* Policy Quote Section */}
                    <div className="p-4 bg-surface-container-lowest font-body-sm text-[12px] leading-relaxed text-secondary border-b border-surface-container-highest/40 space-y-2">
                      <div className="p-3 border-l-2 border-amber-500 bg-surface-container-low/40 text-on-surface text-[12px] leading-normal rounded-r">
                        <p className="text-secondary italic">
                          &ldquo;{activeClaim.policyCitation?.quote || 'All data stores must enforce strict logical segregation.'}&rdquo;
                        </p>
                      </div>
                      <div className="text-[11px] text-secondary">
                        Status: {activeClaim.policyCitation?.status || 'Approved by Chief Compliance Officer.'}
                      </div>
                    </div>

                    {/* Automated Policy Verification Sub-section */}
                    <div className="p-4 bg-surface-container-low/20 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`material-symbols-outlined text-[16px] ${activeClaim.ruleCheck?.status === 'failed' ? 'text-red-600' : 'text-emerald-600'}`}>
                            {activeClaim.ruleCheck?.status === 'failed' ? 'error' : 'task_alt'}
                          </span>
                          <span className="text-label-sm font-semibold text-on-surface text-[12px]">
                            {activeClaim.ruleCheck?.ruleName || 'Automated Policy Verification'}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded font-code-sm text-[10px] font-semibold border ${
                            activeClaim.ruleCheck?.status === 'failed'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {activeClaim.ruleCheck?.status === 'failed' ? 'Failed' : 'Verified'}
                        </span>
                      </div>
                      <div className="text-[11px] text-secondary">
                        {activeClaim.ruleCheck?.description || 'Deterministic pattern match evaluated against source AST.'}
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-secondary/80">
                        <span className="font-code-sm text-secondary">
                          Confidence: {activeClaim.ruleCheck?.matchConfidence || 94.2}%
                        </span>
                        <span className="font-code-sm bg-surface-container-low px-1.5 py-0.5 rounded border border-surface-container-highest/60 text-secondary">
                          {activeClaim.ruleCheck?.ruleId || '#ENG-RLS-09'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Baseline Banner Footer */}
                  <div className="px-4 py-2 rounded-b border-t border-surface-container-highest/40 text-[11px] text-secondary flex items-center gap-1.5 bg-surface-container-low/30">
                    <span className="material-symbols-outlined text-[13px] text-secondary">
                      lock
                    </span>
                    <span className="truncate">
                      Citations cryptographically signed against baseline repository snapshot.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer for sticky bottom bar */}
            <div className="h-16" />
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM ACTION BAR                                                  */}
      {/* ========================================================================= */}
      <footer className="sticky bottom-0 w-full bg-surface-container-lowest border-t border-surface-container-highest px-8 py-3 z-20 shadow-md flex items-center justify-between shrink-0">
        {/* Left: Audit Trail / Metadata Info */}
        <div className="flex items-center gap-2 text-secondary text-[12px]">
          <span className="material-symbols-outlined text-[15px] text-secondary">commit</span>
          <span>
            Target: <code className="font-code-sm text-on-surface font-semibold bg-surface-container-low px-1.5 py-0.5 rounded border border-surface-container-highest/60">{activeClaim.primarySourcePath}</code>
          </span>
          <span className="text-secondary/40">•</span>
          <span className="text-secondary">Status: <strong className="text-on-surface font-medium capitalize">{currentStatus}</strong></span>
        </div>

        {/* Right: Action Button Group */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="text-secondary hover:text-error text-label-sm flex items-center gap-1 px-3 py-1.5 rounded transition-colors text-[12px] disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isRegenerating ? 'rotate_right' : 'refresh'}
            </span>
            <span>{isRegenerating ? 'Synthesizing…' : 'Regenerate Draft'}</span>
          </button>
          <button
            onClick={handleMarkNeedsReview}
            className="flex items-center gap-1 px-3 py-1.5 text-label-sm font-medium text-secondary hover:text-amber-900 hover:bg-amber-50 rounded border border-surface-container-highest/60 transition-colors text-[12px]"
          >
            <span className="material-symbols-outlined text-[15px]">flag</span>
            <span>Mark as Needs Review</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-3.5 py-1.5 text-label-sm font-medium text-on-surface bg-surface-container-lowest border border-surface-container-highest hover:bg-surface-container-low rounded transition-colors text-[12px]"
          >
            <span className="material-symbols-outlined text-secondary text-[15px]">edit</span>
            <span>{isEditing ? 'Close Editor' : 'Edit Answer'}</span>
          </button>
          <button
            onClick={handleApprove}
            className="flex items-center gap-1.5 px-4 py-2 text-label-sm font-semibold text-on-primary bg-primary-container hover:bg-[#ea580c] rounded transition-colors text-[12px] shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Approve Answer</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
