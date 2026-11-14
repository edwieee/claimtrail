'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu } from 'lucide-react';
import styles from './LandingHero.module.css';

interface PublicHeaderProps {
  overlay?: boolean;
}

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Features', href: '/features' },
  { label: 'FAQs', href: '/faqs' },
];

export function PublicHeader({ overlay = false }: PublicHeaderProps) {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => {
    if (menu.current) menu.current.open = false;
  };

  return (
    <header
      id="app-landing"
      className={overlay ? styles.header : `${styles.header} ${styles.headerStatic}`}
    >
      <Link href="/" aria-label="ClaimTrail home" className={styles.brand} onClick={closeMenu}>
        <span className={styles.brandMark} aria-hidden="true">CT</span>
        <span>ClaimTrail</span>
      </Link>

      <nav className={styles.desktopNav} aria-label="Website navigation">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link href="/dashboard" className={`${styles.cta} ${styles.headerCta}`}>
        Start Your Journey <ArrowRight size={16} aria-hidden="true" />
      </Link>

      <details
        ref={menu}
        className={styles.mobileMenu}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            closeMenu();
            menu.current?.querySelector('summary')?.focus();
          }
        }}
      >
        <summary aria-label="Website navigation menu">
          <Menu size={23} aria-hidden="true" />
        </summary>
        <nav aria-label="Mobile website navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/dashboard" className={styles.cta} onClick={closeMenu}>
            Start Your Journey <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </nav>
      </details>
    </header>
  );
}
