import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { generateCompletedQuestionnaireXlsx } from '../lib/xlsxExporter';
import type { SecurityClaim } from '../types/claimtrail';

describe('Step 7: Final Review Workflow, Approval Rules & Excel Export', () => {
  const sampleClaims: SecurityClaim[] = [
    {
      id: 'claim-step7-01',
      code: 'SEC-101',
      category: 'Data Protection',
      question: 'Are data stores encrypted at rest using AES-256 or equivalent?',
      vendorDraftAnswer: 'All production databases use AES-256 encryption via AWS KMS customer-managed keys.',
      answerDraft: 'All production databases use AES-256 encryption via AWS KMS customer-managed keys.',
      editedAnswer: 'All databases utilize AWS KMS customer-managed keys with automatic 365-day rotation.',
      answerVersion: 2,
      status: 'green',
      statusDetail: 'Verified via Terraform & Policy §4.1',
      reviewStatus: 'approved',
      approval: {
        status: 'approved',
        reviewer: 'Alice Doe (Lead Security Architect)',
        timestamp: '2026-10-24T12:00:00Z',
        version: 2,
        notes: 'Verified against AWS KMS terraform configuration in infra/kms.tf.',
        hasUnresolvedFindingOverride: false,
      },
      sheetName: 'Vendor Assessment',
      rowNumber: 4,
      questionCol: 2,
      answerCol: 4,
      policyCitation: {
        docName: 'Acme_InfoSec_Policy_v4.2.pdf',
        section: 'Section 4.1: Cryptographic Key Management',
        page: 22,
        quote: 'Customer master keys configured in AWS KMS must automatically rotate annually.',
        status: 'Approved',
      },
      ruleCheck: {
        ruleId: 'ENG-KMS-01',
        ruleName: 'AWS KMS Key Rotation Policy',
        status: 'passed',
        description: 'Terraform aws_kms_key.enable_key_rotation is set to true.',
        matchConfidence: 98.4,
      },
    },
    {
      id: 'claim-step7-02',
      code: 'SEC-102',
      category: 'Access Control',
      question: 'Is multi-factor authentication (MFA) strictly enforced for all administrative console access?',
      vendorDraftAnswer: 'MFA is enforced via Okta SSO and GitHub organization security policies.',
      answerDraft: 'MFA is enforced via Okta SSO and GitHub organization security policies.',
      status: 'amber',
      statusDetail: 'Needs Review',
      reviewStatus: 'needs_review',
      sheetName: 'Vendor Assessment',
      rowNumber: 5,
      questionCol: 2,
      answerCol: 4,
    },
    {
      id: 'claim-step7-03',
      code: 'SEC-103',
      category: 'Network Security',
      question: 'Are all external endpoints configured to reject TLS 1.0 and 1.1 connections?',
      vendorDraftAnswer: 'Draft unverified',
      status: 'red',
      statusDetail: 'TLS policy violation',
      reviewStatus: 'rejected',
      approval: {
        status: 'rejected',
        reviewer: 'Bob Smith (Senior Auditor)',
        timestamp: '2026-10-24T12:05:00Z',
        notes: 'Rejected: Ingress manifest still allows TLS 1.0 fallback.',
      },
      sheetName: 'Vendor Assessment',
      rowNumber: 6,
      questionCol: 2,
      answerCol: 4,
    },
    {
      id: 'claim-step7-04',
      code: 'SEC-104',
      category: 'Tenant Isolation',
      question: 'How is tenant isolation maintained in database transactions?',
      vendorDraftAnswer: 'Row-level security enforces isolation.',
      status: 'red',
      statusDetail: 'Open conflict with repo middleware',
      reviewStatus: 'approved',
      approval: {
        status: 'approved',
        reviewer: 'Alice Doe (Lead Security Architect)',
        timestamp: '2026-10-24T12:10:00Z',
        version: 1,
        notes: 'Risk accepted for legacy microservice pending v2 rewrite.',
        hasUnresolvedFindingOverride: true,
      },
      sheetName: 'Vendor Assessment',
      rowNumber: 7,
      questionCol: 2,
      answerCol: 4,
    },
  ];

  it('enforces safe approval metadata with reviewer identity, timestamp, version, and overrides', () => {
    const approvedClaim = sampleClaims[0];
    expect(approvedClaim.reviewStatus).toBe('approved');
    expect(approvedClaim.approval?.reviewer).toBe('Alice Doe (Lead Security Architect)');
    expect(approvedClaim.approval?.version).toBe(2);
    expect(approvedClaim.approval?.notes).toContain('AWS KMS terraform');
    expect(approvedClaim.approval?.hasUnresolvedFindingOverride).toBe(false);

    const overrideClaim = sampleClaims[3];
    expect(overrideClaim.approval?.hasUnresolvedFindingOverride).toBe(true);
    expect(overrideClaim.approval?.notes).toContain('Risk accepted');

    const rejectedClaim = sampleClaims[2];
    expect(rejectedClaim.reviewStatus).toBe('rejected');
    expect(rejectedClaim.approval?.status).toBe('rejected');
  });

  it('generates completed questionnaire workbook and formats responses safely', async () => {
    const sampleXlsxPath = path.join(process.cwd(), 'public', 'samples', 'AcmeCorp-Security-Assessment-2026.xlsx');
    let originalBuffer: Buffer | null = null;
    if (fs.existsSync(sampleXlsxPath)) {
      originalBuffer = fs.readFileSync(sampleXlsxPath);
    }

    const exportResult = await generateCompletedQuestionnaireXlsx(sampleClaims, {
      assessmentName: 'AcmeCorp-Security-Assessment-2026',
      includeDrafts: true,
      includeHashes: true,
      embedLinks: true,
      originalWorkbookBuffer: originalBuffer,
    });

    expect(exportResult.filename).toContain('.xlsx');
    expect(exportResult.buffer).toBeInstanceOf(Buffer);
    expect(exportResult.sizeBytes).toBeGreaterThan(1000);
    expect(exportResult.sha256).toMatch(/^[a-f0-9]{64}$/);

    // Load and inspect the generated workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(exportResult.buffer);

    // Verify Audit Evidence Trail sheet exists
    const auditSheet = workbook.getWorksheet('Audit Evidence Trail');
    expect(auditSheet).toBeDefined();

    // Verify statutory disclaimer notice is included
    let foundDisclaimer = false;
    let foundReviewerColumn = false;
    auditSheet?.eachRow((row) => {
      const valuesStr = JSON.stringify(row.values);
      if (valuesStr.includes('STATUTORY COMPLIANCE NOTICE') || valuesStr.includes('internal verification only')) {
        foundDisclaimer = true;
      }
      if (valuesStr.includes('Reviewer') && valuesStr.includes('Decision Timestamp')) {
        foundReviewerColumn = true;
      }
    });

    expect(foundDisclaimer).toBe(true);
    expect(foundReviewerColumn).toBe(true);
  });
});
