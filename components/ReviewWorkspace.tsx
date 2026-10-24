'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  GitBranch,
  ShieldCheck,
  Terminal,
  Layers,
  ArrowRight,
  Clock,
  Check,
  ExternalLink,
  Cpu,
  Sliders,
} from 'lucide-react';
import type { SecurityClaim, ConflictItem } from '@/types/claimtrail';
import { deriveMetrics } from '@/data/demoData';

interface ReviewWorkspaceProps {
  claims: SecurityClaim[];
  conflicts: ConflictItem[];
  isRunningCheck: boolean;
  onRunEvidenceCheck: () => void;
  onNavigateToEvidence: () => void;
  onNavigateToQuestions: () => void;
  onNavigateToFindings: () => void;
}

export function ReviewWorkspace({
  claims,
  conflicts,
  isRunningCheck,
  onRunEvidenceCheck,
  onNavigateToEvidence,
  onNavigateToQuestions,
  onNavigateToFindings,
}: ReviewWorkspaceProps) {
  const [selectedPipelineStep, setSelectedPipelineStep] = useState<number>(3);
  const metrics = deriveMetrics(claims, conflicts);

  const pipelineStages = [
    {
      id: 1,
      title: 'Questionnaire Extraction',
      description: 'Ingest XLSX rows, extract question statements, parse vendor categories',
      status: 'complete' as const,
      timestamp: '2026-10-23 20:13:40 UTC',
      duration: '420ms',
      summary: '5 claims extracted from 3 sheets',
    },
    {
      id: 2,
      title: 'Policy Passage Retrieval',
      description: 'Semantic & keyword search across Information Security Policy PDF',
      status: 'complete' as const,
      timestamp: '2026-10-23 20:13:44 UTC',
      duration: '850ms',
      summary: '14 citations matched across 48 pages',
    },
    {
      id: 3,
      title: 'GitHub IaC & Code AST Scan',
      description: 'Scan Terraform, Kubernetes manifests, and branch protections in public repo',
      status: 'complete' as const,
      timestamp: '2026-10-23 20:13:52 UTC',
      duration: '1.24s',
      summary: '4 manifests evaluated, commit 8f9b4c2',
    },
    {
      id: 4,
      title: 'Deterministic Rule Verification',
      description: 'Run narrow deterministic rules: CIS 2.3.1, Checkov CKV_AWS_150, GitHub Ruleset',
      status: 'complete' as const,
      timestamp: '2026-10-23 20:14:00 UTC',
      duration: '610ms',
      summary: '3 supported, 1 diverged, 1 failed rule',
    },
    {
      id: 5,
      title: 'Grounded Answer Generation',
      description: 'Synthesize conservative answers referencing exact code lines and page numbers',
      status: 'complete' as const,
      timestamp: '2026-10-23 20:14:02 UTC',
      duration: '1.82s',
      summary: '5 grounded answers with strict limitations',
    },
  ];

  const executionLogs = [
    { time: '20:13:40.102', level: 'INFO', msg: 'Ingesting SIG_Lite_2026_Vendor_Assessment.xlsx (3 sheets, 5 candidate questions)' },
    { time: '20:13:40.420', level: 'PASS', msg: 'Mapped: SEC-104 (Row 104), IAM-201 (Row 48), NET-310 (Row 76), LOG-405 (Row 120), CICD-512 (Row 142)' },
    { time: '20:13:44.290', level: 'INFO', msg: 'Indexing Acme_Information_Security_Policy_v3.4.pdf (48 pages, text layer verified)' },
    { time: '20:13:44.850', level: 'PASS', msg: 'Passage citation found: §7.4.2 KMS Envelope Encryption (p.28), §3.1.2 Privileged MFA (p.14), §11.1 WAF (p.44)' },
    { time: '20:13:52.010', level: 'INFO', msg: 'Connecting acme-corp/cloud-core @ main (commit 8f9b4c2)' },
    { time: '20:13:52.450', level: 'PASS', msg: 'Parsed infra/terraform/modules/iam/mfa_enforcement.tf (MFA condition: Present)' },
    { time: '20:13:52.880', level: 'WARN', msg: 'Divergence: infra/terraform/modules/rds/main.tf uses data.aws_kms_alias.rds_default instead of CMK' },
    { time: '20:13:53.110', level: 'FAIL', msg: 'Non-compliant: k8s/ingress/public-ingress.yaml missing waf-acl-arn annotation (Checkov CKV_AWS_150)' },
    { time: '20:14:00.320', level: 'PASS', msg: 'Verified AWS Config Rule s3-bucket-object-lock-enabled (365 days compliance mode)' },
    { time: '20:14:00.610', level: 'WARN', msg: 'Branch ruleset 88129: required_approving_review_count=1 (Policy mandates 2)' },
    { time: '20:14:02.100', level: 'INFO', msg: 'Analysis batch complete. 2 verified, 2 needs review, 1 unsafe condition identified.' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden bg-canvas">
      {/* Header & Run Actions */}
      <div className="shrink-0 bg-surface border-b border-border px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary tracking-tight">Review & Analysis Engine</h1>
              <span className="text-2xs font-mono px-2 py-0.5 rounded bg-signal-green-bg text-signal-green border border-signal-green-border font-medium">
                ENGINE READY
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Automated deterministic cross-referencing between XLSX security questions, PDF policies, and GitHub source repositories.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onRunEvidenceCheck}
              disabled={isRunningCheck}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium text-white transition-colors shadow-xs ${
                isRunningCheck
                  ? 'bg-accent/70 cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-hover active:bg-orange-700'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRunningCheck ? 'animate-spin' : ''}`} />
              <span>{isRunningCheck ? 'Evaluating Pipeline...' : 'Run Evidence Check'}</span>
            </button>
          </div>
        </div>

        {/* Quick status bar */}
        <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-6 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="text-text-tertiary">Last Check:</span>
            <span className="font-mono text-text-primary text-2xs font-semibold">2026-10-23 20:14:02 UTC</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-tertiary">Target Commit:</span>
            <span className="font-mono text-accent text-2xs font-semibold">8f9b4c2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-tertiary">Scope:</span>
            <span className="font-mono text-text-primary text-2xs">5 Questions · 3 Policies · 4 Code Files</span>
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs">
            <button
              onClick={onNavigateToEvidence}
              className="text-accent hover:underline flex items-center gap-1 font-medium"
            >
              <span>Inspect Provenance Graph</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Top Sources Row */}
          <div>
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-tertiary mb-3">
              Connected Source Inputs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Questionnaire */}
              <div className="bg-surface border border-border rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded bg-canvas border border-border flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4 text-signal-green" />
                  </div>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-signal-green-bg text-signal-green border border-signal-green-border font-medium">
                    PARSED
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-text-primary truncate">
                  SIG_Lite_2026_Vendor_Assessment.xlsx
                </h3>
                <p className="text-2xs text-text-tertiary mt-0.5">5 rows loaded · 3 sheets</p>
                <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-2xs text-text-secondary">
                  <span>Vendor Drafts: Ready</span>
                  <button onClick={onNavigateToQuestions} className="text-accent hover:underline font-medium">
                    View Rows
                  </button>
                </div>
              </div>

              {/* Policy */}
              <div className="bg-surface border border-border rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded bg-canvas border border-border flex items-center justify-center">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-signal-green-bg text-signal-green border border-signal-green-border font-medium">
                    INGESTED
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-text-primary truncate">
                  Acme_Information_Security_Policy_v3.4.pdf
                </h3>
                <p className="text-2xs text-text-tertiary mt-0.5">48 pages · 14 citations matched</p>
                <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-2xs text-text-secondary">
                  <span>Hash: 9b2d8...4f1a</span>
                  <span className="font-mono text-2xs text-text-tertiary">v3.4 Approved</span>
                </div>
              </div>

              {/* Repository */}
              <div className="bg-surface border border-border rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded bg-canvas border border-border flex items-center justify-center">
                    <GitBranch className="w-4 h-4 text-text-primary" />
                  </div>
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-signal-green-bg text-signal-green border border-signal-green-border font-medium">
                    SYNCED
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-text-primary truncate">
                  acme-corp/cloud-core
                </h3>
                <p className="text-2xs text-text-tertiary mt-0.5">Branch: main (commit 8f9b4c2)</p>
                <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-2xs text-text-secondary">
                  <span>IaC & HCL Scanned</span>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-tertiary hover:text-text-primary"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Execution Pipeline */}
          <div>
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-tertiary mb-3">
              Automated Verification Pipeline
            </h2>
            <div className="bg-surface border border-border rounded divide-y divide-border overflow-hidden">
              {pipelineStages.map((stage) => {
                const isSelected = selectedPipelineStep === stage.id;
                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedPipelineStep(stage.id)}
                    className={`p-4 flex items-start gap-4 cursor-pointer transition-colors ${
                      isSelected ? 'bg-canvas/60' : 'hover:bg-canvas/30'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-signal-green-bg border border-signal-green-border flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-signal-green" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-2xs font-mono font-semibold text-text-tertiary">
                          STAGE 0{stage.id}
                        </span>
                        <h4 className="text-xs font-semibold text-text-primary">{stage.title}</h4>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">{stage.description}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-2xs font-mono text-text-primary bg-canvas px-2 py-0.5 rounded border border-border block">
                        {stage.summary}
                      </span>
                      <span className="text-2xs font-mono text-text-tertiary mt-1 block">
                        {stage.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Execution Log Terminal */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>Deterministic Check Audit Log</span>
              </h2>
              <span className="text-2xs font-mono text-text-tertiary">
                Showing last 11 events
              </span>
            </div>

            <div className="bg-canvas border border-border rounded p-3 font-mono text-2xs overflow-x-auto max-h-64 overflow-y-auto space-y-1.5">
              {executionLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-text-tertiary shrink-0 select-none">[{log.time}]</span>
                  <span
                    className={`font-semibold shrink-0 w-12 ${
                      log.level === 'PASS'
                        ? 'text-signal-green'
                        : log.level === 'WARN'
                        ? 'text-signal-amber'
                        : log.level === 'FAIL'
                        ? 'text-signal-red'
                        : 'text-text-tertiary'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-text-primary leading-tight">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Cards Bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div
              onClick={onNavigateToQuestions}
              className="p-4 bg-surface border border-border rounded hover:border-border-strong cursor-pointer transition-all"
            >
              <div className="text-xs font-semibold text-text-primary flex items-center justify-between">
                <span>Review Questions (5)</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary" />
              </div>
              <p className="text-2xs text-text-secondary mt-1">
                Inspect generated answers and row citations
              </p>
            </div>

            <div
              onClick={onNavigateToEvidence}
              className="p-4 bg-surface border border-border rounded hover:border-border-strong cursor-pointer transition-all"
            >
              <div className="text-xs font-semibold text-text-primary flex items-center justify-between">
                <span>Trace Evidence Graph</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary" />
              </div>
              <p className="text-2xs text-text-secondary mt-1">
                Explore 4-stage claim to code provenance
              </p>
            </div>

            <div
              onClick={onNavigateToFindings}
              className="p-4 bg-surface border border-border rounded hover:border-border-strong cursor-pointer transition-all"
            >
              <div className="text-xs font-semibold text-text-primary flex items-center justify-between">
                <span>Active Findings ({metrics.activeFindings})</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary" />
              </div>
              <p className="text-2xs text-text-secondary mt-1">
                Investigate discrepancies and failed controls
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
