import type { Metadata } from 'next';
import { LandingHero } from '@/components/LandingHero';
import styles from '@/components/LandingHero.module.css';

export const metadata: Metadata = {
  title: 'ClaimTrail — Security answers. Grounded in evidence.',
  description:
    'ClaimTrail connects security policies, public repositories, and automated checks to produce traceable security questionnaire answers.',
};

export default function HomePage() {
  return (
    <div className={styles.page}>
      <LandingHero />
    </div>
  );
}
