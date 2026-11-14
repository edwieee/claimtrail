'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PublicHeader } from './PublicHeader';
import styles from './LandingHero.module.css';

export function LandingHero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-heading">
      <a
        href="#hero-content"
        className={styles.skipLink}
        onClick={(event) => {
          event.preventDefault();
          const content = document.getElementById('hero-content');
          content?.scrollIntoView({ block: 'center' });
          content?.focus({ preventScroll: true });
        }}
      >
        Skip to content
      </a>
      <div className={styles.map} aria-hidden="true" />
      <PublicHeader overlay />
      <div id="hero-content" className={styles.content} tabIndex={-1}>
        <h1 id="hero-heading" className={styles.headline}>
          <span>Security answers.</span>
          <span>Grounded in evidence.</span>
        </h1>
        <p className={styles.supporting}>
          Connect policies, code, and security checks to create traceable security questionnaire answers.
        </p>
        <Link href="/dashboard" className={`${styles.cta} ${styles.heroCta}`}>
          Start Your Journey <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
