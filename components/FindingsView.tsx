'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  GitBranch,
  FileText,
  FileSpreadsheet,
  ArrowRight,
  Layers,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';
import type { ConflictItem, SecurityClaim } from '@/types/claimtrail';

interface FindingsViewProps {
  conflicts: ConflictItem[];
  claims: SecurityClaim[];
  onSelectFindingForEvidence: (conflict: ConflictItem) => void;
  onSelectClaimForQuestion: (claimCode: string) => void;
}

type FindingReviewState = 'Open' | 'Under Investigation' | 'Remediation In Progress' | 'Accepted Risk';

export function FindingsView({
  conflicts,
  claims,
  onSelectFindingForEvidence,
  onSelectClaimForQuestion,
}: FindingsViewProps) {
  const [selectedFindingId, setSelectedFindingId] = useState<string>(conflicts[0]?.id ?? 'conf-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Local state for tracking real user updates to finding review states
  const [reviewStates, setReviewStates] = useState<Record<string, FindingReviewState>>({
    'conf-1': 'Under Investigation',
    'conf-2': 'Open',
    'conf-3': 'Open',
  });

  const selectedFinding = useMemo(
    () => conflicts.find((c) => c.id === selectedFindingId) ?? conflicts[0],
    [conflicts, selectedFindingId]
  );

  const relatedClaim = useMemo(
    () => claims.find((c) => c.code === selectedFinding?.claimCode),
    [claims, selectedFinding]
  );

  const filteredConflicts = useMemo(() => {
    return conflicts.filter((c) => {
      if (severityFilter !== 'all' && c.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          c.title.toLowerCase().includes(q) ||
          c.claimCode.toLowerCase().includes(q) ||
          c.sourceA.label.toLowerCase().includes(q) ||
          c.sourceB.label.toLowerCase().includes(q) ||
          c.sourceA.statement.toLowerCase().includes(q) ||
          c.sourceB.statement.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [conflicts, severityFilter, searchQuery]);

  const severityCounts = useMemo(() => {
    return {
      all: conflicts.length,
      high: conflicts.filter((c) => c.severity === 'high').length,
      medium: conflicts.filter((c) => c.severity === 'medium').length,
      low: conflicts.filter((c) => c.severity === 'low').length,
    };
  }, [conflicts]);

  const detailedMetadata: Record<
    string,
    {
      whyItMatters: string;
      ruleId: string;
      ruleEngine: string;
      notVerified: string;
      remediation: string;
    }
  > = {
    'conf-1': {
      whyItMatters:
        'Using the default AWS-managed key (aws/rds) instead of a customer-managed key (CMK) prevents customer-controlled cryptographic erasure, key policy segregation, and cross-account key access controls mandated by SOC 2 CC6.1.',
      ruleId: 'CIS AWS Foundations 2.3.1',
      ruleEngine: 'AWS SecurityHub / Terraform Static Scanner',
      notVerified:
        'Key rotation schedule cannot be audited without active AWS KMS API credentials; only Terraform HCL configuration was verified.',
      remediation:
        'In infra/terraform/modules/rds/main.tf, update kms_key_id from data.aws_kms_alias.rds_default.arn to aws_kms_key.rds_production_cmk.arn.',
    },
    'conf-2': {
      whyItMatters:
        'Exposing public Kubernetes ingress without attached WAF WebACL leaves production services vulnerable to layer 7 attacks, automated SQL injection, and HTTP flood requests, violating internal Perimeter Standard §11.1.',
      ruleId: 'Checkov CKV_AWS_150 / OWASP Top 10',
      ruleEngine: 'Bridgecrew Checkov AST Engine',
      notVerified:
        'Cloudflare upstream proxy status was not verified because Cloudflare edge DNS configuration is outside repository inspection scope.',
      remediation:
        'Add annotation "alb.ingress.kubernetes.io/waf-acl-arn: arn:aws:wafv2:..." to k8s/ingress/public-ingress.yaml and re-run check.',
    },
    'conf-3': {
      whyItMatters:
        'Single-reviewer approval merges allow single engineer privilege escalation without secondary oversight, contrary to the 2-peer review standard codified in SDLC Policy §5.2.',
      ruleId: 'GitHub Branch Ruleset Compliance',
      ruleEngine: 'GitHub REST API /repos/rulesets/88129',
      notVerified:
        'Repository admin bypass privileges were not checked; repository administrator override permissions remain unverified.',
      remediation:
        'Update .github/branch-protections.json to set required_approving_review_count = 2 for production branches.',
    },
  };

  const currentMeta = selectedFinding ? detailedMetadata[selectedFinding.id] : null;

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden bg-canvas">
      {/* Top Header */}
      <div className="shrink-0 bg-surface border-b border-border px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-text-primary tracking-tight">Active Findings & Conflicts</h1>
              <span className="text-2xs font-mono px-2 py-0.5 rounded bg-signal-amber-bg text-signal-amber border border-signal-amber-border font-medium">
                {conflicts.length} DETECTED
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Deterministic contradictions between questionnaire claims, security policies, and source repository configurations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xs font-mono text-text-tertiary">
              Entities: 5 Questions · 3 Separate Findings
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-2 border-t border-border">
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter findings by text or claim..."
              className="w-full text-xs bg-canvas border border-border rounded pl-8 pr-3 py-1.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center rounded border border-border bg-canvas p-0.5 text-xs">
            <button
              onClick={() => setSeverityFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium ${
                severityFilter === 'all'
                  ? 'bg-surface text-text-primary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All ({severityCounts.all})
            </button>
            <button
              onClick={() => setSeverityFilter('high')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1 ${
                severityFilter === 'high'
                  ? 'bg-surface text-signal-red shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-red" />
              High ({severityCounts.high})
            </button>
            <button
              onClick={() => setSeverityFilter('medium')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1 ${
                severityFilter === 'medium'
                  ? 'bg-surface text-signal-amber shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-signal-amber" />
              Medium ({severityCounts.medium})
            </button>
            <button
              onClick={() => setSeverityFilter('low')}
              className={`px-2.5 py-1 rounded transition-colors text-xs font-medium flex items-center gap-1 ${
                severityFilter === 'low'
                  ? 'bg-surface text-text-secondary shadow-xs'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary" />
              Low ({severityCounts.low})
            </button>
          </div>
        </div>
      </div>

      {/* Split View Content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 min-w-0 overflow-hidden">
        {/* Left: Findings List */}
        <div className="w-full md:w-[420px] lg:w-[460px] shrink-0 border-r border-border overflow-y-auto bg-surface divide-y divide-border">
          {filteredConflicts.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-secondary">
              No findings match your filter criteria.
            </div>
          ) : (
            filteredConflicts.map((c) => {
              const isSelected = selectedFinding?.id === c.id;
              const severityCls = {
                high: 'bg-signal-red-bg text-signal-red border-signal-red-border',
                medium: 'bg-signal-amber-bg text-signal-amber border-signal-amber-border',
                low: 'bg-canvas text-text-secondary border-border',
              }[c.severity];

              const state = reviewStates[c.id] || 'Open';

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedFindingId(c.id)}
                  className={`p-4 cursor-pointer transition-colors relative ${
                    isSelected ? 'bg-canvas/80 border-l-2 border-l-accent' : 'hover:bg-canvas/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-semibold text-accent">
                      {c.claimCode}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`pill text-2xs ${severityCls}`}>
                        {c.severity.toUpperCase()}
                      </span>
                      <span className="text-2xs font-mono text-text-tertiary">
                        {state}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-semibold text-text-primary line-clamp-2 leading-relaxed">
                    {c.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 text-2xs text-text-tertiary truncate">
                    <span className="truncate">{c.sourceA.label}</span>
                    <span>→</span>
                    <span className="truncate">{c.sourceB.label}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60 text-2xs font-mono text-text-tertiary">
                    <span>Detected {c.detectedAt}</span>
                    <span className="text-accent flex items-center gap-0.5">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Dossier View */}
        <div className="flex-1 overflow-y-auto p-6 bg-canvas">
          {selectedFinding ? (
            <div className="max-w-3xl space-y-5">
              {/* Top Banner / Actions */}
              <div className="bg-surface border border-border rounded p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-accent">
                      {selectedFinding.claimCode}
                    </span>
                    <span className="text-text-tertiary">·</span>
                    <span className="text-2xs font-mono text-text-tertiary">
                      FINDING ID: {selectedFinding.id.toUpperCase()}
                    </span>
                    <span
                      className={`pill ${
                        selectedFinding.severity === 'high'
                          ? 'bg-signal-red-bg text-signal-red border-signal-red-border'
                          : selectedFinding.severity === 'medium'
                          ? 'bg-signal-amber-bg text-signal-amber border-signal-amber-border'
                          : 'bg-canvas text-text-secondary border-border'
                      }`}
                    >
                      {selectedFinding.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>

                  {/* Review State Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-mono text-text-tertiary">Review State:</span>
                    <select
                      value={reviewStates[selectedFinding.id] || 'Open'}
                      onChange={(e) =>
                        setReviewStates((prev) => ({
                          ...prev,
                          [selectedFinding.id]: e.target.value as FindingReviewState,
                        }))
                      }
                      className="text-2xs bg-canvas border border-border rounded px-2 py-1 text-text-primary focus:outline-none focus:border-accent font-medium cursor-pointer"
                    >
                      <option value="Open">Open</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Remediation In Progress">Remediation In Progress</option>
                      <option value="Accepted Risk">Accepted Risk</option>
                    </select>
                  </div>
                </div>

                <h2 className="text-sm font-semibold text-text-primary mt-1">
                  {selectedFinding.title}
                </h2>

                {/* Cross Links Bar */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border">
                  <button
                    onClick={() => onSelectFindingForEvidence(selectedFinding)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent border border-accent rounded bg-accent-bg hover:bg-orange-100 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View in Provenance Map</span>
                  </button>

                  <button
                    onClick={() => onSelectClaimForQuestion(selectedFinding.claimCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary border border-border rounded bg-canvas hover:text-text-primary hover:border-border-strong transition-colors"
                  >
                    <span>View Related Question ({selectedFinding.claimCode})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Conflict Sources Comparison */}
              <div className="bg-surface border border-border rounded p-5 space-y-4">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-tertiary">
                  Direct Evidence Contradiction
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Source A */}
                  <div className="p-3.5 rounded border border-border bg-canvas/60 space-y-2">
                    <div className="flex items-center gap-1.5 text-2xs font-semibold text-text-secondary">
                      <FileText className="w-3.5 h-3.5 text-text-tertiary" />
                      <span>Source A: {selectedFinding.sourceA.label}</span>
                    </div>
                    <p className="text-2xs font-mono text-text-tertiary">
                      {selectedFinding.sourceA.ref}
                    </p>
                    <p className="text-xs text-text-primary italic border-l-2 border-border pl-2.5 py-0.5 font-sans">
                      "{selectedFinding.sourceA.statement}"
                    </p>
                  </div>

                  {/* Source B */}
                  <div className="p-3.5 rounded border border-signal-red-border/60 bg-signal-red-bg/20 space-y-2">
                    <div className="flex items-center gap-1.5 text-2xs font-semibold text-signal-red">
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Source B: {selectedFinding.sourceB.label}</span>
                    </div>
                    <p className="text-2xs font-mono text-text-tertiary">
                      {selectedFinding.sourceB.ref}
                    </p>
                    <p className="text-xs text-text-primary font-mono bg-canvas/80 p-2 rounded border border-border">
                      {selectedFinding.sourceB.statement}
                    </p>
                  </div>
                </div>
              </div>

              {/* Why It Matters & Rule Explanation */}
              {currentMeta && (
                <div className="bg-surface border border-border rounded p-5 space-y-4">
                  <div>
                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-tertiary mb-1">
                      Why This Finding Matters
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {currentMeta.whyItMatters}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-2xs font-mono text-text-tertiary uppercase block">
                        Deterministic Rule ID
                      </span>
                      <span className="font-mono text-text-primary font-semibold text-xs mt-0.5 block">
                        {currentMeta.ruleId}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs font-mono text-text-tertiary uppercase block">
                        Verification Engine
                      </span>
                      <span className="text-text-secondary text-xs mt-0.5 block">
                        {currentMeta.ruleEngine}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <span className="text-2xs font-mono text-signal-amber font-semibold uppercase block mb-1">
                      Scope Limitations / What Was NOT Verified
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {currentMeta.notVerified}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border bg-canvas/60 p-3.5 rounded border border-border">
                    <span className="text-2xs font-mono text-accent font-semibold uppercase block mb-1">
                      Suggested Remediation
                    </span>
                    <p className="text-xs text-text-primary leading-relaxed font-sans">
                      {currentMeta.remediation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-text-secondary">
              Select a finding to inspect its evidence contradiction.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
