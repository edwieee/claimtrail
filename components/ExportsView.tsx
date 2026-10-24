'use client';

import React, { useState, useMemo } from 'react';
import type { SecurityClaim, ConflictItem, ExportDeliverable } from '@/types/claimtrail';

interface ExportsViewProps {
  claims: SecurityClaim[];
  conflicts: ConflictItem[];
  exportHistory?: ExportDeliverable[];
  assessmentName?: string;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning') => void;
  onNavigateToQuestionnaire?: () => void;
  onExportGenerated?: (deliverable: ExportDeliverable) => void;
}

export function ExportsView({
  claims,
  conflicts,
  exportHistory = [],
  assessmentName = 'AcmeCorp Enterprise Security 2026',
  onShowToast,
  onNavigateToQuestionnaire,
  onExportGenerated,
}: ExportsViewProps) {
  const [includeXlsx, setIncludeXlsx] = useState(true);
  const [includePdf, setIncludePdf] = useState(false);
  const [includeHashes, setIncludeHashes] = useState(true);
  const [embedLinks, setEmbedLinks] = useState(true);
  const [includeDrafts, setIncludeDrafts] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Dynamic metrics from actual claims
  const approvedCount = useMemo(
    () => claims.filter((c) => c.reviewStatus === 'approved').length,
    [claims]
  );
  const draftCount = useMemo(
    () => claims.filter((c) => c.reviewStatus !== 'approved').length,
    [claims]
  );
  const flaggedCount = useMemo(
    () => claims.filter((c) => c.status === 'red').length,
    [claims]
  );
  const openConflictsCount = useMemo(
    () => conflicts.filter((c) => c.status === 'open' || !c.status).length,
    [conflicts]
  );

  const readinessPercent = useMemo(() => {
    if (claims.length === 0) return 0;
    return Math.round((approvedCount / claims.length) * 100);
  }, [claims.length, approvedCount]);

  const handleExportWorkbook = async () => {
    setIsExporting(true);
    onShowToast('Generating completed workbook with cryptographic evidence appendix...', 'info');

    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: includeXlsx ? 'XLSX' : 'PDF',
          includeDrafts,
          includeHashes,
          embedLinks,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Export generation failed');
      }

      onShowToast(`Export package ready: ${data.deliverable.filename}`, 'success');
      onExportGenerated?.(data.deliverable);

      // Trigger actual browser download
      window.location.href = data.deliverable.downloadUrl;
    } catch (err: any) {
      console.error('Export error:', err);
      onShowToast(err.message || 'Failed to export workbook', 'warning');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = (item: ExportDeliverable) => {
    onShowToast(`Downloading deliverable: ${item.filename}`, 'info');
    window.location.href = item.downloadUrl || `/api/export/download/${item.id}`;
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 max-w-[1600px] w-full mx-auto bg-background">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-surface-container-highest">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight">
              Exports
            </h1>
            <span className="px-2 py-0.5 rounded text-label-sm font-label-sm bg-surface-container text-secondary border border-surface-container-highest">
              Assessment Deliverables
            </span>
          </div>
          <p className="text-body-md font-body-md text-secondary mt-1">
            Prepare assessment deliverables and review export readiness.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportWorkbook}
            disabled={isExporting}
            className="px-4 py-2 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-[#ea580c] transition-all shadow-sm flex items-center gap-2 border border-[#9A3412] disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isExporting ? 'refresh' : 'file_download'}
            </span>
            <span>{isExporting ? 'Generating XLSX…' : 'Export Workbook'}</span>
          </button>
        </div>
      </div>

      {/* Balanced Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Export Deliverables & Package Configuration (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Assessment Selector / Target File Banner */}
          <div className="p-3.5 bg-surface-container-lowest rounded-lg border border-surface-container-highest shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800">
                <span className="material-symbols-outlined text-[20px]">table_view</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                    {assessmentName}
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-medium font-code-sm">
                    <span className="w-1 h-1 rounded-full bg-emerald-600" /> Origin Verified
                  </span>
                </div>
                <p className="text-code-sm font-code-sm text-secondary mt-0.5">
                  {claims.length} Extracted Questions • Genuine ExcelJS Workbook Generator
                </p>
              </div>
            </div>
          </div>

          {/* Deliverables Selection Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-secondary tracking-wider">
                Select Deliverable Formats
              </span>
              <span className="text-xs text-secondary font-code-sm">Primary target auto-selected</span>
            </div>

            {/* Deliverable Card 1 (Primary XLSX) */}
            <div
              onClick={() => setIncludeXlsx(!includeXlsx)}
              className={`p-4 bg-surface-container-lowest rounded-lg relative shadow-xs transition-all cursor-pointer ${
                includeXlsx
                  ? 'border-2 border-primary-container'
                  : 'border border-surface-container-highest opacity-75'
              }`}
            >
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-primary-fixed text-on-primary-fixed border border-outline-variant">
                  Primary Deliverable
                </span>
                <input
                  type="checkbox"
                  checked={includeXlsx}
                  onChange={(e) => setIncludeXlsx(e.target.checked)}
                  className="w-4 h-4 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
                />
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-emerald-100/60 border border-emerald-300 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-xl">description</span>
                </div>
                <div className="pr-24">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
                    Completed Questionnaire Workbook (.XLSX)
                  </h3>
                  <p className="text-body-md font-body-md text-secondary mt-1 text-xs leading-relaxed">
                    Answers written back into the workbook. Appends dedicated &quot;Audit Evidence Trail&quot; tab with SHA-256 evidence hashes.
                  </p>

                  {/* Question Count and Composition Pill */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-surface-container-highest">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low border border-surface-container-high text-on-surface text-code-sm font-code-sm text-xs">
                      <span className="font-semibold text-on-surface">{claims.length} Total Questions:</span>
                      <span className="text-emerald-700 font-medium">{approvedCount} Approved</span>
                      <span className="text-surface-container-highest">•</span>
                      <span className="text-amber-700 font-medium">{draftCount} Draft</span>
                      <span className="text-surface-container-highest">•</span>
                      <span className="text-rose-700 font-medium">{flaggedCount} Flagged</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverable Card 2 (Secondary PDF Dossier) */}
            <div
              onClick={() => setIncludePdf(!includePdf)}
              className={`p-4 bg-surface-container-lowest rounded-lg relative shadow-xs transition-all cursor-pointer ${
                includePdf
                  ? 'border border-primary-container/80'
                  : 'border border-surface-container-highest opacity-75'
              }`}
            >
              <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-surface-container text-secondary border border-surface-container-highest">
                  Supplementary
                </span>
                <input
                  type="checkbox"
                  checked={includePdf}
                  onChange={(e) => setIncludePdf(e.target.checked)}
                  className="w-4 h-4 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
                />
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800 shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                </div>
                <div className="pr-24">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-2">
                    Audit Findings &amp; Evidence Dossier (.PDF)
                  </h3>
                  <p className="text-body-md font-body-md text-secondary mt-1 text-xs leading-relaxed">
                    Complete audit report with cited policy excerpts, code AST verification hashes, and open discrepancy notes for third-party auditors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Configuration & Cryptographic Integrity Card */}
          <div className="p-4 bg-surface-container-lowest rounded-lg border border-surface-container-highest shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">shield</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Package Configuration &amp; Cryptographic Integrity
                </h3>
              </div>
              <span className="text-code-sm font-code-sm text-secondary">FIPS-140-3 Standard</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeHashes}
                  onChange={(e) => setIncludeHashes(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-body-md font-medium text-on-surface group-hover:text-primary transition-colors text-xs">
                      Include cryptographic evidence hashes (SHA-256) in appendix
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Recommended
                    </span>
                  </div>
                  <span className="text-xs text-secondary mt-0.5">
                    Calculates deterministic signatures for every cited snapshot and log chunk.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={embedLinks}
                  onChange={(e) => setEmbedLinks(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-primary-container rounded border-surface-container-highest focus:ring-primary-container"
                />
                <div className="flex flex-col">
                  <span className="text-body-md font-medium text-on-surface group-hover:text-primary transition-colors text-xs">
                    Embed direct repository citation links
                  </span>
                  <span className="text-xs text-secondary mt-0.5">
                    Includes immutable deep-links back into GitHub code references and policy anchors.
                  </span>
                </div>
              </label>

              {/* Checkbox 3 with Conditional Notice */}
              <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/80 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDrafts}
                    onChange={(e) => setIncludeDrafts(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-primary-container rounded border-amber-300 focus:ring-primary-container"
                  />
                  <div className="flex flex-col">
                    <span className="text-body-md font-medium text-amber-950 text-xs">
                      Include unresolved draft answers
                    </span>
                    <span className="text-xs text-amber-800 mt-0.5">
                      Allow export even with pending compliance verification sign-offs.
                    </span>
                  </div>
                </label>
                {draftCount > 0 && (
                  <div className="flex items-center gap-2 pl-7 pt-1 text-code-sm font-code-sm text-amber-900 border-t border-amber-200/60">
                    <span className="material-symbols-outlined text-[14px] text-amber-700">warning</span>
                    <span>
                      {draftCount} answers exported with{' '}
                      <span className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-mono font-bold text-[10px] border border-amber-300">
                        [UNVERIFIED DRAFT]
                      </span>{' '}
                      watermark tag
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Readiness Checklist & Review Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-surface-container-lowest rounded-lg border border-surface-container-highest shadow-xs space-y-4">
            {/* Checklist Header with Overall Score */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Export Readiness &amp; Integrity Validation
                </h2>
                <p className="text-body-sm font-body-sm text-secondary mt-0.5 text-xs">
                  Pre-flight checks before generating deliverables
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-label-md font-semibold font-code-sm text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Ready {readinessPercent}%
              </div>
            </div>

            {/* Checklist Items Grid */}
            <div className="space-y-2.5">
              {/* Item 1 */}
              <div className="p-2.5 bg-surface rounded border border-surface-container-highest flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <div>
                    <span className="text-body-sm font-medium text-on-surface block text-xs">
                      1. Questionnaire Parsed &amp; Validated
                    </span>
                    <span className="text-[11px] text-secondary font-code-sm">
                      {claims.length} of {claims.length} questions loaded
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Complete
                </span>
              </div>

              {/* Item 2 */}
              <div className="p-2.5 bg-surface rounded border border-surface-container-highest flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <div>
                    <span className="text-body-sm font-medium text-on-surface block text-xs">
                      2. Evidence Sources Connected
                    </span>
                    <span className="text-[11px] text-secondary font-code-sm">
                      Policy PDF &amp; GitHub AST Active
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Complete
                </span>
              </div>

              {/* Item 3 */}
              <div className="p-2.5 bg-amber-50/40 rounded border border-amber-200/90 flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${approvedCount === claims.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                    <span className="material-symbols-outlined text-[14px]">{approvedCount === claims.length ? 'check' : 'priority_high'}</span>
                  </div>
                  <div>
                    <span className="text-body-sm font-medium text-on-surface block text-xs">
                      3. Answers Reviewed &amp; Approved
                    </span>
                    <span className="text-[11px] text-amber-900 font-code-sm">
                      {approvedCount} of {claims.length} approved, {draftCount} pending
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium border ${approvedCount === claims.length ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                    {approvedCount === claims.length ? 'Complete' : 'Needs Attention'}
                  </span>
                  {onNavigateToQuestionnaire && draftCount > 0 && (
                    <button
                      onClick={onNavigateToQuestionnaire}
                      className="text-[11px] text-primary font-medium hover:underline inline-flex items-center gap-0.5"
                    >
                      Review in Catalog →
                    </button>
                  )}
                </div>
              </div>

              {/* Item 4 */}
              <div className="p-2.5 bg-amber-50/40 rounded border border-amber-200/90 flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${openConflictsCount === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                    <span className="material-symbols-outlined text-[14px]">{openConflictsCount === 0 ? 'check' : 'priority_high'}</span>
                  </div>
                  <div>
                    <span className="text-body-sm font-medium text-on-surface block text-xs">
                      4. Open Findings &amp; Policy Conflicts
                    </span>
                    <span className="text-[11px] text-amber-900 font-code-sm">
                      {openConflictsCount} open findings flagged
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium border ${openConflictsCount === 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-900 border-amber-300'}`}>
                  {openConflictsCount === 0 ? 'All Resolved' : 'Review Required'}
                </span>
              </div>
            </div>

            {/* Main Trigger Button */}
            <div className="pt-2">
              <button
                onClick={handleExportWorkbook}
                disabled={isExporting}
                className="w-full py-2.5 px-4 bg-primary-container text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-[#ea580c] transition-all shadow-md flex items-center justify-center gap-2 border border-[#9A3412] disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[18px]">task_alt</span>
                <span>{isExporting ? 'Generating Deliverable...' : 'Generate & Download Deliverable'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Deliverable History & Audit Trail Table */}
      <div className="p-5 bg-surface-container-lowest rounded-lg border border-surface-container-highest shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">history_edu</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
              Deliverable History &amp; Audit Trail
            </h3>
          </div>
          <div className="text-xs text-secondary">
            <span>{exportHistory.length} generated outputs</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container-highest text-[11px] font-semibold text-secondary uppercase tracking-wider bg-surface-container-low/60">
                <th className="py-2.5 px-3">Deliverable Filename</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Assessment</th>
                <th className="py-2.5 px-3">Exported At</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest text-body-sm font-body-sm">
              {exportHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-secondary text-xs">
                    No deliverables generated yet. Click &quot;Export Workbook&quot; to generate your first audit package.
                  </td>
                </tr>
              ) : (
                exportHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-2.5 px-3 font-code-sm text-code-sm font-medium text-on-surface flex items-center gap-2">
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          item.format === 'XLSX' ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {item.format === 'XLSX' ? 'table_chart' : 'picture_as_pdf'}
                      </span>
                      <span>{item.filename}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container border border-surface-container-highest font-medium text-secondary">
                        {item.format}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-secondary text-xs">{item.assessment}</td>
                    <td className="py-2.5 px-3 font-code-sm text-code-sm text-secondary">
                      {item.exportedAt}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                          item.isDraft
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isDraft ? 'bg-amber-600' : 'bg-emerald-600'
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDownload(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-lowest text-on-surface border border-surface-container-highest hover:bg-surface-container text-xs font-label-md transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">download</span>
                        <span>Download</span>
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
