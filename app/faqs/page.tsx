import type { Metadata } from 'next';
import { PublicPage, PublicCtaBand } from '@/components/PublicPage';
import styles from '@/components/PublicPages.module.css';

export const metadata: Metadata = {
  title: 'FAQs — ClaimTrail',
  description:
    'Answers about assessments, supported evidence sources, security checks, AI drafting, review, and exports in ClaimTrail.',
};

const FAQS = [
  {
    question: 'Where does ClaimTrail start?',
    answer:
      'With an empty workspace. You create an assessment, then add your own questionnaire and evidence sources. No sample assessment, claims, or findings are loaded for you.',
  },
  {
    question: 'Which questionnaire formats can I upload?',
    answer:
      'Excel workbooks in .xlsx format, up to 20 MB. CSV, .xls, and non-spreadsheet files are rejected with an explicit error rather than partially imported.',
  },
  {
    question: 'Which evidence sources can I connect?',
    answer:
      'Security policy PDFs and public GitHub repositories. PDFs must contain extractable text — scanned documents need OCR before upload. Repositories are inspected statically over the GitHub API; private repositories are not supported.',
  },
  {
    question: 'How do policy citations work?',
    answer:
      'Each policy PDF is split into page- and section-level passages and fingerprinted with SHA-256. When a claim is cited, you can open the passage and read the exact text that was matched.',
  },
  {
    question: 'How do repository citations work?',
    answer:
      'ClaimTrail records the repository’s default branch, latest commit SHA, and the files and line ranges it inspected. This means a citation can be checked against a specific commit rather than a moving branch head.',
  },
  {
    question: 'Do security checks prove we are secure?',
    answer:
      'No. Checks evaluate the evidence you connected against implemented rules. A clean result means no rule violation was found in that scope — not that the production environment is free of risk. Incomplete or conflicting evidence is routed to review.',
  },
  {
    question: 'Does ClaimTrail write answers automatically?',
    answer:
      'It can draft from retrieved evidence when a model API key is configured. Drafts are not approvals: they stay in review until a named reviewer signs off, and if no key is configured the request fails with a clear message instead of producing an answer.',
  },
  {
    question: 'What happens when I export?',
    answer:
      'Export requires an uploaded questionnaire. If any answer is still unapproved, the workbook is exported as a Draft. Once every response is approved, it exports as Final. Both are real .xlsx files based on your original workbook.',
  },
  {
    question: 'Can I replace or remove an evidence source?',
    answer:
      'Yes. Evidence Sources lists every connected PDF and repository, and each can be removed. Uploading a PDF or connecting a repository again refreshes that source in place.',
  },
];

export default function FaqsPage() {
  return (
    <PublicPage
      eyebrow="FAQs"
      title="Questions about how the evidence works."
      lede="Short answers about inputs, checks, drafting, and exports. If something depends on your own files, the dashboard will tell you rather than guess."
    >
      <section className={styles.section} aria-labelledby="faq-heading">
        <h2 id="faq-heading" className={styles.sectionTitle}>
          Common questions
        </h2>
        <div className={styles.faq}>
          {FAQS.map((item) => (
            <details key={item.question} className={styles.faqItem}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <PublicCtaBand
        title="Still deciding?"
        description="Open the dashboard with an empty workspace and try it against a questionnaire you already have."
      />
    </PublicPage>
  );
}
