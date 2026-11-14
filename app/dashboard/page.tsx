'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppTopBar } from '@/components/AppTopBar';
import { OverviewDashboard } from '@/components/OverviewDashboard';
import { QuestionnaireView } from '@/components/QuestionnaireView';
import { QuestionReviewWorkspace } from '@/components/QuestionReviewWorkspace';
import { EvidenceSourcesView } from '@/components/EvidenceSourcesView';
import { FindingsAndChecksView } from '@/components/FindingsAndChecksView';
import { ExportsView } from '@/components/ExportsView';
import { EvidenceDetailDrawer } from '@/components/EvidenceDetailDrawer';
import { DetailInspectorModal } from '@/components/DetailInspectorModal';
import { SettingsModal } from '@/components/SettingsModal';
import { ToastNotification } from '@/components/ToastNotification';
import { Dialog } from '@/components/Dialog';
import styles from '@/components/LandingHero.module.css';
import type {
  SecurityClaim,
  EvidenceNode,
  EvidenceLibraryItem,
  NavItem,
  AssessmentState,
  ExportDeliverable,
  EvidenceMapping,
  FindingReviewStatus,
} from '@/types/claimtrail';

export default function DashboardPage() {
  // Navigation
  const [currentNav, setCurrentNav] = useState<NavItem>('overview');
  const [isCreateAssessmentOpen, setIsCreateAssessmentOpen] = useState(false);
  const [newAssessmentName, setNewAssessmentName] = useState('');
  const [newAssessmentFramework, setNewAssessmentFramework] = useState('');
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);
  const [createAssessmentError, setCreateAssessmentError] = useState<string | null>(null);
  const [questionnaireMode, setQuestionnaireMode] = useState<'catalog' | 'review'>('catalog');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Assessment State from Persistent Server Store
  const [assessment, setAssessment] = useState<AssessmentState>({
    assessmentId: '',
    assessmentName: '',
    framework: '',
    targetFilename: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    claims: [],
    conflicts: [],
    sources: [],
    exportHistory: [],
    settings: {
      activeModel: 'claude-3-7-sonnet',
      strictVerification: true,
      autoDetectConflicts: true,
      openaiApiKey: '',
      githubToken: '',
    },
  });

  const [isLoadingAssessment, setIsLoadingAssessment] = useState(true);
  const [evidenceMappings, setEvidenceMappings] = useState<Record<string, EvidenceMapping>>({});
  const [isLoadingEvidence, setIsLoadingEvidence] = useState(false);

  // Claim selection
  const [selectedClaimId, setSelectedClaimId] = useState('');

  // Drawers & Modals
  const [inspectedLibraryItem, setInspectedLibraryItem] = useState<EvidenceLibraryItem | null>(null);
  const [inspectedNode, setInspectedNode] = useState<EvidenceNode | null>(null);
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Evidence check status
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<{
    message: string;
    type?: 'info' | 'success' | 'warning';
  } | null>(null);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToast({ message, type });
  }, []);

  // Fetch Assessment on Mount
  const fetchAssessment = useCallback(async () => {
    try {
      const res = await fetch('/api/assessment');
      if (res.ok) {
        const data = await res.json();
        setAssessment(data);
        if (data.claims && data.claims.length > 0) {
          setSelectedClaimId((prev) => {
            const exists = data.claims.some((c: SecurityClaim) => c.id === prev);
            return exists ? prev : data.claims[0].id;
          });
        }
      }
    } catch (err) {
      console.error('Failed to load assessment store:', err);
      showToast('Could not load the persisted workspace. Check the server and refresh.', 'warning');
    } finally {
      setIsLoadingAssessment(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  // Filtered Claims for Search
  const filteredClaims = useMemo(() => {
    const list = assessment.claims || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.question.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.primarySourcePath && c.primarySourcePath.toLowerCase().includes(q))
    );
  }, [assessment.claims, searchQuery]);

  const activeClaim = useMemo(() => {
    const list = assessment.claims || [];
    return list.find((c) => c.id === selectedClaimId || c.code === selectedClaimId) ?? list[0];
  }, [assessment.claims, selectedClaimId]);

  const refreshEvidenceMappings = useCallback(async (claimId?: string) => {
    setIsLoadingEvidence(true);
    try {
      const query = claimId
        ? `/api/evidence/retrieve?claimId=${encodeURIComponent(claimId)}&limit=6`
        : '/api/evidence/retrieve?all=true&limit=4';
      const res = await fetch(query);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evidence retrieval failed.');
      if (claimId) {
        setEvidenceMappings((previous) => ({ ...previous, [data.mapping.claimId]: data.mapping }));
      } else {
        setEvidenceMappings(data.mappings || {});
      }
    } catch (err: any) {
      showToast(err.message || 'Evidence retrieval failed.', 'warning');
    } finally {
      setIsLoadingEvidence(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (currentNav === 'questionnaire') {
      refreshEvidenceMappings(questionnaireMode === 'review' ? selectedClaimId : undefined);
    }
  }, [currentNav, questionnaireMode, selectedClaimId, assessment.claims, assessment.sources, refreshEvidenceMappings]);

  // Handlers for cross-screen navigation
  const handleSelectQuestionForReview = (claim: SecurityClaim) => {
    setSelectedClaimId(claim.id);
    setCurrentNav('questionnaire');
    setQuestionnaireMode('review');
  };

  const handleSelectClaimCodeForReview = (claimCode: string) => {
    const list = assessment.claims || [];
    const claim = list.find((c) => c.code === claimCode);
    if (claim) {
      setSelectedClaimId(claim.id);
    }
    setCurrentNav('questionnaire');
    setQuestionnaireMode('review');
  };

  // Run Real Deterministic Evidence Evaluation
  const handleRunEvidenceCheck = async (claimId?: string) => {
    setIsRunningCheck(true);
    showToast('Executing deterministic security rules against repository & policies...', 'info');

    try {
      const res = await fetch('/api/evidence/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimId ? { claimId } : {}),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setAssessment(data.state);
      showToast(
        `Evidence Check complete: ${data.checksCount || 0} checks run, ${data.findingsCount || 0} findings requiring review.`,
        'success'
      );
    } catch (err: any) {
      console.error('Evidence evaluation error:', err);
      showToast(err.message || 'Evidence evaluation encountered an error', 'warning');
    } finally {
      setIsRunningCheck(false);
    }
  };

  // Upload Real XLSX Questionnaire
  const handleUploadQuestionnaire = async (file: File) => {
    if (!assessment.assessmentId) {
      setIsCreateAssessmentOpen(true);
      throw new Error('Create an assessment before uploading a questionnaire.');
    }
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/questionnaire/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload questionnaire.');
    }

    setAssessment(data.state);
    if (data.claims && data.claims.length > 0) {
      setSelectedClaimId(data.claims[0].id);
    }
    showToast(
      `Workbook parsed: ${data.questionsCount} questions extracted from ${data.filename}`,
      'success'
    );
  };

  // Upload Real Policy PDF
  const handleUploadPdfPolicy = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/sources/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to parse PDF document.');
    }

    setAssessment(data.state);
    showToast(
      `Policy PDF indexed: ${data.pagesCount} pages, ${data.chunksCount} policy clauses mapped.`,
      'success'
    );
  };

  // Connect Public GitHub Repository
  const handleConnectGitHubRepo = async (repoUrl: string) => {
    const res = await fetch('/api/sources/connect-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoUrl }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to connect repository.');
    }

    setAssessment(data.state);
    showToast(`GitHub repository connected: ${data.source.extractedTitle}`, 'success');
  };

  // Disconnect / Remove Evidence Source
  const handleRemoveSource = async (sourceId: string, sourceName?: string) => {
    try {
      const url = sourceId
        ? `/api/sources/connect-repo?sourceId=${encodeURIComponent(sourceId)}`
        : `/api/sources/connect-repo?sourceName=${encodeURIComponent(sourceName || '')}`;
      const res = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove source');
      setAssessment(data.state);
      showToast('Evidence source removed.', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove source', 'warning');
    }
  };

  const handleCreateAssessment = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreateAssessmentError(null);
    setIsCreatingAssessment(true);
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', assessmentName: newAssessmentName, framework: newAssessmentFramework }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create assessment.');
      setAssessment(data);
      setSelectedClaimId('');
      setEvidenceMappings({});
      setIsCreateAssessmentOpen(false);
      setCurrentNav('questionnaire');
      setQuestionnaireMode('catalog');
      showToast(`Assessment created: ${data.assessmentName}`, 'success');
    } catch (err: any) {
      setCreateAssessmentError(err.message || 'Failed to create assessment.');
    } finally {
      setIsCreatingAssessment(false);
    }
  };

  // Update Claim (Approve, Edit, Mark Needs Review)
  const handleUpdateClaim = async (
    claimId: string,
    updates: {
      answerText?: string;
      reviewStatus?: 'draft' | 'needs_review' | 'approved' | 'rejected' | 'stale';
      reason?: string;
      reviewer?: string;
      hasUnresolvedFindingOverride?: boolean;
      staleReason?: string;
    }
  ) => {
    const res = await fetch('/api/claims/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claimId,
        ...updates,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update claim');
    }

    setAssessment(data.state);
  };

  // Synthesize Grounded AI Answer
  const handleSynthesizeAiDraft = async (claimId: string): Promise<string | undefined> => {
    const res = await fetch('/api/ai/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, replace: true }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to synthesize draft');
    }

    setAssessment(data.state);
    return data.claim?.answerDraft;
  };

  // Resolve or Review Finding
  const handleResolveFinding = async (
    findingId: string,
    status: FindingReviewStatus,
    notes?: string,
  ) => {
    const res = await fetch('/api/findings/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ findingId, status, notes }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to resolve finding');
    }

    setAssessment(data.state);
  };

  // Breadcrumbs
  const breadcrumb: string[] =
    {
      overview: ['Dashboard', 'Overview'],
      questionnaire:
        questionnaireMode === 'review'
          ? ['Dashboard', 'Questionnaire', `Review${activeClaim ? ` (${activeClaim.code})` : ''}`]
          : ['Dashboard', 'Questionnaire', 'Catalog'],
      sources: ['Dashboard', 'Evidence Sources'],
      findings: ['Dashboard', 'Findings & Security Checks'],
      exports: ['Dashboard', 'Exports & Deliverables'],
      review: ['Dashboard', 'Questionnaire', 'Review'],
      questions: ['Dashboard', 'Questionnaire'],
      evidence: ['Dashboard', 'Evidence Sources'],
    }[currentNav] || ['Dashboard', 'Overview'];

  // Contextual top bar CTA
  const primaryActionConfig =
    {
      overview: {
        label: assessment.assessmentId ? 'Upload Questionnaire' : 'New Assessment',
        action: () => assessment.assessmentId ? (setCurrentNav('questionnaire'), setQuestionnaireMode('catalog')) : setIsCreateAssessmentOpen(true),
      },
      questionnaire: { label: 'Run Evidence Check', action: handleRunEvidenceCheck },
      sources: {
        label: 'Add Evidence Source',
        action: () => document.getElementById('add-evidence-source')?.click(),
      },
      findings: { label: 'Run Evidence Check', action: handleRunEvidenceCheck },
      exports: {
        label: 'Export Workbook',
        action: () => document.getElementById('export-workbook')?.click(),
      },
      review: { label: 'Run Evidence Check', action: handleRunEvidenceCheck },
      questions: { label: 'Run Evidence Check', action: handleRunEvidenceCheck },
      evidence: { label: 'Add Evidence Source', action: () => setCurrentNav('sources') },
    }[currentNav] || { label: 'Run Evidence Check', action: handleRunEvidenceCheck };

  return (
    <section id="assessment" aria-label="Assessment workspace" tabIndex={-1} className={`${styles.console} flex w-full overflow-hidden bg-canvas`}>
      {/* ── Left Sidebar ── */}
      <AppSidebar
        currentNav={currentNav}
        counts={{ questions: assessment.claims.length, sources: assessment.sources.filter((source) => source.type !== 'xlsx').length, findings: (assessment.findings || []).filter((finding) => !['resolved', 'accepted_risk', 'false_positive'].includes(finding.reviewStatus || '')).length }}
        onNavChange={(nav) => {
          setCurrentNav(nav);
          if (nav === 'questionnaire') {
            setQuestionnaireMode('catalog');
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onImportBatch={() => {
          setCurrentNav('questionnaire');
          setQuestionnaireMode('catalog');
          showToast('Ready to import new questionnaire spreadsheet.', 'info');
        }}
      />

      {/* ── Main Workspace Area ── */}
      <div id="app-workspace" className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Top Utility Bar */}
        <AppTopBar
          breadcrumb={breadcrumb}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alertCount={assessment.conflicts?.length || 0}
          isRunningCheck={isRunningCheck}
          onRunEvidenceCheck={handleRunEvidenceCheck}
          onOpenFindings={() => setCurrentNav('findings')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          assessmentName={assessment.assessmentName}
          primaryActionLabel={primaryActionConfig.label}
          onPrimaryAction={primaryActionConfig.action}
        />

        <nav aria-label="Mobile navigation" className="md:hidden flex items-center gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2 shrink-0">
          {[
            ['overview', 'Overview'],
            ['questionnaire', 'Questionnaire'],
            ['sources', 'Sources'],
            ['findings', 'Findings'],
            ['exports', 'Exports'],
          ].map(([nav, label]) => (
            <button
              key={nav}
              aria-current={currentNav === nav ? 'page' : undefined}
              onClick={() => {
                setCurrentNav(nav as NavItem);
                if (nav === 'questionnaire') setQuestionnaireMode('catalog');
              }}
              className={`shrink-0 rounded-md px-3 py-2 text-xs font-medium ${
                currentNav === nav || (nav === 'questionnaire' && (currentNav === 'review' || currentNav === 'questions'))
                  ? 'bg-accent-bg text-primary'
                  : 'text-secondary hover:bg-surface-container-low'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* ── Screen Router ── */}
        {isLoadingAssessment ? (
          <div role="status" className="flex flex-1 items-center justify-center bg-background text-sm text-secondary">
            <span className="material-symbols-outlined mr-2 animate-spin text-lg">progress_activity</span>
            Loading workspace…
          </div>
        ) : (<>

        {/* Screen A: Overview Dashboard */}
        {currentNav === 'overview' && (
          <OverviewDashboard
            claims={filteredClaims}
            conflicts={assessment.conflicts || []}
            findings={assessment.findings || []}
            sources={assessment.sources || []}
            targetFilename={assessment.targetFilename}
            onSelectQuestionForReview={handleSelectQuestionForReview}
            onNavigateToQuestionnaire={() => {
              setCurrentNav('questionnaire');
              setQuestionnaireMode('catalog');
            }}
            onNavigateToSources={() => setCurrentNav('sources')}
            onNavigateToFindings={() => setCurrentNav('findings')}
            onNavigateToExports={() => setCurrentNav('exports')}
            onNewAssessment={() => assessment.assessmentId ? (setCurrentNav('questionnaire'), setQuestionnaireMode('catalog')) : setIsCreateAssessmentOpen(true)}
          />
        )}

        {/* Screen B & Screen D: Questionnaire */}
        {currentNav === 'questionnaire' && (
          questionnaireMode === 'catalog' ? (
            <QuestionnaireView
              claims={filteredClaims}
              evidenceMappings={evidenceMappings}
              targetFilename={assessment.targetFilename}
              onSelectQuestionForReview={handleSelectQuestionForReview}
              onOpenReviewWorkspace={() => setQuestionnaireMode('review')}
              onUploadQuestionnaire={handleUploadQuestionnaire}
              hasAssessment={Boolean(assessment.assessmentId)}
              onCreateAssessment={() => setIsCreateAssessmentOpen(true)}
            />
          ) : (
            <QuestionReviewWorkspace
              claims={filteredClaims}
              selectedClaimId={selectedClaimId}
              findings={assessment.findings || []}
              conflicts={assessment.conflicts || []}
              onSelectClaim={(c) => setSelectedClaimId(c.id)}
              onInspectEvidenceNode={(node) => {
                setInspectedNode(node);
                setIsInspectorModalOpen(true);
              }}
              onInspectEvidenceLibraryItem={(item) => setInspectedLibraryItem(item)}
              onBackToQuestionnaire={() => setQuestionnaireMode('catalog')}
              onShowToast={showToast}
              onUpdateClaim={handleUpdateClaim}
              onSynthesizeAiDraft={handleSynthesizeAiDraft}
              evidenceMapping={activeClaim ? evidenceMappings[activeClaim.id] : undefined}
              isLoadingEvidence={isLoadingEvidence}
              onRefreshEvidence={() => refreshEvidenceMappings(activeClaim.id)}
              onRunSecurityCheck={() => handleRunEvidenceCheck(activeClaim.id)}
            />
          )
        )}

        {/* Screen C: Evidence Sources */}
        {currentNav === 'sources' && (
          <EvidenceSourcesView
            sources={assessment.sources || []}
            onInspectEvidenceItem={(item) => setInspectedLibraryItem(item)}
            onNavigateToQuestion={handleSelectClaimCodeForReview}
            onShowToast={showToast}
            onConnectRepo={handleConnectGitHubRepo}
            onRemoveSource={handleRemoveSource}
            onUploadPdf={handleUploadPdfPolicy}
            hasAssessment={Boolean(assessment.assessmentId)}
            onCreateAssessment={() => setIsCreateAssessmentOpen(true)}
          />
        )}

        {/* Screen E: Findings & Security Checks */}
        {currentNav === 'findings' && (
          <FindingsAndChecksView
            conflicts={assessment.conflicts || []}
            claims={assessment.claims || []}
            findings={assessment.findings || []}
            checkResults={assessment.checkResults || []}
            onSelectClaimForReview={handleSelectClaimCodeForReview}
            onShowToast={showToast}
            onResolveFinding={handleResolveFinding}
            onRunEvidenceCheck={handleRunEvidenceCheck}
          />
        )}

        {/* Screen G: Exports */}
        {currentNav === 'exports' && (
          <ExportsView
            claims={assessment.claims || []}
            conflicts={assessment.conflicts || []}
            findings={assessment.findings || []}
            sources={assessment.sources || []}
            exportHistory={assessment.exportHistory || []}
            assessmentName={assessment.assessmentName}
            onShowToast={showToast}
            onNavigateToQuestionnaire={() => {
              setCurrentNav('questionnaire');
              setQuestionnaireMode('catalog');
            }}
            onExportGenerated={(deliverable) => {
              setAssessment((prev) => ({
                ...prev,
                exportHistory: [deliverable, ...prev.exportHistory],
              }));
            }}
          />
        )}
        </>)}
      </div>

      {/* ── Slide-Over Evidence Drawer ── */}
      {inspectedLibraryItem && (
        <EvidenceDetailDrawer
          item={inspectedLibraryItem}
          onClose={() => setInspectedLibraryItem(null)}
          onNavigateToQuestion={handleSelectClaimCodeForReview}
        />
      )}

      {/* ── Node Inspector Modal ── */}
      {isInspectorModalOpen && (
        <DetailInspectorModal
          claim={activeClaim!}
          node={inspectedNode}
          onClose={() => setIsInspectorModalOpen(false)}
        />
      )}

      {/* ── Settings Modal ── */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onShowToast={showToast}
        onSettingsSaved={(settings) => {
          setAssessment((prev) => ({ ...prev, settings }));
        }}
      />

      {isCreateAssessmentOpen && (
        <Dialog label="Create assessment" onClose={() => !isCreatingAssessment && setIsCreateAssessmentOpen(false)}>
          <form onSubmit={handleCreateAssessment} className="ct-dialog max-w-md">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-base font-semibold">Create Assessment</h2>
                <p className="mt-1 text-xs text-secondary">Start an empty workspace, then upload your questionnaire and evidence.</p>
              </div>
              <button type="button" aria-label="Close create assessment dialog" disabled={isCreatingAssessment} onClick={() => setIsCreateAssessmentOpen(false)} className="p-1 text-secondary hover:text-on-surface disabled:opacity-50">
                <span aria-hidden="true" className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block text-xs font-medium text-on-surface">
                Assessment name
                <input autoFocus required minLength={2} maxLength={120} value={newAssessmentName} onChange={(event) => setNewAssessmentName(event.target.value)} placeholder="Customer security assessment" className="mt-1.5 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none" />
              </label>
              <label className="block text-xs font-medium text-on-surface">
                Framework <span className="font-normal text-secondary">(optional)</span>
                <input maxLength={160} value={newAssessmentFramework} onChange={(event) => setNewAssessmentFramework(event.target.value)} placeholder="SIG Lite, CAIQ, SOC 2 mapping…" className="mt-1.5 h-10 w-full rounded-md border border-border bg-surface px-3 text-sm focus:border-primary focus:outline-none" />
              </label>
              {createAssessmentError && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">{createAssessmentError}</p>}
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
              <button type="button" disabled={isCreatingAssessment} onClick={() => setIsCreateAssessmentOpen(false)} className="rounded-md border border-border px-4 py-2 text-xs text-secondary hover:bg-background disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isCreatingAssessment || newAssessmentName.trim().length < 2} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50">{isCreatingAssessment ? 'Creating…' : 'Create Assessment'}</button>
            </div>
          </form>
        </Dialog>
      )}

      {/* ── Toast Notification ── */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      </section>
  );
}
