import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './LandingHero.module.css';

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface/70">
      <div className="mx-auto flex w-[calc(100%_-_40px)] md:w-[calc(100%_-_96px)] max-w-[1280px] flex-wrap items-center justify-between gap-6 py-8">
        <div className="flex items-center gap-3">
          <span className={styles.brandMark} aria-hidden="true">CT</span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-on-surface">ClaimTrail</p>
            <p className="text-xs text-secondary">From security claims to source evidence.</p>
          </div>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 text-[13px] text-secondary">
          <Link href="/" className="hover:text-on-surface transition-colors">Home</Link>
          <Link href="/how-it-works" className="hover:text-on-surface transition-colors">How It Works</Link>
          <Link href="/features" className="hover:text-on-surface transition-colors">Features</Link>
          <Link href="/faqs" className="hover:text-on-surface transition-colors">FAQs</Link>
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 font-medium text-primary hover:text-accent-hover transition-colors">
            Get Started <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </footer>
  );
}
