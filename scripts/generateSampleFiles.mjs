import ExcelJS from 'exceljs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const SAMPLES_DIR = path.join(process.cwd(), 'public', 'samples');
if (!fs.existsSync(SAMPLES_DIR)) {
  fs.mkdirSync(SAMPLES_DIR, { recursive: true });
}

async function generateSampleXlsx() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Security Assessment');

  sheet.columns = [
    { header: 'Question ID', key: 'id', width: 14 },
    { header: 'Domain Category', key: 'category', width: 24 },
    { header: 'Questionnaire Requirement', key: 'question', width: 50 },
    { header: 'Vendor Response / Technical Claim', key: 'response', width: 60 },
  ];

  // Style header row
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' },
  };

  const rows = [
    {
      id: 'SEC-104',
      category: 'Data Isolation & RLS',
      question: 'How is customer data separated and isolated across multi-tenant storage layers?',
      response:
        'Customer data isolation is enforced at the database layer using PostgreSQL Row-Level Security (RLS). Every incoming authenticated request resolves tenant context via session metadata, injecting app.current_tenant_id into the transaction context before query execution.',
    },
    {
      id: 'SEC-102',
      category: 'Cryptographic Controls',
      question: 'Are customer data encryption keys uniquely managed and automatically rotated?',
      response:
        'All production data stores enforce KMS envelope encryption using symmetric Customer Managed Keys (CMKs). Keys are provisioned via Terraform modules with automated annual key rotation policies audited through AWS CloudTrail telemetry.',
    },
    {
      id: 'IAM-201',
      category: 'Identity & Access Management',
      question: 'Is multi-factor authentication (MFA) mandated for all administrative console and CLI access?',
      response:
        'Multi-factor authentication (MFA) is strictly mandated across all production consoles, bastion access, and administrative CLI sessions. Enforcement is codified via IAM conditional policies requiring aws:MultiFactorAuthPresent for STS token generation.',
    },
    {
      id: 'NET-301',
      category: 'Network Architecture & Perimeter',
      question: 'Are public perimeter egress channels restricted via default-deny security groups and egress firewalls?',
      response:
        'All VPC subnets implement strict default-deny network security groups. Outbound Internet access is routed exclusively through monitored AWS NAT Gateways with DNS filtering inspection logs.',
    },
    {
      id: 'OPS-402',
      category: 'Incident Response & Telemetry',
      question: 'Are immutable audit logs collected and retained for a minimum of 365 days in tamper-proof storage?',
      response:
        'CloudTrail and application audit trails are streamed to an isolated S3 bucket configured with Object Lock in Compliance Mode and retained for 400 calendar days.',
    },
  ];

  rows.forEach((r) => sheet.addRow(r));

  const targetPath = path.join(SAMPLES_DIR, 'AcmeCorp-Security-Assessment-2026.xlsx');
  await workbook.xlsx.writeFile(targetPath);
  console.log('Generated sample XLSX at:', targetPath);
}

async function generateSamplePdf() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Title & Overview
  const page1 = pdfDoc.addPage([600, 750]);
  page1.drawText('ACME CORP — INFORMATION SECURITY POLICY', {
    x: 50,
    y: 700,
    size: 18,
    font: boldFont,
    color: rgb(0.06, 0.09, 0.16),
  });
  page1.drawText('Document Classification: Confidential • Version 4.2 • Effective Jan 2026', {
    x: 50,
    y: 675,
    size: 10,
    font,
    color: rgb(0.4, 0.45, 0.5),
  });
  page1.drawText('Section 3.1: Identity & Access Management (IAM)', {
    x: 50,
    y: 620,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.35),
  });
  page1.drawText(
    'Multi-Factor Authentication (MFA) is strictly required for all administrative console and CLI sessions.\nAccess to production infrastructure must require hardware-backed FIDO2 or TOTP tokens.\nSession expiration policies must terminate inactive administrative sessions after 15 minutes of idle time.',
    {
      x: 50,
      y: 570,
      size: 10,
      font,
      color: rgb(0.1, 0.1, 0.1),
      lineHeight: 16,
    }
  );

  // Page 2: Multi-tenant & KMS
  const page2 = pdfDoc.addPage([600, 750]);
  page2.drawText('Section 3.2: Multi-Tenant Data Segregation', {
    x: 50,
    y: 700,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.35),
  });
  page2.drawText(
    'All multi-tenant data stores must enforce logical segregation using authenticated tenant identifiers.\nDirect cross-tenant access without session verification is strictly forbidden.\nAll multi-tenant database clusters enforce strict logical segregation via authenticated tenant identifiers\ninjected at connection session level.',
    {
      x: 50,
      y: 650,
      size: 10,
      font,
      color: rgb(0.1, 0.1, 0.1),
      lineHeight: 16,
    }
  );

  page2.drawText('Section 4.1: Cryptographic Key Management', {
    x: 50,
    y: 560,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.2, 0.35),
  });
  page2.drawText(
    'Customer master keys (CMKs) configured in AWS Key Management Service (KMS) must automatically rotate at\nan interval not exceeding 365 calendar days. Manual rotation without cryptographic audit logs is prohibited.\nAll key access events must be captured via AWS CloudTrail with real-time alerting on unauthorized decrypt attempts.',
    {
      x: 50,
      y: 510,
      size: 10,
      font,
      color: rgb(0.1, 0.1, 0.1),
      lineHeight: 16,
    }
  );

  const pdfBytes = await pdfDoc.save();
  const targetPath = path.join(SAMPLES_DIR, 'Acme_InfoSec_Policy_v4.2.pdf');
  fs.writeFileSync(targetPath, pdfBytes);
  console.log('Generated sample PDF at:', targetPath);
}

async function run() {
  await generateSampleXlsx();
  await generateSamplePdf();
}

run().catch(console.error);
