import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import styles from './PublicPages.module.css';

interface PublicPageProps {
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}

export function PublicPage({ eyebrow, title, lede, children }: PublicPageProps) {
  return (
    <div className={styles.page}>
      <PublicHeader />
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lede}>{lede}</p>
        </header>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

interface PublicCtaBandProps {
  title: string;
  description: string;
  href?: string;
  label?: string;
}

export function PublicCtaBand({
  title,
  description,
  href = '/dashboard',
  label = 'Get Started',
}: PublicCtaBandProps) {
  return (
    <section className={styles.ctaBand} aria-label="Get started with ClaimTrail">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Link href={href} className={styles.cta}>
        {label} <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}
