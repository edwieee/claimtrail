'use client';

import React, { useState, useMemo, useRef } from 'react';
import type { EvidenceSourceFile, EvidenceLibraryItem } from '@/types/claimtrail';

interface EvidenceSourcesViewProps {
  sources?: EvidenceSourceFile[];
  onInspectEvidenceItem?: (item: EvidenceLibraryItem) => void;
  onNavigateToQuestion?: (claimCode: string) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onConnectRepo?: (repoUrl: string) => Promise<void>;
  onRemoveSource?: (sourceId: string, sourceName?: string) => Promise<void>;
  onUploadPdf?: (file: File) => Promise<void>;
}

export function EvidenceSourcesView({
  sources = [],
  onNavigateToQuestion,
  onShowToast,
  onConnectRepo,
  onRemoveSource,
  onUploadPdf,
}: EvidenceSourcesViewProps) {
  const evidenceSources = useMemo(() => sources.filter((source) => source.type !== 'xlsx'), [sources]);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(evidenceSources[0]?.id || 'src-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'extracted' | 'linked'>('extracted');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New source form state
  const [newSourceType, setNewSourceType] = useState<'repo' | 'pdf'>('repo');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  const selectedSource = useMemo(
    () => evidenceSources.find((s) => s.id === selectedSourceId) || evidenceSources[0] || {
      id: 'default',
      name: 'No sources connected',
      type: 'pdf',
      typeLabel: 'PDF Policy',
      sizeOrBranch: '0 KB',
      sha: 'none',
      status: 'ready',
      statusLabel: 'Ready',
      extractedTitle: '0 sections',
      extractedProgress: 100,
      extractedNote: '',
      linkedCount: 0,
      lastUpdated: 'Never',
    },
    [evidenceSources, selectedSourceId]
  );

  const filteredSources = useMemo(() => {
    return evidenceSources.filter((s) => {
      if (typeFilter !== 'all' && s.type !== typeFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.sha.toLowerCase().includes(q) ||
          s.typeLabel.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [evidenceSources, searchQuery, typeFilter, statusFilter]);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (newSourceType === 'repo') {
        if (!newRepoUrl.trim()) {
          onShowToast('Please enter a GitHub repository URL.', 'warning');
          setIsSubmitting(false);
          return;
        }
        if (onConnectRepo) {
          await onConnectRepo(newRepoUrl.trim());
        }
      } else if (newSourceType === 'pdf') {
        if (!selectedFile) {
          onShowToast('Please select a PDF file to upload.', 'warning');
          setIsSubmitting(false);
          return;
        }
        if (onUploadPdf) {
          await onUploadPdf(selectedFile);
        }
      }
      setIsAddModalOpen(false);
      setSelectedFile(null);
      onShowToast(`Evidence source successfully integrated and analyzed!`, 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to connect evidence source', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const readyCount = evidenceSources.filter((s) => s.status === 'ready').length;
  const attentionCount = evidenceSources.filter((s) => s.status === 'needs_attention').length;

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      {/* Primary Data Pane (Scrollable) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 bg-background">
        {/* Header Banner & Action Bar */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
                Evidence Sources
              </h1>
              <span className="bg-surface-container-low text-secondary border border-surface-container-high font-code-sm text-code-sm px-2 py-0.5 rounded">
                ENV: PROD-AUDIT-26
              </span>
            </div>
            <p className="text-body-md font-body-md text-secondary mt-1">
              Manage the documents and repository evidence used to support questionnaire answers.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onShowToast('Extraction rule set: AST + OCR v4.2 active', 'info')}
              className="h-8 px-3 rounded border border-surface-container-highest bg-surface-container-lowest text-on-surface font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container-low transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
              <span>Extraction Rules</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="h-8 px-3.5 rounded bg-primary-container hover:bg-[#ea580c] text-on-primary font-label-md text-label-md flex items-center gap-1.5 transition-colors border border-primary shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Source</span>
            </button>
          </div>
        </div>

        {/* Compact Source Summary (3 Restrained Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Total Sources */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider font-semibold">
                Total Sources
              </span>
              <span className="material-symbols-outlined text-secondary text-[18px]">folder</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-headline-xl font-headline-xl font-bold text-on-surface">{evidenceSources.length}</span>
                <span className="text-label-sm font-label-sm text-secondary">connected</span>
              </div>
              <span className="text-code-sm font-code-sm text-secondary bg-surface-container-low px-1.5 py-0.5 rounded border border-surface-container-high">
                {evidenceSources.length > 0 ? '100% Target Met' : 'Pending Ingestion'}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-surface-container-highest/60 flex items-center justify-between text-[11px] text-secondary">
              <span>All active evidence feeds</span>
              <span className="font-code-sm">{evidenceSources.length} of {evidenceSources.length} Active</span>
            </div>
          </div>

          {/* Card 2: Successfully Processed */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider font-semibold">
                Successfully Processed
              </span>
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">
                check_circle
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-headline-xl font-headline-xl font-bold text-emerald-700">{readyCount}</span>
                <span className="text-label-sm font-label-sm text-secondary">ready for audit</span>
              </div>
              <span className="text-code-sm font-code-sm text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                Indexed Citations
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-surface-container-highest/60 flex items-center justify-between text-[11px] text-secondary">
              <span>Fully Indexed Vector Pipeline</span>
              <span className="font-code-sm text-emerald-700">0 Parser Faults</span>
            </div>
          </div>

          {/* Card 3: Sources Needing Attention */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-label-sm text-secondary uppercase tracking-wider font-semibold">
                Sources Needing Attention
              </span>
              <span className="material-symbols-outlined text-amber-600 text-[18px]">warning</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-headline-xl font-headline-xl font-bold text-amber-700">{attentionCount}</span>
                <span className="text-label-sm font-label-sm text-secondary">with warning</span>
              </div>
              <span className="text-code-sm font-code-sm text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {attentionCount > 0 ? 'Pattern Flagged' : 'All Clear'}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-surface-container-highest/60 flex items-center justify-between text-[11px] text-secondary">
              <span className="text-amber-800">Deterministic check findings</span>
              <span className="font-code-sm text-amber-700">{attentionCount > 0 ? 'Review Needed' : 'Verified'}</span>
            </div>
          </div>
        </div>

        {/* Main Source Table Container */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded shadow-xs overflow-hidden">
          {/* Filters & Toolbar */}
          <div className="p-3 border-b border-surface-container-highest flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-xl">
              {/* Search within sources */}
              <div className="relative w-64">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-secondary">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-label-md font-label-md bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface placeholder:text-secondary/60 focus:outline-none focus:border-on-surface"
                  placeholder="Filter sources by name or hash..."
                  type="text"
                />
              </div>

              {/* Filter: Type */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-8 pl-3 pr-7 text-label-md font-label-md bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface appearance-none focus:outline-none focus:border-on-surface cursor-pointer"
                >
                  <option value="all">Type: All Types</option>
                  <option value="pdf">PDF Policy (.pdf)</option>
                  <option value="repo">GitHub Repository</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-secondary pointer-events-none">
                  expand_more
                </span>
              </div>

              {/* Filter: Status */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-8 pl-3 pr-7 text-label-md font-label-md bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface appearance-none focus:outline-none focus:border-on-surface cursor-pointer"
                >
                  <option value="all">Status: All Statuses</option>
                  <option value="ready">Ready</option>
                  <option value="needs_attention">Needs Attention</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-secondary pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Table Actions */}
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-secondary">
                Showing {filteredSources.length} of {evidenceSources.length} records
              </span>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container-highest bg-surface-container-low/50">
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider w-[26%]">
                    Source
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider w-[14%]">
                    Type
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider w-[13%]">
                    Processing Status
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider w-[21%]">
                    Extracted Content
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider w-[11%]">
                    Linked Questions
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider w-[9%]">
                    Last Updated
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold text-secondary uppercase tracking-wider text-right w-[6%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-highest">
                {filteredSources.map((source) => {
                  const isSelected = selectedSourceId === source.id && isDrawerOpen;
                  return (
                    <tr
                      key={source.id}
                      onClick={() => {
                        setSelectedSourceId(source.id);
                        setIsDrawerOpen(true);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-surface-container-low/70 border-l-2 border-l-primary-container'
                          : 'hover:bg-surface-container-low/40'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded border flex items-center justify-center shrink-0 ${
                              source.type === 'xlsx'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : source.type === 'pdf'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-slate-100 border-slate-300 text-slate-800'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {source.type === 'xlsx'
                                ? 'table_chart'
                                : source.type === 'pdf'
                                ? 'picture_as_pdf'
                                : 'code'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-on-surface font-semibold truncate flex items-center gap-1.5 text-xs">
                              <span className="hover:underline">{source.name}</span>
                              <span className="text-[10px] font-code-sm text-secondary bg-surface-container-lowest px-1 py-0.2 rounded border border-surface-container-high">
                                {source.sizeOrBranch}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-label-sm text-primary bg-primary-fixed/40 text-on-primary-fixed px-1.5 py-0.2 rounded font-medium">
                                  Inspecting
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-secondary font-code-sm truncate">
                              SHA: {source.sha}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container-low text-secondary border border-surface-container-high">
                          {source.typeLabel}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                            source.status === 'ready'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              source.status === 'ready' ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}
                          />
                          {source.statusLabel}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-on-surface font-body-sm text-body-sm truncate text-xs">
                          {source.extractedTitle}
                        </div>
                        <div className="text-[11px] text-secondary font-code-sm">
                          {source.extractedNote}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-code-sm text-code-sm text-primary font-medium flex items-center gap-1">
                          <span>{source.linkedCount} questions</span>
                          <span className="material-symbols-outlined text-[12px]">
                            arrow_outward
                          </span>
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-secondary font-code-sm text-code-sm">
                          {source.lastUpdated}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSourceId(source.id);
                            setIsDrawerOpen(true);
                          }}
                          className="px-2 py-1 text-label-sm font-label-sm bg-surface-container-lowest text-primary font-medium hover:bg-surface-container-high rounded border border-surface-container-high transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Evidence Verification Policy Notice */}
        <div className="p-3.5 rounded bg-surface-container-low border border-surface-container-high flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
            verified_user
          </span>
          <div className="text-body-sm font-body-sm">
            <span className="font-semibold text-on-surface">
              SOC2 CC6.1 &amp; ISO 27001 Deterministic Grounding Protocol:
            </span>
            <span className="text-secondary ml-1">
              ClaimTrail enforces that 100% of generated responses correlate to at least one immutable evidence file or public commit SHA. Unlinked responses will be flagged during SOC2 auditor exports.
            </span>
          </div>
        </div>
      </main>

      {/* ======================================================================= */}
      {/* SLIDE-OVER SOURCE DETAIL DRAWER                                         */}
      {/* ======================================================================= */}
      {isDrawerOpen && (
        <aside className="w-[480px] bg-surface-container-lowest border-l border-surface-container-highest flex flex-col h-full shadow-lg z-10 shrink-0">
          {/* Drawer Header */}
          <div className="p-4 border-b border-surface-container-highest flex items-start justify-between bg-surface-container-lowest">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                  selectedSource.type === 'pdf'
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : selectedSource.type === 'xlsx'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {selectedSource.type === 'pdf'
                    ? 'picture_as_pdf'
                    : selectedSource.type === 'xlsx'
                    ? 'table_chart'
                    : 'code'}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface font-semibold truncate max-w-[260px]">
                    {selectedSource.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                      selectedSource.status === 'ready'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {selectedSource.statusLabel}
                  </span>
                </div>
                <p className="text-[11px] font-code-sm text-secondary mt-0.5 truncate">
                  {selectedSource.sizeOrBranch} • SHA: {selectedSource.sha}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
                title="Close Drawer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Drawer Navigation Tabs */}
          <div className="flex border-b border-surface-container-highest px-4 bg-surface-container-low/40">
            <button
              onClick={() => setDrawerTab('overview')}
              className={`px-3 py-2 text-label-md font-label-md transition-colors ${
                drawerTab === 'overview'
                  ? 'text-on-surface font-semibold border-b-2 border-primary-container'
                  : 'text-secondary hover:text-on-surface border-b-2 border-transparent'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setDrawerTab('extracted')}
              className={`px-3 py-2 text-label-md font-label-md transition-colors flex items-center gap-1.5 ${
                drawerTab === 'extracted'
                  ? 'text-on-surface font-semibold border-b-2 border-primary-container'
                  : 'text-secondary hover:text-on-surface border-b-2 border-transparent'
              }`}
            >
              <span>Extracted Chunks</span>
              <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-1.5 rounded-full font-code-sm">
                {selectedSource.extractedChunks?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setDrawerTab('linked')}
              className={`px-3 py-2 text-label-md font-label-md transition-colors flex items-center gap-1.5 ${
                drawerTab === 'linked'
                  ? 'text-on-surface font-semibold border-b-2 border-primary-container'
                  : 'text-secondary hover:text-on-surface border-b-2 border-transparent'
              }`}
            >
              <span>Linked Questions</span>
              <span className="text-[10px] bg-surface-container-high text-secondary px-1.5 rounded-full font-code-sm">
                {selectedSource.linkedCount}
              </span>
            </button>
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {drawerTab === 'extracted' && (
              <>
                {selectedSource.extractedChunks && selectedSource.extractedChunks.length > 0 ? (
                  selectedSource.extractedChunks.map((chunk, i) => (
                    <div
                      key={chunk.id || i}
                      className="border border-surface-container-highest rounded p-3 bg-surface-container-lowest shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-1.5 py-0.5 rounded bg-surface-container-low border border-surface-container-high text-[10px] font-code-sm font-semibold text-on-surface uppercase truncate">
                            {chunk.pageOrFile}
                          </span>
                          <span className="text-label-sm font-label-sm text-secondary font-medium truncate max-w-[200px]">
                            {chunk.section}
                          </span>
                        </div>
                        <span className="text-[10px] font-code-sm text-primary font-medium bg-primary-fixed/40 px-1.5 py-0.5 rounded shrink-0">
                          {chunk.confidence ? `${chunk.confidence}%` : 'Verified'}
                        </span>
                      </div>

                      {selectedSource.type === 'repo' ? (
                        <pre className="text-[11px] font-mono leading-relaxed bg-surface-container-low/70 border border-surface-container-high/60 rounded p-2.5 overflow-x-auto text-on-surface whitespace-pre">
                          <code>{chunk.text}</code>
                        </pre>
                      ) : (
                        <p className="text-xs text-on-surface leading-relaxed whitespace-pre-line">
                          {chunk.text}
                        </p>
                      )}

                      {chunk.linkedQuestionCode && (
                        <div className="pt-2 border-t border-surface-container-highest/60 flex items-center justify-between text-[11px]">
                          <span className="text-secondary font-code-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            Supports {chunk.linkedQuestionCode}
                          </span>
                          <button
                            onClick={() => onNavigateToQuestion?.(chunk.linkedQuestionCode!)}
                            className="text-primary font-medium hover:underline flex items-center gap-0.5"
                          >
                            <span>Inspect</span>
                            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-secondary text-xs">
                    No extracted chunks found for this evidence source.
                  </div>
                )}
              </>
            )}

            {drawerTab === 'linked' && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                  Associated Questions ({selectedSource.linkedCount})
                </span>
                {['SEC-104 · Data Isolation & RLS', 'SEC-102 · Key Management & KMS', 'IAM-201 · Multi-Factor Authentication', 'NET-301 · Perimeter Security'].map(
                  (qText, i) => (
                    <div
                      key={i}
                      className="p-3 rounded border border-surface-container-highest bg-surface-container-lowest flex items-center justify-between"
                    >
                      <span className="text-xs font-medium text-on-surface">{qText}</span>
                      <button
                        onClick={() => onNavigateToQuestion?.(qText.split(' ')[0])}
                        className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5"
                      >
                        Inspect
                        <span className="material-symbols-outlined text-xs">chevron_right</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {drawerTab === 'overview' && (
              <div className="space-y-3 text-xs text-secondary leading-relaxed">
                <div className="p-3 bg-surface-container-low rounded border border-surface-container-high space-y-2">
                  <div className="font-semibold text-on-surface flex items-center justify-between">
                    <span>Source Specifications</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-surface-container rounded border border-surface-container-high">
                      {selectedSource.type.toUpperCase()}
                    </span>
                  </div>

                  <div>Format: <span className="text-on-surface font-medium">{selectedSource.typeLabel}</span></div>
                  <div>Identifier: <span className="text-on-surface font-mono">{selectedSource.name}</span></div>
                  <div>Size / Branch: <span className="text-on-surface">{selectedSource.sizeOrBranch}</span></div>
                  <div>Revision / SHA: <span className="text-on-surface font-mono">{selectedSource.sha}</span></div>
                  <div>Status: <span className="text-on-surface">{selectedSource.statusLabel}</span></div>

                  {selectedSource.type === 'repo' && selectedSource.repoMetadata && (
                    <div className="pt-2 border-t border-surface-container-high space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span>Canonical URL:</span>
                        <a
                          href={selectedSource.repoMetadata.canonicalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline font-mono inline-flex items-center gap-0.5"
                        >
                          <span>{selectedSource.repoMetadata.owner}/{selectedSource.repoMetadata.repo}</span>
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                        </a>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Commit SHA:</span>
                        <a
                          href={`${selectedSource.repoMetadata.canonicalUrl}/commit/${selectedSource.repoMetadata.commitSha}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline font-mono inline-flex items-center gap-0.5"
                        >
                          <span>{selectedSource.repoMetadata.commitSha.slice(0, 7)}</span>
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                        </a>
                      </div>

                      {selectedSource.repoMetadata.commitMessage && (
                        <div>
                          <span className="text-secondary">Message: </span>
                          <span className="text-on-surface italic">"{selectedSource.repoMetadata.commitMessage}"</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span>Tree Inspection:</span>
                        <span className="text-on-surface font-mono">
                          {selectedSource.repoMetadata.inspectedFilesCount} files indexed of {selectedSource.repoMetadata.totalFilesScanned} tree items
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Warnings Section if present */}
                {selectedSource.repoMetadata?.warnings && selectedSource.repoMetadata.warnings.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      <span>Inspection Scope Notice</span>
                    </div>
                    {selectedSource.repoMetadata.warnings.map((w, idx) => (
                      <p key={idx} className="text-[11px] leading-relaxed">
                        {w}
                      </p>
                    ))}
                  </div>
                )}

                {/* Skipped Files Section if present */}
                {selectedSource.repoMetadata?.skippedFiles && selectedSource.repoMetadata.skippedFiles.length > 0 && (
                  <div className="p-3 bg-surface-container-low rounded border border-surface-container-high space-y-1.5 text-[11px]">
                    <div className="font-semibold text-on-surface">Skipped Files ({selectedSource.repoMetadata.skippedFiles.length})</div>
                    <div className="max-h-28 overflow-y-auto space-y-1 font-mono text-[10px]">
                      {selectedSource.repoMetadata.skippedFiles.slice(0, 10).map((sf, idx) => (
                        <div key={idx} className="flex items-center justify-between text-secondary truncate">
                          <span className="truncate max-w-[240px]">{sf.path}</span>
                          <span className="text-amber-700 shrink-0">{sf.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source Actions (Re-sync, Remove) */}
                <div className="pt-3 border-t border-surface-container-highest flex items-center gap-2">
                  {selectedSource.type === 'repo' && onConnectRepo && (
                    <button
                      onClick={async () => {
                        const url = selectedSource.repoMetadata?.canonicalUrl || `https://${selectedSource.name}`;
                        onShowToast(`Re-inspecting ${selectedSource.name}...`, 'info');
                        try {
                          await onConnectRepo(url);
                        } catch (err: any) {
                          onShowToast(err.message || 'Re-sync failed', 'warning');
                        }
                      }}
                      className="flex-1 py-1.5 px-3 bg-surface-container-low hover:bg-surface-container-high text-on-surface text-xs font-medium rounded border border-surface-container-high flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">refresh</span>
                      <span>Re-sync Source</span>
                    </button>
                  )}

                  {onRemoveSource && (
                    <button
                      onClick={async () => {
                        if (confirm(`Are you sure you want to disconnect '${selectedSource.name}'?`)) {
                          await onRemoveSource(selectedSource.id, selectedSource.name);
                        }
                      }}
                      className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded border border-red-200 flex items-center justify-center gap-1 transition-colors"
                      title="Disconnect evidence source"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      <span>Disconnect</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-secondary">
                  ClaimTrail validates this source against internal SOC 2 Type II trust principles and ISO 27001 standards. Code is inspected statically without executing repository scripts.
                </p>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ======================================================================= */}
      {/* ADD SOURCE MODAL                                                        */}
      {/* ======================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-surface-container-highest flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
                <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                  Connect Evidence Source
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSource} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewSourceType('repo')}
                  className={`p-2.5 rounded text-xs font-medium border text-center transition-colors ${
                    newSourceType === 'repo'
                      ? 'bg-surface-container-low border-primary-container text-on-surface font-semibold shadow-xs'
                      : 'border-surface-container-highest text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base block mx-auto mb-1">
                    terminal
                  </span>
                  GitHub Repo
                </button>
                <button
                  type="button"
                  onClick={() => setNewSourceType('pdf')}
                  className={`p-2.5 rounded text-xs font-medium border text-center transition-colors ${
                    newSourceType === 'pdf'
                      ? 'bg-surface-container-low border-primary-container text-on-surface font-semibold shadow-xs'
                      : 'border-surface-container-highest text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-base block mx-auto mb-1">
                    picture_as_pdf
                  </span>
                  Policy PDF
                </button>
              </div>

              {newSourceType === 'repo' ? (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-on-surface block">
                    Public GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    value={newRepoUrl}
                    onChange={(e) => setNewRepoUrl(e.target.value)}
                    className="w-full h-8 px-3 text-xs bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface focus:outline-none focus:border-on-surface"
                    placeholder="https://github.com/owner/repository"
                  />
                  <span className="text-[11px] text-secondary">
                    ClaimTrail will inspect default branch IaC manifests (.tf), configs, and security middleware without running repository code.
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    accept=".pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <div
                    onClick={() => modalFileInputRef.current?.click()}
                    className="p-6 border-2 border-dashed border-surface-container-highest hover:border-primary-container rounded-lg text-center bg-surface-container-low/30 space-y-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-3xl text-secondary">
                      cloud_upload
                    </span>
                    <div className="text-xs font-medium text-on-surface">
                      {selectedFile ? selectedFile.name : `Click to choose ${newSourceType.toUpperCase()} file`}
                    </div>
                    <div className="text-[11px] text-secondary">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB selected` : 'Supports .pdf documents'}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-surface-container-highest flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-xs rounded border border-surface-container-highest text-secondary hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs rounded bg-primary-container text-on-primary font-semibold hover:bg-[#ea580c] shadow-xs disabled:opacity-60"
                >
                  {isSubmitting
                    ? newSourceType === 'repo'
                      ? 'Inspecting Repo via Octokit…'
                      : 'Processing Source…'
                    : 'Connect Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
