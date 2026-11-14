import type { Metadata } from 'next';
import { PublicPage, PublicCtaBand } from '@/components/PublicPage';
import styles from '@/components/PublicPages.module.css';

export const metadata: Metadata = {
  title: 'Features — ClaimTrail',
  description:
    'Questionnaire import, policy citations, repository evidence, automated control checks, grounded drafting, and reviewed XLSX export.',
};

const FEATURES = [
  {
    label: 'Input',
    title: 'Real .xlsx questionnaire import',
    body:
      'Workbooks are parsed directly. Extracted claims keep their code, category, and question text, and begin as drafts awaiting review rather than presumed answers.',
  },
  {
    label: 'Policy',
    title: 'Passage-level policy citations',
    body:
      'Policy PDFs are indexed into page- and section-level passages. Each citation carries the document name, section, and the quoted text it came from.',
  },
  {
    label: 'Repository',
    title: 'Static public repository inspection',
    body:
      'Connect a public GitHub repository and ClaimTrail records the default branch, the commit SHA, and the specific files and line ranges it inspected. Repository scripts are never executed.',
  },
  {
    label: 'Checks',
    title: 'Implemented control rules',
    body:
      'Automated checks evaluate retrieved evidence against explicit rules — for example encryption at rest or permissive CORS — and raise findings with a clear status instead of a score.',
  },
  {
    label: 'Drafting',
    title: 'Evidence-grounded AI drafts',
    body:
      'When an API key is configured, drafting uses the retrieved policy and repository snippets as its only source material. Without a key, synthesis stops and says so rather than filling in an answer.',
  },
  {
    label: 'Review',
    title: 'Named sign-off and XLSX export',
    body:
      'Approvals record who signed off and when. Exports reproduce the original workbook with response columns, citations, and hashes, marked either Draft or Final.',
  },
];

export default function FeaturesPage() {
  return (
    <PublicPage
      eyebrow="Features"
      title="Everything points back to a source."
      lede="ClaimTrail is built around provenance: each answer, check, and export can be traced to the policy passage or repository reference that supports it."
    >
      <section className={styles.section} aria-labelledby="feature-heading">
        <h2 id="feature-heading" className={styles.sectionTitle}>
          What the workspace covers
        </h2>
        <p className={styles.sectionNote}>
          These are the capabilities implemented in the current dashboard — not a roadmap.
        </p>

        <div className={styles.grid}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={styles.card}>
              <p className={styles.cardLabel}>{feature.label}</p>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="scope-heading">
        <h2 id="scope-heading" className={styles.sectionTitle}>
          What it deliberately does not do
        </h2>
        <p className={styles.sectionNote}>
          ClaimTrail reports what the inspected evidence shows. It does not certify your environment, scan a private
          codebase, or answer questions without a source. Scanned PDFs need OCR before upload, and drafting requires a
          configured model key.
        </p>
      </section>

      <PublicCtaBand
        title="See it against your own files"
        description="Create an assessment, then upload a questionnaire and evidence sources."
      />
    </PublicPage>
  );
}
