'use client';

import { useRef } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import type { NavItem } from '@/types/claimtrail';
import styles from './LandingHero.module.css';

interface LandingHeroProps {
  onNavigate: (nav: NavItem) => void;
  onOpenFaq: () => void;
}

export function LandingHero({ onNavigate, onOpenFaq }: LandingHeroProps) {
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (menu.current) menu.current.open = false; };
  const enterWorkspace = (nav: NavItem) => {
    closeMenu();
    onNavigate(nav);
    const workspace = document.getElementById('assessment');
    workspace?.scrollIntoView({ block: 'start' });
    workspace?.focus({ preventScroll: true });
  };
  const navigation = [
    { label: 'Home', href: '#home', action: closeMenu },
    { label: 'How It Works', href: '#assessment', action: () => enterWorkspace('questionnaire') },
    { label: 'Features', href: '#assessment', action: () => enterWorkspace('sources') },
    { label: 'FAQs', href: '#faqs', action: () => { closeMenu(); onOpenFaq(); } },
  ];

  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-heading">
      <a href="#assessment" className={styles.skipLink} onClick={(event) => { event.preventDefault(); enterWorkspace('overview'); }}>Skip to assessment</a>
      <div className={styles.map} aria-hidden="true" />
      <div className={styles.readability} aria-hidden="true" />
      <header id="app-landing" className={styles.header}>
        <a href="#home" aria-label="ClaimTrail home" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">CT</span>
          <span>ClaimTrail</span>
        </a>
        <nav className={styles.desktopNav} aria-label="Website navigation">
          {navigation.map((link) => (
            <a key={link.label} href={link.href} onClick={(event) => {
              if (link.label !== 'Home') event.preventDefault();
              link.action();
            }}>{link.label}</a>
          ))}
        </nav>
        <a href="#assessment" className={`${styles.cta} ${styles.headerCta}`} onClick={(event) => { event.preventDefault(); enterWorkspace('questionnaire'); }}>
          Start Your Journey <ArrowRight size={16} aria-hidden="true" />
        </a>
        <details ref={menu} className={styles.mobileMenu} onKeyDown={(event) => {
          if (event.key === 'Escape') { closeMenu(); menu.current?.querySelector('summary')?.focus(); }
        }}>
          <summary aria-label="Website navigation menu"><Menu size={23} aria-hidden="true" /></summary>
          <nav aria-label="Mobile website navigation">
            {navigation.map((link) => (
              <a key={link.label} href={link.href} onClick={(event) => {
                if (link.label !== 'Home') event.preventDefault();
                link.action();
              }}>{link.label}</a>
            ))}
            <a href="#assessment" className={styles.cta} onClick={(event) => { event.preventDefault(); enterWorkspace('questionnaire'); }}>
              Start Your Journey <ArrowRight size={16} aria-hidden="true" />
            </a>
          </nav>
        </details>
      </header>
      <div id="hero-content" className={styles.content}>
        <h1 id="hero-heading" className={styles.headline}>
          <span>Security answers.</span>
          <span>Grounded in evidence.</span>
        </h1>
        <p className={styles.supporting}>
          Connect policies, code, and security checks to create traceable security questionnaire answers.
        </p>
        <a href="#assessment" className={`${styles.cta} ${styles.heroCta}`} onClick={(event) => { event.preventDefault(); enterWorkspace('questionnaire'); }}>
          Start Your Journey <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
