import type { Metadata } from 'next';
import { PublicPage, PublicCtaBand } from '@/components/PublicPage';
import styles from '@/components/PublicPages.module.css';

export const metadata: Metadata = {
  title: 'How It Works — ClaimTrail',
  description:
    'ClaimTrail imports a security questionnaire, connects policy PDFs and public repositories, retrieves evidence, runs checks, and exports a reviewed workbook.',
};

const STEPS = [
  {
    title: 'Create an assessment',
    body:
      'Every workspace starts empty. Name the assessment and, if you have one, note the framework it responds to. Nothing is generated until you add your own source material.',
    tags: ['Assessment name', 'Framework (optional)', 'No prefilled data'],
  },
  {
    title: 'Import the questionnaire',
    body:
      'Upload the customer’s .xlsx security questionnaire. ClaimTrail parses the workbook and extracts its real questions — it does not invent answers, and imported answers are not treated as approved.',
    tags: ['.xlsx', '20 MB limit', 'Draft status'],
  },
  {
    title: 'Connect evidence sources',
    body:
      'Add security policy PDFs and connect public GitHub repositories. Policy documents are indexed by page and section with a SHA-256 fingerprint. Repositories are inspected statically and recorded with their commit SHA, file paths, and line ranges.',
    tags: ['Policy PDF', 'Public GitHub repo', 'Commit SHA'],
  },
  {
    title: 'Retrieve evidence for each claim',
    body:
      'ClaimTrail searches the inspected scope for passages and files that relate to each questionnaire claim. A claim with no relevant match stays unresolved rather than being marked satisfied.',
    tags: ['Policy citations', 'Repository references', 'Unresolved by default'],
  },
  {
    title: 'Run security checks',
    body:
      'Implemented control rules evaluate the retrieved evidence and record results as verified, ambiguous, or non-compliant. Findings that need a decision are raised for review instead of being resolved silently.',
    tags: ['Rule-based checks', 'Findings', 'Manual review'],
  },
  {
    title: 'Review, sign off, and export',
    body:
      'A reviewer inspects each answer against its citations, edits drafts where needed, and records an approval with their name. Only then does the workbook export as a final deliverable.',
    tags: ['Named reviewer', 'Draft vs Final', 'XLSX export'],
  },
];

export default function HowItWorksPage() {
  return (
    <PublicPage
      eyebrow="How it works"
      title="From a questionnaire to a reviewed workbook."
      lede="ClaimTrail works in a fixed order: your sources first, evidence second, answers last. Each step is inspectable, and nothing is marked verified without something to point at."
    >
      <section className={styles.section} aria-labelledby="workflow-heading">
        <h2 id="workflow-heading" className={styles.sectionTitle}>
          The workflow
        </h2>
        <p className={styles.sectionNote}>
          The dashboard is a separate workspace. The public pages explain the process; the work happens after you open it.
        </p>

        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={styles.stepBody}>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <div className={styles.stepDetail}>
                  {step.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="states-heading">
        <h2 id="states-heading" className={styles.sectionTitle}>
          What the statuses mean
        </h2>
        <p className={styles.sectionNote}>
          Three states describe what the inspected evidence actually shows. None of them is a guarantee about your production environment.
        </p>

        <ul className={styles.states}>
          <li className={styles.state}>
            <span className={`${styles.stateDot} ${styles.stateGreen}`} aria-hidden="true" />
            <strong>Verified or supporting</strong>
            <span>Supporting signals were found inside the scope you connected.</span>
          </li>
          <li className={styles.state}>
            <span className={`${styles.stateDot} ${styles.stateAmber}`} aria-hidden="true" />
            <strong>Ambiguous or incomplete</strong>
            <span>Evidence is partial, conflicting, or missing, and requires a human decision.</span>
          </li>
          <li className={styles.state}>
            <span className={`${styles.stateDot} ${styles.stateRed}`} aria-hidden="true" />
            <strong>Non-compliant or unsafe</strong>
            <span>An implemented rule found a specific unsafe condition in the evidence.</span>
          </li>
        </ul>
      </section>

      <PublicCtaBand
        title="Run your first evidence check"
        description="Open the dashboard to create an assessment and upload your own questionnaire."
      />
    </PublicPage>
  );
}
