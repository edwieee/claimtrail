'use client';

import React, { useState } from 'react';
import type { SecurityClaim, ConflictItem, EvidenceSourceFile } from '@/types/claimtrail';
import { deriveMetrics } from '@/data/demoData';

interface OverviewDashboardProps {
  claims: SecurityClaim[];
  conflicts: ConflictItem[];
  sources: EvidenceSourceFile[];
  onSelectQuestionForReview: (claim: SecurityClaim) => void;
  onNavigateToQuestionnaire: () => void;
  onNavigateToSources: () => void;
  onNavigateToFindings: () => void;
  onNewAssessment: () => void;
}

export function OverviewDashboard({
  claims,
  conflicts,
  sources,
  onSelectQuestionForReview,
  onNavigateToQuestionnaire,
  onNavigateToSources,
  onNavigateToFindings,
  onNewAssessment,
}: OverviewDashboardProps) {
  const metrics = deriveMetrics(claims, conflicts);
  const evidenceSourceCount = sources.filter((source) => source.type !== 'xlsx').length;
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-background">
      <div className="max-w-[1520px] mx-auto space-y-6">
        {/* ================================================================= */}
        {/* PAGE HEADER & SEGMENTED CONTROLS                                  */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
              Assessment Overview: AcmeCorp Vendor Review
            </h1>
            <p className="text-body-md font-body-md text-secondary mt-0.5">
              Track questionnaire progress, review supporting evidence, and resolve outstanding findings.
            </p>
          </div>

          <div className="text-right text-label-sm font-label-sm text-secondary">
            <div className="font-semibold text-on-surface">{claims.length} claims in scope</div>
            <div>{evidenceSourceCount} evidence sources connected</div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4-METRIC SUMMARY CARDS ROW                                        */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Total Questions */}
          <div className="bg-surface-container-lowest hairline-border p-4 rounded-xl metric-card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-secondary">
                Total Questions
              </span>
              <div className="w-7 h-7 rounded border border-surface-container-highest flex items-center justify-center bg-surface-container-low text-secondary">
                <span className="material-symbols-outlined text-sm">description</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight">
                {metrics.total}
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-code-sm text-code-sm text-secondary truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                <span className="truncate">Questionnaire Catalog Loaded</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Evidence Supported */}
          <div className="bg-surface-container-lowest hairline-border p-4 rounded-xl metric-card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-secondary">
                Evidence Supported
              </span>
              <div className="w-7 h-7 rounded border border-surface-container-highest flex items-center justify-center bg-surface-container-low text-emerald-600">
                <span className="material-symbols-outlined text-sm">check_circle</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight">
                  {metrics.supported} <span className="text-headline-sm font-headline-sm text-secondary font-normal">/ {metrics.total}</span>
                </span>
                <span className="text-label-sm font-label-sm font-semibold text-emerald-800 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  {metrics.total > 0 ? Math.round((metrics.supported / metrics.total) * 100) : 0}%
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 font-body-sm text-body-sm text-emerald-700 font-medium">
                <span className="material-symbols-outlined text-xs">arrow_upward</span>
                <span>Verified by evidence check</span>
              </div>
            </div>
          </div>

          {/* Metric 3: Needs Review */}
          <div className="bg-surface-container-lowest hairline-border p-4 rounded-xl metric-card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-secondary">
                Needs Review
              </span>
              <div className="w-7 h-7 rounded border border-surface-container-highest flex items-center justify-center bg-surface-container-low text-amber-600">
                <span className="material-symbols-outlined text-sm">pending_actions</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight">
                {metrics.needsReview}
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-body-sm text-body-sm text-amber-700">
                <span className="material-symbols-outlined text-xs">info</span>
                <span>Requires manual sign-off</span>
              </div>
            </div>
          </div>

          {/* Metric 4: Open Findings */}
          <div className="bg-surface-container-lowest hairline-border p-4 rounded-xl metric-card-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between text-secondary">
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-secondary">
                Open Findings
              </span>
              <div className="w-7 h-7 rounded border border-surface-container-highest flex items-center justify-center bg-surface-container-low text-error">
                <span className="material-symbols-outlined text-sm">warning</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-headline-xl font-headline-xl font-bold text-error tracking-tight">
                  {metrics.activeFindings}
                </span>
                <span className="text-label-sm font-label-sm text-error font-medium">
                  Exceptions
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-body-sm text-body-sm text-error">
                <span className="w-1.5 h-1.5 rounded-full bg-error" />
                <span>Policy vs Code discrepancies</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN ANALYTICAL GRID: TWO-COLUMN ASYMMETRIC SYSTEM (65% / 35%)   */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT / PRIMARY WORKSPACE COLUMN (8 of 12 cols = ~66%) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section A: Review Progress & Completion Trajectory */}
            <div className="bg-surface-container-lowest hairline-border rounded-xl p-5 metric-card-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
                <div>
                  <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                    Review Progress &amp; Completion Curve
                  </h2>
                  <p className="text-body-sm font-body-sm text-secondary">
                    Cumulative grounded claims indexed against 3-week sprint target
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-low border border-surface-container-high font-code-sm text-code-sm text-secondary">
                    <span className="w-2 h-2 rounded-full bg-primary-container" />
                    Target: Oct 30 (100%)
                  </span>
                </div>
              </div>

              {/* SVG Line Chart Minimalist Visualization */}
              <div className="relative mt-4 h-64 w-full">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 760 220">
                  {/* Grid Guides */}
                  <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="760" y1="20" y2="20" />
                  <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="760" y1="70" y2="70" />
                  <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="760" y1="120" y2="120" />
                  <line stroke="#E2E8F0" strokeDasharray="3 3" x1="0" x2="760" y1="170" y2="170" />
                  <line stroke="#E2E8F0" strokeWidth="1" x1="0" x2="760" y1="200" y2="200" />

                  {/* Target Projection Line */}
                  <path d="M 40 180 L 720 30" fill="none" stroke="#CBD5E1" strokeDasharray="4 4" strokeWidth="1.5" />

                  {/* Area Fill Under Path */}
                  <path
                    d="M 40 185 Q 160 170, 260 145 T 460 85 T 620 54 L 720 40 L 720 200 L 40 200 Z"
                    fill="url(#copperGradient)"
                    opacity="0.14"
                  />

                  {/* Actual Claims Grounded Path */}
                  <path
                    d="M 40 185 Q 160 170, 260 145 T 460 85 T 620 54 L 720 40"
                    fill="none"
                    stroke="#0B1C30"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />

                  {/* Current Benchmark Marker */}
                  <line stroke="#C2410C" strokeDasharray="2 2" strokeWidth="1" x1="460" x2="460" y1="20" y2="200" />
                  <circle cx="460" cy="85" fill="#FFFFFF" r="5" stroke="#C2410C" strokeWidth="3" />

                  <defs>
                    <linearGradient id="copperGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#C2410C" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating Data Tag above Marker */}
                <div className="absolute top-[48px] left-[60%] -translate-x-1/2 bg-on-surface text-surface-container-lowest px-2.5 py-1 rounded shadow-md border border-surface-container-high/40 text-center">
                  <div className="font-code-sm text-code-sm font-semibold">28 Verified</div>
                  <div className="text-[10px] text-surface-variant font-mono">74% Target</div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between text-secondary font-code-sm text-code-sm pt-2">
                  <span>Oct 08 (Import)</span>
                  <span>Oct 14</span>
                  <span>Oct 20</span>
                  <span className="font-semibold text-primary">Today (Oct 24)</span>
                  <span>Oct 28</span>
                  <span className="text-secondary">Oct 31 (Target)</span>
                </div>
              </div>
            </div>

            {/* Section B: Questions Needing Immediate Attention Table */}
            <div className="bg-surface-container-lowest hairline-border rounded-xl overflow-hidden metric-card-shadow">
              <div className="p-5 pb-3 flex items-center justify-between border-b border-surface-container-highest">
                <div>
                  <h2 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                    Questions Needing Immediate Attention
                  </h2>
                  <p className="text-body-sm font-body-sm text-secondary">
                    High-priority items with unverified statements or policy conflicts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onNavigateToFindings}
                    className="flex items-center gap-1 px-2.5 py-1 text-label-sm font-label-sm rounded border border-surface-container-highest hover:bg-surface-container-low text-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined text-xs">filter_list</span>
                    <span>View {conflicts.length} findings</span>
                  </button>
                  <button
                    onClick={onNavigateToQuestionnaire}
                    className="text-label-sm font-label-sm text-primary font-medium hover:underline flex items-center gap-0.5"
                  >
                    View all {claims.length}
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-surface-container-highest font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                      <th className="py-2.5 px-4 font-semibold w-16">ID</th>
                      <th className="py-2.5 px-4 font-semibold">Question Title</th>
                      <th className="py-2.5 px-4 font-semibold w-36">Domain</th>
                      <th className="py-2.5 px-4 font-semibold w-56">Evidence State</th>
                      <th className="py-2.5 px-4 text-right font-semibold w-32">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-highest font-body-md text-body-md">
                    {claims.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="py-3 px-4 font-code-sm text-code-sm font-medium text-secondary">
                          {c.code}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-on-surface group-hover:text-primary transition-colors text-xs block">
                            {c.question}
                          </span>
                          <div className="text-body-sm font-body-sm text-secondary mt-0.5 truncate max-w-sm text-xs">
                            {c.vendorDraftAnswer}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded font-code-sm text-code-sm bg-surface-container text-on-surface text-xs">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
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
                              ? 'Evidence Supported'
                              : c.status === 'amber'
                              ? 'Needs Review'
                              : 'Discrepancy Flagged'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => onSelectQuestionForReview(c)}
                            className="px-2.5 py-1 text-label-sm font-label-sm font-medium rounded bg-surface-container-lowest border border-surface-container-highest hover:bg-surface-container-low text-on-surface transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT / SECONDARY WORKSPACE COLUMN (4 of 12 cols = ~34%) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card C: Connected Evidence Sources */}
            <div className="bg-surface-container-lowest hairline-border rounded-xl p-5 metric-card-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">source</span>
                  <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                    Connected Evidence Sources
                  </h3>
                </div>
                <span className="px-2 py-0.5 font-code-sm text-code-sm bg-surface-container-low rounded border border-surface-container-highest text-secondary font-medium">
                  {sources.length} active
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                {/* Source 1: Excel Questionnaire */}
                <div className="p-3 rounded-lg border border-surface-container-highest bg-surface-container-lowest hover:border-secondary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-base">table_chart</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-code-sm text-code-sm font-semibold text-on-surface truncate">
                          AcmeCorp-Security-Assessment-2026.xlsx
                        </div>
                        <div className="text-body-sm font-body-sm text-secondary">
                          38 questions parsed · 100% extracted
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-surface-container-highest flex items-center justify-between">
                    <span className="font-code-sm text-code-sm text-secondary">Updated 2h ago</span>
                    <button
                      onClick={onNewAssessment}
                      className="font-label-sm text-label-sm text-primary hover:underline font-medium"
                    >
                      Replace File
                    </button>
                  </div>
                </div>

                {/* Source 2: Security Policy PDF */}
                <div className="p-3 rounded-lg border border-surface-container-highest bg-surface-container-lowest hover:border-secondary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-code-sm text-code-sm font-semibold text-on-surface truncate">
                          Acme_InfoSec_Policy_v4.2.pdf
                        </div>
                        <div className="text-body-sm font-body-sm text-secondary">
                          48 pages indexed · 12 sections mapped
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-surface-container-highest flex items-center justify-between">
                    <span className="font-code-sm text-code-sm text-secondary">Indexed Oct 18</span>
                    <button
                      onClick={onNavigateToSources}
                      className="font-label-sm text-label-sm text-on-surface hover:text-primary font-medium"
                    >
                      View PDF
                    </button>
                  </div>
                </div>

                {/* Source 3: Source Code Repository */}
                <div className="p-3 rounded-lg border border-surface-container-highest bg-surface-container-lowest hover:border-secondary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded bg-slate-100 border border-slate-300 text-slate-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-base">terminal</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-code-sm text-code-sm font-semibold text-on-surface truncate">
                          github.com/acme/core-api
                        </div>
                        <div className="text-body-sm font-body-sm text-secondary">
                          Branch: <span className="font-mono text-on-surface font-medium">main</span> · SHA: <span className="font-mono text-primary font-medium">7a21f8</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-surface-container-highest flex items-center justify-between">
                    <span className="font-code-sm text-code-sm text-secondary">14 Go files analyzed</span>
                    <button
                      onClick={onNavigateToSources}
                      className="font-label-sm text-label-sm text-on-surface hover:text-primary font-medium"
                    >
                      Sync Repo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card D: Upcoming Audit Milestones */}
            <div className="bg-surface-container-lowest hairline-border rounded-xl p-5 metric-card-shadow">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">event</span>
                  <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface">
                    Upcoming Audit Milestones
                  </h3>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start justify-between text-body-md font-body-md">
                  <div>
                    <div className="font-medium text-on-surface">Enterprise Review Deadline</div>
                    <div className="text-body-sm font-body-sm text-secondary">Acme Legal &amp; Vendor Assurance</div>
                  </div>
                  <div className="text-right">
                    <div className="font-code-sm text-code-sm font-semibold text-primary">Oct 31, 2026</div>
                    <span className="text-label-sm font-label-sm text-secondary">In 6 days</span>
                  </div>
                </div>

                <div className="h-[1px] bg-surface-container-highest" />

                <div className="flex items-start justify-between text-body-md font-body-md">
                  <div>
                    <div className="font-medium text-on-surface">SOC 2 Annual Auditor Check</div>
                    <div className="text-body-sm font-body-sm text-secondary">Schellman &amp; Company LLC</div>
                  </div>
                  <div className="text-right">
                    <div className="font-code-sm text-code-sm text-on-surface">Nov 15, 2026</div>
                    <span className="text-label-sm font-label-sm text-secondary">In 21 days</span>
                  </div>
                </div>

                <div className="h-[1px] bg-surface-container-highest" />

                <div className="flex items-start justify-between text-body-md font-body-md">
                  <div>
                    <div className="font-medium text-on-surface">Customer Pen Test Debrief</div>
                    <div className="text-body-sm font-body-sm text-secondary">Cure53 Executive Summary</div>
                  </div>
                  <div className="text-right">
                    <div className="font-code-sm text-code-sm text-on-surface">Nov 22, 2026</div>
                    <span className="text-label-sm font-label-sm text-secondary">In 28 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card E: Quick Actions Execution Panel */}
            <div className="bg-surface-container-low hairline-border rounded-xl p-5 metric-card-shadow space-y-3">
              <h3 className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-secondary">
                Executive Workbench
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={onNewAssessment}
                  className="w-full flex items-center justify-between py-2 px-3 bg-surface-container-lowest hover:bg-surface-bright text-on-surface font-label-md text-label-md rounded border border-surface-container-highest transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">file_upload</span>
                    <span>Upload New Questionnaire (.xlsx)</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-secondary">chevron_right</span>
                </button>

                <button
                  onClick={onNavigateToSources}
                  className="w-full flex items-center justify-between py-2 px-3 bg-surface-container-lowest hover:bg-surface-bright text-on-surface font-label-md text-label-md rounded border border-surface-container-highest transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary">policy</span>
                    <span>Manage Evidence Sources</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-secondary">chevron_right</span>
                </button>

                <button
                  onClick={onNavigateToFindings}
                  className="w-full flex items-center justify-between py-2 px-3 bg-surface-container-lowest hover:bg-surface-bright text-on-surface font-label-md text-label-md rounded border border-surface-container-highest transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">report_problem</span>
                    <span>Inspect Policy Discrepancies (3)</span>
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
