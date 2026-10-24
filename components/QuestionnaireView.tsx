'use client';

import React, { useState, useMemo, useRef } from 'react';
import type { SecurityClaim, EvidenceMapping, EvidenceStatus } from '@/types/claimtrail';

interface QuestionnaireViewProps {
  claims: SecurityClaim[];
  evidenceMappings?: Record<string, EvidenceMapping>;
  targetFilename?: string;
  onSelectQuestionForReview: (claim: SecurityClaim) => void;
  onOpenReviewWorkspace: () => void;
  onUploadQuestionnaire?: (file: File) => Promise<void>;
  onLoadSample?: () => Promise<void>;
}

export function QuestionnaireView({
  claims,
  evidenceMappings = {},
  targetFilename = 'AcmeCorp-Security-Assessment-2026.xlsx',
  onSelectQuestionForReview,
  onOpenReviewWorkspace,
  onUploadQuestionnaire,
  onLoadSample,
}: QuestionnaireViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | EvidenceStatus>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique domains
  const domains = useMemo(() => {
    return ['all', ...Array.from(new Set(claims.map((c) => c.category)))];
  }, [claims]);

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      if (domainFilter !== 'all' && claim.category !== domainFilter) return false;
      if (statusFilter !== 'all' && claim.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          claim.code.toLowerCase().includes(q) ||
          claim.question.toLowerCase().includes(q) ||
          claim.category.toLowerCase().includes(q) ||
          claim.vendorDraftAnswer.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [claims, domainFilter, statusFilter, searchQuery]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setUploadError('Please select a valid .xlsx spreadsheet file.');
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    try {
      if (onUploadQuestionnaire) {
        await onUploadQuestionnaire(file);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload spreadsheet.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setUploadError('Please drop a valid .xlsx spreadsheet file.');
      return;
    }
    setUploadError(null);
    setIsUploading(true);
    try {
      if (onUploadQuestionnaire) {
        await onUploadQuestionnaire(file);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload spreadsheet.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 max-w-[1600px] w-full mx-auto bg-background">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-surface-container-highest">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight">
              Questionnaire Catalog
            </h1>
            <span className="px-2 py-0.5 rounded text-label-sm font-label-sm bg-surface-container text-secondary border border-surface-container-highest">
              {claims.length} Extracted Items
            </span>
          </div>
          <p className="text-body-md font-body-md text-secondary mt-1">
            Browse and review individual security questionnaire claims mapped to verifiable policy &amp; repository evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onLoadSample && (
            <button
              onClick={onLoadSample}
              className="px-3 py-2 bg-surface-container-lowest text-on-surface border border-surface-container-highest rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-all shadow-xs flex items-center gap-1.5"
              title="Reset and load sample assessment"
            >
              <span className="material-symbols-outlined text-[17px] text-secondary">restart_alt</span>
              <span>Load Sample Assessment</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3.5 py-2 bg-surface-container-lowest text-on-surface border border-surface-container-highest rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-all shadow-xs flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">upload_file</span>
            <span>{isUploading ? 'Parsing XLSX...' : 'Upload New XLSX'}</span>
          </button>

          <button
            onClick={onOpenReviewWorkspace}
            className="px-4 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-[#ea580c] transition-all shadow-sm flex items-center gap-2 border border-[#9A3412]"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Open Review Workspace</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError(null)} className="text-secondary hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Target File Info Card & Drag-Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="p-4 bg-surface-container-lowest rounded-lg border border-dashed border-surface-container-highest hover:border-primary-container/80 transition-colors shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800">
            <span className="material-symbols-outlined text-xl">table_chart</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                {targetFilename}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-medium font-code-sm">
                <span className="w-1 h-1 rounded-full bg-emerald-600" /> Parsed &amp; Indexed
              </span>
            </div>
            <p className="text-code-sm font-code-sm text-secondary mt-0.5">
              {claims.length} Questions loaded • Verified against SHA-256 Checksum • Drag .xlsx here to replace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-primary font-code-sm bg-surface-container-low px-2.5 py-1 rounded border border-surface-container-high hover:bg-surface-container transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">file_upload</span>
            <span>Replace File</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Toolbar */}
      <div className="p-3 bg-surface-container-lowest rounded-lg border border-surface-container-highest flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center bg-surface p-0.5 rounded border border-surface-container-highest text-label-sm font-label-sm">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'all'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold border border-surface-container-highest'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              All ({claims.length})
            </button>
            <button
              onClick={() => setStatusFilter('green')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'green'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold border border-surface-container-highest'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Supported ({claims.filter((c) => c.status === 'green').length})
            </button>
            <button
              onClick={() => setStatusFilter('amber')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'amber'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold border border-surface-container-highest'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Needs Review ({claims.filter((c) => c.status === 'amber').length})
            </button>
            <button
              onClick={() => setStatusFilter('red')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'red'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold border border-surface-container-highest'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Discrepancies ({claims.filter((c) => c.status === 'red').length})
            </button>
          </div>

          <div className="h-4 w-px bg-surface-container-highest mx-1" />

          {/* Domain Dropdown */}
          <div className="relative">
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="h-8 pl-3 pr-7 text-label-sm font-label-sm bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface appearance-none focus:outline-none cursor-pointer"
            >
              <option value="all">Domain: All Domains</option>
              {domains.filter((d) => d !== 'all').map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] text-secondary pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-secondary">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-label-md font-label-md bg-surface border border-surface-container-highest rounded text-on-surface placeholder:text-secondary/60 focus:outline-none"
            placeholder="Search questions or answers..."
            type="text"
          />
        </div>
      </div>

      {/* Questions Data Table */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container-highest bg-surface-container-low/60 font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                <th className="py-2.5 px-4 font-semibold w-20">Code</th>
                <th className="py-2.5 px-4 font-semibold">Question Title &amp; Synthesized Statement</th>
                <th className="py-2.5 px-4 font-semibold w-36">Domain</th>
                <th className="py-2.5 px-4 font-semibold w-48">Evidence Status</th>
                <th className="py-2.5 px-4 text-right font-semibold w-28">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest font-body-md text-body-md">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-secondary text-sm">
                    No questions found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-4 font-code-sm text-code-sm font-semibold text-primary">
                      {claim.code}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-on-surface group-hover:text-primary transition-colors text-xs block">
                        {claim.question}
                      </span>
                      <p className="text-body-sm font-body-sm text-secondary mt-1 text-xs line-clamp-2 leading-relaxed">
                        {claim.vendorDraftAnswer}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10.5px] text-secondary font-code-sm">
                        <span>Ref: {claim.linePageRef || 'SOC2-CC6.1'}</span>
                        <span>•</span>
                        <span>Source: {claim.primarySourcePath}</span>
                        <span>•</span>
                        <span className="text-primary">
                          {evidenceMappings[claim.id]?.evidence.length || 0} evidence matches
                        </span>
                        {claim.reviewStatus === 'approved' && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">✓ Auditor Approved</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-code-sm text-code-sm bg-surface-container text-on-surface text-xs">
                        {claim.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                          claim.status === 'green'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : claim.status === 'amber'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            claim.status === 'green'
                              ? 'bg-emerald-600'
                              : claim.status === 'amber'
                              ? 'bg-amber-500'
                              : 'bg-red-600'
                          }`}
                        />
                        {claim.status === 'green'
                          ? 'Evidence Supported'
                          : claim.status === 'amber'
                          ? 'Needs Review'
                          : 'Discrepancy Flagged'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectQuestionForReview(claim)}
                        className="px-2.5 py-1 text-label-sm font-label-sm font-medium rounded bg-surface-container-lowest border border-surface-container-highest hover:bg-surface-container-low text-on-surface transition-colors"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
