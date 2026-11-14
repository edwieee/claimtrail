'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DialogProps {
  children: React.ReactNode;
  label: string;
  onClose: () => void;
  drawer?: boolean;
}

/** Shared focus and dismissal behavior for modal surfaces. */
export function Dialog({ children, label, onClose, drawer = false }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const surface = ref.current;
    const background = ['home', 'app-workspace', 'app-navigation'].map((id) => document.getElementById(id)).filter((element): element is HTMLElement => !!element);
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    const getFocusable = () => Array.from(surface?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
    ) || []).filter((element) => element.getClientRects().length > 0);

    (getFocusable()[0] || surface)?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) { event.preventDefault(); surface?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === surface)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === surface)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      className={`ct-overlay ${drawer ? 'ct-overlay-drawer' : ''}`}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      {children}
    </div>,
    document.body
  );
}
