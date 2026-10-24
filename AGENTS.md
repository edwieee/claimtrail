# ClaimTrail - Agent & Architectural Guidelines

## Overview
ClaimTrail transforms security questionnaire claims into verifiable source evidence.
It cross-references:
1. **XLSX Security Questionnaires** (Vendor security assessments, SIG Lite, CAIQ, SOC 2 mapping)
2. **Security Policy PDFs** (Information Security Policy, Access Control Policy, Incident Response Plan)
3. **Public GitHub Repositories** (Infrastructure-as-code, CI/CD workflows, source code, branch protections)

## Core Value Proposition
- **Tagline**: From security claims to source evidence.
- **Primary action**: "Run Evidence Check"
- **Operational Triad**:
  - `Policy Evidence` (PDF passage citation, section, page, text quote)
  - `Repository Evidence` (GitHub file path, line range, commit SHA, workflow trigger)
  - `Security Controls` (Automated control verification, branch rule, secret scanning, TLS policy)

## Status Schema
- **Green (`verified` / `supporting`)**: Supporting signals found in inspected scope.
- **Amber (`ambiguous` / `incomplete`)**: Incomplete, ambiguous, or conflicting evidence requiring manual review.
- **Red (`non_compliant` / `unsafe`)**: Specific unsafe condition defined by an implemented rule (e.g., hardcoded secrets, missing MFA requirement, permissive CORS).

## UI Design System
- **Operations Console Aesthetic**: Light monochrome palette with off-white canvas (`#F6F7F9`), crisp white surfaces (`#FFFFFF`), near-black typography (`#0F141C`), hair-line gray borders (`#E2E4E8`), restrained orange accent (`#EA580C`) for active items and warnings.
- **Density**: Compact information density, technical monospace metadata tags, uppercase micro-labels (`text-2xs font-mono uppercase tracking-wider`).
- **Interactive Provenance Map**: Native SVG + CSS nodes and bezier/orthogonal connectors showing exact claim-to-evidence paths.
- **Viewports**: Optimized for 1280x800 desktop workstation consoles; gracefully stacks and collapses for smaller screens.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
